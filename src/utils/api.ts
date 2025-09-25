export async function sendImageToBackend(imageBlob: Blob, mode: string) {
  const formData = new FormData();
  formData.append('file', imageBlob);

  const response = await fetch(`http://localhost:5001/predict/${mode}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Backend error');
  return await response.json();
}