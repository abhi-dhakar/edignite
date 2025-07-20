"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Trash2, Upload, ImageIcon, VideoIcon , Loader2} from "lucide-react"

export default function AdminMediaPage() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All") // All

  const [file, setFile] = useState(null)
  const [caption, setCaption] = useState("")
  const [type, setType] = useState("Photo")
  const [uploading, setUploading] = useState(false)
   const [showUploadForm, setShowUploadForm] = useState(false)

  useEffect(() => {
    fetchMedia()
  }, [filter])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const query = filter !== "All" ? `?type=${filter}` : ""
      const res = await fetch(`/api/admin/media${query}`)
      const data = await res.json()
      setMedia(data.media)
    } catch (err) {
      toast.error("Failed to load media")
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!file || !type) {
      toast.error("Please select a file and media type")
      return
    }
     setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("caption", caption)
      formData.append("type", type)

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.message)

      toast.success("Media uploaded")
      setCaption("")
      setFile(null)
      fetchMedia()
    } catch (err) {
      toast.error(err.message || "Upload failed")
    } finally {
         setUploading(false)
         setShowUploadForm(false)
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this media?")
    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/admin/media?id=${id}`, {
        method: "DELETE",
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message)
      toast.success("Media deleted")
      fetchMedia()
    } catch (err) {
      toast.error(err.message || "Delete failed")
    }
  }

    if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Media Management</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === "All" ? "default" : "outline"}
            onClick={() => setFilter("All")}
          >
            All
          </Button>
          <Button
            variant={filter === "Photo" ? "default" : "outline"}
            onClick={() => setFilter("Photo")}
          >
            <ImageIcon className="w-4 h-4 mr-1" /> Photos
          </Button>
          <Button
            variant={filter === "Video" ? "default" : "outline"}
            onClick={() => setFilter("Video")}
          >
            <VideoIcon className="w-4 h-4 mr-1" /> Videos
          </Button>

           <Button onClick={() => setShowUploadForm(prev => !prev)}
           
           className="bg-amber-900 hover:bg-amber-950"
            >
             <Upload className="w-4 h-4 mr-2" /> 
              {showUploadForm ? "Close Upload" : "Upload Media"}
           </Button>

        </div>
      </div>

      {showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Media Type</label>
              <select
                className="block w-full p-2 border rounded-md text-sm"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Photo">Photo</option>
                <option value="Video">Video</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Caption</label>
              <Textarea
                placeholder="Enter caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">File</label>
              <Input
                type="file"
                accept={type === "Photo" ? "image/*" : "video/*"}
                onChange={(e) => setFile(e.target.files?.[0])}
              />
            </div>

            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" /> Upload Media
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}


      <Card>
        <CardHeader>
          <CardTitle>All Media</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {loading ? (
            <div className="p-4 text-muted-foreground text-sm">Loading...</div>
          ) : media.length === 0 ? (
            <div className="p-4 text-muted-foreground text-sm">No media uploaded.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Caption</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {media.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      {item.type === "Photo" ? (
                        <img src={item.url} alt="Media" className="h-14 w-14 rounded-md object-cover" />
                      ) : (
                        <video
                          src={item.url}
                          controls
                          className="h-14 w-20 rounded-md object-cover"
                        ></video>
                      )}
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell className="max-w-[300px] truncate" title={item.caption}>
                      {item.caption || "-"}
                    </TableCell>
                    <TableCell>{item.uploadedBy?.name || "Unknown"}</TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(item._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}