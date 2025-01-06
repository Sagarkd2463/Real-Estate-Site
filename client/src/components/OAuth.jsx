import React from 'react';
import { GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../Firebase';
import { useDispatch } from 'react-redux';
import { signInFailure, signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOAuthClick = async (provider, endpoint) => {
        try {
            const result = await signInWithPopup(auth, provider);

            if (!result.user || !result.user.displayName || !result.user.email || !result.user.photoURL) {
                console.warn("Incomplete user information received from OAuth provider.");
                return;
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                    gender: 'Other',
                }),
            });

            if (!res.ok) throw new Error('Authentication failed. Please try again.');

            const data = await res.json();

            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            if (error.code === 'auth/popup-closed-by-user') {
                console.warn("OAuth popup was closed by the user before completing the sign-in.");
                return;
            }

            if (error.code === 'auth/account-exists-with-different-credential') {
                console.error("Account exists with a different credential. Error: ", error.message);

                alert(
                    `The email address is already associated with another authentication provider. 
                    Please sign in using another email with another provider.`
                );

                return;
            }

            console.error("OAuth Error: ", error.message);
            dispatch(signInFailure(error.message));
        }
    };

    const handleGoogleClick = () => handleOAuthClick(new GoogleAuthProvider(), '/api/auth/google');
    const handleFacebookClick = () => handleOAuthClick(new FacebookAuthProvider(), '/api/auth/facebook');
    const handleGithubClick = () => handleOAuthClick(new GithubAuthProvider(), '/api/auth/github');

    return (
        <div className='flex flex-col gap-4 justify-center'>
            <button
                type='button'
                className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
                onClick={handleGoogleClick}>
                Continue with Google
            </button>

            <button
                type='button'
                className='bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
                onClick={handleFacebookClick}>
                Continue with Facebook
            </button>

            <button
                type='button'
                className='bg-gray-900 text-white p-3 rounded-lg uppercase hover:opacity-95'
                onClick={handleGithubClick}>
                Continue with GitHub
            </button>
        </div>
    );
};

export default OAuth;