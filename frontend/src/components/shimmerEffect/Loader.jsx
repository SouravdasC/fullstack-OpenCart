import React from 'react';
import './loader.css';

const Loader = () => {
  return (
    <>
      <div class="spinner flex justify-center items-center mx-auto my-[50px] h-screen">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="text-2xl flex justify-center items-center mx-auto my-[50px]">
        Loading..................
      </div>
    </>
  );
};

export default Loader;
