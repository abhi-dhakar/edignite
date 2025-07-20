
import React from 'react'

const OurImpacts = () => {
  return (
    <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Impact</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
              Through dedicated efforts and community partnerships, we've achieved meaningful results.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-myColorA mb-2">20+</div>
              <p className="text-gray-600">Communities Served</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-myColorA mb-2">25,00+</div>
              <p className="text-gray-600">Lives Impacted</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-myColorA mb-2">50+</div>
              <p className="text-gray-600">Projects Completed</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-myColorA mb-2">10+</div>
              <p className="text-gray-600">states Reached</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default OurImpacts