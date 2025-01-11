import { useState } from 'react';
import Image from 'next/image';
import { useResizer } from 'react-image-file-resizer';

const UploadPage = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const resizer = useResizer();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const resizedImage = await resizer.resize(file, {
        width: 400,
        height: 400,
        // Other resizing options
      });
      setUploadedImage(resizedImage);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Upload Your Food Image</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {uploadedImage && (
        <div className="mt-4">
          <Image src={URL.createObjectURL(uploadedImage)} width={400} height={400} alt="Uploaded Food" />
        </div>
      )}
    </div>
  );
};

export default UploadPage;