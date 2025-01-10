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
                setLoading(false);
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

            {loading &&
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            }

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
                <>
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
                </>
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