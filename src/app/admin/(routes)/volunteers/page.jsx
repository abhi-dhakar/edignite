"use client";
import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, RefreshCw, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/volunteers");
      setVolunteers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch volunteers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchVolunteers();
    setRefreshing(false);
    toast.success("Volunteer list has been updated");
  };

  const updateVolunteerStatus = async () => {
    try {
      await axios.patch(`/api/admin/volunteers/${selectedVolunteer._id}`, {
        status: selectedStatus || selectedVolunteer.status,
      });

      // Update local state
      setVolunteers(
        volunteers.map((volunteer) =>
          volunteer._id === selectedVolunteer._id
            ? {
                ...volunteer,
                status: selectedStatus || selectedVolunteer.status,
              }
            : volunteer
        )
      );

      toast.success("Volunteer status updated successfully");
      setDetailsDialogOpen(false);
    } catch (err) {
      console.error("Failed to update volunteer status:", err);
      toast.error("Failed to update volunteer status");
    }
  };

  const handleDelete = async () => {
    if (!selectedVolunteer?._id) return;

    if (
      !confirm(
        "Are you sure you want to delete this volunteer? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`/api/admin/volunteers/${selectedVolunteer._id}`);

      // Update local state by removing the deleted volunteer
      setVolunteers(
        volunteers.filter(
          (volunteer) => volunteer._id !== selectedVolunteer._id
        )
      );

      toast.success("Volunteer deleted successfully");
      setDetailsDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete volunteer:", err);
      toast.error("Failed to delete volunteer");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
        );
      case "Rejected":
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      default:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
        );
    }
  };

  const handleViewDetails = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setSelectedStatus(volunteer.status);
    setDetailsDialogOpen(true);
  };

  const filteredVolunteers = volunteers.filter((volunteer) => {
    const matchesSearch =
      volunteer.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.user?.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      volunteer.skills?.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" ? true : volunteer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
              Volunteer Management
            </CardTitle>
            <CardDescription>
              Manage volunteer applications and profiles
            </CardDescription>
          </div>

          <div className="flex justify-center items-center gap-4">

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

            <Button
              onClick={() => router.push("/admin/volunteers/create")}
              className="bg-amber-950 hover:bg-amber-900"
              size="sm"
            >
              Create Volunteer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search volunteers by name, email or skills..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {/* Changed empty string to "all" */}
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVolunteers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center h-24 text-muted-foreground"
                    >
                      {searchQuery || statusFilter !== "all"
                        ? "No volunteers match your search"
                        : "No volunteers found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVolunteers.map((volunteer) => (
                    <TableRow key={volunteer._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {volunteer.user?.image ? (
                            <img
                              src={volunteer.user.image}
                              alt={volunteer.user.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {volunteer.user?.name
                                  ?.charAt(0)
                                  .toUpperCase() || "?"}
                              </span>
                            </div>
                          )}
                          <span>{volunteer.user?.name || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{volunteer.user?.email || "N/A"}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          {volunteer.skills?.length > 0
                            ? volunteer.skills.join(", ")
                            : "None specified"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {volunteer.availability || "Not specified"}
                      </TableCell>
                      <TableCell>{getStatusBadge(volunteer.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(volunteer)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredVolunteers.length} of {volunteers.length}{" "}
            volunteers
          </div>
        </CardContent>
      </Card>

      {/* Volunteer Details Dialog */}
      {selectedVolunteer && (
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Volunteer Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="flex justify-center mb-4">
                {selectedVolunteer.user?.image ? (
                  <img
                    src={selectedVolunteer.user.image}
                    alt={selectedVolunteer.user.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xl font-medium">
                      {selectedVolunteer.user?.name?.charAt(0).toUpperCase() ||
                        "?"}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="font-semibold">Name:</div>
                <div>{selectedVolunteer.user?.name || "N/A"}</div>

                <div className="font-semibold">Email:</div>
                <div className="break-all">
                  {selectedVolunteer.user?.email || "N/A"}
                </div>

                <div className="font-semibold">Phone:</div>
                <div>{selectedVolunteer.user?.phone || "N/A"}</div>

                <div className="font-semibold">Address:</div>
                <div>{selectedVolunteer.user?.address || "N/A"}</div>

                <div className="font-semibold">Skills:</div>
                <div>
                  {selectedVolunteer.skills?.join(", ") || "None specified"}
                </div>

                <div className="font-semibold">Availability:</div>
                <div>{selectedVolunteer.availability || "Not specified"}</div>

                <div className="font-semibold">Experience:</div>
                <div>{selectedVolunteer.experience || "Not specified"}</div>

                <div className="font-semibold">Preferred Location:</div>
                <div>
                  {selectedVolunteer.preferredLocation || "Not specified"}
                </div>

                <div className="font-semibold">Current Status:</div>
                <div>{getStatusBadge(selectedVolunteer.status)}</div>
              </div>

              <div className="mt-6">
                <Label htmlFor="status" className="font-semibold mb-2">
                  Update Status:
                </Label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6 pt-2 border-t">
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="mr-auto"
              >
                Delete Volunteer
              </Button>
              <div>
                <Button
                  variant="outline"
                  onClick={() => setDetailsDialogOpen(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button onClick={updateVolunteerStatus}>Save Changes</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
