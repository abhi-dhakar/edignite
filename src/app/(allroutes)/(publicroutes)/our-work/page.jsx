'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useRouter } from 'next/navigation';


export default function OurWorkPage() {

  const router = useRouter();
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
          Our Work
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Driving positive change through sustainable community-based initiatives and partnerships that empower lives and protect our planet.
        </p>
      </section>
  
      {/* Key Projects */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Key Initiatives</h2>
        
        <Tabs defaultValue="education" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="education" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Rural Education Access Program</CardTitle>
                <CardDescription>Bringing quality education to underserved communities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg bg-slate-100 mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                    <img src="/image3.jpg" alt="image" />
                  </div>
                </div>
                <p>Our flagship education initiative has established 25 learning centers across rural areas, providing education to over 5,000 children annually. The program focuses on quality teaching, modern curriculum, and technology integration.</p>
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Learn more</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="healthcare" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Community Health Initiative</CardTitle>
                <CardDescription>Improving healthcare access in underserved regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg bg-slate-100 mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-emerald-100 to-emerald-200 flex items-center justify-center">
                    <img src="/image3.jpg" alt="image" />
                  </div>
                </div>
                <p>Our healthcare program has established 12 mobile clinics serving remote communities, providing essential healthcare services to over 30,000 people. The initiative focuses on preventive care, maternal health, and fighting infectious diseases.</p>
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Learn more</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="environment" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Reforestation Project</CardTitle>
                <CardDescription>Restoring ecosystems and fighting climate change</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg bg-slate-100 mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center">
                       <img src="/image3.jpg" alt="image" />
                  </div>
                </div>
                <p>Our environmental initiative has planted over 500,000 trees across critical ecosystems, engaging local communities in sustainable forest management. The program combines conservation with economic opportunities through agroforestry.</p>
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Learn more</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* How We Work */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">How We Work</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Identify Needs</h3>
            <p className="text-muted-foreground">We collaborate with communities to identify their most pressing challenges</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Co-Create Solutions</h3>
            <p className="text-muted-foreground">We design programs with local partners to ensure cultural relevance</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Build Capacity</h3>
            <p className="text-muted-foreground">We empower communities with skills, knowledge and resources</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-emerald-600">4</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Ensure Sustainability</h3>
            <p className="text-muted-foreground">We create frameworks for long-term program sustainability</p>
          </div>
        </div>
      </section>
      
      {/* Get Involved */}
      <section className="bg-slate-50 rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Get Involved in Our Work</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our mission to create lasting positive change. There are many ways you can contribute to our work and help communities thrive.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button onClick={()=> router.push("/donate")} size="lg" className="bg-blue-600 hover:bg-blue-700">Donate Now</Button>
          <Button onClick={()=> router.push("/volunteer")}  size="lg" variant="outline">Volunteer</Button>
          <Button onClick={()=> router.push("/volunteer")} size="lg" variant="outline">Partner With Us</Button>
        </div>
      </section>
    </div>
  );
}