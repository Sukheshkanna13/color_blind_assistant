<img width="1001" height="257" alt="Screenshot 2026-02-07 at 9 49 28 AM" src="https://github.com/user-attachments/assets/6c7915d3-13ac-4df5-b52b-a968d6f8ad64" />

<h1 align="center">👁️ IntelliColor</h1>

<p align="center">
  <em>AI-Powered Assistive Wearable for Color Blindness</em>
</p>

<p align="center">
  <b>Raspberry Pi Edge AI</b> • <b>Haptic Feedback Specs</b> • <b>React Dashboard</b>
</p>

<div align="center">
  <img src="https://img.shields.io/badge/Status-Prototype-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Hardware-Raspberry_Pi-A22846?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-Computer_Vision-5C3EE8?style=for-the-badge" />
</div>

---

### 📖 Overview
**IntelliColor** is a smart wearable system designed to assist individuals with color blindness (CVD). By integrating a **Raspberry Pi-based camera module** into a spectacle frame, the system utilizes an optimized **Deep Learning model** to analyze the visual field in real-time.

Instead of just labeling colors, the system correlates specific color spectrums to distinct **haptic feedback patterns** on the frame, allowing users to "feel" colors. A companion **React Dashboard** allows users to calibrate the model and customize feedback sensitivity.

---

### ⚙️ System Architecture & Workflow

The system operates on a low-latency Edge AI pipeline:

1.  **Input:** The **Raspberry Pi Camera Module** captures a live video feed from the user's perspective.
2.  **Processing:** A quantized **CNN (Convolutional Neural Network)** runs locally on the Pi to detect and classify dominant colors in the center focus area.
3.  **Output 1 (Wearable):** The Pi triggers **Haptic Motors** embedded in the spectacle arms. Different vibration patterns correspond to different colors (e.g., *Red = 1 Long Pulse*, *Green = 2 Short Pulses*).
4.  **Output 2 (Dashboard):** Data is streamed via WebSockets to a **React-based Dashboard**, visualizing what the AI sees and allowing for real-time model tuning.

---

### 🚀 Key Features

* **👓 Smart Specs Integration:** Lightweight Raspberry Pi Zero/4 setup mounted on a wearable frame.
* **⚡ Edge AI Inference:** Optimized Machine Learning models (TFLite) running locally for zero-latency detection.
* **📳 Haptic Language:** A tactile feedback system that translates visual color data into physical vibration patterns.
* **🖥️ Live Command Center:** A **React.js** dashboard to:
    * View the live camera feed with AI bounding boxes.
    * Customize haptic intensity.
    * Adjust color sensitivity thresholds for different lighting conditions.

---

### 💻 Tech Stack

<div align="center">
  <h4>Hardware & IoT</h4>
  <img src="https://img.shields.io/badge/Raspberry%20Pi-A22846?style=for-the-badge&logo=Raspberry%20Pi&logoColor=white" />
  <img src="https://img.shields.io/badge/Camera_Module-555555?style=for-the-badge&logo=arduino&logoColor=white" />
  <img src="https://img.shields.io/badge/Haptics-FF6600?style=for-the-badge&logo=electronicarts&logoColor=white" />
  <br />

  <h4>AI & Computer Vision</h4>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white" />
  <img src="https://img.shields.io/badge/TensorFlow_Lite-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" />
  <br />

  <h4>Dashboard & Interface</h4>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
</div>

---
