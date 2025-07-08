"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-b from-black to-gray-900 rounded-2xl shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-500">
          Empowering Lives, One Step at a Time
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Providing education, healthcare, and hope to underprivileged
          communities. Your support can change a life!
        </p>
        <div className="space-x-4">
          <Link href="/donate">
            <button className="px-6 py-3 bg-cyan-500 rounded-lg text-white hover:bg-cyan-600">
              Donate Now
            </button>
          </Link>
          <Link href="/get-involved">
            <button className="px-6 py-3 border border-cyan-500 rounded-lg text-cyan-500 hover:bg-cyan-500 hover:text-white">
              Get Involved
            </button>
          </Link>
        </div>
      </section>

      {/* Impact Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6 text-cyan-500">
          Making a Difference, One Life at a Time
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">500+</h3>
            <p className="text-gray-400">Children Educated</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">500+</h3>
            <p className="text-gray-400">Medical Treatments Provided</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">10+</h3>
            <p className="text-gray-400">Villages Empowered</p>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6 text-cyan-500">
          Our Major Activities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-4 rounded-2xl shadow-md">
            <h4 className="font-semibold mb-2">Education</h4>
            <p className="text-sm text-gray-400">
              Free schooling, scholarships, books
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl shadow-md">
            <h4 className="font-semibold mb-2">Healthcare</h4>
            <p className="text-sm text-gray-400">
              Medical camps, hygiene programs
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl shadow-md">
            <h4 className="font-semibold mb-2">Women Empowerment</h4>
            <p className="text-sm text-gray-400">
              Skills, employment, self-help groups
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl shadow-md">
            <h4 className="font-semibold mb-2">Environment</h4>
            <p className="text-sm text-gray-400">
              Tree plantation, clean water drives
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4 text-cyan-500">
          Join Us in Making a Difference!
        </h2>
        <p className="text-gray-300 mb-6">
          Together, we can create a brighter future for everyone.
        </p>
        <Link href="/donate">
          <button className="px-6 py-3 bg-cyan-500 rounded-lg text-white hover:bg-cyan-600">
            Donate Now
          </button>
        </Link>
      </section>
    </div>
  );
}
