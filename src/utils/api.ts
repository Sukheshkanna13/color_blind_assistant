// src/utils/api.ts

const API_BASE_URL = 'http://localhost:5001';

export const sendImageToBackend = async (imageFile: File | Blob, mode: string) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch(`http://localhost:5001/predict/${mode}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data); // Debug log
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};