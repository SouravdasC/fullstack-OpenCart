import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const searchSubmitHandler = e => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="mx-auto py-[20px] bg-gray-300 flex justify-center items-center h-screen">
      <MetaData title={'Search Products'} />
      <form onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="search product"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="w-[50vw] bg-white px-4 py-4 outline-none rounded-bl-lg rounded-tl-lg"
        />
        <input
          type="submit"
          value="Search"
          className="bg-red-400 px-6 py-4 text-white font-bold capitalize hover:bg-blue-600 transition-all ease-in-out cursor-pointer"
        />
      </form>
    </div>
  );
};

export default Search;
