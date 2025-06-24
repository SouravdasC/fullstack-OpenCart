import {
  adminCreateProduct,
  adminUpdateProduct,
} from '@/redux/thunk/dashboardThunk/adminProductThunks/adminProductThunks';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAdminProductState } from '@/redux/reducer/dashboard/adminProducts/adminProductsListSlice';
import toast from 'react-hot-toast';
import MetaData from '@/components/layout/MetaData';
import DashboardSideBar from '@/components/dashboardCom/DashboardSideBar';
import Loader2 from '@/components/shimmerEffect/Loader2';

const CreateProduct = ({ productToEdit, onSuccess }) => {
  const dispatch = useDispatch();
  const { updateProduct, loading, error } = useSelector(state => state.adminProduct);

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    _id: null,
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const formRef = useRef();

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files];
    const newPreviews = [...imagePreviews, ...files.map(file => URL.createObjectURL(file))];

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const payload = new FormData();
    payload.set('name', form.name.trim());
    payload.set('price', form.price);
    payload.set('stock', form.stock);
    payload.set('category', form.category.trim());
    payload.set('description', form.description.trim());

    images.forEach(img => {
      if (img instanceof File) {
        payload.append('images', img);
      }
    });

    try {
      if (form._id) {
        await dispatch(adminUpdateProduct({ id: form._id, updatedData: payload })).unwrap();
        toast.success('Product updated successfully');
      } else {
        await dispatch(adminCreateProduct(payload)).unwrap();
        toast.success('Product created successfully');
      }

      setForm({
        name: '',
        price: '',
        category: '',
        stock: '',
        description: '',
        _id: null,
      });
      setImages([]);
      setImagePreviews([]);

      onSuccess?.();
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (productToEdit?._id) {
      setForm({
        _id: productToEdit._id,
        name: productToEdit.name,
        price: productToEdit.price,
        category: productToEdit.category,
        stock: productToEdit.stock,
        description: productToEdit.description,
      });

      if (productToEdit.images?.length > 0) {
        setImagePreviews(productToEdit.images.map(img => img.url));
        setImages([]);
      }

      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [productToEdit]);

  useEffect(() => {
    if (error) {
      toast.error('Product list not found');
    }
  }, [error]);

  return (
    <div className="flex flex-col md:flex-row w-full bg-gray-50 rounded shadow mb-10 dark:bg-gray-900">
      <MetaData title={`${form._id ? 'Edit Product' : 'Create New Product'}`} />

      <div className={` ${form._id ? 'hidden' : 'block'}`}>
        <DashboardSideBar />
      </div>

      <main className="flex-1 p-6 md:p-10 overflow-auto text-black">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
          {form._id ? 'Edit Product' : 'Create New Product'}
        </h2>
        <div ref={formRef}>
          {loading ? (
            <Loader2 />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 dark:text-white"
            >
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded w-full"
                required
              />
              <input
                name="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded w-full"
                required
              />
              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded w-full"
                required
              />
              <input
                name="stock"
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded w-full"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded w-full col-span-1 sm:col-span-2"
                required
              />

              <div className="col-span-1 sm:col-span-2">
                <label className="block mb-1 font-medium text-gray-700">
                  Upload Product Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="flex flex-wrap mt-4 gap-4">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={src}
                        alt={`preview-${idx}`}
                        className="h-20 w-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...images];
                          const newPreviews = [...imagePreviews];
                          newImages.splice(idx, 1);
                          newPreviews.splice(idx, 1);
                          setImages(newImages);
                          setImagePreviews(newPreviews);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs hidden group-hover:flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 flex gap-3 mt-4 flex-wrap">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
                >
                  {form._id ? 'Update Product' : 'Create Product'}
                </button>

                {form._id && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm({
                        name: '',
                        price: '',
                        category: '',
                        stock: '',
                        description: '',
                        _id: null,
                      });
                      setImages([]);
                      setImagePreviews([]);
                      dispatch(clearAdminProductState());
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateProduct;
