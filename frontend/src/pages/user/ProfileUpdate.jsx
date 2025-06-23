import React, { useEffect, useState } from 'react';
import profile from '../../images/Profile.png';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { clearError, resetUpdatedState } from '@/redux/reducer/profileUpdateSlice';
import { loadUser } from '@/redux/thunk/userThunk';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { blue } from '@mui/material/colors';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { updateProfile } from '@/redux/thunk/profileUpdateThunk';
import MetaData from '@/components/layout/MetaData';
import { SkeletonCard } from '@/components/shimmerEffect/SkeletonCard';

const ProfileUpdate = () => {
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [avatarPreview, setAvatarPreview] = useState(profile);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);
  const { error, isUpdated, loading } = useSelector(state => state.profileUpdate);

  // for update profile
  const handleUpdateProfileSubmit = e => {
    e.preventDefault();
    const formData = new FormData();

    formData.set('name', name);
    formData.set('email', email);
    formData.set('avatar', avatar);
    // dispatch register thunk here
    dispatch(updateProfile(formData));
  };

  const updateProfileDataChange = e => {
    const file = e.target.files[0];
    if (!file) return; // ✅ skip if nothing selected

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
    setAvatar(file); // ✅ File is passed to FormData
  };

  useEffect(() => {
    if (user) {
      setName(user?.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar?.url || profile);
    }

    if (error) {
      toast.error(error.message);
      dispatch(clearError());
    }

    if (isUpdated) {
      toast.success('profile updated successfully');
      dispatch(loadUser());
      navigate('/account');
      dispatch(resetUpdatedState());
    }
  }, [error, isUpdated, navigate, dispatch, user]);

  return (
    <>
      {loading ? (
        <SkeletonCard />
      ) : (
        <div>
          <MetaData title={`update profile`} />
          <div className="w-full h-auto max-w-md mx-auto p-6 bg-white shadow-md rounded-lg xl:my-10">
            <h2 className="text-black uppercase flex items-center justify-center my-4 border border-b-black">
              update profile
            </h2>
            <form
              onSubmit={handleUpdateProfileSubmit}
              className="space-y-4"
              encType="multipart/form-data"
            >
              <div>
                <label className="block text-sm font-medium text-black">
                  <AccountCircleIcon sx={{ color: blue[500] }} />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full border p-2 rounded text-black"
                />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center text-black">
                  <EmailOutlinedIcon sx={{ color: blue[500] }} /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full border p-2 rounded text-black"
                />
              </div>

              <div className="flex cursor-pointer">
                <img src={avatarPreview} alt="avatar Preview" className="w-12" />
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  placeholder="Enter your image"
                  onChange={updateProfileDataChange}
                  className="w-full border p-2 rounded cursor-pointer text-black"
                />
              </div>
              {/* button  */}
              <input
                type="submit"
                value="Update Profile"
                className="w-full bg-green-600 text-white font-semibold py-2 rounded cursor-pointer hover:bg-green-500 transition-all duration-500 ease-in"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileUpdate;
