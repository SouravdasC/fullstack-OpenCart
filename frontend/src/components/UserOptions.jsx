import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Backdrop from '@mui/material/Backdrop';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/thunk/userThunk';
import profile from '../images/profile.png';

const UserOptions = ({ user }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector(state => state.cart);

  // for admin
  const dashboard = () => {
    navigate('/admin/dashboard');
  };

  // for profile
  function account() {
    navigate('/account');
  }

  // for logout user
  const logoutUser = () => {
    dispatch(logout());
    navigate('/');
    toast.success('logout user successful');
  };

  // orders
  const orders = () => {
    navigate('/orders');
  };

  const cart = () => {
    navigate('/cart');
  };

  const actions = [
    { icon: <PersonIcon />, name: 'Account', func: account },
    { icon: <ExitToAppIcon />, name: 'Logout', func: logoutUser },
    { icon: <ListAltIcon />, name: 'Orders', func: orders },
    {
      icon: <ShoppingCartIcon className={cartItems.length > 0 ? 'text-red-600' : ''} />,
      name: `Cart(${cartItems.length})`,
      func: cart,
    },
  ];

  // for admin
  if (user.role === 'admin') {
    actions.unshift({ icon: <DashboardIcon />, name: 'Dashboard', func: dashboard });
  }

  return (
    <div className="fixed top-10 w-full z-50 rounded-lg">
      <Box sx={{ flexGrow: 1 }}>
        <Backdrop open={open} />
        <SpeedDial
          ariaLabel="SpeedDial openIcon example"
          sx={{ position: 'absolute', top: 16, right: 16 }}
          direction="down"
          icon={
            <img
              src={user?.avatar?.url || profile} // fallback image
              alt="profile"
              style={{ borderRadius: '50%', width: 40, height: 40 }}
            />
          }
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
        >
          {actions.map(action => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              placement="left"
              tooltipOpen
              onClick={action.func}
            />
          ))}
        </SpeedDial>
      </Box>
    </div>
  );
};

export default UserOptions;
