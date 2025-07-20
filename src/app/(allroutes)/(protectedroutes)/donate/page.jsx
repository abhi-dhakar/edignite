// pages/donate.jsx
'use client'
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Heart,
  HandCoins,
  CheckCircle,
  User,
  Mail,
  Phone,
  DollarSign,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { toast} from 'sonner';



export default function DonatePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [donationAmount, setDonationAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState(false);
  const [donationFrequency, setDonationFrequency] = useState('one-time');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);
  const [donorDetails, setDonorDetails] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    message: '',
    anonymous: false
  });
  
  const predefinedAmounts = [100, 500, 1000, 5000];
  
  const handleAmountSelect = (amount) => {
    setDonationAmount(amount);
    setCustomAmount(false);
  };
  
  const handleCustomAmountChange = (e) => {
    setDonationAmount(Number(e.target.value));
  };
  
  const handleDonorDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonorDetails({
      ...donorDetails,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleNextStep = () => {
    if (paymentStep === 1) {
      // Validate donor details before proceeding
      if (!session && (!donorDetails.name || !donorDetails.email || !donorDetails.phone)) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields to continue.",
          variant: "destructive"
        });
        return;
      }
    }
    setPaymentStep(paymentStep + 1);
  };
  
  const handlePreviousStep = () => {
    setPaymentStep(paymentStep - 1);
  };
  
  const handleDonationSubmit = async () => {
    setIsProcessing(true);
    
    try {
      // Here you would integrate with your payment gateway (Razorpay, Stripe, etc.)
      // This is a placeholder for the actual payment processing
      
      // Mock payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // On successful payment, you would create a donation record in your database



      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: donationAmount,
          currency: 'INR',
          donorDetails,
          frequency: donationFrequency
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle successful donation
      }
      
      // Mock successful payment
      setPaymentStep(3); // Move to thank you step
      
      toast({
        title: "Donation successful",
        description: "Thank you for your generous contribution!",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Donation Form */}
        <div className="lg:col-span-2">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Make a Donation</h1>
            <p className="text-muted-foreground">Your contribution helps us create lasting change in communities worldwide.</p>
          </div>
          
          {/* Step 1: Donation Amount & Donor Details */}
          {paymentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Donation Details</CardTitle>
                <CardDescription>Choose an amount and how often you'd like to give</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Donation Amount Selection */}
                <div className="space-y-3">
                  <Label>Select Donation Amount</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {predefinedAmounts.map(amount => (
                      <Button
                        key={amount}
                        type="button"
                        variant={donationAmount === amount && !customAmount ? "default" : "outline"}
                        onClick={() => handleAmountSelect(amount)}
                        className="h-16"
                      >
                        ₹{amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="custom-amount">Custom Amount</Label>
                      <Input
                        id="custom-amount"
                        type="number"
                        min="10"
                        value={customAmount ? donationAmount : ''}
                        onChange={(e) => {
                          setCustomAmount(true);
                          handleCustomAmountChange(e);
                        }}
                        placeholder="Enter amount"
                        className="max-w-[180px]"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                 
                {/* Donor Details */}
                {!session ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={donorDetails.name} 
                        onChange={handleDonorDetailsChange} 
                        placeholder="Enter your full name" 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={donorDetails.email} 
                        onChange={handleDonorDetailsChange} 
                        placeholder="Enter your email" 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={donorDetails.phone} 
                        onChange={handleDonorDetailsChange} 
                        placeholder="Enter your phone number" 
                        required 
                      />
                    </div>
                    <div className="pt-4 text-sm text-muted-foreground">
                      <p>Already have an account? <Link href="/signin" className="text-primary font-medium">Sign in</Link></p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={session.user?.image} />
                      <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{session.user?.name}</p>
                      <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                    </div>
                  </div>
                )}
                
                {/* Additional Message */}
                <div>
                  <Label htmlFor="message">Leave a message (optional)</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={donorDetails.message} 
                    onChange={handleDonorDetailsChange} 
                    placeholder="Share why you're donating today" 
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="anonymous" 
                    name="anonymous" 
                    checked={donorDetails.anonymous} 
                    onChange={handleDonorDetailsChange} 
                    className="rounded" 
                  />
                  <Label htmlFor="anonymous">Make my donation anonymous</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleNextStep} className="w-full">
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 2: Payment Information */}
          {paymentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Secure payment processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="card">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="card">Credit Card</TabsTrigger>
                    <TabsTrigger value="upi">UPI</TabsTrigger>
                    <TabsTrigger value="netbanking">Net Banking</TabsTrigger>
                  </TabsList>
                  <TabsContent value="card" className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="card-name">Name on Card</Label>
                      <Input id="card-name" placeholder="John Doe" />
                    </div>
                  </TabsContent>
                  <TabsContent value="upi" className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input id="upi-id" placeholder="yourname@upi" />
                    </div>
                    <div className="pt-2 text-sm text-muted-foreground">
                      <p>A payment request will be sent to your UPI app</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="netbanking" className="space-y-4 pt-4">
                    <div>
                      <Label>Select Your Bank</Label>
                      <RadioGroup defaultValue="sbi" className="grid grid-cols-2 gap-2 pt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sbi" id="sbi" />
                          <Label htmlFor="sbi">State Bank of India</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hdfc" id="hdfc" />
                          <Label htmlFor="hdfc">HDFC Bank</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="icici" id="icici" />
                          <Label htmlFor="icici">ICICI Bank</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="axis" id="axis" />
                          <Label htmlFor="axis">Axis Bank</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Donation Amount:</span>
                    <span className="font-medium">₹{donationAmount.toLocaleString()}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>₹{donationAmount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Your payment information is encrypted and secure</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button variant="outline" onClick={handlePreviousStep} className="w-full sm:w-1/3">
                  Back
                </Button>
                <Button 
                  onClick={handleDonationSubmit} 
                  disabled={isProcessing}
                  className="w-full sm:w-2/3"
                >
                  {isProcessing ? "Processing..." : `Donate ₹${donationAmount.toLocaleString()}`}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 3: Thank You */}
          {paymentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Thank You for Your Donation!</CardTitle>
                  <CardDescription>Your generosity makes our work possible</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>Donation Amount:</span>
                      <span className="font-medium">₹{donationAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Date:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Transaction ID:</span>
                      <span className="font-mono text-sm">TXN{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Payment Status:</span>
                      <span className="text-green-600 font-medium">Completed</span>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p>A receipt has been sent to your email address.</p>
                    <p className="text-sm text-muted-foreground">If you have any questions about your donation, please contact us at donations@hopeworks.org</p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Button onClick={() => router.push('/')} variant="outline" className="w-full sm:w-1/2">
                    Return to Home
                  </Button>
                  <Button className="w-full sm:w-1/2">
                    View Your Impact
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </div>
        
        {/* Right Column - Impact & Information */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Why Donate?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <HandCoins className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">100% Impact</h4>
                  <p className="text-sm text-muted-foreground">Every rupee you donate goes directly to our programs on the ground.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Change Lives</h4>
                  <p className="text-sm text-muted-foreground">Your contribution creates lasting change for communities in need.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Tax Benefits</h4>
                  <p className="text-sm text-muted-foreground">Donations are eligible for tax deduction under Section 80G.</p>
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <div className="text-sm">
                <p className="mb-2">For any questions about donations:</p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  donations@hopeworks.org
                </p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +91 98765 43210
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}