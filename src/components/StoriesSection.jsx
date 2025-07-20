"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
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
import { ArrowRight, CalendarDays } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

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
    <section className="my-12 px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center text-black mb-8">
        Success Stories
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="rounded-xl shadow-md">
              <Skeleton className="h-48 w-full rounded-t-xl" />
              <CardContent className="space-y-3 pt-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : stories.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No stories available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card
              key={story._id}
              className="rounded-xl shadow-md hover:shadow-lg transition p-0 pb-2"
            >
              {story.image && (
                <img
                  src={story.image}
                  alt={story.title}
                  className="h-48 w-full object-cover rounded-t-xl"
                />
              )}
              <CardHeader  className="pt-1 px-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  <span>{formatDate(story.date)}</span>
                </div>

                <CardTitle className="text-myColorAB text-lg">
                  {story.title}
                </CardTitle>

                <div className="text-xs text-gray-500 ">
                  {story.authorName || "Anonymous"}'s story
                </div>

              </CardHeader>
              <CardContent  className="px-6">
                <p className="text-gray-700 mb-2 line-clamp-2">
                  {story.content}
                </p>

                <Dialog
                  open={open && selectedStory?._id === story._id}
                  onOpenChange={setOpen}
                >
                  <DialogTrigger asChild>
                    <div>
                        <Separator/>
                    <Button
                      className="text-myColorA mt-2 hover:text-myColorAB group"
                      variant="ghost"
                      onClick={() => {
                        setSelectedStory(story);
                        setOpen(true);
                      }}
                    >
                      
                      Read Full Story
                       <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{selectedStory?.title}</DialogTitle>
                      <DialogDescription>
                        By {selectedStory?.authorName || "Anonymous"}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedStory?.image && (
                      <img
                        src={selectedStory.image}
                        alt={selectedStory.title}
                        className="w-full h-56 object-cover rounded mb-4"
                      />
                    )}
                    <div className="text-gray-700 whitespace-pre-line">
                      {selectedStory?.content}
                    </div>
                    <DialogClose asChild>
                      <button className="mt-6 px-4 py-2 bg-myColorA text-white rounded hover:bg-myColorAB">
                        Close
                      </button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link
          href="/success-stories"
          className="inline-block px-6 py-3 bg-myColorA text-white rounded-md font-medium hover:bg-myColorAB transition"
        >
          View All Stories
        </Link>
      </div>
    </section>
  );
}
