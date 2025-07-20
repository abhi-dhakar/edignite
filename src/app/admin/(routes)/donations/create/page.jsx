'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { useForm } from "react-hook-form";

import { ArrowLeft, Save } from 'lucide-react';


export default function CreateDonationPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      donor: "",
      amount: "",
      currency: "INR",
      paymentStatus: "Pending",
      transactionId: "",
      receiptUrl: ""
    }
  });

  // Fetch users for donor selection
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/admin/users');
        
        // console.log('API Response:', response.data);
        
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } 
        else if (response.data && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } 
       
        else {
          console.error('Unexpected API response format:', response.data);
          setUsers([]);
          toast.error('Invalid user data format received');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      await axios.post('/api/admin/donations', data);
      toast.success('Donation created successfully');
      router.push('/admin/donations');
    } catch (error) {
      console.error('Error creating donation:', error);
      toast.error(error.response?.data?.message || 'Failed to create donation');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => router.push('/admin/donations')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Donations
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Donation</CardTitle>
          <CardDescription>
            Manually add a new donation to the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="donor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donor</FormLabel>
                    <Select 
                      disabled={isLoading} 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a donor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoading ? (
                          <SelectItem value="loading" disabled>Loading users...</SelectItem>
                        ) : users.length > 0 ? (
                          users.map(user => (
                            <SelectItem key={user._id} value={user._id}>
                              {user.name} ({user.email})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-users" disabled>No users found</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The person who made the donation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">₹</span>
                          <Input {...field} type="number" className="pl-7" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction ID (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Payment gateway transaction ID if available
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="receiptUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt URL (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" />
                    </FormControl>
                    <FormDescription>
                      Link to download the receipt if available
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Creating Donation...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Donation
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/donations')}
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}