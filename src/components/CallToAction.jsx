import React from 'react'
import Link from 'next/link'

const CallToAction = () => {
  return (
    <div className="bg-myColorA py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white">Join Us in Making a Difference</h2>
          <p className="mt-4 text-lg text-green-100">
            Together, we can create lasting change for communities and environments in need.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/volunteer" className="bg-white text-myColorAB px-6 py-3 rounded-md font-medium hover:bg-green-50 transition-colors">
              Become a Volunteer
            </Link>
            <Link href="/donate" className="bg-myColorA text-white px-6 py-3 rounded-md font-medium hover:bg-myColorAB border border-myColorA transition-colors">
              Make a Donation
            </Link>
            <Link href="/contact" className="bg-myColorAB text-white px-6 py-3 rounded-md font-medium hover:bg-myColorA transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
  )
}

export default CallToAction