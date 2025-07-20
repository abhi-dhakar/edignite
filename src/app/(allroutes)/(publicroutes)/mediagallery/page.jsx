'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ImageIcon, VideoIcon, Calendar, Search, 
  Play, Download, Share2, Info, ArrowLeft, ArrowRight
} from 'lucide-react';


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
// import { toast } from "@/components/ui/use-toast";

export default function MediaGalleryPage() {
  const [mediaItems, setMediaItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mediaType, setMediaType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/media');
        setMediaItems(response.data.media);
        setFilteredItems(response.data.media);
      } catch (error) {
        console.error('Error fetching media:', error);
        // toast({
        //   title: "Error loading media",
        //   description: "Please try refreshing the page.",
        //   variant: "destructive",
        // });
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  useEffect(() => {
    // Filter media based on type and search query
    let filtered = [...mediaItems];
    
    if (mediaType !== 'all') {
      filtered = filtered.filter(item => item.type === mediaType);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        (item.caption && item.caption.toLowerCase().includes(query))
      );
    }
    
    setFilteredItems(filtered);
  }, [mediaType, searchQuery, mediaItems]);

  const handleShareMedia = (media) => {
    if (navigator.share) {
      navigator.share({
        title: media.caption || 'Shared from our Media Gallery',
        text: media.caption || 'Check out this media from our NGO',
        url: media.url
      })
      .catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(media.url)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
          // toast({
          //   title: "Link copied",
          //   description: "Media link copied to clipboard",
          //   variant: "success",
          // });
        })
        .catch(err => {
          console.error('Error copying URL:', err);
          // toast({
          //   title: "Copy failed",
          //   description: "Failed to copy the link",
          //   variant: "destructive",
          // });
        });
    }
  };
  
  const handleDownloadMedia = (media) => {
    const link = document.createElement('a');
    link.href = media.url;
    link.download = media.caption || `${media.type.toLowerCase()}-${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your download should begin shortly",
      variant: "success",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const navigateMedia = (direction) => {
    if (!selectedMedia || filteredItems.length <= 1) return;
    
    const currentIndex = filteredItems.findIndex(item => item._id === selectedMedia._id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredItems.length;
    } else {
      newIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    }
    
    setSelectedMedia(filteredItems[newIndex]);
    setSelectedIndex(newIndex);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-myColorA py-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight">Our Media Gallery</h1>
          <p className="mt-4 text-xl text-green-100 max-w-3xl mx-auto">
            Explore photos and videos documenting our impact and community activities
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          {/* Media Filters */}
          <div className="flex items-center space-x-4">
            <Tabs 
              defaultValue="all" 
              value={mediaType} 
              onValueChange={setMediaType}
              className="w-full sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">All Media</TabsTrigger>
                <TabsTrigger value="Photo">Photos</TabsTrigger>
                <TabsTrigger value="Video">Videos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex space-x-4">
            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by caption..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Media Gallery */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              {mediaType === 'Photo' ? (
                <ImageIcon className="h-8 w-8 text-gray-400" />
              ) : mediaType === 'Video' ? (
                <VideoIcon className="h-8 w-8 text-gray-400" />
              ) : (
                <Info className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900">No media found</h3>
            <p className="mt-1 text-gray-500">
              {searchQuery 
                ? "Try adjusting your search terms" 
                : `No ${mediaType === 'all' ? 'media items' : mediaType.toLowerCase() + 's'} available`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 group"
                  onClick={() => {
                    setSelectedMedia(item);
                    setSelectedIndex(index);
                  }}
                >
                  {/* Media Preview */}
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer">
                    {item.type === 'Photo' ? (
                      <img
                        src={item.url}
                        alt={item.caption || 'Gallery photo'}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-black opacity-50" />
                        <div className="w-14 h-14 rounded-full bg-white bg-opacity-80 flex items-center justify-center z-10">
                          <Play className="h-8 w-8 text-gray-800 ml-1" />
                        </div>
                      </div>
                    )}
                    <Badge 
                      className="absolute top-2 right-2"
                      variant={item.type === 'Photo' ? 'outline' : 'default'}
                    >
                      {item.type}
                    </Badge>
                  </div>
                  
                  {/* Caption and Info */}
                  <div className="p-3">
                    {item.caption && (
                      <p className="text-gray-800 font-medium line-clamp-2">{item.caption}</p>
                    )}
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Media Viewer Modal */}
        {selectedMedia && (
          <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
            <DialogContent className="sm:max-w-4xl h-auto max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {selectedMedia.caption || (selectedMedia.type === 'Photo' ? 'Photo' : 'Video')}
                </DialogTitle>
                <DialogDescription>
                  {formatDate(selectedMedia.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex-grow overflow-auto my-4 relative">
                {/* Navigation Arrows */}
                {filteredItems.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateMedia('prev');
                      }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-all z-10"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateMedia('next');
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-all z-10"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                
                {selectedMedia.type === 'Photo' ? (
                  <div className="relative w-full max-h-[60vh] flex items-center justify-center">
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.caption || 'Photo'}
                      className="max-w-full max-h-[60vh] object-contain rounded-md"
                    />
                  </div>
                ) : (
                  <div className="relative w-full pt-[56.25%]">
                    <iframe
                      src={selectedMedia.url}
                      className="absolute top-0 left-0 w-full h-full rounded-md"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
              
              {selectedMedia.caption && (
                <div className="mt-2 text-gray-700">
                  <p>{selectedMedia.caption}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareMedia(selectedMedia);
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {copySuccess ? 'Copied!' : 'Share'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadMedia(selectedMedia);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedMedia(null)}
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {/* Call to Action */}
      <div className="bg-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-myColorAB mb-4">Get Involved with Our Community</h2>
          <p className="text-myColorA mb-6 max-w-2xl mx-auto">
            Join us in making a difference. Volunteer, donate, or participate in our upcoming events to support our mission.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-myColorA hover:bg-myColorAB">
              <Link href="/volunteer">Become a Volunteer</Link>
            </Button>
            <Button asChild variant="outline" className="border-myColorA text-myColorAB hover:bg-myColorA">
              <Link href="/events">Upcoming Events</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}