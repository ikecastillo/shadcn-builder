"use client";

import { 
  BlocksIcon, 
  Heart, 
  Code2, 
  Zap, 
  Users, 
  Lightbulb, 
  Target, 
  ArrowRight,
  Github,
  Coffee,
  Sparkles,
  Clock,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/landingpage/header";
import Footer from "@/components/landingpage/footer";

export default function AboutPage() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              ← Back to Home
            </Link>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <BlocksIcon className="h-8 w-8" strokeWidth={2} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">About shadcn/ui Builder</h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Making form building accessible, beautiful, and fun for everyone
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Beta Version
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Code2 className="h-3 w-3" />
                  Open Source
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Heart className="h-3 w-3 text-red-500" />
                  Built with Love
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* The Story */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">The Story Behind the Builder</h2>
            
            <div className="prose prose-gray max-w-none space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-primary">
                <p className="text-lg leading-relaxed text-muted-foreground italic">
                  "Every great tool starts with a frustration, and mine began with the countless hours I spent 
                  building forms from scratch, over and over again."
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  It was a typical Tuesday morning when the idea for shadcn/ui Builder was born. As a developer, 
                  I found myself repeatedly building the same form components, styling them with Tailwind CSS, 
                  and ensuring they worked perfectly with React Hook Form and Zod validation. The pattern was always 
                  the same, but the implementation took hours every single time.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  The breakthrough moment came when I discovered <Link href="https://ui.shadcn.com" className="text-primary hover:underline font-medium">shadcn/ui</Link> - 
                  a beautifully designed component library that perfectly balanced aesthetics with functionality. 
                  I realized that if I could create a visual form builder using these components as the foundation, 
                  I could solve not just my own problem, but help thousands of other developers too.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  What started as a late-night side project quickly evolved into something much bigger. I envisioned a tool 
                  that would make form building as simple as drag-and-drop, while still generating clean, 
                  production-ready React code that developers could be proud of.
                </p>
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="grid md:grid-cols-2 gap-8">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary" />
                  <CardTitle>My Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To democratize form building by providing a powerful, intuitive visual builder that generates 
                  clean, maintainable React code using the best practices and modern web standards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                  <CardTitle>My Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  A world where creating beautiful, accessible, and functional forms takes minutes, not hours, 
                  and where both developers and non-developers can build professional web forms effortlessly.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Core Values */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">What Drives Me</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 w-fit">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Simplicity First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Complex problems deserve simple solutions. We believe powerful tools don't have to be complicated.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 w-fit">
                    <Code2 className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Code Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Generated code should be clean, readable, and maintainable - code you'd be proud to write yourself.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 w-fit">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Community Driven</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Built by developers, for developers, with feedback and contributions from the community.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Technical Foundation */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Built on Solid Foundations</h2>
            
            <div className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-lg p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                I built shadcn/ui Builder using the same modern stack that powers today's best web applications:
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-lg bg-background border">
                    <Code2 className="h-6 w-6 mx-auto text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">React + TypeScript</p>
                    <p className="text-xs text-muted-foreground">Type-safe components</p>
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-lg bg-background border">
                    <Zap className="h-6 w-6 mx-auto text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Next.js</p>
                    <p className="text-xs text-muted-foreground">Full-stack framework</p>
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-lg bg-background border">
                    <Sparkles className="h-6 w-6 mx-auto text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">shadcn/ui</p>
                    <p className="text-xs text-muted-foreground">Beautiful components</p>
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-lg bg-background border">
                    <CheckCircle className="h-6 w-6 mx-auto text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Tailwind CSS</p>
                    <p className="text-xs text-muted-foreground">Utility-first styling</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Development Journey */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">My Journey So Far</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Coffee className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">The Idea Phase</h3>
                  <p className="text-sm text-muted-foreground">
                    Late nights and countless coffee sessions figuring out the perfect form builder that developers would actually want to use.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">First Prototype</h3>
                  <p className="text-sm text-muted-foreground">
                    Built the initial drag-and-drop interface and component system. The magic moment when I saw components come to life!
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Beta Launch</h3>
                  <p className="text-sm text-muted-foreground">
                    Released my first public beta with core form components and code generation capabilities.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Community Growth</h3>
                  <p className="text-sm text-muted-foreground">
                    Amazing feedback from early adopters helping me shape the roadmap and improve the user experience.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Future Vision */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">What's Next</h2>
            
            <div className="bg-gradient-to-r from-primary/10 to-purple-100/50 dark:to-purple-900/20 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">The Road Ahead</h3>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                I'm just getting started! My roadmap includes advanced validation rules, custom component support, 
                form analytics, team collaboration features, and integrations with popular services. 
                But most importantly, I'm building what the community needs.
              </p>
              
              <div className="pt-4">
                <Link href="https://github.com/iduspara/shadcn-builder/issues" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                  Share your ideas on GitHub <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center space-y-6 py-12">
            <h2 className="text-3xl font-bold">Join the Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Whether you're a developer looking to speed up your workflow, or someone who wants to build 
              beautiful forms without code, I'd love to have you as part of this community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/builder">
                  Try the Builder <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://github.com/iduspara/shadcn-builder">
                  <Github className="h-4 w-4 mr-2" />
                  View on GitHub
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
