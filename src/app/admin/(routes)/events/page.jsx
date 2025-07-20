"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, X, Pencil, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [openDialogEvent, setOpenDialogEvent] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/events");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setEvents(data.events);
      } catch (err) {
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const startEdit = (event) => {
    setEditId(event._id);
    setEditForm({
      title: event.title,
      description: event.description,
      date: event.date?.slice(0, 10),
      location: event.location,
      status: event.status,
      preview: event.image,
      newImageFile: null,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  const handleChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setEditForm((prev) => ({
        ...prev,
        newImageFile: file,
        preview: previewUrl,
      }));
    }
  };

  const handleSave = async (id) => {
    try {
      const formData = new FormData();
      formData.append("eventId", id);
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);
      formData.append("date", editForm.date);
      formData.append("location", editForm.location);
      formData.append("status", editForm.status);

      if (editForm.newImageFile) {
        formData.append("image", editForm.newImageFile);
      }

      const res = await fetch("/api/admin/events", {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success("Event updated");

      setEvents((prev) =>
        prev.map((e) =>
          e._id === id ? { ...e, ...editForm, image: editForm.preview } : e
        )
      );

      cancelEdit();
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    const ok = confirm("Are you sure you want to delete this event?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/events?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast.success("Event deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUserDelete = async (eventId, userId) => {
    try {
      const res = await fetch("/api/admin/events/unregister-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId, userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove user");
      }

      // alert("User successfully removed from event");
 toast("User removed", {
  description: "The user has been successfully removed from the event.",
});

     
      setOpenDialogEvent((prev) => ({
        ...prev,
        registeredUsers: prev.registeredUsers.filter((u) => u._id !== userId),
      }));
      router.refresh();
    
    } catch (error) {
      console.error("Error removing user:", error.message);
        toast("Error", {
        description: "Failed to remove user.",
      });
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Events</h2>
        <Link href="/admin/events/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Event
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {loading ? (
            <p className="text-muted-foreground">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-muted-foreground">No events found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event._id}>
                      <TableCell>
                        {editId === event._id ? (
                          <div className="flex items-center gap-2">
                            {editForm.preview && (
                              <img
                                src={editForm.preview}
                                alt="Preview"
                                className="h-10 w-10 object-cover rounded"
                              />
                            )}
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </div>
                        ) : event.image ? (
                          <img
                            src={event.image}
                            alt="Event"
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {editId === event._id ? (
                          <Input
                            name="title"
                            value={editForm.title}
                            onChange={handleChange}
                          />
                        ) : (
                          event.title
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {editId === event._id ? (
                          <Textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleChange}
                            className="text-sm"
                            rows={3}
                          />
                        ) : (
                          <div className="text-muted-foreground line-clamp-2 text-sm">
                            {event.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editId === event._id ? (
                          <Input
                            type="date"
                            name="date"
                            value={editForm.date}
                            onChange={handleChange}
                          />
                        ) : (
                          new Date(event.date).toLocaleDateString()
                        )}
                      </TableCell>
                      <TableCell>
                        {editId === event._id ? (
                          <Input
                            name="location"
                            value={editForm.location}
                            onChange={handleChange}
                          />
                        ) : (
                          event.location
                        )}
                      </TableCell>
                      <TableCell>
                        {editId === event._id ? (
                          <select
                            name="status"
                            value={editForm.status}
                            onChange={handleChange}
                            className="border p-1 rounded-md text-sm"
                          >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              event.status === "Upcoming"
                                ? "bg-green-100 text-green-700"
                                : event.status === "Ongoing"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {event.status}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {event.registeredUsers?.length ? (
                          <Button
                            variant="ghost"
                            className="text-sm p-0 hover:underline"
                            onClick={() => setOpenDialogEvent(event)}
                          >
                            {event.registeredUsers.length} Users
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            0
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {editId === event._id ? (
                          <>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleSave(event._id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={cancelEdit}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => startEdit(event)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDelete(event._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Dialog
                open={!!openDialogEvent}
                onOpenChange={() => setOpenDialogEvent(null)}
              >
                <DialogContent className="max-w-md sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      Registered Users
                      {openDialogEvent?.title && (
                        <span className="block text-sm text-muted-foreground">
                          for "{openDialogEvent.title}"
                        </span>
                      )}
                    </DialogTitle>
                  </DialogHeader>

                  {openDialogEvent?.registeredUsers?.length > 0 ? (
                    <ul className="space-y-2 max-h-[350px] overflow-auto">
                      {openDialogEvent.registeredUsers.map((user, index) => (
                        <li
                          key={user._id || index}
                          className="flex justify-between items-center border-b pb-2"
                        >
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleUserDelete(openDialogEvent._id, user._id)
                            }
                            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      No users registered for this event.
                    </p>
                  )}
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
