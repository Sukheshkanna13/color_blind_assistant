from flask import Flask, request, jsonify
import torch
from PIL import Image
import io
from flask_cors import CORS

# Ensure ultralytics is installed: pip install ultralytics
try:
    from ultralytics.nn.tasks import DetectionModel
    import torch.serialization
    torch.serialization.add_safe_globals(['ultralytics.nn.tasks.DetectionModel'])
except ImportError:
    DetectionModel = None

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Color Blind Assistant API is running."

def get_model():
    # Replace with your actual model architecture and arguments if needed
    if DetectionModel is not None:
        return DetectionModel()
    else:
        raise ImportError("DetectionModel class not available.")

# Load your PyTorch model once at startup
try:
    checkpoint = torch.load('models/Augmented8n.pt', map_location=torch.device('cpu'), weights_only=False)
    if isinstance(checkpoint, dict) and "model" in checkpoint:
        model = get_model()
        model.load_state_dict(checkpoint["model"].state_dict())
        model.eval()
    elif isinstance(checkpoint, dict):
        model = get_model()
        model.load_state_dict(checkpoint)
        model.eval()
    else:
        model = checkpoint
        model.eval()
except Exception as e:
    model = None
    print(f"Error loading model: {e}")
    import traceback
    traceback.print_exc()

def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    import torchvision.transforms as transforms
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])
    return transform(image).unsqueeze(0)

@app.route('/predict/<mode>', methods=['POST'])
def predict(mode):
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']
    img_bytes = file.read()
    input_tensor = preprocess_image(img_bytes)
    with torch.no_grad():
        output = model(input_tensor)
    return jsonify({'result': str(output.tolist()), 'mode': mode})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)