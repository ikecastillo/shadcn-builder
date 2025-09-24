"use client";

import { useAuthState } from "@/hooks/use-auth";
import { UserButton } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function ProfilePage() {
  const { user, isLoading } = useAuthState();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">Manage your account settings</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-16 h-16",
                        },
                      }}
                      afterSignOutUrl="/"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-gray-600">
                        {user?.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <p className="text-gray-900">{user?.firstName || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <p className="text-gray-900">{user?.lastName || "Not provided"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{user?.emailAddresses[0]?.emailAddress}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Member Since</label>
                      <p className="text-gray-900">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
