'use client'
import { useState} from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, UserPlus, Search } from 'lucide-react';

export default function CreateVolunteerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [formData, setFormData] = useState({
    skills: '',
    availability: '',
    experience: '',
    preferredLocation: '',
    status: 'Pending'
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    
    
  try {
    setSearching(true);
    const response = await axios.get(`/api/admin/users/search?q=${encodeURIComponent(searchQuery)}`);
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
      toast.error('Please select a user');
      return;
    }
    
    try {
      setLoading(true);
      
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill);
      
      const response = await axios.post('/api/admin/volunteers', {
        user: selectedUser._id,
        skills: skillsArray,
        availability: formData.availability,
        experience: formData.experience,
        preferredLocation: formData.preferredLocation,
        status: formData.status
      });
      
      toast.success('Volunteer created successfully');
      router.push('/admin/volunteers');
    } catch (error) {
      console.error('Error creating volunteer:', error);
      toast.error(error.response?.data?.message || 'Failed to create volunteer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => router.push('/admin/volunteers')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Volunteers
      </Button>
      
      <Card className="max-w-2xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Volunteer</CardTitle>
          <CardDescription>
            Add a new volunteer to the system by selecting an existing user and providing volunteer details
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* User Selection Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select User</h3>
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
                        <span className="text-sm font-medium">
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{selectedUser.name}</p>
                      <p className="text-sm">{selectedUser.email}</p>
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
              
              {/* Volunteer Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Volunteer Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    name="skills"
                    placeholder="e.g. Teaching, Web Development, First Aid"
                    value={formData.skills}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    name="availability"
                    value={formData.availability}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weekends">Weekends</SelectItem>
                      <SelectItem value="Weekdays">Weekdays</SelectItem>
                      <SelectItem value="Evenings">Evenings</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    placeholder="Describe previous volunteer or relevant experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preferredLocation">Preferred Location</Label>
                  <Input
                    id="preferredLocation"
                    name="preferredLocation"
                    placeholder="e.g. Downtown, Remote, Any location"
                    value={formData.preferredLocation}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
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
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/volunteers')}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading || !selectedUser}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Create Volunteer
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}