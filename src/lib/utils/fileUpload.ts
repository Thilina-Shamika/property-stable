export async function uploadFiles(files: File[], type: 'property' | 'qrcode'): Promise<string[]> {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('type', type);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const data = await response.json();
    return data.urls;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
} 