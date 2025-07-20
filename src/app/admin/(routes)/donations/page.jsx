'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Search, RefreshCw, MoreVertical, Edit, Trash2, Download, ExternalLink, DollarSign, User } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    paymentStatus: '',
    amount: '',
    transactionId: '',
    receiptUrl: ''
  });
  
  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


  const [stats, setStats] = useState({
    totalDonations: 0,
    completedDonations: 0,
    pendingDonations: 0,
    failedDonations: 0,
    totalAmount: 0
  });

  const router = useRouter();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/donations');
      setDonations(response.data);
      calculateStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch donations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (donationData) => {
    const stats = {
      totalDonations: donationData.length,
      completedDonations: 0,
      pendingDonations: 0,
      failedDonations: 0,
      totalAmount: 0
    };

    donationData.forEach(donation => {
      if (donation.paymentStatus === 'Completed') {
        stats.completedDonations++;
        stats.totalAmount += donation.amount;
      } else if (donation.paymentStatus === 'Pending') {
        stats.pendingDonations++;
      } else if (donation.paymentStatus === 'Failed') {
        stats.failedDonations++;
      }
    });

    setStats(stats);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDonations();
    setRefreshing(false);
    toast.success('Donations refreshed');
  };

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setDetailsDialogOpen(true);
  };

  const handleEditClick = (donation) => {
    setSelectedDonation(donation);
    setEditFormData({
      paymentStatus: donation.paymentStatus,
      amount: donation.amount.toString(),
      transactionId: donation.transactionId || '',
      receiptUrl: donation.receiptUrl || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (donation) => {
    setSelectedDonation(donation);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.patch(`/api/admin/donations/${selectedDonation._id}`, {
        paymentStatus: editFormData.paymentStatus,
        amount: parseFloat(editFormData.amount),
        transactionId: editFormData.transactionId || undefined,
        receiptUrl: editFormData.receiptUrl || undefined
      });
      
      // Update local state
      const updatedDonations = donations.map(donation => 
        donation._id === selectedDonation._id ? response.data : donation
      );
      
      setDonations(updatedDonations);
      calculateStats(updatedDonations);
      
      toast.success('Donation updated successfully');
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating donation:', error);
      toast.error(error.response?.data?.message || 'Failed to update donation');
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`/api/admin/donations/${selectedDonation._id}`);
      
      // Update local state
      const updatedDonations = donations.filter(donation => 
        donation._id !== selectedDonation._id
      );
      
      setDonations(updatedDonations);
      calculateStats(updatedDonations);
      
      toast.success('Donation deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting donation:', error);
      toast.error(error.response?.data?.message || 'Failed to delete donation');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'Failed':
        return <Badge className="bg-red-500 hover:bg-red-600">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    }
  };

  const filteredDonations = donations.filter(donation => {
    // Search filter
    const matchesSearch = 
      (donation.donor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       donation.donor?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (donation.transactionId && donation.transactionId.toLowerCase().includes(searchQuery.toLowerCase())));
    
    // Status filter
    const matchesStatus = statusFilter === "all" ? true : donation.paymentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
      <p className="font-medium">Error</p>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Total Donations</div>
            <div className="text-2xl font-bold mt-1">{stats.totalDonations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Completed</div>
            <div className="text-2xl font-bold mt-1 text-green-600">{stats.completedDonations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold mt-1 text-yellow-600">{stats.pendingDonations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Failed</div>
            <div className="text-2xl font-bold mt-1 text-red-600">{stats.failedDonations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Total Amount</div>
            <div className="text-2xl font-bold mt-1 text-primary">₹{stats.totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Donation Management</CardTitle>
            <CardDescription>Manage and track all donations</CardDescription>
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
              onClick={() => router.push("/admin/donations/create")}
              className="bg-amber-950 hover:bg-amber-900"
              size="sm"
            >
              Make a donation
            </Button>
            </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by donor name, email or transaction ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Select 
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      {searchQuery || statusFilter !== "all" 
                        ? 'No donations match your search' 
                        : 'No donations found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDonations.map((donation) => (
                    <TableRow key={donation._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {donation.donor?.image ? (
                            <img
                              src={donation.donor.image}
                              alt={donation.donor.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {donation.donor?.name?.charAt(0).toUpperCase() || '?'}
                              </span>
                            </div>
                          )}
                          <div>
                            <div>{donation.donor?.name || 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground">{donation.donor?.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">₹{donation.amount.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground ml-1">{donation.currency}</span>
                      </TableCell>
                      <TableCell>
                        {donation.transactionId ? (
                          <span className="font-mono text-xs">{donation.transactionId}</span>
                        ) : (
                          <span className="text-muted-foreground text-xs">Not available</span>
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(donation.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{getStatusBadge(donation.paymentStatus)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(donation)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClick(donation)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {donation.receiptUrl && (
                              <DropdownMenuItem 
                                onClick={() => window.open(donation.receiptUrl, '_blank')}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download Receipt
                              </DropdownMenuItem>
                            )}
                                                        <DropdownMenuItem 
                              onClick={() => handleDeleteClick(donation)}
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
        </CardContent>
      </Card>

      {/* Donation Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
          </DialogHeader>
          {selectedDonation && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 py-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{selectedDonation.donor?.name || 'Anonymous'}</div>
                  <div className="text-sm text-muted-foreground">{selectedDonation.donor?.email || 'No email provided'}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Amount</div>
                  <div className="font-medium flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {selectedDonation.amount.toLocaleString()} {selectedDonation.currency || 'INR'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div>{getStatusBadge(selectedDonation.paymentStatus)}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Date</div>
                  <div>{format(new Date(selectedDonation.createdAt), 'PPP')}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Time</div>
                  <div>{format(new Date(selectedDonation.createdAt), 'p')}</div>
                </div>
              </div>
              
              {selectedDonation.transactionId && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Transaction ID</div>
                  <div className="font-mono text-sm bg-muted p-2 rounded-md overflow-x-auto">
                    {selectedDonation.transactionId}
                  </div>
                </div>
              )}
              
              {selectedDonation.receiptUrl && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Receipt</div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-1"
                    onClick={() => window.open(selectedDonation.receiptUrl, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                </div>
              )}
              
              {selectedDonation.notes && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Notes</div>
                  <div className="text-sm bg-muted p-2 rounded-md">{selectedDonation.notes}</div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>Close</Button>
            {selectedDonation && (
              <Button onClick={() => {
                setDetailsDialogOpen(false);
                handleEditClick(selectedDonation);
              }}>
                Edit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Donation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Donation</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-status" className="text-right">
                Status
              </Label>
              <Select 
                value={editFormData.paymentStatus}
                onValueChange={(value) => setEditFormData({...editFormData, paymentStatus: value})}
              >
                <SelectTrigger className="col-span-3" id="payment-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-2.5">₹</span>
                <Input
                  id="amount"
                  className="pl-7"
                  type="number"
                  value={editFormData.amount}
                  onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction-id" className="text-right">
                Transaction ID
              </Label>
              <Input
                id="transaction-id"
                className="col-span-3"
                value={editFormData.transactionId}
                onChange={(e) => setEditFormData({...editFormData, transactionId: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="receipt-url" className="text-right">
                Receipt URL
              </Label>
              <Input
                id="receipt-url"
                className="col-span-3"
                value={editFormData.receiptUrl}
                onChange={(e) => setEditFormData({...editFormData, receiptUrl: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p className="text-muted-foreground">
              Are you sure you want to delete this donation? This action cannot be undone.
            </p>
            {selectedDonation && (
              <div className="mt-4 bg-muted p-3 rounded-md text-sm">
                <div className="flex justify-between">
                  <span>Donor:</span>
                  <span className="font-medium">{selectedDonation.donor?.name || 'Anonymous'}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Amount:</span>
                  <span className="font-medium">₹{selectedDonation.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Date:</span>
                  <span className="font-medium">{format(new Date(selectedDonation.createdAt), 'PP')}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmit}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}