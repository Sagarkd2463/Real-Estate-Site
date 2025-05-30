import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleGenderChange = (e) => {
    setFormData({
      ...formData,
      gender: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder='Username'
          className='border p-3 rounded-lg focus:outline-none'
          id='username'
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder='Email'
          className='border p-3 rounded-lg focus:outline-none'
          id='email'
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder='Password'
          className='border p-3 rounded-lg focus:outline-none'
          id='password'
          onChange={handleChange}
        />

        <div className='flex flex-col gap-2'>
          <label className='text-lg font-semibold'>Gender:</label>
          <div className='flex gap-4'>
            <label className='flex items-center gap-2'>
              <input
                type="radio"
                name="gender"
                value="Male"
                onChange={handleGenderChange}
                required
              />
              Male
            </label>
            <label className='flex items-center gap-2'>
              <input
                type="radio"
                name="gender"
                value="Female"
                onChange={handleGenderChange}
                required
              />
              Female
            </label>
            <label className='flex items-center gap-2'>
              <input
                type="radio"
                name="gender"
                value="Other"
                onChange={handleGenderChange}
                required
              />
              Other
            </label>
          </div>
        </div>

        <button
          className='bg-slate-700 text-white p-3 rounded-lg uppercase 
          hover:opacity-95 disabled:opacity-80 cursor-pointer font-semibold'
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p className='text-xl'>Already have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700 text-xl hover:underline'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
};

export default SignUp;