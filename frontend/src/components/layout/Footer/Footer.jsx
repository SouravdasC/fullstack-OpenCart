import React from 'react';
import playStore from '../../../images/Appstore.png';
import appStore from '../../../images/appstore.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[rgb(34,33,33)] px-[10px] md:px-0 py-[10px] flex flex-col md:flex-row justify-around md:items-center text-white">
      {/* left footer  */}
      <div className="leftFooter flex flex-col gap-[20px]">
        <p className="uppercase font-bold">download our app</p>
        <h4 className="capitalize font-light">download app for android and ios devices</h4>
        <img src={playStore} alt="playStore" className="w-40" />
        <img src={appStore} alt="appStore" className="w-40" />
      </div>

      {/* mid footer  */}
      <div className="midFooter capitalize flex flex-col gap-[15px]">
        <Link
          to={'/'}
          className='hover:underline uppercase decoration-[1px] text-[40px] text-red-700 font-bold font-["Poppins",sans-serif] italic'
        >
          Ecommerce
        </Link>
        <p className='ont-["Lato",sans-serif] italic font-medium'>
          high quality in our first priority
        </p>
        <p className='font-["Lato",sans-serif] italic font-light'>
          copyrights 2025 @ Ecommerce website
        </p>
      </div>

      {/* right footer  */}
      <div className="rightFooter">
        <h4 className="capitalize text-[25px] underline decoration-[1px]">follow us</h4>
        <div className="flex flex-col gap-[20px] capitalize ">
          <Link to={''} className="hover:text-amber-100 hover:underline decoration-[1px]">
            instagram
          </Link>
          <Link to={''} className="hover:text-amber-100 hover:underline decoration-[1px]">
            youtube
          </Link>
          <Link to={''} className="hover:text-amber-100 hover:underline decoration-[1px]">
            facebook
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
