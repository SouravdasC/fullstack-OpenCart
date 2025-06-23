import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Country, State } from 'country-state-city';
import { useNavigate } from 'react-router-dom';
import {
  Home as HomeIcon,
  LocationOn as LocationOnIcon,
  PinDrop as PinDropIcon,
  Phone as PhoneIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import MetaData from '@/components/layout/MetaData';
import Checkout from '@/components/stepper/Checkout';
import { saveShippingInfo } from '@/redux/reducer/cartReducer/cartItemsSlice';
import toast from 'react-hot-toast';
import { SkeletonShipping } from '@/components/shimmerEffect/SkeletonShipping';

const ShippingInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingInfo, loading } = useSelector(state => state.cart);

  const [address, setAddress] = useState(shippingInfo?.address || '');
  const [city, setCity] = useState(shippingInfo?.city || '');
  const [state, setState] = useState(shippingInfo?.state || '');
  const [country, setCountry] = useState(shippingInfo?.country || '');
  const [pinCode, setPinCode] = useState(shippingInfo?.pinCode || '');
  const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo || '');
  const [loader, setLoader] = useState(true);

  const countries = Country.getAllCountries();
  const states = country ? State.getStatesOfCountry(country) : [];

  const handleShippingSubmit = e => {
    e.preventDefault();

    if (phoneNo.length !== 10) {
      alert('Phone number should be 10 digits');
      return;
    }

    // validation
    if (!(address || city || state || country || pinCode || phoneNo)) {
      toast.error('all field are required');
      return;
    }
    dispatch(
      saveShippingInfo({
        address,
        city,
        state,
        country,
        pinCode,
        phoneNo,
      })
    );

    navigate('/order/confirm');
  };

  useEffect(() => {
    // simulate loading delay
    const timer = setTimeout(() => {
      setLoader(false);
    }, 1000); // 1s delay for visual effect

    return () => clearTimeout(timer);
  }, []);

  if (loader) return <SkeletonShipping />;

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md text-black">
      <MetaData title={'Shipping Details'} />
      <h2 className="text-2xl font-semibold text-center mb-6">Shipping Details</h2>
      <Checkout activeStep={0} />

      <form onSubmit={handleShippingSubmit} className="space-y-6 my-6">
        <div className="flex items-center gap-3">
          <HomeIcon />
          <input
            type="text"
            placeholder="Address"
            value={address}
            required
            onChange={e => setAddress(e.target.value)}
            className="w-full border p-2 rounded-md focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <LocationOnIcon />
          <input
            type="text"
            placeholder="City"
            value={city}
            required
            onChange={e => setCity(e.target.value)}
            className="w-full border p-2 rounded-md focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <PinDropIcon />
          <input
            type="number"
            placeholder="Pin Code"
            value={pinCode}
            required
            onChange={e => setPinCode(e.target.value)}
            className="w-full border p-2 rounded-md focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <PhoneIcon />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNo}
            required
            maxLength={10}
            onChange={e => setPhoneNo(e.target.value)}
            className="w-full border p-2 rounded-md focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <PublicIcon />
          <select
            value={country}
            required
            onChange={e => {
              setCountry(e.target.value);
              setState(''); // reset state
            }}
            className="w-full border p-2 rounded-md focus:outline-none"
          >
            <option value="">Select Country</option>
            {countries.map(c => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <PublicIcon />
          <select
            value={state}
            required
            onChange={e => setState(e.target.value)}
            disabled={!country}
            className="w-full border p-2 rounded-md focus:outline-none"
          >
            <option value="">Select State</option>
            {states.map(s => (
              <option key={s.isoCode} value={s.isoCode}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!state}
          className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${
            !state ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default ShippingInfo;
