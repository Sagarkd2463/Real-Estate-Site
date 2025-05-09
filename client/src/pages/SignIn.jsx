import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

function SignIn() {
    const [formData, setFormData] = useState({});
    const [localError, setLocalError] = useState(null);
    const { loading } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
        setLocalError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setLocalError('Email and password are required.');
            return;
        }

        try {
            dispatch(signInStart());

            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Sign-in failed. Please try again.');
            }

            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            setLocalError(error.message);
            dispatch(signInFailure(error.message));
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-3 rounded-lg focus:outline-none"
                    id="email"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border p-3 rounded-lg focus:outline-none"
                    id="password"
                    onChange={handleChange}
                />

                <button
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase 
                hover:opacity-95 disabled:opacity-80 cursor-pointer font-semibold"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Sign In'}
                </button>

                <OAuth />
            </form>

            <div className="flex gap-2 mt-5">
                <p className="text-xl">No account? Please sign up!</p>
                <Link to={'/sign-up'}>
                    <span className="text-blue-700 text-xl hover:underline">Sign Up</span>
                </Link>
            </div>

            {localError && <p className="text-red-500 mt-5">{localError}</p>}
        </div>
    );
}

export default SignIn;