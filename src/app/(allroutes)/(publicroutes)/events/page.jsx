'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  CalendarIcon,
  MapPinIcon,
  Users,
  Clock,
  Filter,
  Search,
  ArrowRight,
  Info,
  CalendarCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
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
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);


  const filteredEvents = typeof window !== 'undefined' ? events.filter(event => {
    const query = searchQuery.toLowerCase().trim();
    const matchesStatus = filter === 'all' ||
      event.status?.trim().toLowerCase() === filter.toLowerCase();
    const matchesSearch = !query ||
      event.title?.toLowerCase().includes(query) ||
      (event.description && event.description.toLowerCase().includes(query)) ||
      (event.location && event.location.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  }) : [];

  const counts = {
    all: events.length,
    upcoming: events.filter(e => e.status?.toLowerCase() === 'upcoming').length,
    ongoing: events.filter(e => e.status?.toLowerCase() === 'ongoing').length,
    completed: events.filter(e => e.status?.toLowerCase() === 'completed').length,
  };

  const registerForEvent = async (eventId) => {
    if (!session) return;

    try {
      setIsRegistering(true);
      await axios.post('/api/events/register', { eventId });

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

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Ongoing': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Completed': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-myColorA/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-14 md:pt-20 md:pb-20 px-4 overflow-hidden bg-slate-900 border-b border-white/5 shadow-2xl">
        {/* Animated Background Image Decor */}
        <div className="absolute inset-0 opacity-70 scale-110 pointer-events-none">
          <img
            src="/children-banner.webp"
            alt="Background"
            className="w-full h-full object-cover blur-[2px]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950" />

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-3"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-myColorA/20 border border-myColorA/30 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-myColorA" />
              <span className="text-sm font-bold text-myColorAB uppercase tracking-wider">Events & Gatherings</span>
            </div>
          </motion.div>

          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight"
            >
              Collaborate for <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-myColorA to-emerald-400">Greater Impact</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed"
            >
              Discover upcoming opportunities to connect, learn, and contribute to our community-driven initiatives. Together, we can build a more sustainable future.
            </motion.p>
          </div>

          {/* Search and Filter Combo Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-5xl mx-auto p-2 md:p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-grow group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-myColorA transition-colors" />
                <Input
                  type="text"
                  placeholder="Search by title, location, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 h-14 bg-white/5 border-none text-white placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-myColorA/50 rounded-[1.5rem]"
                />
              </div>

              <Tabs
                defaultValue="all"
                value={filter}
                onValueChange={setFilter}
                className="w-full lg:w-auto"
              >
                <TabsList className="h-14 bg-white/5 p-1.5 rounded-[1.5rem] border border-white/10 w-full sm:w-auto overflow-x-auto sm:overflow-visible flex justify-start">
                  <TabsTrigger value="all" className="rounded-2xl px-6 h-full text-white/70 data-[state=active]:bg-myColorA data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                    All <span className="ml-2 text-[10px] opacity-50 bg-white/20 px-1.5 py-0.5 rounded-full">{counts.all}</span>
                  </TabsTrigger>
                  <TabsTrigger value="Upcoming" className="rounded-2xl px-6 h-full text-white/70 data-[state=active]:bg-myColorA data-[state=active]:text-white transition-all">
                    Upcoming <span className="ml-2 text-[10px] opacity-50 bg-white/20 px-1.5 py-0.5 rounded-full">{counts.upcoming}</span>
                  </TabsTrigger>
                  <TabsTrigger value="Ongoing" className="rounded-2xl px-6 h-full text-white/70 data-[state=active]:bg-myColorA data-[state=active]:text-white transition-all">
                    Ongoing <span className="ml-2 text-[10px] opacity-50 bg-white/20 px-1.5 py-0.5 rounded-full">{counts.ongoing}</span>
                  </TabsTrigger>
                  <TabsTrigger value="Completed" className="rounded-2xl px-6 h-full text-white/70 data-[state=active]:bg-myColorA data-[state=active]:text-white transition-all">
                    Completed <span className="ml-2 text-[10px] opacity-50 bg-white/20 px-1.5 py-0.5 rounded-full">{counts.completed}</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Listing */}
      <section className="py-24 px-4 min-h-[600px]">
        <div className="container mx-auto">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[500px] w-full rounded-[2.5rem] bg-slate-50 animate-pulse border border-slate-100" />
                ))}
              </motion.div>
            ) : filteredEvents.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-32 rounded-[3rem] bg-slate-50 border border-dashed border-slate-300"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
                  <Info className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">No events found</h3>
                <p className="text-slate-500 text-lg max-w-md mx-auto">Try adjusting your filters or search keywords to find what you're looking for.</p>
                <Button
                  variant="outline"
                  className="mt-8 rounded-full px-8"
                  onClick={() => { setFilter('all'); setSearchQuery(''); }}
                >
                  Clear all filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event._id}
                    layout="position"
                    variants={fadeInUp}
                    className="group flex flex-col h-full bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-myColorA/10 transition-all duration-500 overflow-hidden"
                  >
                    {/* Event Banner */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-myColorA to-emerald-500 flex items-center justify-center">
                          <CalendarCheck className="h-16 w-16 text-white opacity-40" />
                        </div>
                      )}

                      {/* Floating Status Badge */}
                      <div className="absolute top-6 left-6">
                        <Badge className={cn("px-4 py-1.5 rounded-full border backdrop-blur-md font-bold uppercase tracking-widest text-[10px]", getStatusBadgeStyles(event.status))}>
                          {event.status}
                        </Badge>
                      </div>

                      {/* Date Badge Overlay */}
                      <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-white flex flex-col items-center min-w-[70px]">
                        <span className="text-2xl font-black text-myColorA leading-none">{format(new Date(event.date), 'dd')}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{format(new Date(event.date), 'MMM')}</span>
                      </div>

                      {/* Participant Icons Repositioned to Banner Bottom-Right */}
                      <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 group-hover:bg-slate-900/60 transition-all">
                        <div className="flex -space-x-3 overflow-hidden">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="h-6 w-6 rounded-full ring-2 ring-slate-800 bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <Users className="w-3 h-3 text-slate-400 stroke-[3]" />
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                          {event.registeredUsers?.length || 0}+
                        </span>
                      </div>
                    </div>

                    <CardHeader className="p-8 pb-4">
                      <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm font-medium">
                        <Clock className="w-4 h-4 text-myColorA" />
                        <span>{format(new Date(event.date), 'h:mm a')}</span>
                        <Separator orientation="vertical" className="h-4 mx-1" />
                        <MapPinIcon className="w-4 h-4 text-myColorA" />
                        <span className="truncate max-w-[150px]">{event.location || "Online"}</span>
                      </div>
                      <CardTitle className="text-2xl font-black text-slate-900 group-hover:text-myColorA transition-colors line-clamp-1">
                        {event.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="px-8 flex-grow">
                      <p className="text-slate-600 leading-relaxed line-clamp-2">
                        {event.description || "Join our community initiative and help us make a meaningful difference together. Be the change you want to see."}
                      </p>
                    </CardContent>

                    <CardFooter className="p-8 pt-4 flex gap-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 rounded-2xl h-12 border-slate-200 hover:bg-slate-50 transition-all font-bold group"
                            onClick={() => setSelectedEvent(event)}
                          >
                            Explore
                            <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-5xl bg-transparent border-none p-0 gap-0 shadow-none focus-visible:outline-none overflow-visible">
                          {selectedEvent && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: 30 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              className="relative flex flex-col md:flex-row h-full max-h-[95vh] md:h-[700px] rounded-[3.5rem] overflow-hidden bg-white/80 backdrop-blur-3xl border border-white/50 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)]"
                            >
                              {/* Background Artistic Decor */}
                              <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                                <Sparkles className="w-96 h-96 text-slate-900" />
                              </div>

                              {/* Left Side: Creative Image Section */}
                              <div className="relative w-full md:w-[42%] h-72 md:h-full group overflow-hidden">
                                {selectedEvent.image ? (
                                  <motion.img
                                    initial={{ scale: 1.3 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    src={selectedEvent.image}
                                    alt={selectedEvent.title}
                                    className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                    <Sparkles className="w-24 h-24 text-white/10 animate-pulse" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent" />

                                <div className="absolute top-12 left-12">
                                  <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                  >
                                    <Badge className={cn("px-6 py-2.5 rounded-full border border-white/20 backdrop-blur-3xl font-black uppercase tracking-[0.3em] text-[9px] shadow-2xl", getStatusBadgeStyles(selectedEvent.status))}>
                                      {selectedEvent.status}
                                    </Badge>
                                  </motion.div>
                                </div>

                                <div className="absolute bottom-12 left-12 right-12">
                                  <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, type: "spring", damping: 20 }}
                                    className="space-y-6"
                                  >
                                    <div className="flex gap-2">
                                      <div className="w-3 h-3 rounded-full bg-myColorA shadow-[0_0_15px_rgba(var(--myColorA-rgb),0.8)]" />
                                      <div className="w-3 h-3 rounded-full bg-white/20" />
                                      <div className="w-3 h-3 rounded-full bg-white/10" />
                                    </div>
                                    <h2 className="text-5xl lg:text-7xl font-black text-white leading-[0.95] tracking-[ -0.05em]">
                                      {selectedEvent.title}
                                    </h2>
                                    <div className="flex items-center gap-4 text-white/50 font-black text-[10px] tracking-[0.4em] uppercase">
                                      <div className="w-8 h-[1px] bg-myColorA" />
                                      {selectedEvent.location || "Global Assembly"}
                                    </div>
                                  </motion.div>
                                </div>
                              </div>

                              {/* Right Side: Editorial Information Panel */}
                              <div className="flex-grow p-12 md:p-16 lg:p-20 space-y-16 overflow-y-auto custom-scrollbar relative">
                                {/* Large Background Typography Accent */}
                                <div className="absolute top-10 right-10 text-[180px] font-black text-slate-900/[0.02] leading-none pointer-events-none select-none tracking-tighter">
                                  {format(new Date(selectedEvent.date), 'dd')}
                                </div>

                                <div className="relative space-y-12">
                                  {/* Asymmetrical Info Grid */}
                                  <motion.div
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                    className="flex flex-wrap gap-12 lg:gap-20"
                                  >
                                    <motion.div variants={fadeInUp} className="space-y-4 min-w-[140px]">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] mb-2 flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full bg-myColorA" /> Timeline
                                      </p>
                                      <div>
                                        <p className="text-4xl font-black text-slate-900 tracking-tighter">{format(new Date(selectedEvent.date), 'MMM dd')}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">{format(new Date(selectedEvent.date), 'h:mm a')} Onwards</p>
                                      </div>
                                    </motion.div>

                                    <motion.div variants={fadeInUp} className="space-y-4 min-w-[140px] pt-8 lg:pt-0">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] mb-2 flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Community
                                      </p>
                                      <div>
                                        <p className="text-4xl font-black text-slate-900 tracking-tighter">{selectedEvent.registeredUsers?.length || 0}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Confirmed Souls</p>
                                      </div>
                                    </motion.div>
                                  </motion.div>

                                  <Separator className="bg-slate-200/60 w-24 h-1 rounded-full" />

                                  {/* Mission Pull-Quote */}
                                  <motion.div variants={fadeInUp} className="space-y-8 relative">
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.6em] relative z-10">The Mission Manifest</h4>
                                    <div className="relative">
                                      <div className="absolute -left-12 -top-10 text-9xl font-black text-myColorA/[0.07] pointer-events-none">“</div>
                                      <p className="text-slate-700 leading-[1.8] text-xl md:text-2xl font-medium tracking-tight bg-gradient-to-br from-myColorA/[0.03] to-transparent p-10 rounded-[2.5rem] border border-myColorA/5 shadow-sm">
                                        {selectedEvent.description || "We are crafting a legacy of change, one gathering at a time. Join us in this intentional space where every conversation sparks a movement."}
                                      </p>
                                    </div>
                                  </motion.div>

                                  {/* Action Section */}
                                  <motion.div variants={fadeInUp} className="pt-4">
                                    {isUserRegistered(selectedEvent) ? (
                                      <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-myColorA to-emerald-500 rounded-[3rem] blur-2xl opacity-20" />
                                        <div className="relative flex items-center gap-8 p-12 rounded-[3rem] bg-white border border-slate-100 shadow-2xl transition-transform duration-700 group-hover:-translate-y-2">
                                          <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500 flex items-center justify-center text-white shadow-[0_20px_40px_-10px_rgba(16,185,129,0.5)]">
                                            <CalendarCheck className="w-12 h-12" />
                                          </div>
                                          <div>
                                            <h5 className="text-4xl font-black text-slate-900 tracking-tighter">You're Manifest</h5>
                                            <p className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[9px] mt-2">Reserved Placement Confirmed</p>
                                          </div>
                                        </div>
                                      </div>
                                    ) : selectedEvent.status === 'Upcoming' ? (
                                      <div className="space-y-10">
                                        <div className="group relative">
                                          <Button
                                            onClick={() => registerForEvent(selectedEvent._id)}
                                            disabled={isRegistering || !session}
                                            className="w-full rounded-[3rem] h-28 bg-slate-900 hover:bg-myColorA text-white text-3xl font-black transition-all duration-700 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)] active:scale-[0.97] group border-none relative overflow-hidden"
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                            <span className="relative flex items-center gap-6">
                                              {isRegistering ? 'Registering Intent...' : 'Claim Reserved Spot'}
                                              <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform duration-700" />
                                            </span>
                                          </Button>

                                          {!session && (
                                            <motion.div
                                              initial={{ opacity: 0, y: 10 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              className="mt-6 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-amber-50/70 border border-amber-100/50 backdrop-blur-md"
                                            >
                                              <Info className="w-6 h-6 text-amber-500" />
                                              <p className="text-xs font-black text-amber-900 uppercase tracking-widest leading-none">
                                                Session required. <Link href="/signin" className="underline decoration-2 underline-offset-4 hover:text-myColorA transition-colors">SignIn</Link>
                                              </p>
                                            </motion.div>
                                          )}
                                        </div>

                                        {/* Progress Bar Placeholder for Visual Impact */}
                                        <div className="space-y-3 px-4">
                                          <div className="flex justify-between items-end">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Available Resonance</p>
                                            <p className="text-xs font-black text-slate-900">82% Full</p>
                                          </div>
                                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                              initial={{ width: 0 }}
                                              animate={{ width: '82%' }}
                                              transition={{ duration: 1.5, delay: 1 }}
                                              className="h-full bg-slate-900 rounded-full"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="p-20 rounded-[4rem] bg-slate-50/50 border-4 border-dashed border-slate-100/80 text-center flex flex-col items-center gap-6">
                                        <Sparkles className="w-16 h-16 text-slate-200" />
                                        <p className="font-black uppercase tracking-[0.8em] text-xs text-slate-300">Phase Completed</p>
                                      </div>
                                    )}
                                  </motion.div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {event.status === 'Upcoming' ? (
                        isUserRegistered(event) ? (
                          <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-50 text-emerald-600 text-sm font-bold border border-emerald-100">
                            <CalendarCheck className="w-4 h-4" />
                            Joined
                          </div>
                        ) : (
                          <Button
                            onClick={() => registerForEvent(event._id)}
                            disabled={isRegistering || !session}
                            className="flex-1 rounded-2xl h-12 bg-myColorA hover:bg-myColorAB text-white font-bold transition-all shadow-lg shadow-myColorA/20"
                          >
                            Join Event
                          </Button>
                        )
                      ) : (
                        <div className="flex-1 flex items-center justify-center px-4 py-3 rounded-2xl bg-slate-50 text-slate-400 text-sm font-bold border border-slate-100">
                          {event.status === 'Ongoing' ? 'In Progress' : 'Event Ended'}
                        </div>
                      )}
                    </CardFooter>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24 px-4 bg-slate-900 border-t border-white/5 relative overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-myColorA/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Want to Organize an<br /><span className="text-myColorA">Impactful Opportunity?</span></h2>
            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              If you have an idea for a community gathering, skill-building workshop, or sustainable initiative, we'd love to partner with you to make it a reality.
            </p>
            <Button
              size="xl"
              className="bg-white hover:bg-slate-100 text-slate-900 rounded-full px-12 h-16 text-lg font-black shadow-2xl transition-all hover:scale-105 group"
              asChild
            >
              <Link href="/contact">
                Connect With Us
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Bottom Success Message */}
      <AnimatePresence>
        {registrationSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-[100]"
          >
            <div className="bg-emerald-500 text-white px-8 py-4 rounded-[1.5rem] shadow-2xl shadow-emerald-500/30 flex items-center gap-3 border border-emerald-400/50 backdrop-blur-md">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <p className="font-black uppercase tracking-wider text-sm">Successfully registered!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
