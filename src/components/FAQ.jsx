'use client'
import { ChevronDown, ChevronUp } from 'lucide-react'
import React, { useState } from 'react'

const FAQ = () => {

      const [expandedFaq, setExpandedFaq] = useState(null);
    
      const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index);
      };
  return (
    <div className="py-16 bg-white">
    <div className="max-w-3xl mx-auto px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
        <p className="mt-4 text-lg text-gray-600">
          Common questions about our organization and work.
        </p>
      </div>

      <div className="space-y-6">
        {[
          {
            question: "How can I get involved with your organization?",
            answer: "There are many ways to contribute! You can volunteer your time, donate to support our programs, participate in our events, or become a partner. Visit our 'Get Involved' page to learn more about specific opportunities."
          },
          {
            question: "How is my donation used?",
            answer: "We're committed to transparency in our financial practices. Approximately 85% of all donations go directly to our programs. The remaining funds support essential administrative functions and fundraising efforts that allow us to continue our work."
          },
          {
            question: "Do you work with local communities?",
            answer: "Absolutely. Local partnership is at the core of our approach. We believe that sustainable change must be led by the communities themselves, with our organization providing support, resources, and expertise as needed."
          },
          {
            question: "Are you a registered nonprofit organization?",
            answer: "Yes, we are a registered 501(c)(3) nonprofit organization in the surat gujrat, and we maintain appropriate registrations in all countries where we operate. All donations from india. donors are tax-deductible to the extent allowed by law."
          }
        ].map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-6">
            <button
              onClick={() => toggleFaq(index)}
              className="flex justify-between items-center w-full text-left focus:outline-none"
            >
              <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
              {expandedFaq === index ? (
                <ChevronUp className="h-5 w-5 text-myColorA" />
              ) : (
                <ChevronDown className="h-5 w-5 text-myColorA" />
              )}
            </button>
            {expandedFaq === index && (
              <div className="mt-3 text-gray-600">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default FAQ