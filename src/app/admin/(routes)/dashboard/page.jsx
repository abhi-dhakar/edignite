'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp, 
  Heart, 
  FileText, 
  Clock, 
  ArrowRight, 
  RefreshCw,
  UserPlus,
  Handshake,
  BarChart3,
  IndianRupee,
  IndianRupeeIcon
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalDonationAmount: 0,
    totalVolunteers: 0,
    totalSponsors: 0,
    totalEvents: 0,
    totalStories: 0,
    pendingVolunteers: 0
  });
  
  const [recentDonations, setRecentDonations] = useState([]);
  const [recentVolunteers, setRecentVolunteers] = useState([]);
  const [recentSponsors, setRecentSponsors] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/dashboard');
      
      // Set data from the response
      setStats(response.data.stats);
      setRecentDonations(response.data.recentDonations);
      setRecentVolunteers(response.data.recentVolunteers);
      setRecentSponsors(response.data.recentSponsors);
      setUpcomingEvents(response.data.upcomingEvents);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'Active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'Completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Donations</p>
                <h3 className="text-2xl font-bold mt-1">₹{stats.totalDonationAmount.toLocaleString()}</h3>
                <p className="text-sm text-blue-600 mt-1">{stats.totalDonations} donations</p>
              </div>
              <div className="bg-blue-500 p-2 rounded-full">
                <IndianRupee className="h-5 w-5 text-white" />
              </div>
            </div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-blue-600 mt-4"
              onClick={() => router.push('/admin/donations')}
            >
              View all donations <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-green-600">Volunteers</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalVolunteers}</h3>
                <p className="text-sm text-green-600 mt-1">{stats.pendingVolunteers} pending approvals</p>
              </div>
              <div className="bg-green-500 p-2 rounded-full">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-green-600 mt-4"
              onClick={() => router.push('/admin/volunteers')}
            >
              Manage volunteers <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-purple-600">Sponsorships</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalSponsors}</h3>
                <p className="text-sm text-purple-600 mt-1">Active sponsors</p>
              </div>
              <div className="bg-purple-500 p-2 rounded-full">
                <Handshake className="h-5 w-5 text-white" />
              </div>
            </div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-purple-600 mt-4"
              onClick={() => router.push('/admin/sponsorships')}
            >
              View sponsorships <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-amber-600">Events & Stories</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalEvents}</h3>
                <p className="text-sm text-amber-600 mt-1">{stats.totalStories} success stories</p>
              </div>
              <div className="bg-amber-500 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-amber-600 mt-4"
              onClick={() => router.push('/admin/events')}
            >
              Manage events <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col items-center justify-center gap-2"
          onClick={() => router.push('/admin/donations/create')}
        >
          <IndianRupee className="h-5 w-5" />
          <span>Record Donation</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col items-center justify-center gap-2"
          onClick={() => router.push('/admin/volunteers/create')}
        >
          <UserPlus className="h-5 w-5" />
          <span>Add Volunteer</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col items-center justify-center gap-2"
          onClick={() => router.push('/admin/sponsorships/create')}
        >
          <Heart className="h-5 w-5" />
          <span>Create Sponsorship</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col items-center justify-center gap-2"
          onClick={() => router.push('/admin/stories')}
        >
          <FileText className="h-5 w-5" />
          <span>Add Story</span>
        </Button>
      </div>
      
      {/* Recent Activity Tabs */}
      <Tabs defaultValue="donations" className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="donations">Recent Donations</TabsTrigger>
          <TabsTrigger value="volunteers">New Volunteers</TabsTrigger>
          <TabsTrigger value="sponsors">Recent Sponsors</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="donations" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Latest donations received</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDonations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No recent donations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentDonations.map((donation) => (
                      <TableRow key={donation._id}>
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
                            <span>{donation.donor?.name || 'Anonymous'}</span>
                          </div>
                        </TableCell>
                        <TableCell>₹{donation.amount.toLocaleString()}</TableCell>
                        <TableCell>{format(new Date(donation.createdAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{getStatusBadge(donation.paymentStatus)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={() => router.push('/admin/donations')}
              >
                View All Donations
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="volunteers" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>New Volunteers</CardTitle>
              <CardDescription>Recently registered volunteers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentVolunteers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No recent volunteers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentVolunteers.map((volunteer) => (
                      <TableRow key={volunteer._id}>
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
                                  {volunteer.user?.name?.charAt(0).toUpperCase() || '?'}
                                </span>
                              </div>
                            )}
                            <span>{volunteer.user?.name || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate">
                            {volunteer.skills?.length > 0 
                              ? volunteer.skills.join(', ') 
                              : 'None specified'}
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(volunteer.createdAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{getStatusBadge(volunteer.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={() => router.push('/admin/volunteers')}
              >
                View All Volunteers
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="sponsors" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Sponsors</CardTitle>
              <CardDescription>Latest sponsorships</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sponsor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSponsors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No recent sponsorships found
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentSponsors.map((sponsorship) => (
                      <TableRow key={sponsorship._id}>
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
                                  {sponsorship.sponsor?.name?.charAt(0).toUpperCase() || '?'}
                                </span>
                              </div>
                            )}
                            <span>{sponsorship.sponsor?.name || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {sponsorship.childName 
                            ? `Child: ${sponsorship.childName}` 
                            : sponsorship.projectName 
                              ? `Project: ${sponsorship.projectName}` 
                              : 'General'}
                        </TableCell>
                        <TableCell>
                          ₹{sponsorship.amount.toLocaleString()} 
                          <span className="text-xs text-muted-foreground ml-1">
                            ({sponsorship.frequency})
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(sponsorship.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={() => router.push('/admin/sponsorships')}
              >
                View All Sponsorships
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events scheduled in the near future</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Registrations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingEvents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No upcoming events found
                      </TableCell>
                    </TableRow>
                  ) : (
                    upcomingEvents.map((event) => (
                      <TableRow key={event._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            {event.image ? (
                              <img
                                src={event.image}
                                alt={event.title}
                                className="h-8 w-8 rounded object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <span>{event.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(event.date), 'MMM d, yyyy')}
                          <div className="text-xs text-muted-foreground">
                            {event.time || 'Time not specified'}
                          </div>
                        </TableCell>
                        <TableCell>{event.location || 'Location not specified'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-primary/10">
                            {event.registrations?.length || 0} registered
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={() => router.push('/admin/events')}
              >
                View All Events
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Donations</span>
                </div>
                <div className="font-medium">{stats.totalDonations}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Volunteers</span>
                </div>
                <div className="font-medium">{stats.totalVolunteers}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span>Sponsorships</span>
                </div>
                <div className="font-medium">{stats.totalSponsors}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span>Events</span>
                </div>
                <div className="font-medium">{stats.totalEvents}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>Success Stories</span>
                </div>
                <div className="font-medium">{stats.totalStories}</div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Reports
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Tasks & Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Tasks & Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.pendingVolunteers > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-yellow-600 mr-2" />
                    <span>{stats.pendingVolunteers} volunteer applications pending review</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => router.push('/admin/volunteers')}
                  >
                    Review
                  </Button>
                </div>
              )}
              
              {upcomingEvents.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <span>Next event: {upcomingEvents[0].title} on {format(new Date(upcomingEvents[0].date), 'MMM d')}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => router.push('/admin/events')}
                  >
                    View
                  </Button>
                </div>
              )}
              
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-green-600 mr-2" />
                  <span>Update website content and success stories</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => router.push('/admin/stories')}
                >
                  Update
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-md">
                <div className="flex items-center">
                  <IndianRupeeIcon className="h-5 w-5 text-purple-600 mr-2" />
                  <span>Review monthly donation reports</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => router.push('/admin/donations')}
                >
                  Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}