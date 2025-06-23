import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { blue } from '@mui/material/colors';
import LockIcon from '@mui/icons-material/Lock';
import profile from '../../images/Profile.png';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '@/redux/thunk/userThunk';
import toast from 'react-hot-toast';
import { SkeletonCard } from '../../components/shimmerEffect/SkeletonCard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MetaData from '@/components/layout/MetaData';
import { clearErrors } from '@/redux/reducer/userSlice';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState(profile);
  const navigate = useNavigate();
  const [loginAttempted, setLoginAttempted] = useState(false);

  const dispatch = useDispatch();
  const { error, loading, isAuthenticated } = useSelector(state => state.user);

  // for clear errors in state
  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = user;

  // login user
  const handleLoginSubmit = e => {
    e.preventDefault();
    setLoginAttempted(true);
    dispatch(login({ email: loginEmail, password: loginPassword }));
  };

  // register user
  const handleRegisterSubmit = e => {
    e.preventDefault();
    const formData = new FormData();

    formData.set('name', name);
    formData.set('email', email);
    formData.set('password', password);
    formData.set('avatar', avatar);
    // dispatch register thunk here
    dispatch(register(formData));
    toast.success('User Register Successfull');
  };

  // user data from register form
  const registerDataChange = e => {
    if (e.target.name === 'avatar') {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setAvatar(file); // ✅ use File, not base64
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  // for shipping or login
  // const redirect = location.search ? location.search.split('=')[1] : '/account';
  const redirect = new URLSearchParams(location.search).get('redirect') || '/account';

  useEffect(() => {
    if (error && loginAttempted) {
      toast.error('Login failed or invalid email/password');
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [error, isAuthenticated, navigate, loginAttempted, dispatch, redirect]);

  return (
    <>
      {loading ? (
        <SkeletonCard />
      ) : (
        <>
          <MetaData title={'Authenticated page'} />
          <div className="w-full h-auto max-w-md mx-auto p-6 bg-white shadow-md rounded-lg xl:my-10">
            {/* Toggle Buttons */}
            <div className="flex justify-center mb-6">
              <button
                className={`px-4 py-2 font-semibold cursor-pointer ${
                  isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`ml-4 px-4 py-2 font-semibold cursor-pointer ${
                  !isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>

            {isLogin ? (
              // login form
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium flex items-center text-black">
                    <EmailOutlinedIcon sx={{ color: blue[500] }} /> Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    required
                    className="w-full border p-2 rounded text-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center text-black">
                    <LockIcon sx={{ color: blue[500] }} /> Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                    className="w-full border p-2 rounded text-black"
                  />
                </div>
                <input
                  type="submit"
                  value="Login"
                  className="w-full bg-blue-600 text-white py-2 rounded cursor-pointer"
                />
                <Link
                  to="/password/forgot"
                  className="text-blue-500 text-sm block text-right hover:underline hover:text-red-500"
                >
                  Forgot password?
                </Link>
              </form>
            ) : (
              // register form
              <form
                onSubmit={handleRegisterSubmit}
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
                    onChange={registerDataChange}
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
                    onChange={registerDataChange}
                    required
                    className="w-full border p-2 rounded text-black"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center text-black">
                    <LockIcon sx={{ color: blue[500] }} /> Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={registerDataChange}
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
                    onChange={registerDataChange}
                    required
                    className="w-full border p-2 rounded cursor-pointer text-black"
                  />
                </div>
                {/* button  */}
                <input
                  type="submit"
                  value="Register"
                  className="w-full bg-green-600 text-white py-2 rounded cursor-pointer"
                />
              </form>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default LoginSignup;
