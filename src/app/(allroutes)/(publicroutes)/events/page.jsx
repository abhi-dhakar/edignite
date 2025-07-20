'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, Users, Clock, Filter, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { SparklesCore } from "@/components/ui/sparkles";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);



  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/events');
        setEvents(response.data.events);
        setFilteredEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events based on status and search query
    let filtered = [...events];
    
    if (filter !== 'all') {
      filtered = filtered.filter(event => event.status === filter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) || 
        (event.description && event.description.toLowerCase().includes(query)) ||
        (event.location && event.location.toLowerCase().includes(query))
      );
    }
    
    setFilteredEvents(filtered);
  }, [filter, searchQuery, events]);

  const registerForEvent = async (eventId) => {
    if (!session) {
      // Redirect to login or show login dialog
      return;
    }
    
    try {
      setIsRegistering(true);
      await axios.post('/api/events/register', { eventId });
      
      // Update local state to reflect registration
      setEvents(prevEvents => 
        prevEvents.map(event => {
          if (event._id === eventId) {
            return {
              ...event,
              registeredUsers: [...(event.registeredUsers || []), session.user.id]
            };
          }
          return event;
        })
      );
      
      setRegistrationSuccess(true);
      setTimeout(() => setRegistrationSuccess(false), 3000);
    } catch (error) {
      console.error('Error registering for event:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const isUserRegistered = (event) => {
    return session && event.registeredUsers && 
      event.registeredUsers.some(userId => userId === session.user.id);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Ongoing': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // console.log(session?.user?.memberType)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
     
      {/* <div className="relative h-[40vh] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <TextGenerateEffect words="Join Our Events" />
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Connect, learn, and make a difference through our community gatherings and initiatives
          </motion.p>
        </div>
      </div> */}

      {/* Events Filter and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <p className="text-gray-600 mt-1">Discover our upcoming activities and get involved</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="Ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="Completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <CardHeader>
                  <div className="h-7 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
               <div key={event._id} >
                 <Card className="rounded-[20px] overflow-hidden border-none bg-white">
                  <div className="h-48 w-full relative overflow-hidden">
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-myColorA to-myColorAB flex items-center justify-center">
                        <CalendarIcon className="h-16 w-16 text-white opacity-75" />
                      </div>
                    )}
                    <Badge 
                      className={cn(
                        "absolute top-4 right-4",
                        getStatusColor(event.status)
                      )}
                    >
                      {event.status}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-1">{event.title}</CardTitle>
                    <CardDescription className="flex items-center text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {format(new Date(event.date), 'MMMM d, yyyy - h:mm a')}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {event.description || "Join us for this exciting event!"}
                      </p>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-start mb-2">
                        <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5 mr-1 flex-shrink-0" />
                        <span className="text-sm text-gray-600 line-clamp-1">{event.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600">
                        {event.registeredUsers?.length || 0} registered
                      </span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setSelectedEvent(event)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-xl">{selectedEvent?.title}</DialogTitle>
                          <DialogDescription className="flex items-center text-gray-600">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {selectedEvent && format(new Date(selectedEvent.date), 'MMMM d, yyyy - h:mm a')}
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedEvent && (
                          <div className="space-y-4">
                            {selectedEvent.image && (
                              <img 
                                src={selectedEvent.image} 
                                alt={selectedEvent.title} 
                                className="w-full h-48 object-cover rounded-md"
                              />
                            )}
                            
                            <p className="text-gray-700">{selectedEvent.description}</p>
                            
                            {selectedEvent.location && (
                              <div className="flex items-start">
                                <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-gray-700">{selectedEvent.location}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center">
                              <Users className="h-5 w-5 text-gray-500 mr-2" />
                              <span className="text-gray-700">
                                {selectedEvent.registeredUsers?.length || 0} people registered
                              </span>
                            </div>
                            
                            <div className="pt-4">
                              {isUserRegistered(selectedEvent) ? (
                                <Badge variant="outline" className="bg-white text-myColorA border-myColorAB px-3 py-1">
                                  You're registered for this event
                                </Badge>
                              ) : selectedEvent.status === 'Upcoming' ? (
                                <Button 
                                  onClick={() => registerForEvent(selectedEvent._id)}
                                  disabled={isRegistering || !session}
                                  className="w-full"
                                >
                                  {isRegistering ? 'Registering...' : 'Register Now'}
                                </Button>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 px-3 py-1">
                                  Registration closed
                                </Badge>
                              )}
                              
                              {!session && (
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                  Please <Link href="/signin" className="text-myColorA hover:underline">sign in</Link> to register
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    {event.status === 'Upcoming' ? (
                      isUserRegistered(event) ? (
                        <Badge variant="outline" className="bg-white text-myColorAB border-myColorA">
                          Registered
                        </Badge>
                      ) : (
                        <Button 
                          onClick={() => registerForEvent(event._id)}
                          disabled={isRegistering || !session}
                        >
                          Register
                        </Button>
                      )
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        {event.status === 'Ongoing' ? 'In Progress' : 'Ended'}
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
               </div>
            ))}
          </div>
        )}

        {/* Success message for registration */}
        {registrationSuccess && (
          <div className="fixed bottom-4 right-4 bg-myColorA text-white p-4 rounded-md shadow-lg z-50">
            Successfully registered for the event!
          </div>
        )}
      </div>
      
     
      <div className="bg-myColorA py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want to organize your own event?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            If you have an idea for a community gathering or initiative, we'd love to hear from you!
          </p>
          <Button
            size="lg"
            className="bg-white text-myColorAB hover:bg-green-50"
            asChild
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}