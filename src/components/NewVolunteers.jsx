"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, User, UserPlus, Users, Sparkles, Star, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
    <section className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-myColorA/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-myColorA/10 text-myColorA text-sm font-black uppercase tracking-widest mb-6"
          >
            <Star className="h-4 w-4 fill-current" />
            New Heroes Joined
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tighter"
          >
            Meet Our <span className="text-secondary">New Volunteers</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg md:text-xl text-gray-500 font-medium max-w-2xl"
          >
            "These compassionate individuals have recently stepped forward to drive our mission of hope and empowerment."
          </motion.p>
        </div>

        <div className="px-0">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center p-8 bg-gray-50 rounded-[2.5rem] space-y-4">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : volunteers.length === 0 ? (
            <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
              <UserPlus className="h-16 w-16 text-gray-200 mx-auto mb-6" />
              <p className="text-xl font-bold text-gray-400">Waiting for our next hero...</p>
              <Button
                onClick={() => router.push("/volunteer")}
                className="mt-6 h-12 px-8 bg-myColorA hover:bg-myColorAB rounded-xl font-black shadow-lg shadow-myColorA/20"
              >
                Be The First!
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {volunteers.map((v, index) => (
                <motion.div
                  key={v._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group flex flex-col items-center"
                >
                  {/* Premium Avatar presentation */}
                  <div className="relative mb-6">
                    <div className="absolute inset-[-8px] bg-gradient-to-br from-myColorA to-secondary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md scale-110" />
                    <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-full p-1.5 bg-white shadow-xl ring-1 ring-black/5 group-hover:ring-myColorA transition-all duration-500">
                      {v.image ? (
                        <img
                          src={v.image}
                          alt={v.name}
                          className="h-full w-full rounded-full object-cover transition-all duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                          <User className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                    {/* Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.5 + index * 0.1 }}
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-myColorA border-4 border-white flex items-center justify-center shadow-lg"
                    >
                      <Heart className="h-3 w-3 text-white fill-current" />
                    </motion.div>
                  </div>

                  {/* Profile info */}
                  <div className="text-center">
                    <h3 className="text-lg md:text-xl font-black text-gray-900 group-hover:text-myColorA transition-colors mb-1">
                      {v.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <Clock className="h-3 w-3" />
                      {new Date(v.joinedAt).toLocaleDateString(undefined, {
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Skills Chips */}
                  {v.skills && v.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                      {v.skills.slice(0, 2).map((skill, si) => (
                        <span key={si} className="px-3 py-1 bg-white border border-gray-100 shadow-sm text-gray-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                          {skill}
                        </span>
                      ))}
                      {v.skills.length > 2 && (
                        <span className="px-2 py-1 bg-myColorA text-white rounded-full text-[10px] font-black">
                          +{v.skills.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {!loading && volunteers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-20 text-center"
          >
            <Button
              onClick={() => router.push("/volunteer")}
              className="h-16 px-12 bg-gray-900 hover:bg-myColorA text-white rounded-[2rem] text-lg font-black shadow-2xl shadow-black/10 transition-all hover:scale-105 active:scale-95 group"
            >
              <UserPlus className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
              Start Your Journey With Us
            </Button>
            <p className="mt-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
              Join a community of 500+ active change-makers
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
