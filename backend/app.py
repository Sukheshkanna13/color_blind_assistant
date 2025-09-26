from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import os
import traceback

# Ensure ultralytics is installed: pip install ultralytics
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# --- Model Loading ---
# Load the YOLOv8 model once at startup.
# This is much more robust than using torch.load manually.
model = None
MODEL_PATH = 'models/Augmented8n.pt'

try:
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Make sure you run this script from the 'backend' directory.")
    model = YOLO(MODEL_PATH)
    print("✅ Model loaded successfully!")
    # Store class names from the model
    CLASS_NAMES = model.names
    print(f"Model class names: {CLASS_NAMES}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    traceback.print_exc()

@app.route('/')
def home():
    return "Color Blind Assistant API is running."

@app.route('/predict/<mode>', methods=['POST'])
def predict(mode):
    # For now, we only handle 'driving' mode as requested.
    if mode != 'driving':
        return jsonify({'error': f'Mode "{mode}" is not yet supported.'}), 400

    if model is None:
        return jsonify({'error': 'Model is not loaded. Check server logs for details.'}), 500
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request.'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file.'}), 400

    try:
        # Read image bytes and open with PIL
        img_bytes = file.read()
        image = Image.open(io.BytesIO(img_bytes)).convert('RGB')

        # --- Perform Inference ---
        # The model handles preprocessing automatically.
        results = model(image)

        # --- Process Results ---
        # We'll find the detection with the highest confidence.
        detections = []
        for result in results:  # Iterate over the results object
            if result.boxes:
                for box in result.boxes:
                    class_id = int(box.cls[0])
                    confidence = float(box.conf[0])
                    detections.append({
                        "color": CLASS_NAMES[class_id],
                        "confidence": confidence
                    })

        if not detections:
            return jsonify({
                'prediction': 'No signal detected',
                'confidence': 0.0,
                'mode': mode
            })
        
        # Get the best prediction (highest confidence)
        best_prediction = max(detections, key=lambda x: x['confidence'])
        
        return jsonify({
            'prediction': best_prediction['color'],
            'confidence': best_prediction['confidence'],
            'mode': mode
        })

    except Exception as e:
        print(f"❌ Error during prediction: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Failed to process the image.'}), 500

if __name__ == '__main__':
    # Use debug=True for development to see detailed errors in the browser
    app.run(host='0.0.0.0', port=5001, debug=True)