'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Trash2, 
  Plus, 
  Filter, 
  Search,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { debounce } from 'lodash';

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  

  const [filters, setFilters] = useState({
    userId: 'all',
    type: 'all',
    isRead: 'all',
    search: ''
  });
  
  //notification dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [sendToAll, setSendToAll] = useState(false);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  
  // Create notification user search
  const [createUserSearchQuery, setCreateUserSearchQuery] = useState('');
  const [createSearchedUsers, setCreateSearchedUsers] = useState([]);
  const [isSearchingCreateUsers, setIsSearchingCreateUsers] = useState(false);
  const [createUserPopoverOpen, setCreateUserPopoverOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const form = useForm({
    defaultValues: {
      title: '',
      message: '',
      type: 'info',
      link: '',
    }
  });
  
  // Debounced search function for users (for filter)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchUsers = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        setSearchedUsers([]);
        setIsSearchingUsers(false);
        return;
      }

      setIsSearchingUsers(true);
      try {
        const res = await axios.get(`/api/admin/users/search?q=${encodeURIComponent(query)}`);
        setSearchedUsers(res.data || []);
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchedUsers([]);
      } finally {
        setIsSearchingUsers(false);
      }
    }, 300),
    []
  );
  
  // Debounced search function for create notification
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchCreateUsers = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        setCreateSearchedUsers([]);
        setIsSearchingCreateUsers(false);
        return;
      }

      setIsSearchingCreateUsers(true);
      try {
        const res = await axios.get(`/api/admin/users/search?q=${encodeURIComponent(query)}`);
        setCreateSearchedUsers(res.data || []);
      } catch (error) {
        console.error('Error searching users:', error);
        setCreateSearchedUsers([]);
      } finally {
        setIsSearchingCreateUsers(false);
      }
    }, 300),
    []
  );
  
  const handleUserSearchChange = (e) => {
    const query = e.target.value;
    setUserSearchQuery(query);
    debouncedSearchUsers(query);
  };
  
  const handleCreateUserSearchChange = (e) => {
    const query = e.target.value;
    setCreateUserSearchQuery(query);
    debouncedSearchCreateUsers(query);
  };
  
  // Fetch initial users for dropdown
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data.users);
    } catch (error) {
      handleApiError(error);
    }
  };
  
  // Fetch notifications with filters
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.userId !== 'all') params.append('userId', filters.userId);
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.isRead !== 'all') params.append('isRead', filters.isRead);
      if (filters.search) params.append('search', filters.search);
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);
      
      const res = await axios.get(`/api/admin/notifications?${params.toString()}`);
      setNotifications(res.data.notifications);
      setPagination(res.data.pagination);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNotifications();
  }, [filters, pagination.page, pagination.limit]);
  
  const handleApiError = (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Unauthorized or Forbidden
      if (error.response.status === 401 || error.response.status === 403) {
        toast.error("You don't have permission to access this page");
        router.push('/'); 
        return;
      }
      
      toast.error(error.response.data.message || 'An error occurred');
    } else {
      toast.error('Failed to connect to the server');
    }
  };
 
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };
  
  const selectUserFromSearch = (user) => {
    setFilters(prev => ({ ...prev, userId: user._id }));
    setUserPopoverOpen(false);
  };
  
 
  const selectUserForCreate = (user) => {
    setSelectedUser(user);
    setCreateUserPopoverOpen(false);
  };
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!createDialogOpen) {
      form.reset({
        title: '',
        message: '',
        type: 'info',
        link: '',
      });
      setSelectedUser(null);
      setCreateUserSearchQuery('');
      setCreateSearchedUsers([]);
      setSendToAll(false);
    }
  }, [createDialogOpen, form]);
  
  
  const handleCreateNotification = async (data) => {
    try {
      if (sendToAll) {
        // Send to all users
        await axios.post('/api/admin/notifications', {
          bulk: true,
          userIds: users.map(user => user._id),
          title: data.title,
          message: data.message,
          type: data.type,
          link: data.link || null
        });
        
        toast.success('Notification sent to all users');
      } else {
        // Check if user is selected
        if (!selectedUser) {
          toast.error('Please select a user');
          return;
        }
        
        // Send to single user
        await axios.post('/api/admin/notifications', {
          userId: selectedUser._id,
          title: data.title,
          message: data.message,
          type: data.type,
          link: data.link || null
        });
        
        toast.success('Notification created successfully');
      }
      
      setCreateDialogOpen(false);
      fetchNotifications();
    } catch (error) {
      handleApiError(error);
    }
  };
  

  const handleDeleteNotification = async (id) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      await axios.delete(`/api/admin/notifications/${id}`);
      toast.success('Notification deleted successfully');
      fetchNotifications();
    } catch (error) {
      handleApiError(error);
    }
  };
  
  
  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };
  

  const getUserNameById = (userId) => {
    // First try in the full users list
    const userFromList = users.find(user => user._id === userId);
    if (userFromList) return userFromList.name;
    
    // Then try in searched users
    const userFromSearch = searchedUsers.find(user => user._id === userId);
    if (userFromSearch) return userFromSearch.name;
    
    // Default case
    return "Selected User";
  };
  
  const getPageNumbers = () => {
    const { page, pages } = pagination;
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Show current page and adjacent pages
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) {
      // Add ellipsis if there's a gap
      if (i > 2 && pageNumbers[pageNumbers.length - 1] !== i - 1 && pageNumbers[pageNumbers.length - 1] !== '...') {
        pageNumbers.push('...');
      }
      pageNumbers.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (pages > 1 && pageNumbers[pageNumbers.length - 1] !== pages - 1 && pageNumbers[pageNumbers.length - 1] !== '...') {
      pageNumbers.push('...');
    }
    
    // Always show last page if there's more than one page
    if (pages > 1) {
      pageNumbers.push(pages);
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <Bell className="mr-2 h-6 w-6 text-myColorA" />
                Manage Notifications
              </CardTitle>
              <CardDescription>
                Create and manage user notifications for your NGO website
              </CardDescription>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-myColorA hover:bg-myColorAB">
                  <Plus className="mr-2 h-4 w-4" /> Create Notification
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Notification</DialogTitle>
                  <DialogDescription>
                    Send a notification to users of your NGO website
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateNotification)} className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <input
                        type="checkbox"
                        id="sendToAll"
                        checked={sendToAll}
                        onChange={() => setSendToAll(!sendToAll)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="sendToAll" className="text-sm font-medium">
                        Send to all users
                      </label>
                    </div>
                    
                    {!sendToAll && (
                      <FormItem>
                        <FormLabel>Select User</FormLabel>
                        <Popover open={createUserPopoverOpen} onOpenChange={setCreateUserPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button 
                              variant="outline" 
                              role="combobox" 
                              className="w-full justify-between"
                            >
                              {selectedUser ? (
                                <div className="flex flex-col items-start">
                                  <span>{selectedUser.name}</span>
                                  <span className="text-xs text-gray-500">{selectedUser.email}</span>
                                </div>
                              ) : (
                                "Search for a user"
                              )}
                              <User className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0">
                            <div className="p-2 border-b">
                              <div className="flex items-center gap-2">
                                <Search className="h-4 w-4 text-gray-500" />
                                <Input
                                  placeholder="Search users..."
                                  value={createUserSearchQuery}
                                  onChange={handleCreateUserSearchChange}
                                  className="h-8 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                              </div>
                            </div>
                            <div className="max-h-[300px] overflow-auto p-1">
                              {isSearchingCreateUsers ? (
                                <div className="flex justify-center items-center py-4">
                                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                                </div>
                              ) : (
                                <>
                                  {createSearchedUsers.length > 0 ? (
                                    createSearchedUsers.map(user => (
                                      <Button
                                        key={user._id}
                                        variant="ghost"
                                        className="w-full justify-start font-normal mb-1"
                                        onClick={() => selectUserForCreate(user)}
                                      >
                                        <div className="flex flex-col items-start">
                                          <span>{user.name}</span>
                                          <span className="text-xs text-gray-500">{user.email}</span>
                                        </div>
                                      </Button>
                                    ))
                                  ) : createUserSearchQuery.length >= 2 ? (
                                    <div className="text-center py-4 text-sm text-gray-500">
                                      No users found
                                    </div>
                                  ) : (
                                    <div className="text-center py-4 text-sm text-gray-500">
                                      Type at least 2 characters to search
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                        {!selectedUser && !sendToAll && (
                          <p className="text-sm text-red-500 mt-1">Please select a user</p>
                        )}
                      </FormItem>
                    )}
                    
                    <FormField
                      control={form.control}
                      name="title"
                      rules={{ required: 'Title is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Notification title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      rules={{ required: 'Message is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Notification message" 
                              {...field} 
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="info">Info</SelectItem>
                              <SelectItem value="success">Success</SelectItem>
                              <SelectItem value="warning">Warning</SelectItem>
                              <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="/dashboard" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL to navigate to when notification is clicked
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        className="bg-myColorA hover:bg-myColorAB"
                        disabled={!sendToAll && !selectedUser}
                      >
                        Create Notification
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4 items-end">
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium block mb-2">
                <Filter className="h-4 w-4 inline mr-1" /> Filter by User
              </label>
              
              {/* User search with popover */}
              <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    role="combobox" 
                    className="w-full sm:w-[240px] justify-between"
                  >
                    {filters.userId !== 'all' 
                      ? getUserNameById(filters.userId)
                      : "All Users"}
                    <User className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0">
                  <div className="p-2 border-b">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search users..."
                        value={userSearchQuery}
                        onChange={handleUserSearchChange}
                        className="h-8 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-auto p-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal mb-1"
                      onClick={() => {
                        handleFilterChange('userId', 'all');
                        setUserPopoverOpen(false);
                      }}
                    >
                      All Users
                    </Button>
                    
                    {isSearchingUsers ? (
                      <div className="flex justify-center items-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      </div>
                    ) : (
                      <>
                        {searchedUsers.length > 0 ? (
                          searchedUsers.map(user => (
                            <Button
                              key={user._id}
                              variant="ghost"
                              className="w-full justify-start font-normal mb-1"
                              onClick={() => selectUserFromSearch(user)}
                            >
                              <div className="flex flex-col items-start">
                                <span>{user.name}</span>
                                <span className="text-xs text-gray-500">{user.email}</span>
                              </div>
                            </Button>
                          ))
                        ) : userSearchQuery.length >= 2 ? (
                          <div className="text-center py-4 text-sm text-gray-500">
                            No users found
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium block mb-2">
                <Filter className="h-4 w-4 inline mr-1" /> Filter by Type
              </label>
              <Select 
                value={filters.type}
                onValueChange={value => handleFilterChange('type', value)}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium block mb-2">
                <Filter className="h-4 w-4 inline mr-1" /> Read Status
              </label>
              <Select 
                value={filters.isRead}
                onValueChange={value => handleFilterChange('isRead', value)}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="false">Unread</SelectItem>
                  <SelectItem value="true">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search notifications..."
                  className="pl-9"
                  value={filters.search}
                  onChange={e => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Notifications Table */}
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-myColorA" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <Bell className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications found</p>
            </div>
          ) : (
            <>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[70px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.map(notification => (
                      <TableRow key={notification._id}>
                        <TableCell>
                          {getTypeIcon(notification.type)}
                        </TableCell>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {notification.message}
                        </TableCell>
                        <TableCell>
                          {notification.user ? notification.user.name : 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              notification.isRead 
                                ? 'bg-gray-100 text-gray-600' 
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            {notification.isRead ? 'Read' : 'Unread'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(notification.createdAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteNotification(notification._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Inline Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center mt-6 gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  
                  {getPageNumbers().map((pageNum, idx) => (
                    pageNum === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2">...</span>
                    ) : (
                      <Button
                        key={`page-${pageNum}`}
                        variant={pagination.page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                      >
                        {pageNum}
                      </Button>
                    )
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                    disabled={pagination.page >= pagination.pages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}