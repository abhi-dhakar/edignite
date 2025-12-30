"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ArrowRight, CalendarDays, User, Quote, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

export default function HomeStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get("/api/stories/component");
        setStories(res.data.stories || []);
      } catch (err) {
        setError("Failed to load stories");
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-gray-50/50 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-myColorA/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-myColorA/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-myColorA/10 text-myColorA text-sm font-black uppercase tracking-widest mb-4"
            >
              <Sparkles className="h-4 w-4" />
              Voices of Hope
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tighter"
            >
              Real Stories of <br />
              <span className="text-myColorA">Remarkable Change</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <Link href="/success-stories">
              <Button variant="outline" className="h-14 px-8 border-2 border-myColorA/20 text-myColorA hover:bg-myColorA hover:text-white rounded-2xl font-black transition-all group">
                Full Impact Gallery
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="rounded-[2.5rem] overflow-hidden border-none shadow-xl shadow-black/5 bg-white">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-8 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-20 bg-white rounded-[3rem] border-2 border-dashed border-red-100 font-bold">{error}</div>
        ) : stories.length === 0 ? (
          <div className="text-center text-gray-400 py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 font-bold">
            Stay tuned! Compassionate stories are being written.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-myColorA/10 transition-all duration-500 bg-white group h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    {story.image ? (
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Quote className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <div className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(story.date)}
                      </div>
                    </div>
                    {/* Floating Author badge */}
                    <div className="absolute -bottom-6 right-8">
                      <div className="h-12 w-12 rounded-2xl bg-myColorA shadow-lg flex items-center justify-center border-4 border-white">
                        <User className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pt-10 px-8 pb-4">
                    <CardTitle className="text-2xl font-black text-myColorAB leading-tight line-clamp-2 group-hover:text-myColorA transition-colors">
                      {story.title}
                    </CardTitle>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">
                      by {story.authorName || "Anonymous Correspondent"}
                    </p>
                  </CardHeader>

                  <CardContent className="px-8 pb-8 flex-1 flex flex-col">
                    <p className="text-gray-500 font-medium leading-relaxed italic line-clamp-3 mb-8">
                      "{story.content}"
                    </p>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                      <Dialog
                        open={open && selectedStory?._id === story._id}
                        onOpenChange={setOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="p-0 h-auto font-black text-myColorA hover:text-myColorAB hover:bg-transparent transition-all group/btn"
                            onClick={() => {
                              setSelectedStory(story);
                              setOpen(true);
                            }}
                          >
                            Explore Impact
                            <MoveRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-2" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden border-none shadow-[0_0_100px_rgba(0,0,0,0.2)]">
                          <div className="relative h-64 md:h-80 overflow-hidden">
                            <img
                              src={selectedStory?.image}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-8 left-8 text-white">
                              <h2 className="text-3xl md:text-4xl font-black leading-tight max-w-lg mb-2">{selectedStory?.title}</h2>
                              <div className="flex items-center gap-4 text-white/70 text-sm font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  {selectedStory?.authorName || "Anonymous"}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-white/40" />
                                <span>{formatDate(selectedStory?.date)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-10 md:p-12 bg-white">
                            <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                              {selectedStory?.content}
                            </div>
                            <div className="mt-12 flex justify-end">
                              <DialogClose asChild>
                                <Button className="h-14 px-10 bg-myColorA hover:bg-myColorAB rounded-2xl font-black shadow-xl shadow-myColorA/20">
                                  Done Reading
                                </Button>
                              </DialogClose>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Helper icons
const MoveRight = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8L22 12L18 16" />
    <path d="M2 12H22" />
  </svg>
);
