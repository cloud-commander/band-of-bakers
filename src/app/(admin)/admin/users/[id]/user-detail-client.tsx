"use client";

import { useState } from "react";
import { PageHeader } from "@/components/state/page-header";
import type { User } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { AvatarUpload } from "@/components/ui/avatar-upload";

interface UserDetailClientProps {
  user: User | null;
}

export function UserDetailClient({ user }: UserDetailClientProps) {
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    role: (user?.role || "customer") as User["role"],
    avatar_url: user?.avatar_url || "",
  });

  // State for the new avatar file (if uploaded)
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  if (!user) {
    return (
      <div>
        <PageHeader title="User Not Found" description="The requested user could not be found" />
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/admin/users">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // TODO: Implement actual save logic, including avatar upload if avatarFile is present
    toast.success(`User ${editForm.name} updated successfully`, {
      description: "Changes will be saved to the database",
    });
  };

  return (
    <div>
      <PageHeader
        title={user.name}
        description={user.email}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/users">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Profile Information */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update user profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center pb-4">
                <AvatarUpload
                  name={editForm.name}
                  currentAvatarUrl={editForm.avatar_url}
                  onAvatarChange={(file) => setAvatarFile(file)}
                  variant="overlay"
                  size="xl"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email (Read-only)</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">Email addresses cannot be changed</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editForm.phone || ""}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="+447700900000"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, role: value as User["role"] })
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Status & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Email Verification</Label>
                <div className="mt-1">
                  <Badge variant={user.email_verified ? "default" : "secondary"}>
                    {user.email_verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Member Since</Label>
                <p className="text-sm mt-1">
                  {new Date(user.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
