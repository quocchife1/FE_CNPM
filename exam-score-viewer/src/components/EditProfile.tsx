// EditProfile.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchUserProfile, saveUserProfile } from '../features/user/profileSlice';
import { selectProfile, selectProfileLoading } from '../features/user/profileSelectors';
import { useParams } from 'react-router-dom';
import Notification from '../components/Notification';
import { selectProfileError } from '../features/user/profileSelectors';
import ImageCropper from '../components/ImageCropper'; // Import component cắt ảnh

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);
const CancelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const ImageModal: React.FC<{ imageUrl: string; onClose: () => void }> = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div className="relative max-w-3xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Preview" className="max-w-full max-h-[80vh] object-contain" />
        <button
          onClick={onClose}
          className="absolute top-[-15px] right-[-15px] text-white text-3xl font-bold bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

const EditProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const loading = useAppSelector(selectProfileLoading);
  const error = useAppSelector(selectProfileError);
  const { userId } = useParams<{ userId: string }>();

  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    address: '',
    avatar: null as File | null,
    avatarPreviewUrl: '',
  });


  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null); // URL của ảnh gốc để truyền vào cropper
  // Fix: Khởi tạo useRef với null
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(Number(userId)));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (profile) {
      setFormState({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        avatar: null,
        avatarPreviewUrl: profile.avatarUrl || '/default-avatar.png', // Sử dụng avatar hiện có hoặc default
      });
    }
  }, [profile]);

  if (error && !loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Bạn không có quyền truy cập</h2>
          <p className="text-gray-600">Vui lòng kiểm tra lại hoặc liên hệ quản trị viên.</p>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Lấy file đầu tiên từ FileList
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (file.type === 'image/gif') {
        setFormState((prev) => ({
          ...prev,
          avatar: file,
          avatarPreviewUrl: URL.createObjectURL(file),
        }));
        setNotification({ message: 'Cập nhật thành công', type: 'success' });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setImageToCrop(reader.result as string);
          setShowCropper(true);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCropComplete = (croppedImageBlob: Blob | null) => {
    if (croppedImageBlob) {
      const croppedImageFile = new File([croppedImageBlob], `avatar-${Date.now()}.jpeg`, {
        type: 'image/jpeg',
      });
      setFormState((prev) => ({
        ...prev,
        avatar: croppedImageFile,
        avatarPreviewUrl: URL.createObjectURL(croppedImageBlob),
      }));
    }
    setImageToCrop(null);
    setShowCropper(false);
  };

  const handleSave = async () => {
    if (!userId) return;

    const formData = new FormData();
    formData.append('name', formState.name);
    formData.append('phone', formState.phone);
    formData.append('address', formState.address);
    if (formState.avatar) {
      formData.append('avatar', formState.avatar);
    }

    try {
      const resultAction = await dispatch(saveUserProfile({ userId: Number(userId), formData }));
      if (saveUserProfile.fulfilled.match(resultAction)) {
        setNotification({ message: 'Cập nhật hồ sơ thành công!', type: 'success' });
        setEditMode(false);
      } else {

        setNotification({ message: 'Cập nhật hồ sơ thất bại. Vui lòng thử lại!', type: 'error' });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setNotification({ message: 'Đã xảy ra lỗi khi lưu hồ sơ. Vui lòng thử lại!', type: 'error' });
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormState({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        avatar: null,
        avatarPreviewUrl: profile.avatarUrl || '/default-avatar.png', // Đặt lại ảnh preview về ảnh gốc
      });
    }
    setEditMode(false);
    setNotification(null);
  };

  const handleAvatarClick = () => {
    if (editMode) {
      fileInputRef.current?.click();
    } else {
      setShowImageModal(true);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center py-4 px-4">
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-xl border border-blue-200 lg:max-w-5xl xl:max-w-6xl">
        <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight mb-2 text-center py-5 lg:text-4xl">Hồ sơ cá nhân</h2>

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
            duration={3000}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 lg:gap-x-12 lg:gap-y-8 items-start">
          <div className="flex flex-col items-center pt-4 md:pt-0">
            <div
              className="relative w-40 h-40 md:w-48 md:h-48 border-4 border-blue-100 rounded-full shadow-lg bg-white cursor-pointer overflow-hidden group"
              onClick={handleAvatarClick}
            >
              <img
                src={formState.avatarPreviewUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              {editMode && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CameraIcon />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>

            <div className="mt-6 text-base text-slate-700 font-medium">
              <span className="text-blue-800 font-semibold">ID:</span>{' '}
              <span className="font-mono bg-blue-50 text-blue-800 px-3 py-1 rounded-md text-sm ml-1">
                {userId}
              </span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-5 lg:space-y-6">
            {loading ? (
              <p className="text-center text-slate-500 text-lg">Đang tải dữ liệu...</p>
            ) : (
              <>
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-base font-semibold text-blue-800 mb-1">Họ tên</label>
                  <input
                    id="name"
                    type="text"
                    className={`w-full border ${editMode ? 'border-blue-400 focus:ring-2 focus:ring-blue-300' : 'border-slate-300 bg-slate-50 text-slate-700'} rounded-lg px-3 py-2 text-base transition-all duration-200`}
                    value={formState.name}
                    onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                    disabled={!editMode}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-base font-semibold text-blue-800 mb-1">Số điện thoại</label>
                  <input
                    id="phone"
                    type="text"
                    className={`w-full border ${editMode ? 'border-blue-400 focus:ring-2 focus:ring-blue-300' : 'border-slate-300 bg-slate-50 text-slate-700'} rounded-lg px-3 py-2 text-base transition-all duration-200`}
                    value={formState.phone}
                    onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                    disabled={!editMode}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="address" className="text-base font-semibold text-blue-800 mb-1">Địa chỉ</label>
                  <input
                    id="address"
                    type="text"
                    className={`w-full border ${editMode ? 'border-blue-400 focus:ring-2 focus:ring-blue-300' : 'border-slate-300 bg-slate-50 text-slate-700'} rounded-lg px-3 py-2 text-base transition-all duration-200`}
                    value={formState.address}
                    onChange={(e) => setFormState((prev) => ({ ...prev, address: e.target.value }))}
                    disabled={!editMode}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-base font-semibold text-blue-800 mb-1">Email</label>
                  <p className="w-full bg-blue-50 text-blue-700 rounded-lg px-3 py-2 text-base font-medium border border-blue-200">
                    {profile?.email || 'N/A'}
                  </p>
                </div>
                <div className="flex flex-col">
                  <label className="text-base font-semibold text-blue-800 mb-1">Ngày tạo</label>
                  <p className="w-full bg-blue-50 text-blue-700 rounded-lg px-3 py-2 text-base font-medium border border-blue-200">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 mt-4 lg:mt-6">
              {editMode ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2 rounded-lg bg-slate-300 text-slate-800 hover:bg-slate-400 text-base font-medium flex items-center gap-1 transition-colors duration-200"
                  >
                    <CancelIcon /> Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-base font-medium flex items-center gap-1 transition-colors duration-200"
                  >
                    <SaveIcon /> Lưu
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-base font-medium flex items-center gap-1 transition-colors duration-200"
                >
                  <PencilIcon /> Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {showCropper && imageToCrop && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onClose={() => setShowCropper(false)}
        />
      )}
      {showImageModal && (
        <ImageModal
          imageUrl={formState.avatarPreviewUrl}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </div>
  );
};

export default EditProfile;