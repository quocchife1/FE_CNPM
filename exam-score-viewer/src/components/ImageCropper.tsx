// src/components/ImageCropper.tsx
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: Blob | null) => void;
  onClose: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
        onCropComplete(croppedImageBlob);
        onClose();
      }
    } catch (e) {
      console.error(e);
      onCropComplete(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Cắt ảnh đại diện</h3>
        </div>
        <div className="relative w-full h-96 bg-gray-100">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1 / 1}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteHandler}
            cropShape="round"
            showGrid={false}
          />
        </div>
        <div className="flex flex-col p-4 border-t border-gray-200">
          <label htmlFor="zoom-range" className="text-sm font-medium text-gray-700 mb-2">Phóng to/Thu nhỏ:</label>
          <input
            id="zoom-range"
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => {
              onZoomChange(parseFloat(e.target.value));
            }}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer range-sm dark:bg-blue-700"
          />
        </div>
        <div className="flex justify-end p-4 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Hủy
          </button>
          <button
            onClick={handleCrop}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Cắt & Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;