// form - CLIENT SIDE

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  const [file, setFile] = useState(null)

  const handleImageChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(selected)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const form = e.target
      const formData = new FormData()

      formData.append("title", form.title.value)
      formData.append("description", form.description.value)
      formData.append("date", form.date.value)
      formData.append("location", form.location.value)
      formData.append("status", form.status.value)

      if (file) {
        formData.append("image", file)
      }

      const res = await fetch("/api/admin/events", {
        method: "POST",
        body: formData,
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.message || "Failed to create event")
        return
      }

      toast.success("Event created successfully!")
      router.push("/admin/events")
    } catch (err) {
      console.error(err)
      toast.error("Could not create event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h2 className="text-2xl font-bold">Create New Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Event Title</Label>
          <Input name="title" required />
        </div>

        <div>
          <Label htmlFor="description">Event Description</Label>
          <Textarea name="description" />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input name="date" type="date" required />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input name="location" />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <select name="status" className="w-full p-2 border rounded-md">
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <Label htmlFor="image">Event Image</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="mt-2 h-48 w-full object-cover rounded-md"
            />
          )}
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </div>
  )
}