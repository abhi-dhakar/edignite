'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ArrowRight, 
  Heart, Share2, 
  UserCircle2, CalendarDays
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
// import { toast } from "@/components/ui/use-toast";

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/stories');
        setStories(response.data.stories);
        setFilteredStories(response.data.stories);
      } catch (error) {
        console.error('Error fetching stories:', error);
        // toast({
        //   title: "Error loading stories",
        //   description: "Please try refreshing the page.",
        //   variant: "destructive",
        // });
      } finally {
        setLoading(false);
      }
    };

  fetchStories();
   
  }, []);

  useEffect(() => {
    // Filter stories based on search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = stories.filter(story => 
        story.title.toLowerCase().includes(query) || 
        story.authorName?.toLowerCase().includes(query) ||
        story.content.toLowerCase().includes(query)
      );
      setFilteredStories(filtered);
    } else {
      setFilteredStories(stories);
    }
  }, [searchQuery, stories]);

  const handleShareStory = (story) => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: `Read ${story.authorName}'s story: ${story.title}`,
        url: window.location.href + '/' + story._id
      })
      .catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      const url = window.location.href + '/' + story._id;
      navigator.clipboard.writeText(url)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        //   toast({
        //     title: "Link copied",
        //     description: "Story link copied to clipboard",
        //     variant: "success",
        //   });
        })
        .catch(err => {
          console.error('Error copying URL:', err);
        //   toast({
        //     title: "Copy failed",
        //     description: "Failed to copy the link",
        //     variant: "destructive",
        //   });
        });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Function to create excerpt from content
  const createExcerpt = (content, maxLength = 150) => {
    // Remove HTML tags
    const textOnly = content.replace(/<[^>]*>/g, '');
    if (textOnly.length <= maxLength) return textOnly;
    
    // Cut to max length and add ellipsis
    return textOnly.substr(0, maxLength).trim() + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-myColorA py-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-4xl font-bold tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Success Stories
          </motion.h1>
          <motion.p 
            className="mt-4 text-xl text-green-100 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Real stories of impact and transformation from the communities we serve
          </motion.p>
        </div>
      </div>

      {/* Stories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Separator className="my-6" />

        {/* Stories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="h-64 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-1/3 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No stories found</h3>
            <p className="mt-1 text-gray-500">
              {searchQuery 
                ? "Try adjusting your search terms" 
                : "Check back soon for inspiring stories"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredStories.map((story, index) => (
                <motion.div
                  key={story._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                      {story.image ? (
                        <img
                          src={story.image}
                          alt={story.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-myColorA">
                          <Heart className="h-16 w-16 text-myColorAB" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        <span>{formatDate(story.date)}</span>
                      </div>
                      <CardTitle className="text-2xl">{story.title}</CardTitle>
                      {story.authorName && (
                        <CardDescription className="flex items-center">
                          <UserCircle2 className="h-4 w-4 mr-1" />
                          {story.authorName}'s story
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600">
                        {createExcerpt(story.content)}
                      </p>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button 
                        onClick={() => setSelectedStory(story)}
                        className="text-myColorA hover:text-myColorAB group"
                        variant="ghost"
                      >
                        <span>Read full story</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Story Detail Modal */}
        {selectedStory && (
          <Dialog open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)}>
            <DialogContent className="sm:max-w-4xl h-auto max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedStory.title}</DialogTitle>
                <DialogDescription className="flex items-center">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span>{formatDate(selectedStory.date)}</span>
                  </div>
                  {selectedStory.authorName && (
                    <div className="flex items-center ml-4">
                      <UserCircle2 className="h-4 w-4 mr-1" />
                      <span>{selectedStory.authorName}'s story</span>
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="overflow-auto flex-grow my-4">
                {selectedStory.image && (
                  <div className="relative h-80 w-full mb-6 rounded-md overflow-hidden">
                    <img
                      src={selectedStory.image}
                      alt={selectedStory.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                
                <div 
                  className="prose prose-green max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedStory.content }}
                />
              </div>
              
              <DialogFooter className="flex justify-between items-center border-t pt-4 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleShareStory(selectedStory)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {copySuccess ? 'Copied!' : 'Share Story'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedStory(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Call to Action */}
        {!loading && filteredStories.length > 0 && (
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Have a story to share?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              If you've been impacted by our work and would like to share your experience, 
              we'd love to hear from you. Your story can inspire others and help us improve our programs.
            </p>
            <Button asChild className="bg-myColorA hover:bg-myColorAB">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}