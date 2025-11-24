"use client";

import { PageHeader } from "@/components/state/page-header";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockCurrentUser } from "@/lib/mocks/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: mockCurrentUser.name,
    email: mockCurrentUser.email,
    phone: mockCurrentUser.phone || "",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <PageHeader
          title="My Profile"
          description="Manage your account information"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Profile" }]}
          actions={!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>}
        />

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={mockCurrentUser.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {getInitials(mockCurrentUser.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{mockCurrentUser.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{mockCurrentUser.role}</p>
                {mockCurrentUser.email_verified && (
                  <p className="text-xs text-green-600 mt-1">✓ Email verified</p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSave} className="border rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="+44 7700 900000"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-6">
                <Button type="submit">Save Changes</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: mockCurrentUser.name,
                      email: mockCurrentUser.email,
                      phone: mockCurrentUser.phone || "",
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>

          {/* Account Stats */}
          <div className="border rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-4">Account Activity</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {new Date(mockCurrentUser.created_at).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {new Date(mockCurrentUser.updated_at).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
