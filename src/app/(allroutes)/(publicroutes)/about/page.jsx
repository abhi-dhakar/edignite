"use client";
import { Users, Globe, Target, Award } from "lucide-react";
import FAQ from "@/components/FAQ";
import CallToAction from "@/components/CallToAction";
import WhereWeWorks from "@/components/WhereWeWorks";

export default function AboutUsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-green-5 00 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-myColorAB to-myColorA mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-6 sm:py-32">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            About Our Mission
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-green-100">
            Founded in 2019, we are dedicated to creating sustainable change
            through community empowerment, environmental conservation, and
            humanitarian support.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Our Story
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                We are the Students of the NIT Surat who with so much love,
                dreams, hopes and, ambitions we have opened Edignite NGO for the
                upliftment of underprivileged kids through education. We work
                for the kids who have not seen the school, not able to afford
                the education and/ or are not getting the proper guidance for
                any exam preparation. In this way, we are striving to achieve
                our honorable Dr. A.P.J. Abdul Kalam Sir's mission of Educated
                and Empowered India.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Till now, we have guided/are guiding 350+ underprivileged and
                needy kids, from which some of them getting selected for several
                scholarships. We are a registered Trust at NGO Darpan, NITI
                Aayog, in affiliation with Sessions Court, Surat Charity
                Commissioner office, Govt. of India.
              </p>
    
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-200">
                {/* Replace with an actual image of your organization's history or work */}
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <img src="/image1.jpeg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Mission & Vision
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
              Guided by clear principles, we work toward a better future for
              all.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mt-12">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="inline-block p-3 bg-myColorA rounded-lg mb-4">
                <Target className="h-8 w-8 text-myColorAB" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600">
                To empower communities through sustainable development,
                environmental conservation, and educational initiatives that
                create lasting positive change. We believe in working alongside
                communities, respecting local knowledge and traditions while
                introducing innovative solutions to complex challenges.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="inline-block p-3 bg-myColorA rounded-lg mb-4">
                <Globe className="h-8 w-8 text-myColorAB" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600">
                A world where communities thrive in harmony with nature, where
                resources are shared equitably, and where every person has the
                opportunity to reach their full potential. We envision a future
                of resilient communities that are economically, socially, and
                environmentally sustainable for generations to come.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Our Team */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Leadership Team
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
              Meet the dedicated individuals guiding our organization.
            </p>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="mx-auto h-40 w-40 rounded-full overflow-hidden bg-gray-200">
                {/* Replace with actual team member image */}
                <div className="w-full h-full flex items-center justify-center bg-myColorAB">
                  <Users className="h-16 w-16 text-myColorA" />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Sarah Johnson
              </h3>
              <p className="text-myColorA font-medium">Executive Director</p>
              <p className="mt-2 text-gray-600 max-w-xs mx-auto">
                With 15+ years in nonprofit leadership, Sarah brings vision and
                passion to our mission.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="mx-auto h-40 w-40 rounded-full overflow-hidden bg-gray-200">
                {/* Replace with actual team member image */}
                <div className="w-full h-full flex items-center justify-center bg-myColorAB">
                  <Users className="h-16 w-16 text-myColorA" />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Michael Chen
              </h3>
              <p className="text-myColorA font-medium">Operations Director</p>
              <p className="mt-2 text-gray-600 max-w-xs mx-auto">
                Michael oversees our program implementation and ensures
                efficiency across operations.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <div className="mx-auto h-40 w-40 rounded-full overflow-hidden bg-gray-200">
                {/* Replace with actual team member image */}
                <div className="w-full h-full flex items-center justify-center bg-myColorAB">
                  <Users className="h-16 w-16 text-myColorA" />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Amara Okafor
              </h3>
              <p className="text-myColorA font-medium">
                Community Outreach Lead
              </p>
              <p className="mt-2 text-gray-600 max-w-xs mx-auto">
                Amara builds and nurtures our partnerships with communities and
                stakeholders.
              </p>
            </div>
          </div>
        </div>
      </div>

      <WhereWeWorks />
      <FAQ />

      {/* Partners & Supporters */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Partners & Supporters
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
              We're grateful for the organizations that make our work possible.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
            {/* Partner logos would go here */}
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex justify-center py-8 px-8 bg-white rounded-lg"
              >
                <div className="h-12 flex items-center justify-center">
                  <Award className="h-10 w-10 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CallToAction />
    </div>
  );
}
