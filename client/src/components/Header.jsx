import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const defaultAvatar = 'https://i.pinimg.com/originals/de/6e/8d/de6e8d53598eecfb6a2d86919b267791.png';

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);

        const searchQuery = urlParams.toString();
        navigate(`/search/${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');

        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [window.location.search]);

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to={'/'}>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <span className='text-slate-500'>Bricks</span>
                        <span className='text-slate-700'>Estate</span>
                    </h1>
                </Link>

                <form className='bg-slate-100 p-3 rounded-lg flex items-center' onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder='Search...'
                        className='bg-transparent focus:outline-none w-24 sm:w-64'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <button>
                        <FaSearch className='text-slate-600' />
                    </button>
                </form>

                <ul className='flex gap-4'>
                    <Link to={'/'}><li className='hidden sm:inline text-slate-700'>Home</li></Link>
                    <Link to={'/about'}><li className='hidden sm:inline text-slate-700'>About</li></Link>

                    <Link to={'/profile'}>
                        {currentUser ? (
                            <img
                                className='rounded-full h-7 w-7 object-cover'
                                src={currentUser.avatar || defaultAvatar}
                                alt="profile"
                                onError={(e) => e.target.src = defaultAvatar}
                            />
                        ) : (
                            <li className='text-slate-700'>Sign in</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    );
};

export default Header;