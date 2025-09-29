from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, UnidentifiedImageError
import io
import os
import traceback
import cv2
import numpy as np
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

# --- Settings ---
FOOD_CONFIDENCE_THRESHOLD = 0.5
# --- End Settings ---


# --- Multi-Model Loading ---
models = {}
CLASS_NAMES = {}

MODEL_CONFIG = {
    "driving": "models/Augmented8n.pt",
    "shopping": "models/Fashion.pt",
    "food": "models/best.pt"
}

print("--- Loading AI Models ---")
for mode, path in MODEL_CONFIG.items():
    try:
        if not os.path.exists(path):
            print(f"⚠️  Warning: Model file for '{mode}' mode not found at {path}. This mode will be unavailable.")
            continue

        model = YOLO(path)
        models[mode] = model
        CLASS_NAMES[mode] = model.names
        print(f"✅ Model for '{mode}' mode loaded successfully!")
        print(f"   - Class names: {model.names}")

    except Exception as e:
        print(f"❌ Error loading model for '{mode}' mode from {path}: {e}")
        traceback.print_exc()
print("-------------------------")


# --- Color Analysis Functions (for Food Mode) ---
COLOR_MAP = [
    ('red', (255, 0, 0)), ('green', (0, 128, 0)), ('blue', (0, 0, 255)),
    ('yellow', (255, 255, 0)), ('orange', (255, 165, 0)), ('purple', (128, 0, 128)),
    ('white', (255, 255, 255)), ('black', (0, 0, 0)), ('gray', (128, 128, 128)),
    ('brown', (165, 42, 42)), ('beige', (245, 245, 220))
]

def get_color_name_opencv(rgb_tuple):
    input_rgb_np = np.uint8([[rgb_tuple]])
    input_lab = cv2.cvtColor(input_rgb_np, cv2.COLOR_RGB2LAB)
    min_distance = float("inf")
    closest_name = ""
    for name, (r, g, b) in COLOR_MAP:
        map_rgb_np = np.uint8([[(r, g, b)]])
        map_lab = cv2.cvtColor(map_rgb_np, cv2.COLOR_RGB2LAB)
        distance = np.linalg.norm(input_lab - map_lab)
        if distance < min_distance:
            min_distance = distance
            closest_name = name
    return closest_name

def get_dominant_colors_opencv(image, mask, k=3):
    masked_pixels = image[mask > 0]
    if len(masked_pixels) < k:
        return []
    
    pixels_float32 = masked_pixels.reshape(-1, 3).astype(np.float32)
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
    
    # NEW: Added a try-except block to make K-Means more robust
    try:
        _, _, centers = cv2.kmeans(pixels_float32, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    except cv2.error:
        # This can happen if there are not enough unique colors
        return []
        
    dominant_colors_bgr = centers.astype(np.uint8)
    return [tuple(color) for color in dominant_colors_bgr]

# --- Image Processing Pipelines ---

def process_image_and_get_detections(model, class_names, image_bytes):
    # ... (This function is unchanged)
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    results = model(image)
    detections = []
    for result in results:
        if result.boxes:
            for box in result.boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                detections.append({
                    "label": class_names[class_id],
                    "confidence": confidence
                })
    detections.sort(key=lambda x: x['confidence'], reverse=True)
    return detections

def process_food_image(model, image_bytes):
    pil_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    frame_rgb = np.array(pil_image)
    frame_bgr = cv2.cvtColor(frame_rgb, cv2.COLOR_RGB2BGR)
    
    img_h, img_w, _ = frame_bgr.shape # Get image dimensions
    
    results = model(frame_bgr, conf=FOOD_CONFIDENCE_THRESHOLD)
    detections = []

    if results[0].masks is not None:
        for mask_data, box_data in zip(results[0].masks.data.cpu().numpy(), results[0].boxes.data.cpu().numpy()):
            class_id = int(box_data[5])
            confidence = float(box_data[4])
            class_name = model.names[class_id]
            
            # --- NEW: Resize the mask to match the original image ---
            # This is the critical fix for the crash
            mask = cv2.resize(mask_data, (img_w, img_h), interpolation=cv2.INTER_NEAREST).astype(np.uint8)
            # --- END OF FIX ---

            dominant_colors_bgr = get_dominant_colors_opencv(frame_bgr, mask)
            dominant_colors_rgb = [cv2.cvtColor(np.uint8([[color]]), cv2.COLOR_BGR2RGB)[0][0] for color in dominant_colors_bgr]
            color_names = [get_color_name_opencv(tuple(color)) for color in dominant_colors_rgb]
            
            unique_color_names = list(dict.fromkeys(color_names))
            color_str = f"[{', '.join(unique_color_names)}]" if unique_color_names else ""
            
            final_label = f"{class_name} {color_str}"
            
            detections.append({
                "label": final_label.strip(),
                "confidence": confidence
            })
            
    detections.sort(key=lambda x: x['confidence'], reverse=True)
    return detections

@app.route('/predict/<mode>', methods=['POST'])
def predict(mode):
    # ... (This function is unchanged)
    if mode not in models:
        return jsonify({'error': f'Mode "{mode}" is not available or its model failed to load.'}), 400

    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request.'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file.'}), 400

    try:
        model = models[mode]
        img_bytes = file.read()
        
        if mode == 'food':
            all_detections = process_food_image(model, img_bytes)
        else:
            class_names_for_mode = CLASS_NAMES[mode]
            all_detections = process_image_and_get_detections(model, class_names_for_mode, img_bytes)
        
        return jsonify({
            'detections': all_detections,
            'mode': mode
        })

    except (ValueError, UnidentifiedImageError) as ve:
        return jsonify({'error': str(ve) or "Invalid image file provided."}), 400
    except Exception as e:
        print(f"❌ Error during prediction for '{mode}' mode: {e}")
        traceback.print_exc()
        return jsonify({'error': 'An unexpected error occurred while processing the image.'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)