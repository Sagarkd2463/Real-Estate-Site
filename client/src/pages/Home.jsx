import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ListingItem from '../components/ListingItem';

function Home() {
    const { currentUser } = useSelector((state) => state.user);
    const [offerListings, setOfferListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) return;

        const fetchListings = async () => {
            setLoading(true);
            setError('');

            const MIN_LOADING_DURATION = 1500; // 1.5 seconds
            const startTime = Date.now();

            try {
                const [offers, rent, sale] = await Promise.all([
                    fetch('/api/listing/get?offer=true&limit=4').then((res) => {
                        if (!res.ok) throw new Error('Failed to fetch offer listings');
                        return res.json();
                    }),
                    fetch('/api/listing/get?type=rent&limit=4').then((res) => {
                        if (!res.ok) throw new Error('Failed to fetch rent listings');
                        return res.json();
                    }),
                    fetch('/api/listing/get?type=sale&limit=4').then((res) => {
                        if (!res.ok) throw new Error('Failed to fetch sale listings');
                        return res.json();
                    }),
                ]);

                setOfferListings(offers);
                setRentListings(rent);
                setSaleListings(sale);
            } catch (err) {
                setError(err.message);
                console.error(err.message);
            } finally {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, MIN_LOADING_DURATION - elapsedTime);
                setTimeout(() => {
                    setLoading(false);
                }, remainingTime);
            }
        };

        fetchListings();
    }, [currentUser]);

    return (
        <div>
            <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
                {currentUser &&
                    <>
                        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
                            Find your next <span className="text-slate-500">perfect</span>
                            <br />
                            place with ease
                        </h1>

                        <div className="text-gray-400 text-xs sm:text-sm">
                            Brick Estate is the best place to find your next perfect place to live.
                            <br />
                            We have a wide range of properties for you to choose from.
                        </div>

                        <Link
                            to="/search"
                            className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
                        >
                            Let's start now...
                        </Link>
                    </>
                }
            </div>

            {loading && (
                <>
                    <div className="flex justify-center items-center w-full mt-6">
                        <svg
                            className="flex items-center px-4 py-2 bg-slate-400 rounded-full shadow hover:bg-slate-700 focus:outline-none animate-spin h-16 w-16 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                        </svg>
                    </div>
                </>
            )}

            {error &&
                <div className="text-center mt-5">
                    <p className="text-danger">Something went wrong. Please try again!</p>
                    <button
                        className="btn mt-3"
                        style={{ backgroundColor: "#faa935", color: "white" }}
                        onClick={() => navigate("/")}
                    >
                        Go to Home Page
                    </button>
                </div>
            }

            {!loading && !error && currentUser && (
                <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
                    {offerListings.length > 0 && (
                        <Section
                            title="Recent offers"
                            linkTo="/search?offer=true"
                            listings={offerListings}
                        />
                    )}

                    {rentListings.length > 0 && (
                        <Section
                            title="Recent places for rent"
                            linkTo="/search?type=rent"
                            listings={rentListings}
                        />
                    )}

                    {saleListings.length > 0 && (
                        <Section
                            title="Recent places for sale"
                            linkTo="/search?type=sale"
                            listings={saleListings}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

function Section({ title, linkTo, listings }) {
    return (
        <div>
            <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">{title}</h2>
                <Link to={linkTo} className="text-sm text-blue-800 hover:underline">
                    Show more
                </Link>
            </div>
            <div className="flex flex-wrap gap-4">
                {listings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                ))}
            </div>
        </div>
    );
};

export default Home;