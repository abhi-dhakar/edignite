"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, User, UserPlus, Users } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function NewVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/volunteers/new")
      .then((res) => setVolunteers(res.data.volunteers || []))
      .catch(() => setVolunteers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-blue-50 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="inline-flex items-center justify-center bg-blue-100 rounded-full p-2 mb-4">
            <Users className="h-6 w-6 text-myColorA" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Meet Our New Volunteers
          </h2>
          <div className="w-20 h-1.5 bg-myColorA rounded-full"></div>
          <p className="mt-4 text-gray-600 text-center max-w-2xl">
            These amazing people recently joined our mission to make a
            difference
          </p>
        </div>

        <div className="px-0">
          {loading ? (
            <div className="flex overflow-x-auto pb-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 snap-x scrollbar-hide">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[130px] mx-[5px] first:ml-0 md:w-auto md:mx-0 snap-start flex flex-col items-center"
                >
                  <Skeleton className="h-20 w-20 rounded-full mb-3" />
                  <Skeleton className="h-5 w-[90px] mb-2" />
                  <Skeleton className="h-4 w-[70px]" />
                </div>
              ))}
            </div>
          ) : volunteers.length === 0 ? (
            <div className="text-center py-12 bg-white/50 rounded-xl border border-gray-100">
              <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No new volunteers yet</p>
              <p className="text-gray-400 text-sm mt-1">Check back soon!</p>
            </div>
          ) : (
            <div className="flex overflow-x-auto pb-4 pr-[calc(50%-65px)] md:pr-0 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 snap-x scrollbar-hide">
              {volunteers.map((v, index) => (
                <div
                  key={v._id}
                  className={`flex-shrink-0 w-[130px] mx-[5px] ${index === 0 ? "ml-0" : ""} md:w-auto md:mx-0 snap-center group flex flex-col items-center`}
                >
                  {/* Avatar with hover effect */}
                  <div className="mb-3 relative">
                    <div className="absolute inset-0 bg-myColorA/20 rounded-full transform scale-0 group-hover:scale-110 transition-all duration-300"></div>
                    {v.image ? (
                      <img
                        src={v.image}
                        alt={v.name}
                        className="h-20 w-20 rounded-full object-cover border-2 border-white shadow-md group-hover:border-myColorA transition-all duration-300"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-white shadow-md group-hover:border-myColorA transition-all duration-300">
                        <User className="h-9 w-9 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Volunteer details */}
                  <h3 className="font-semibold text-gray-800 text-base text-center group-hover:text-myColorA transition-colors">
                    {v.name}
                  </h3>
                  <div className="text-xs text-gray-500 mt-1 flex items-center justify-center">
                    <Clock className="h-3 w-3 mr-1 inline" />
                    {new Date(v.joinedAt).toLocaleDateString(undefined, {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>

                  {/* Skills tags (optional) */}
                  {v.skills && v.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                        {v.skills[0]}
                        {v.skills.length > 1 ? ` +${v.skills.length - 1}` : ""}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {!loading && volunteers.length > 0 && (
          <div className="mt-8 md:mt-12 text-center">
            <Button
              variant="outline"
              className="border-myColorA text-myColorA hover:bg-myColorA hover:text-white"
              onClick={() => router.push("/volunteer")}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Become a Volunteer
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
