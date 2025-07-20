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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Search,
  RefreshCw,
  MoreVertical,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function AdminSponsorshipsPage() {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();


  const [selectedSponsorship, setSelectedSponsorship] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    status: "",
    amount: "",
    frequency: "",
  });

 
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchSponsorships();
  }, []);

  const fetchSponsorships = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/sponsorships");
      setSponsorships(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch sponsorships");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSponsorships();
    setRefreshing(false);
    toast.success("Sponsorships refreshed");
  };

  const handleViewDetails = (sponsorship) => {
    setSelectedSponsorship(sponsorship);
    setDetailsDialogOpen(true);
  };

  const handleEditClick = (sponsorship) => {
    setSelectedSponsorship(sponsorship);
    setEditFormData({
      status: sponsorship.status,
      amount: sponsorship.amount.toString(),
      frequency: sponsorship.frequency,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (sponsorship) => {
    setSelectedSponsorship(sponsorship);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.patch(
        `/api/admin/sponsorships/${selectedSponsorship._id}`,
        {
          status: editFormData.status,
          amount: parseFloat(editFormData.amount),
          frequency: editFormData.frequency,
        }
      );

      // Update local state
      setSponsorships(
        sponsorships.map((sponsorship) =>
          sponsorship._id === selectedSponsorship._id
            ? response.data
            : sponsorship
        )
      );

      toast.success("Sponsorship updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating sponsorship:", error);
      toast.error(
        error.response?.data?.message || "Failed to update sponsorship"
      );
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`/api/admin/sponsorships/${selectedSponsorship._id}`);

      // Update local state
      setSponsorships(
        sponsorships.filter(
          (sponsorship) => sponsorship._id !== selectedSponsorship._id
        )
      );

      toast.success("Sponsorship deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting sponsorship:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete sponsorship"
      );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>
        );
      case "Cancelled":
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
      default:
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>
        );
    }
  };

  const getFrequencyBadge = (frequency) => {
    switch (frequency) {
      case "One-Time":
        return <Badge variant="outline">One-Time</Badge>;
      case "Monthly":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Monthly
          </Badge>
        );
      case "Yearly":
        return (
          <Badge
            variant="outline"
            className="border-purple-500 text-purple-500"
          >
            Yearly
          </Badge>
        );
      default:
        return <Badge variant="outline">{frequency}</Badge>;
    }
  };

  const filteredSponsorships = sponsorships.filter((sponsorship) => {
    // Search filter
    const matchesSearch =
      sponsorship.sponsor?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      sponsorship.sponsor?.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (sponsorship.childName &&
        sponsorship.childName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (sponsorship.projectName &&
        sponsorship.projectName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    // Status filter
    const matchesStatus =
      statusFilter === "all" ? true : sponsorship.status === statusFilter;

    // Frequency filter
    const matchesFrequency =
      frequencyFilter === "all"
        ? true
        : sponsorship.frequency === frequencyFilter;

    return matchesSearch && matchesStatus && matchesFrequency;
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
              Sponsorship Management
            </CardTitle>
            <CardDescription>
              Manage child and project sponsorships
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
              onClick={() => router.push("/admin/sponsorships/create")}
              className="bg-amber-950 hover:bg-amber-900"
              size="sm"
            >
              Create Sponsorship
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by sponsor, child or project name..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={frequencyFilter}
                onValueChange={setFrequencyFilter}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frequency</SelectItem>
                  <SelectItem value="One-Time">One-Time</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sponsor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSponsorships.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center h-24 text-muted-foreground"
                    >
                      {searchQuery ||
                      statusFilter !== "all" ||
                      frequencyFilter !== "all"
                        ? "No sponsorships match your search"
                        : "No sponsorships found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSponsorships.map((sponsorship) => (
                    <TableRow
                      key={sponsorship._id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {sponsorship.sponsor?.image ? (
                            <img
                              src={sponsorship.sponsor.image}
                              alt={sponsorship.sponsor.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {sponsorship.sponsor?.name
                                  ?.charAt(0)
                                  .toUpperCase() || "?"}
                              </span>
                            </div>
                          )}
                          <div>
                            <div>{sponsorship.sponsor?.name || "Unknown"}</div>
                            <div className="text-xs text-muted-foreground">
                              {sponsorship.sponsor?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {sponsorship.childName ? (
                          <span>Child: {sponsorship.childName}</span>
                        ) : sponsorship.projectName ? (
                          <span>Project: {sponsorship.projectName}</span>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          ${sponsorship.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getFrequencyBadge(sponsorship.frequency)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(sponsorship.startDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(sponsorship.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(sponsorship)}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditClick(sponsorship)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(sponsorship)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredSponsorships.length} of {sponsorships.length}{" "}
            sponsorships
          </div>
        </CardContent>
      </Card>

      {/* Sponsorship Details Dialog */}
      {selectedSponsorship && (
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Sponsorship Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {/* Sponsor Information */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Sponsor Information
                </h3>
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-md">
                  {selectedSponsorship.sponsor?.image ? (
                    <img
                      src={selectedSponsorship.sponsor.image}
                      alt={selectedSponsorship.sponsor.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {selectedSponsorship.sponsor?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedSponsorship.sponsor?.email || "No email"}
                    </p>
                    {selectedSponsorship.sponsor?.phone && (
                      <p className="text-sm text-muted-foreground">
                        {selectedSponsorship.sponsor.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sponsorship Details */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Sponsorship Details
                </h3>
                <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-md">
                  <div className="font-medium">Type:</div>
                  <div>
                    {selectedSponsorship.childName
                      ? "Child Sponsorship"
                      : selectedSponsorship.projectName
                        ? "Project Sponsorship"
                        : "General Sponsorship"}
                  </div>

                  {selectedSponsorship.childName && (
                    <>
                      <div className="font-medium">Child Name:</div>
                      <div>{selectedSponsorship.childName}</div>
                    </>
                  )}

                  {selectedSponsorship.projectName && (
                    <>
                      <div className="font-medium">Project Name:</div>
                      <div>{selectedSponsorship.projectName}</div>
                    </>
                  )}

                  <div className="font-medium">Amount:</div>
                  <div className="font-semibold text-primary">
                    ${selectedSponsorship.amount.toFixed(2)}
                  </div>

                  <div className="font-medium">Frequency:</div>
                  <div>{getFrequencyBadge(selectedSponsorship.frequency)}</div>

                  <div className="font-medium">Start Date:</div>
                  <div>
                    {format(
                      new Date(selectedSponsorship.startDate),
                      "MMMM d, yyyy"
                    )}
                  </div>

                  <div className="font-medium">Status:</div>
                  <div>{getStatusBadge(selectedSponsorship.status)}</div>

                  <div className="font-medium">Created:</div>
                  <div>
                    {format(
                      new Date(selectedSponsorship.createdAt),
                      "MMM d, yyyy"
                    )}
                  </div>

                  {selectedSponsorship.updatedAt &&
                    selectedSponsorship.updatedAt !==
                      selectedSponsorship.createdAt && (
                      <>
                        <div className="font-medium">Last Updated:</div>
                        <div>
                          {format(
                            new Date(selectedSponsorship.updatedAt),
                            "MMM d, yyyy"
                          )}
                        </div>
                      </>
                    )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    handleEditClick(selectedSponsorship);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    handleDeleteClick(selectedSponsorship);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Sponsorship Dialog */}
      {selectedSponsorship && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Sponsorship</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editFormData.amount}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, amount: e.target.value })
                  }
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={editFormData.frequency}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, frequency: value })
                  }
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="One-Time">One-Time</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                disabled={
                  !editFormData.amount ||
                  !editFormData.frequency ||
                  !editFormData.status
                }
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedSponsorship && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Sponsorship</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="mb-2">
                Are you sure you want to delete this sponsorship?
              </p>
              <div className="bg-muted/30 p-3 rounded-md mb-3">
                <p>
                  <span className="font-medium">Sponsor:</span>{" "}
                  {selectedSponsorship.sponsor?.name || "Unknown"}
                </p>
                <p>
                  <span className="font-medium">Type:</span>{" "}
                  {selectedSponsorship.childName
                    ? `Child: ${selectedSponsorship.childName}`
                    : selectedSponsorship.projectName
                      ? `Project: ${selectedSponsorship.projectName}`
                      : "General Sponsorship"}
                </p>
                <p>
                  <span className="font-medium">Amount:</span> $
                  {selectedSponsorship.amount.toFixed(2)} (
                  {selectedSponsorship.frequency})
                </p>
              </div>
              <p className="text-sm text-red-500 font-medium">
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
              <Button variant="destructive" onClick={handleDeleteSubmit}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
