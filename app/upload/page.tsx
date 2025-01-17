/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */


'use client';

import { useState } from 'react';
import Image from 'next/image';
import Resizer from 'react-image-file-resizer';

const UploadPage = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  const resizeFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        400, // max width
        400, // max height
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri as string);
        },
        'base64'
      );
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsResizing(true);
      try {
        const resizedImage = await resizeFile(file);
        setUploadedImage(resizedImage);
      } catch (err) {
        console.error('Error resizing image:', err);
      } finally {
        setIsResizing(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Upload Your Food Image</h1>
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
          mb-4"
      />

      {isResizing && (
        <div className="mb-4">
          <p className="text-gray-600">Resizing image...</p>
        </div>
      )}

      {uploadedImage && (
        <div className="mt-4 relative w-[400px] h-[400px]">
          <Image
            src={`data:image/jpeg;base64,${uploadedImage}`}
            alt="Uploaded Food"
            fill
            className="object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default UploadPage;