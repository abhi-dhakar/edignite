'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, Search, DollarSign, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

export default function CreateSponsorshipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sponsorshipType, setSponsorshipType] = useState('child');
  
  const [formData, setFormData] = useState({
    childName: '',
    projectName: '',
    amount: '',
    frequency: 'One-Time',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'Active'
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    
    try {
      setSearching(true);
      const response = await axios.get(`/api/admin/users/sponsor-search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data);
      
      if (response.data.length === 0) {
        toast.info('No users found matching your search');
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) {
      toast.error('Please select a sponsor');
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (sponsorshipType === 'child' && !formData.childName) {
      toast.error('Please enter a child name');
      return;
    }
    
    if (sponsorshipType === 'project' && !formData.projectName) {
      toast.error('Please enter a project name');
      return;
    }
    
    try {
      setLoading(true);
      
      const sponsorshipData = {
        sponsor: selectedUser._id,
        amount: parseFloat(formData.amount),
        frequency: formData.frequency,
        startDate: new Date(formData.startDate),
        status: formData.status
      };
      
      if (sponsorshipType === 'child') {
        sponsorshipData.childName = formData.childName;
      } else {
        sponsorshipData.projectName = formData.projectName;
      }
      
      const response = await axios.post('/api/admin/sponsorships/create', sponsorshipData);
      
      toast.success('Sponsorship created successfully');
      router.push('/admin/sponsorships');
    } catch (error) {
      console.error('Error creating sponsorship:', error);
      toast.error(error.response?.data?.message || 'Failed to create sponsorship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => router.push('/admin/sponsorships')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Sponsorships
      </Button>
      
      <Card className="max-w-2xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Sponsorship</CardTitle>
          <CardDescription>
            Add a new sponsorship by selecting a sponsor and providing sponsorship details
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Sponsor Selection Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select Sponsor</h3>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                    {searching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleSearch}
                    disabled={searching || !searchQuery.trim()}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
                
                {searchResults.length > 0 && (
                  <div className="border rounded-md max-h-60 overflow-auto">
                    <ul className="divide-y">
                      {searchResults.map(user => (
                        <li 
                          key={user._id} 
                          className="p-3 hover:bg-muted cursor-pointer flex items-center gap-3"
                          onClick={() => handleSelectUser(user)}
                        >
                          {user.image ? (
                            <img 
                              src={user.image} 
                              alt={user.name} 
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedUser && (
                  <div className="bg-muted/50 p-3 rounded-md flex items-center gap-3">
                    {selectedUser.image ? (
                      <img 
                        src={selectedUser.image} 
                        alt={selectedUser.name} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{selectedUser.name}</p>
                      <p className="text-sm">{selectedUser.email}</p>
                      {selectedUser.phone && <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>}
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => setSelectedUser(null)}
                    >
                      Change
                    </Button>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Sponsorship Type Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sponsorship Type</h3>
                <RadioGroup 
                  value={sponsorshipType} 
                  onValueChange={setSponsorshipType}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="child" id="child" />
                    <Label htmlFor="child" className="cursor-pointer">Child Sponsorship</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="project" id="project" />
                    <Label htmlFor="project" className="cursor-pointer">Project Sponsorship</Label>
                  </div>
                </RadioGroup>
                
                {sponsorshipType === 'child' ? (
                  <div className="space-y-2">
                    <Label htmlFor="childName">Child Name</Label>
                    <Input
                      id="childName"
                      name="childName"
                      value={formData.childName}
                      onChange={handleInputChange}
                      placeholder="Enter child name"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      placeholder="Enter project name"
                    />
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Sponsorship Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sponsorship Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    name="frequency"
                    value={formData.frequency}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
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
                  <Label htmlFor="startDate">Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
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
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/sponsorships')}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading || !selectedUser || !formData.amount || 
              (sponsorshipType === 'child' && !formData.childName) || 
              (sponsorshipType === 'project' && !formData.projectName)}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <DollarSign className="h-4 w-4" />
            )}
            Create Sponsorship
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}