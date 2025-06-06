import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase';

const CreateListing = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [uploading, setUploading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            resolve(downloadURL);
                        })
                        .catch(reject);
                }
            );
        });
    };

    const handleImageSubmit = async (e) => {
        e.preventDefault();

        if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            try {
                const urls = await Promise.all(promises);
                setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...urls] }));
            } catch (error) {
                setImageUploadError('Image upload failed (2MB max per image)');
            } finally {
                setUploading(false);
            }
        } else {
            setImageUploadError('You can only upload up to 6 images per listing.');
        }
    };

    const handleImageRemove = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            });
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            });
        }

        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.imageUrls.length < 1) {
            return setError('You must upload at least one image!');
        }
        if (+formData.regularPrice < +formData.discountPrice) {
            return setError('Discount price must be lower than regular price.');
        }

        try {
            setLoading(true);
            setError(false);

            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });

            const data = await res.json();
            setLoading(false);

            if (data.success === false) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <main className='p-6 mx-auto max-w-4xl'>
            <h1 className='text-3xl font-semibold text-center my-6 text-gray-800'>Create a Listing</h1>
            <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            id="name"
                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                            maxLength={60}
                            minLength={10}
                            onChange={handleChange}
                            value={formData.name}
                            required
                        />
                        <textarea
                            placeholder="Description"
                            id="description"
                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            value={formData.description}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            id="address"
                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            value={formData.address}
                            required
                        />

                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="sale"
                                    className="w-5 h-5"
                                    onChange={handleChange}
                                    checked={formData.type === 'sale'}
                                />
                                <span>Sale</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="rent"
                                    className="w-5 h-5"
                                    onChange={handleChange}
                                    checked={formData.type === 'rent'}
                                />
                                <span>Rent</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="parking"
                                    className="w-5 h-5"
                                    onChange={handleChange}
                                    checked={formData.parking}
                                />
                                <span>Parking Spot</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="furnished"
                                    className="w-5 h-5"
                                    onChange={handleChange}
                                    checked={formData.furnished}
                                />
                                <span>Furnished</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="offer"
                                    className="w-5 h-5"
                                    onChange={handleChange}
                                    checked={formData.offer}
                                />
                                <span>Offer</span>
                            </label>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    id="bedrooms"
                                    min="1"
                                    max="10"
                                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange}
                                    value={formData.bedrooms}
                                    required
                                />
                                <span>Beds</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    id="bathrooms"
                                    min="1"
                                    max="10"
                                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange}
                                    value={formData.bathrooms}
                                    required
                                />
                                <span>Baths</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    id="regularPrice"
                                    min="50"
                                    max="10000000"
                                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange}
                                    value={formData.regularPrice}
                                    required
                                />
                                <span className='text-sm font-semibold'>Regular Price (₹ / month)</span>
                            </div>

                            {formData.offer && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        id="discountPrice"
                                        min="0"
                                        max="10000000"
                                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        onChange={handleChange}
                                        value={formData.discountPrice}
                                        required
                                    />
                                    <span className='text-sm font-semibold'>Discount Price (₹ / month)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <p className="font-medium">
                            Images:
                            <span className="text-sm text-gray-500 ml-2">First image will be the cover (max 6)</span>
                        </p>
                        <div className="flex gap-4">
                            <input
                                type="file"
                                id="images"
                                className="border border-gray-300 p-3 rounded w-full"
                                accept="image/*"
                                multiple
                                onChange={(e) => setFiles(e.target.files)}
                            />
                            <button
                                type="button"
                                disabled={uploading}
                                onClick={handleImageSubmit}
                                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50">
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                        {imageUploadError && <p className="text-sm text-red-600">{imageUploadError}</p>}

                        <div className="grid grid-cols-3 gap-4">
                            {formData.imageUrls.map((url, index) => (
                                <div key={url} className="relative border rounded-lg">
                                    <img
                                        src={url}
                                        alt="uploaded"
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleImageRemove(index)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700">
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="w-full py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 disabled:opacity-50">
                    {loading ? 'Creating...' : 'Create Listing'}
                </button>

                {error && <p className='text-red-600 mt-4'>{error}</p>}
            </form>
        </main>
    );
};

export default CreateListing;