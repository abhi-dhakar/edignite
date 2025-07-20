import { Globe, MapPin } from 'lucide-react'
import React from 'react'

const WhereWeWorks = () => {
  return (
    
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Where We Work</h2>
              <p className="mt-4 text-lg text-gray-600">
                Our programs span multiple regions, with a focus on areas where we can make the most impact.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-myColorA mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Surat</h3>
                    <p className="text-gray-600">Sustainable agriculture and clean water initiatives</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-myColorA mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Rajasthan</h3>
                    <p className="text-gray-600">Education and healthcare access programs</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-myColorA mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Rajkot</h3>
                    <p className="text-gray-600">Environmental conservation and community resilience</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-myColorA mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Rajasthan</h3>
                    <p className="text-gray-600">Urban renewal and food security initiatives</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 lg:mt-0">
              <div className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden bg-gray-200">
               
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Globe className="h-16 w-16 text-myColorA" />
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default WhereWeWorks