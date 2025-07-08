'use client';

import { useState } from 'react';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/signup', formData);

      if (res.status === 201) {
        await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        router.push('/profile');
      } else {
        setError('Signup failed. Please try again.');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-gray-800 p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-orange-400 mb-6 text-center">Create Your Account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
            placeholder="Password"
          />
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-orange-500 rounded-lg text-white hover:bg-orange-600">
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        {error && <p className="text-red-400 mt-3 text-center">{error}</p>}

        <div className='flex gap-2 justify-center mt-2 pt-2'>
        already have account <Link className='text-yellow-600' href="/signin">sign-in</Link>
      </div>
      </form>
    </div>
  );
}
