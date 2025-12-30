"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqData = [
  {
    question: "How can I get involved with your organization?",
    answer: "There are many ways to contribute! You can volunteer your time, donate to support our programs, participate in our events, or become a partner. Visit our 'Get Involved' page to learn more about specific opportunities."
  },
  {
    question: "How is my donation used?",
    answer: "We're committed to transparency. Approximately 85% of all donations go directly to our programs. The remaining funds support essential administrative functions and fundraising efforts that allow us to continue our work sustainably."
  },
  {
    question: "Do you work with local communities?",
    answer: "Absolutely. Local partnership is at the core of our approach. We believe that sustainable change must be led by the communities themselves, with our organization providing support, resources, and expertise as needed."
  },
  {
    question: "Are you a registered nonprofit organization?",
    answer: "Yes, we are a registered nonprofit organization. We maintain appropriate registrations in all regions where we operate. All donations are handled with strict adherence to local nonprofit regulations and transparency standards."
  },
];

const FAQItem = ({ faq, index, expandedFaq, toggleFaq }) => {
  const isOpen = expandedFaq === index;

  return (
    <motion.div
      initial={false}
      className={cn(
        "mb-4 overflow-hidden rounded-[2rem] border transition-all duration-300",
        isOpen ? "bg-myColorA/5 border-myColorA/20 shadow-lg shadow-myColorA/5" : "bg-white border-gray-100 hover:border-myColorA/30"
      )}
    >
      <button
        onClick={() => toggleFaq(index)}
        className="flex items-center justify-between w-full p-6 md:p-8 text-left focus:outline-none group"
      >
        <div className="flex items-center gap-4 md:gap-6">
          <div className={cn(
            "h-10 w-10 md:h-12 md:w-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
            isOpen ? "bg-myColorA text-white" : "bg-gray-50 text-gray-400 group-hover:bg-myColorA/10 group-hover:text-myColorA"
          )}>
            <HelpCircle className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <h3 className={cn(
            "text-lg md:text-xl font-black tracking-tight transition-colors",
            isOpen ? "text-myColorAB" : "text-gray-700 group-hover:text-gray-900"
          )}>
            {faq.question}
          </h3>
        </div>

        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300",
          isOpen ? "bg-myColorA text-white rotate-180" : "bg-gray-50 text-gray-400"
        )}>
          <ChevronDown className="h-5 w-5" />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 md:px-8 pb-8 ml-0 md:ml-16 mr-0 md:mr-8">
              <div className="h-[2px] w-12 bg-myColorA/20 mb-6 rounded-full" />
              <p className="text-gray-500 text-base md:text-lg font-medium leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const [expandedFaq, setExpandedFaq] = useState(0); // Open first by default

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20 text-balance">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-6"
          >
            <HelpCircle className="h-4 w-4" />
            Common Inquiries
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter"
          >
            Everything You <span className="text-myColorA">Need to Know</span>
          </motion.h2>
          <p className="mt-6 text-lg text-gray-500 font-medium max-w-2xl mx-auto italic">
            "Transparent answers for our compassionate supporters. We're here to provide clarity on our mission and impact."
          </p>
        </div>

        <div className="space-y-2">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              index={index}
              faq={faq}
              expandedFaq={expandedFaq}
              toggleFaq={toggleFaq}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-8 rounded-[2.5rem] bg-gray-900 text-center relative overflow-hidden group shadow-2xl shadow-black/10 transition-transform active:scale-[0.98]"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
            <HelpCircle size={100} className="text-white" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">Still have questions?</h3>
          <p className="text-white/60 font-medium mb-8">Our dedicated team is ready to assist you round the clock.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="h-14 px-10 bg-myColorA text-white rounded-2xl font-black hover:bg-myColorAB transition-all hover:scale-105 active:scale-95 shadow-xl shadow-myColorA/20">
              Get in Touch
            </button>
            <button className="h-14 px-10 bg-white/10 text-white rounded-2xl font-black backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
              Live Chat Support
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;