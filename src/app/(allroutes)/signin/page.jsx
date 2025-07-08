'use client';

import { useState } from 'react';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SigninPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
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

    const res = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid email or password.');
    } else {
      router.push('/profile');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-gray-800 p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-orange-400 mb-6 text-center">Sign In to Your Account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

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
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {error && <p className="text-red-400 mt-3 text-center">{error}</p>}
      </form>

      <div className='flex gap-2 justify-center mt-2 pt-2'>
        dont have account <Link className='text-yellow-600' href="/signup">signup</Link>
      </div>

    </div>
  );
} 
