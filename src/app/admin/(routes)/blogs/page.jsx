'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Calendar,
    User,
    Tag,
    BookOpen,
    X,
    Upload,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminBlogsPage() {
    const { data: session } = useSession();
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        imagePublicId: '',
        category: 'Community',
        author: { name: '', image: '' },
        readTime: '5 min read',
        tags: [],
        isFeatured: false
    });
    const [tagsInput, setTagsInput] = useState('');

    useEffect(() => {
        fetchBlogs();
    }, []);

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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            const formDataImg = new FormData();
            formDataImg.append('file', file);

            const response = await axios.post('/api/upload/image', formDataImg);
            setFormData(prev => ({
                ...prev,
                image: response.data.url,
                imagePublicId: response.data.publicId
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);

            // Convert tags input string to array
            const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
            const dataToSubmit = { ...formData, tags: tagsArray };

            if (editingBlog) {
                await axios.put(`/api/blogs?id=${editingBlog._id}`, dataToSubmit);
            } else {
                await axios.post('/api/blogs', dataToSubmit);
            }

            await fetchBlogs();
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error saving blog:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/blogs?id=${deleteId}`);
            await fetchBlogs();
            setDeleteId(null);
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    const openEditDialog = (blog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            image: blog.image,
            imagePublicId: blog.imagePublicId || '',
            category: blog.category,
            author: blog.author,
            readTime: blog.readTime,
            tags: blog.tags || [],
            isFeatured: blog.isFeatured || false
        });
        setTagsInput((blog.tags || []).join(', '));
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setEditingBlog(null);
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            image: '',
            imagePublicId: '',
            category: 'Community',
            author: { name: session?.user?.name || '', image: session?.user?.image || '' },
            readTime: '5 min read',
            tags: [],
            isFeatured: false
        });
        setTagsInput('');
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Blog Management</h1>
                            <p className="text-slate-500 font-medium">Create and manage editorial content</p>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={(open) => {
                            setIsDialogOpen(open);
                            if (!open) resetForm();
                        }}>
                            <DialogTrigger asChild>
                                <Button className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs shadow-xl">
                                    <Plus className="w-5 h-5 mr-2" />
                                    New Article
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[3rem] p-12">
                                <DialogHeader>
                                    <DialogTitle className="text-4xl font-black tracking-tighter">
                                        {editingBlog ? 'Edit Article' : 'Create New Article'}
                                    </DialogTitle>
                                </DialogHeader>

                                <form onSubmit={handleSubmit} className="space-y-8 mt-8">
                                    {/* Image Upload */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Cover Image</label>
                                        {formData.image ? (
                                            <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-slate-100 group">
                                                <img src={formData.image} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, image: '', imagePublicId: '' }))}
                                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center aspect-video rounded-3xl border-4 border-dashed border-slate-200 hover:border-slate-400 cursor-pointer transition-colors bg-slate-50">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    disabled={uploadingImage}
                                                />
                                                {uploadingImage ? (
                                                    <Loader2 className="w-12 h-12 text-slate-400 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Upload className="w-12 h-12 text-slate-300 mb-4" />
                                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Upload Image</p>
                                                    </>
                                                )}
                                            </label>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Title</label>
                                        <Input
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            className="h-16 text-2xl font-black rounded-2xl border-2 border-slate-200 focus-visible:ring-slate-900"
                                            placeholder="Enter article title..."
                                        />
                                    </div>

                                    {/* Excerpt */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Excerpt</label>
                                        <Textarea
                                            required
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                            className="min-h-[100px] text-lg rounded-2xl border-2 border-slate-200 focus-visible:ring-slate-900"
                                            placeholder="Brief summary..."
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Content (HTML)</label>
                                        <Textarea
                                            required
                                            value={formData.content}
                                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                            className="min-h-[300px] font-mono text-sm rounded-2xl border-2 border-slate-200 focus-visible:ring-slate-900"
                                            placeholder="<p>Article content in HTML...</p>"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Category */}
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Category</label>
                                            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                                                <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-200 font-bold">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Sustainability">Sustainability</SelectItem>
                                                    <SelectItem value="Education">Education</SelectItem>
                                                    <SelectItem value="Community">Community</SelectItem>
                                                    <SelectItem value="News">News</SelectItem>
                                                    <SelectItem value="Impact">Impact</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Read Time */}
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Read Time</label>
                                            <Input
                                                value={formData.readTime}
                                                onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                                                className="h-14 rounded-2xl border-2 border-slate-200 font-bold"
                                                placeholder="5 min read"
                                            />
                                        </div>
                                    </div>

                                    {/* Author Name */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Author Name</label>
                                        <Input
                                            required
                                            value={formData.author.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, author: { ...prev.author, name: e.target.value } }))}
                                            className="h-14 rounded-2xl border-2 border-slate-200 font-bold"
                                            placeholder="Author name..."
                                        />
                                    </div>

                                    {/* Tags */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Tags (comma separated)</label>
                                        <Input
                                            value={tagsInput}
                                            onChange={(e) => setTagsInput(e.target.value)}
                                            className="h-14 rounded-2xl border-2 border-slate-200 font-bold"
                                            placeholder="tag1, tag2, tag3"
                                        />
                                    </div>

                                    <DialogFooter className="gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsDialogOpen(false)}
                                            className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSaving || !formData.image}
                                            className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                editingBlog ? 'Update Article' : 'Publish Article'
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-16 pl-16 rounded-2xl border-2 border-slate-200 text-lg font-medium"
                            placeholder="Search articles..."
                        />
                    </div>
                </div>

                {/* Blog List */}
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 rounded-3xl bg-white animate-pulse" />
                        ))}
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="py-32 text-center rounded-3xl bg-white border-2 border-dashed border-slate-200">
                        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No Articles Found</h3>
                        <p className="text-slate-500 font-medium">Create your first blog post to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredBlogs.map((blog) => (
                            <motion.div
                                key={blog._id}
                                layout
                                className="bg-white rounded-3xl p-8 border-2 border-slate-100 hover:border-slate-300 transition-all group"
                            >
                                <div className="flex gap-8">
                                    {/* Thumbnail */}
                                    <div className="w-48 h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                                        {blog.image && (
                                            <img src={blog.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Badge className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-black text-[10px] uppercase tracking-widest">
                                                        {blog.category}
                                                    </Badge>
                                                    <span className="text-xs text-slate-400 font-bold">{blog.readTime}</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-myColorA transition-colors">
                                                    {blog.title}
                                                </h3>
                                                <p className="text-slate-600 font-medium line-clamp-2">{blog.excerpt}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => openEditDialog(blog)}
                                                    variant="outline"
                                                    className="w-10 h-10 rounded-xl p-0 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => setDeleteId(blog._id)}
                                                    variant="outline"
                                                    className="w-10 h-10 rounded-xl p-0 border-slate-200 hover:bg-red-500 hover:text-white hover:border-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 text-xs text-slate-400 font-bold">
                                            <span className="flex items-center gap-2">
                                                <User className="w-3.5 h-3.5" />
                                                {blog.author?.name}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {format(new Date(blog.date), 'MMM dd, yyyy')}
                                            </span>
                                            {blog.tags?.length > 0 && (
                                                <span className="flex items-center gap-2">
                                                    <Tag className="w-3.5 h-3.5" />
                                                    {blog.tags.slice(0, 2).join(', ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Delete Confirmation */}
                <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                    <AlertDialogContent className="rounded-3xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-3xl font-black">Delete Article?</AlertDialogTitle>
                            <AlertDialogDescription className="text-lg font-medium">
                                This action cannot be undone. The article will be permanently removed from the database.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-xs">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="h-12 px-6 rounded-xl bg-red-500 hover:bg-red-600 font-black uppercase tracking-widest text-xs"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
