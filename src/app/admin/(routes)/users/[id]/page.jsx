"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  UserCircle,
  Loader2,
} from "lucide-react";

export default function UserEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    memberType: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        const data = await res.json();
        // console.log("data is", data);

        if (!res.ok) throw new Error(data.message || "Failed to fetch user");

        setUser(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || "",
          address: data.user.address || "",
          memberType: data.user.memberType,
        });
        setImagePreview(data.user.image);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, memberType: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("memberType", formData.memberType);

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update user");
      }

      // Update local state with the updated user
      setUser(result.user);
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">User Not Found</h2>
        <p className="text-muted-foreground">
          The requested user could not be found.
        </p>
        <Button onClick={() => router.push("/admin/users")}>
          Return to Users List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/users")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Edit User</h2>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>
                  Update user details and preferences
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-muted">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-muted">
                        <UserCircle className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer text-sm text-primary hover:underline"
                    >
                      Change Profile Image
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memberType">
                      User Role <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.memberType}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Volunteer">Volunteer</SelectItem>
                        <SelectItem value="Donor">Donor</SelectItem>
                        <SelectItem value="Sponsor">Sponsor</SelectItem>
                        <SelectItem value="Beneficiary">Beneficiary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    rows={3}
                  />
                </div>

                {/* Account Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Account Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(user.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end space-x-4 border-t p-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/users")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        {/* Activity Tab */}

        <TabsContent value="activity" className="space-y-6">
          {/* Grid layout for cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


            {/* Volunteer Profile */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Volunteer Profile</h3>
              {user.volunteerProfile ? (
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Skills:</span>{" "}
                    {user.volunteerProfile.skills?.join(", ") || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Availability:</span>{" "}
                    {user.volunteerProfile.availability || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Experience:</span>{" "}
                    {user.volunteerProfile.experience || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Preferred Location:</span>{" "}
                    {user.volunteerProfile.preferredLocation || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded text-white text-xs ${
                        user.volunteerProfile.status === "Approved"
                          ? "bg-green-600"
                          : user.volunteerProfile.status === "Pending"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                      }`}
                    >
                      {user.volunteerProfile.status}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No volunteer profile submitted yet.
                </p>
              )}
            </Card>


            {/* Donations */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Donations</h3>
              {user.donations.length > 0 ? (
                <ul className="space-y-3">
                  {user.donations.map((donation) => (
                    <li
                      key={donation._id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <p className="text-base">Amount: ₹{donation.amount}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(donation.date).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No donations yet.</p>
              )}
            </Card>

            {/* Event Registrations */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                Event Registrations
              </h3>
              {user.eventRegistrations.length > 0 ? (
                <ul className="space-y-3">
                  {user.eventRegistrations.map((event) => (
                    <li
                      key={event._id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <p className="font-medium text-base">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString()} •{" "}
                        {event.location}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  No events registered yet.
                </p>
              )}
            </Card>

          
            {/* Sponsorships */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Sponsorships</h3>
              {user?.sponsorships?.length > 0 ? (
                <ul className="space-y-3">
                  {user.sponsorships.map((sponsor, i) => (
                    <li
                      key={i}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-1 text-sm"
                    >
                      {sponsor.childName && (
                        <p>
                          <span className="font-medium">Child:</span>{" "}
                          {sponsor.childName}
                        </p>
                      )}
                      {sponsor.projectName && (
                        <p>
                          <span className="font-medium">Project:</span>{" "}
                          {sponsor.projectName}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Amount:</span> ₹
                        {sponsor.amount.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Frequency:</span>{" "}
                        {sponsor.frequency}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        <span
                          className={`inline-block px-2 py-1 rounded text-white text-xs ${
                            sponsor.status === "Active"
                              ? "bg-green-600"
                              : sponsor.status === "Completed"
                                ? "bg-blue-600"
                                : "bg-red-600"
                          }`}
                        >
                          {sponsor.status}
                        </span>
                      </p>
                      <p className="text-gray-500">
                        Started on:{" "}
                        {new Date(sponsor.startDate).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic text-sm">
                  No sponsorships found.
                </p>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
