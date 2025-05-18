import React, { useEffect, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { auth } from '../Firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateListing = () => {
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

    const [imageUploadError, setImageUploadError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const listingId = params.listingId;
                const res = await fetch(`/api/listing/get/${listingId}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.message || 'Failed to fetch listing data');
                    return;
                }

                setFormData(data);
            } catch (err) {
                setError('An error occurred while fetching the listing.');
            }
        };

        fetchListing();
    }, [params.listingId]);

    const handleImageSubmit = async () => {
        if (files.length === 0) {
            setImageUploadError('No images selected.');
            return;
        }

        if (files.length + formData.imageUrls.length > 6) {
            setImageUploadError('You can upload a maximum of 6 images.');
            return;
        }

        try {
            setUploading(true);
            setImageUploadError('');
            const uploadPromises = Array.from(files).map((file) => storeImage(file));
            const urls = await Promise.all(uploadPromises);

            setFormData((prevState) => ({
                ...prevState,
                imageUrls: [...prevState.imageUrls, ...urls],
            }));
        } catch {
            setImageUploadError('Image upload failed. Ensure each file is under 2MB.');
        } finally {
            setUploading(false);
        }
    };

    const storeImage = (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(auth.app);
            const fileName = `${Date.now()}-${file.name}`;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                null,
                (error) => reject(error),
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (err) {
                        reject(err);
                    }
                }
            );
        });
    };

    const handleImageRemove = (index) => {
        setFormData((prevState) => ({
            ...prevState,
            imageUrls: prevState.imageUrls.filter((_, i) => i !== index),
        }));
    };

    const handleChange = (e) => {
        const { id, checked, value } = e.target;
        if (id === 'sale' || id === 'rent') {
            setFormData((prevState) => ({ ...prevState, type: id }));
        } else if (['parking', 'furnished', 'offer'].includes(id)) {
            setFormData((prevState) => ({ ...prevState, [id]: checked }));
        } else {
            setFormData((prevState) => ({ ...prevState, [id]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.imageUrls.length < 1) {
            setError('You must upload at least one image!');
            return;
        }

        if (formData.offer && +formData.discountPrice >= +formData.regularPrice) {
            setError('Discount price must be lower than regular price.');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, userRef: currentUser._id }),
            });

            const data = await res.json();
            setLoading(false);

            if (!res.ok) {
                setError(data.message || 'Failed to update listing.');
                return;
            }

            navigate('/');
        } catch (err) {
            setError('An error occurred while updating the listing.');
            setLoading(false);
        }
    };

    return (
        <main className="p-6 mx-auto max-w-4xl">
            <h1 className="text-3xl font-semibold text-center my-6 text-gray-800">Update a Listing</h1>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Updating...' : 'Update Listing'}
                </button>

                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </form>
        </main>
    );
};

export default UpdateListing;