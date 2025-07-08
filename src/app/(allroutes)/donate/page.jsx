'use client';

import { useState } from "react";
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function DonationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await axios.post('/api/donation', formData);
      setSuccess('Thank you for your donation!');
      setFormData({ name: '', email: '', amount: '', message: '' });
    } catch (err) {
        console.log("error is",err)
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">

      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-orange-400">Support Our Mission</h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Your generous donation helps us provide education, healthcare, and hope to those who need it most.
        </p>
      </section>

      <section className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-orange-400">Donate Now</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Donation Amount (INR)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="1000"
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Message (Optional)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message"
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
            ></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-orange-500 rounded-lg text-white hover:bg-orange-600">
            {loading ? 'Processing...' : 'Donate Securely'}
          </button>
        </form>

        {success && <p className="text-green-400 mt-4 text-center">{success}</p>}
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

        <p className="text-sm text-gray-400 mt-4 text-center">
          We respect your privacy. Your information is secure and confidential.
        </p>
      </section>

      <section className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2 text-orange-400">Other Ways to Help</h3>
        <p className="text-gray-300 mb-4">Become a Volunteer or Sponsor a Child</p>
        <div className="space-x-4">
          <Link href="/get-involved">
            <button className="px-5 py-2 border border-orange-500 rounded-lg text-orange-500 hover:bg-orange-500 hover:text-white">Get Involved</button>
          </Link>
          <Link href="/sponsorship">
            <button className="px-5 py-2 border border-orange-500 rounded-lg text-orange-500 hover:bg-orange-500 hover:text-white">Sponsor a Child</button>
          </Link>
        </div>
      </section>

    </div>
  );
}
