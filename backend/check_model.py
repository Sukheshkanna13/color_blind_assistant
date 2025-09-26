# backend/check_model.py

import os
from ultralytics import YOLO

MODEL_PATH = "models/Fashion.pt"

print("-----------------------------------------")
print(f"--- Checking for model at: {MODEL_PATH} ---")

# 1. Check if the file exists at the specified path
if not os.path.exists(MODEL_PATH):
    print(f"\n❌ FAILURE: File Not Found")
    print("   The script could not find 'Fashion.pt' in the 'backend/models/' folder.")
    print("   SOLUTION: Check the file name for typos and make sure it's in the correct directory.")
    exit()
else:
    print("\n   File found at the correct location.")

# 2. If the file exists, try to load it
try:
    model = YOLO(MODEL_PATH)
    print("\n✅ SUCCESS: Model loaded without errors!")
    print(f"   Detected class names: {model.names}")
except Exception as e:
    print(f"\n❌ FAILURE: The file was found, but it is invalid or corrupted.")
    print("   SOLUTION: Re-download or re-export your 'Fashion.pt' file.")
    print(f"\n   Detailed Error: {e}")
print("-----------------------------------------")