import { useState, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ImageUploadProps {
  onImageChange: (files: File[]) => void;
  maxImages?: number;
  existingImages?: string[];
  onRemoveImage?: (index: number) => void;
}

export function ImageUpload({
  onImageChange,
  maxImages = 10,
  existingImages = [],
  onRemoveImage
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(existingImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding new files would exceed the maximum
    if (previews.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    // Create preview URLs for new files
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);

    // Pass files to parent component
    onImageChange(files);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    onRemoveImage?.(index);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-primary/90"
        />
        <span className="text-sm text-gray-500">
          {maxImages - previews.length} images remaining
        </span>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={preview} className="relative group aspect-square">
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                fill
                className="rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 
                  hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary/80 text-white text-xs px-2 py-1 rounded">
                  Main Image
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 