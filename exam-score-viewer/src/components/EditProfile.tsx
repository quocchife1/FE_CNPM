// EditProfile.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchUserProfile, saveUserProfile } from '../features/user/profileSlice';
import { selectProfile, selectProfileLoading } from '../features/user/profileSelectors';

// Icon components
const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);

const EditProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const loading = useAppSelector(selectProfileLoading);
  const [editMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || '');
  const [tempUserId, setTempUserId] = useState(userId);

  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    address: '',
    avatar: null as File | null,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
      dispatch(fetchUserProfile());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (profile) {
      setFormState({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        avatar: null,
      });
    }
  }, [profile]);

  const handleSave = () => {
    const formData = new FormData();
    formData.append('name', formState.name);
    formData.append('phone', formState.phone);
    formData.append('address', formState.address);
    if (formState.avatar) {
      formData.append('avatar', formState.avatar);
    }
    dispatch(saveUserProfile(formData)).then(() => setEditMode(false));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-slate-100 min-h-screen py-12 px-4">
      {/* ⚙️ Test userId input */}
      <div className="w-full max-w-3xl mx-auto mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="text-sm font-medium text-yellow-800 whitespace-nowrap">🧪 Test userId:</div>
        <input
          type="number"
          className="border px-3 py-1 rounded w-full max-w-xs text-sm"
          placeholder="Nhập userId..."
          value={tempUserId}
          onChange={(e) => setTempUserId(e.target.value)}
        />
        <button
          className="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-700 text-sm"
          onClick={() => {
            setUserId(tempUserId);
            localStorage.setItem('userId', tempUserId);
            dispatch(fetchUserProfile());
          }}
        >
          Áp dụng
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-md border border-blue-200">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Hồ sơ cá nhân</h2>
        <p className="text-slate-500 mb-8">Xem và chỉnh sửa thông tin cá nhân của bạn.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div
              className="relative w-32 h-32 border-4 border-blue-100 rounded-full shadow-sm bg-white cursor-pointer overflow-hidden"
              onClick={editMode ? handleAvatarClick : undefined}
            >
              <img
                src={
                  formState.avatar
                    ? URL.createObjectURL(formState.avatar)
                    : profile?.avatarUrl || '/default-avatar.png'
                }
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              {editMode && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white text-sm font-semibold">
                  <CameraIcon />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFormState((prev) => ({ ...prev, avatar: e.target.files![0] }));
                  }
                }}
              />
            </div>

            {/* 👤 Mã người dùng ngay dưới ảnh */}
            <div className="mt-4 text-sm text-slate-600">
              <span className="font-medium">Mã người dùng:</span>{' '}
              <span className="font-mono bg-slate-100 text-blue-800 px-2 py-1 rounded">{userId}</span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            {loading ? (
              <p className="text-center text-slate-500">Đang tải dữ liệu...</p>
            ) : (
              <>
                {/* Editable fields */}
                <div>
                  <label className="block text-sm font-medium text-blue-800">Tên</label>
                  <input
                    type="text"
                    className="w-full border border-slate-300 rounded px-3 py-2"
                    value={formState.name}
                    onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800">Số điện thoại</label>
                  <input
                    type="text"
                    className="w-full border border-slate-300 rounded px-3 py-2"
                    value={formState.phone}
                    onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800">Địa chỉ</label>
                  <input
                    type="text"
                    className="w-full border border-slate-300 rounded px-3 py-2"
                    value={formState.address}
                    onChange={(e) => setFormState((prev) => ({ ...prev, address: e.target.value }))}
                    disabled={!editMode}
                  />
                </div>

                {/* Read-only fields */}
                <div>
                  <label className="block text-sm font-medium text-blue-800">Email</label>
                  <input
                    type="text"
                    className="w-full bg-slate-100 border border-slate-300 rounded px-3 py-2 text-slate-500"
                    value={profile?.email || ''}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800">Ngày tạo</label>
                  <input
                    type="text"
                    className="w-full bg-slate-100 border border-slate-300 rounded px-3 py-2 text-slate-500"
                    value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ''}
                    disabled
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-4 pt-4">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 rounded bg-slate-300 text-slate-800 hover:bg-slate-400 flex items-center gap-2"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                  >
                    <SaveIcon /> Lưu
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                >
                  <PencilIcon /> Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
