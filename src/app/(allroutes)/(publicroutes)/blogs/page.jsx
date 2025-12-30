'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { format } from 'date-fns';
import {
    Search,
    ArrowRight,
    Clock,
    User,
    Calendar,
    ChevronRight,
    Sparkles,
    BookOpen,
    Filter,
    Share2,
    Bookmark,
    MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBlog, setSelectedBlog] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/blogs');
                setBlogs(response.data.blogs);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const filteredBlogs = blogs.filter(blog => {
        const query = searchQuery.toLowerCase().trim();
        const matchesStatus = filter === 'all' ||
            blog.category?.trim().toLowerCase() === filter.toLowerCase();

        const matchesSearch = !query ||
            blog.title?.toLowerCase().includes(query) ||
            blog.excerpt?.toLowerCase().includes(query) ||
            blog.author?.name?.toLowerCase().includes(query);

        return matchesStatus && matchesSearch;
    });

    const categories = ['all', 'Sustainability', 'Education', 'Community', 'News', 'Impact'];

    return (
        <div className="min-h-screen bg-white">
            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-myColorA/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 px-4 overflow-hidden bg-slate-900 border-b border-white/5 shadow-2xl">
                {/* Animated Background Image Decor */}
                <div className="absolute inset-0 opacity-40 scale-105 pointer-events-none">
                    <img
                        src="/children-banner.webp"
                        alt="Background"
                        className="w-full h-full object-cover blur-[1px]"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950" />

                <div className="container mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl">
                            <BookOpen className="w-5 h-5 text-myColorA" />
                            <span className="text-xs font-black text-white uppercase tracking-[0.4em]">The Edignite Journal</span>
                        </div>
                    </motion.div>

                    <div className="text-center max-w-5xl mx-auto mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="text-5xl md:text-8xl lg:text-9xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-[0.9]"
                        >
                            Voices of <span className="text-transparent bg-clip-text bg-gradient-to-r from-myColorA to-emerald-400">Change</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-base md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium px-4"
                        >
                            Explore stories of resilience, innovation, and community impact. Every word crafted with the intent to inspire a better tomorrow.
                        </motion.p>
                    </div>

                    {/* Editorial Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-myColorA to-emerald-500 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition" />
                            <div className="relative bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center p-2">
                                <Search className="w-6 h-6 ml-6 text-white/40 group-focus-within:text-myColorA transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="Search stories, authors, or topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-grow bg-transparent border-none text-white text-base md:text-lg placeholder:text-white/20 focus-visible:ring-0 h-14 md:h-16 px-4 md:px-6"
                                />
                                <Button className="hidden md:flex h-12 px-8 rounded-xl bg-myColorA hover:bg-myColorAB text-white font-black uppercase tracking-widest text-xs">
                                    Search
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Filter Tabs */}
            <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 overflow-visible">
                <div className="container mx-auto px-4 py-4 md:py-6 overflow-visible">
                    <Tabs value={filter} onValueChange={setFilter} className="w-full overflow-visible">
                        <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-2 md:gap-4 justify-start w-full">
                            {categories.map((cat) => (
                                <TabsTrigger
                                    key={cat}
                                    value={cat}
                                    className="rounded-full px-3 md:px-8 py-2 md:py-3 text-[11px] md:text-sm font-black uppercase tracking-tight md:tracking-widest border-2 border-slate-200 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:border-slate-900 data-[state=active]:shadow-xl transition-all hover:border-slate-400 group relative overflow-hidden flex-[0_0_calc(33.333%-0.5rem)] md:flex-[0_0_auto]"
                                >
                                    <span className="relative z-10 truncate">{cat}</span>
                                    {cat === filter && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-slate-900"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-24 px-4 min-h-[600px]">
                <div className="container mx-auto">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                            >
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-slate-50 animate-pulse" />
                                ))}
                            </motion.div>
                        ) : filteredBlogs.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-40 text-center rounded-[4rem] bg-slate-50 border-4 border-dashed border-slate-100 flex flex-col items-center"
                            >
                                <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mb-10">
                                    <BookOpen className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">No Stories Found</h3>
                                <p className="text-slate-500 text-lg mb-10 max-w-sm font-medium">We couldn't find any articles matching your current search or filters.</p>
                                <Button
                                    onClick={() => { setFilter('all'); setSearchQuery(''); }}
                                    className="rounded-full px-12 h-14 bg-slate-900 text-white font-black uppercase tracking-widest text-xs"
                                >
                                    Reset Library
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="results"
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12"
                            >
                                {filteredBlogs.map((blog, idx) => (
                                    <motion.div
                                        key={blog._id}
                                        variants={fadeInUp}
                                        className={cn(
                                            "group relative flex flex-col h-full rounded-[3rem] overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-myColorA/10 transition-all duration-700",
                                            idx === 0 && "md:col-span-2 lg:col-span-2"
                                        )}
                                    >
                                        {/* Card Media */}
                                        <div className={cn(
                                            "relative overflow-hidden",
                                            idx === 0 ? "aspect-[4/3] md:aspect-auto md:h-[400px]" : "aspect-[16/10]"
                                        )}>
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s]"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                            <div className="absolute top-4 left-4 md:top-8 md:left-8">
                                                <Badge className="px-5 py-2 rounded-full border border-white/20 backdrop-blur-3xl font-black text-[9px] uppercase tracking-[0.3em] bg-white/10 text-white shadow-2xl">
                                                    {blog.category}
                                                </Badge>
                                            </div>

                                            <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 flex justify-between items-end">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 text-white/50 font-black text-[9px] uppercase tracking-[0.4em]">
                                                        <Clock className="w-3.5 h-3.5 text-myColorA" />
                                                        {blog.readTime}
                                                    </div>
                                                    <h3 className={cn(
                                                        "font-black text-white leading-[1.1] tracking-tighter",
                                                        idx === 0 ? "text-2xl md:text-4xl lg:text-6xl" : "text-xl md:text-3xl"
                                                    )}>
                                                        {blog.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>

                                        <CardContent className="p-6 md:p-10 flex-grow bg-white">
                                            <p className="text-slate-600 leading-[1.8] text-base md:text-lg font-medium line-clamp-3 mb-6 md:mb-10">
                                                {blog.excerpt}
                                            </p>

                                            <Separator className="bg-slate-100 mb-8" />

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-white shadow-xl overflow-hidden flex items-center justify-center">
                                                        {blog.author?.image ? (
                                                            <img src={blog.author.image} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="w-6 h-6 text-white/40" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Story By</p>
                                                        <p className="text-sm font-black text-slate-900 tracking-tight">{blog.author?.name}</p>
                                                    </div>
                                                </div>

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            onClick={() => setSelectedBlog(blog)}
                                                            variant="ghost"
                                                            className="w-14 h-14 rounded-full bg-slate-50 hover:bg-slate-900 hover:text-white transition-all group/btn flex items-center justify-center p-0"
                                                        >
                                                            <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="w-[95vw] sm:max-w-6xl h-[95vh] bg-transparent border-none p-0 overflow-visible shadow-none focus-visible:outline-none">
                                                        {selectedBlog && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                className="relative w-full h-full bg-white rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row"
                                                            >
                                                                {/* Modal Close handled by DialogContent */}

                                                                {/* Modal Image Section */}
                                                                <div className="relative w-full md:w-[40%] h-64 md:h-full bg-slate-900 overflow-hidden shrink-0">
                                                                    <img
                                                                        src={selectedBlog.image}
                                                                        className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000"
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/80 to-transparent" />
                                                                    <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 space-y-3 md:space-y-4">
                                                                        <Badge className="px-6 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl text-white font-black text-[9px] uppercase tracking-[0.4em]">
                                                                            {selectedBlog.category}
                                                                        </Badge>
                                                                        <h2 className="text-2xl md:text-4xl lg:text-6xl font-black text-white leading-[1.05] tracking-tighter">
                                                                            {selectedBlog.title}
                                                                        </h2>
                                                                        <div className="flex flex-wrap items-center gap-3 md:gap-6 pt-2 md:pt-4">
                                                                            <div className="flex items-center gap-2 text-white/50 font-black text-[10px] uppercase tracking-widest">
                                                                                <Clock className="w-4 h-4 text-myColorA" /> {selectedBlog.readTime}
                                                                            </div>
                                                                            <div className="flex items-center gap-2 text-white/50 font-black text-[10px] uppercase tracking-widest">
                                                                                <Calendar className="w-4 h-4 text-emerald-500" /> {format(new Date(selectedBlog.date), 'MMM dd, yyyy')}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Modal Content Section */}
                                                                <div className="flex-grow overflow-y-auto p-6 md:p-12 lg:p-20 custom-scrollbar bg-white">
                                                                    <div className="max-w-3xl mx-auto space-y-16">
                                                                        {/* Author Profile Card */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-slate-50/80 border border-slate-100 overflow-hidden relative group/author">
                                                                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 transition-transform group-hover/author:scale-110 duration-700">
                                                                                <Sparkles className="w-32 h-32" />
                                                                            </div>
                                                                            <div className="flex items-center gap-4 md:gap-8 relative z-10">
                                                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-[1.5rem] bg-slate-900 shadow-2xl overflow-hidden flex items-center justify-center rotate-3 group-hover/author:rotate-0 transition-transform duration-500">
                                                                                    {selectedBlog.author?.image ? (
                                                                                        <img src={selectedBlog.author.image} className="w-full h-full object-cover" />
                                                                                    ) : (
                                                                                        <User className="w-10 h-10 text-white/30" />
                                                                                    )}
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-1">Authenticated Narrative</p>
                                                                                    <p className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter">{selectedBlog.author?.name}</p>
                                                                                    <p className="text-xs font-bold text-myColorA tracking-widest uppercase mt-1">Founding Member</p>
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex gap-3 relative z-10">
                                                                                <Button variant="outline" className="w-12 h-12 rounded-full p-0 flex items-center justify-center border-slate-200 hover:bg-slate-900 hover:border-slate-900 hover:text-white transition-all">
                                                                                    <Share2 className="w-5 h-5" />
                                                                                </Button>
                                                                                <Button variant="outline" className="w-12 h-12 rounded-full p-0 flex items-center justify-center border-slate-200 hover:bg-myColorA hover:border-myColorA hover:text-white transition-all">
                                                                                    <Bookmark className="w-5 h-5" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>

                                                                        {/* Main Content */}
                                                                        <div className="space-y-12">
                                                                            <p className="text-xl md:text-3xl font-black text-slate-900 leading-[1.3] tracking-tighter border-l-4 md:border-l-8 border-myColorA pl-6 md:pl-10 py-2">
                                                                                {selectedBlog.excerpt}
                                                                            </p>

                                                                            <div
                                                                                className="prose prose-slate prose-invert max-w-none prose-p:text-slate-600 prose-p:text-base md:prose-p:text-xl prose-p:leading-[1.9] prose-p:font-medium prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tighter prose-strong:text-slate-900"
                                                                                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                                                                            />
                                                                        </div>

                                                                        {/* Footer Accent */}
                                                                        <div className="pt-20 pb-10">
                                                                            <div className="flex items-center justify-center gap-4 mb-8">
                                                                                <div className="h-[2px] flex-grow bg-slate-100" />
                                                                                <Sparkles className="w-6 h-6 text-myColorA opacity-20" />
                                                                                <div className="h-[2px] flex-grow bg-slate-100" />
                                                                            </div>
                                                                            <div className="flex flex-col items-center gap-6">
                                                                                <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.8em]">End of Narrative</h6>
                                                                                <div className="flex gap-4">
                                                                                    {selectedBlog.tags?.map(tag => (
                                                                                        <span key={tag} className="px-4 py-2 rounded-lg bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">
                                                                                            #{tag}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </CardContent>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Subscription Section */}
            <section className="py-32 px-4 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-myColorA/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse [animation-delay:2s]" />

                <div className="container mx-auto relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="space-y-10"
                        >
                            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
                                Get the Latest <br className="hidden md:block" /> <span className="text-myColorA">Impact Updates</span>
                            </h2>
                            <p className="text-base md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium px-4">
                                Subscribe to our newsletter and join thousands receives our monthly curated stories of hope and action.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto p-2 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10">
                                <Input
                                    placeholder="Enter your email address"
                                    className="bg-transparent border-none text-white text-base md:text-lg h-14 md:h-16 px-6 md:px-8 placeholder:text-slate-500 focus-visible:ring-0"
                                />
                                <Button className="h-14 md:h-16 px-8 md:px-12 rounded-xl md:rounded-[1.5rem] bg-white hover:bg-slate-200 text-slate-900 font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:scale-[1.02]">
                                    Join Circle
                                </Button>
                            </div>

                            <div className="flex items-center justify-center gap-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                                <span className="flex items-center gap-2 underline underline-offset-4 decoration-myColorA/30">Privacy Protected</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                                <span className="flex items-center gap-2 underline underline-offset-4 decoration-myColorA/30">Zero Garbage</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
