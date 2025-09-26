// src/utils/api.ts

const API_BASE_URL = 'http://localhost:5001';

export const sendImageToBackend = async (imageFile: Blob, mode: string) => {
  const formData = new FormData();
  // Use a specific filename, e.g., 'capture.jpg'
  formData.append('file', imageFile, 'capture.jpg');

  const response = await fetch(`${API_BASE_URL}/predict/${mode}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    // Try to parse the error message from the backend for better feedback
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.error || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log('API Response:', data); // Debug log
  return data;
};