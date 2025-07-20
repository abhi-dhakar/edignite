"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { format } from "date-fns";

export default function AdminStoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Form states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    authorName: "",
    image: null,
  });

  // File upload
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/stories");
      setStories(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch stories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStories();
    setRefreshing(false);
    toast.success("Stories refreshed");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      authorName: "",
      image: null,
    });
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (story) => {
    setSelectedStory(story);
    setFormData({
      title: story.title,
      content: story.content,
      authorName: story.authorName || "",
      image: null,
    });
    setImagePreview(story.image || "");
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (story) => {
    setSelectedStory(story);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateStory = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required");
      return;
    }

    try {
      setUploading(true);

      let imageUrl = "";
      let imagePublicId = "";

      if (formData.image) {
        // Upload image first
        const formDataForUpload = new FormData();
        formDataForUpload.append("file", formData.image);

        const uploadResponse = await axios.post(
          "/api/upload",
          formDataForUpload
        );
        imageUrl = uploadResponse.data.url;
        imagePublicId = uploadResponse.data.publicId;
      }
e
      const response = await axios.post("/api/admin/stories", {
        title: formData.title,
        content: formData.content,
        authorName: formData.authorName,
        image: imageUrl || undefined,
        imagePublicId: imagePublicId || undefined,
      });

      setStories([response.data, ...stories]);
      toast.success("Story created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating story:", error);
      toast.error(error.response?.data?.message || "Failed to create story");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateStory = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required");
      return;
    }

    try {
      setUploading(true);

      let imageUrl = selectedStory.image;
      let imagePublicId = selectedStory.imagePublicId;

      if (formData.image) {
        // Upload new image if selected
        const formDataForUpload = new FormData();
        formDataForUpload.append("file", formData.image);

        const uploadResponse = await axios.post(
          "/api/upload",
          formDataForUpload
        );
        imageUrl = uploadResponse.data.url;
        imagePublicId = uploadResponse.data.publicId;
      }

      // Update story
      const response = await axios.patch(
        `/api/admin/stories/${selectedStory._id}`,
        {
          title: formData.title,
          content: formData.content,
          authorName: formData.authorName,
          image: imageUrl,
          imagePublicId: imagePublicId,
        }
      );

      // Update local state
      setStories(
        stories.map((story) =>
          story._id === selectedStory._id ? response.data : story
        )
      );

      toast.success("Story updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating story:", error);
      toast.error(error.response?.data?.message || "Failed to update story");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteStory = async () => {
    try {
      await axios.delete(`/api/admin/stories/${selectedStory._id}`);

      // Update local state
      setStories(stories.filter((story) => story._id !== selectedStory._id));

      toast.success("Story deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error(error.response?.data?.message || "Failed to delete story");
    }
  };

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (story.authorName &&
        story.authorName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">
              Story Management
            </CardTitle>
            <CardDescription>Create and manage success stories</CardDescription>
          </div>


          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Story
            </Button>
          </div>

        </CardHeader>


        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stories by title, content or author..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center h-24 text-muted-foreground"
                    >
                      {searchQuery
                        ? "No stories match your search"
                        : "No stories found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStories.map((story) => (
                    <TableRow key={story._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="max-w-[300px] truncate">
                          {story.title}
                        </div>
                      </TableCell>
                      <TableCell>{story.authorName || "Anonymous"}</TableCell>
                      <TableCell>
                        {format(
                          new Date(story.date || story.createdAt),
                          "MMM d, yyyy"
                        )}
                      </TableCell>
                      <TableCell>
                        {story.image ? (
                          <div className="h-10 w-10 rounded-md overflow-hidden">
                            <img
                              src={story.image}
                              alt={story.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No image
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="">
                        <div className="flex items-center  justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(story)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(story)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredStories.length} of {stories.length} stories
          </div>
        </CardContent>

      </Card>

      {/* Create Story Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Create New Story</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="content" className="mt-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter story title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorName">Author Name</Label>
                <Input
                  id="authorName"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  placeholder="Enter author name (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter story content"
                  rows={10}
                />
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4 mt-4">
              <div className="space-y-4">
                <Label>Story Image</Label>

                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  {imagePreview ? (
                    <div className="space-y-4 w-full">
                      <div className="relative mx-auto max-w-xs overflow-hidden rounded-md">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-auto"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, image: null }));
                            setImagePreview("");
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop an image, or click to select
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Select Image
                      </Button>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Recommended: Square images with minimum dimensions of 800x800
                  pixels. Maximum file size: 5MB.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateStory}
              disabled={uploading || !formData.title || !formData.content}
            >
              {uploading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Create Story"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Story Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit Story</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="content" className="mt-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter story title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-authorName">Author Name</Label>
                <Input
                  id="edit-authorName"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  placeholder="Enter author name (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter story content"
                  rows={10}
                />
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4 mt-4">
              <div className="space-y-4">
                <Label>Story Image</Label>

                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  {imagePreview ? (
                    <div className="space-y-4 w-full">
                      <div className="relative mx-auto max-w-xs overflow-hidden rounded-md">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-auto"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, image: null }));
                            setImagePreview(selectedStory.image || "");
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        >
                          {formData.image ? "Remove" : "Clear"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop an image, or click to select
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Select Image
                      </Button>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Recommended: Square images with minimum dimensions of 800x800
                  pixels. Maximum file size: 5MB.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStory}
              disabled={uploading || !formData.title || !formData.content}
            >
              {uploading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Story</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="mb-2">Are you sure you want to delete this story?</p>
            <p className="font-medium">{selectedStory?.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}
