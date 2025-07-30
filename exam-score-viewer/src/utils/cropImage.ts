// src/utils/cropImage.ts

// Hàm này để tạo một image từ URL và chờ cho nó load xong
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // Cần thiết để tránh lỗi CORS khi tải ảnh từ các domain khác
    image.src = url;
  });

export async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Set canvas size to match the cropped area
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the image onto the canvas, cropping it to the specified pixelCrop
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Return the cropped image as a Blob
  return new Promise((resolve) => {
    // Sửa định dạng thành 'image/jpeg' hoặc 'image/png' tùy theo nhu cầu
    // Không nên dùng 'image/jpeg/png' vì nó không phải là định dạng MIME hợp lệ
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg/png'); // Chọn định dạng phổ biến, hoặc bạn có thể làm động theo loại ảnh gốc nếu muốn
  });
}