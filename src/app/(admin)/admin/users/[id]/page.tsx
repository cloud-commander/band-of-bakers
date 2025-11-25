"use client";

import { use, useState } from "react";
import { PageHeader } from "@/components/state/page-header";
import { mockUsers } from "@/lib/mocks/users";
import type { User } from "@/lib/validators/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Ban, ShieldCheck, Save } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const user = mockUsers.find((u) => u.id === id);

  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState("");

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    role: (user?.role || "customer") as User["role"],
    avatar_url: user?.avatar_url || "",
  });

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
    // In Phase 4, this will call an API
    toast.success(`User ${editForm.name} updated successfully`, {
      description: "Changes will be reflected in the database",
    });
  };

  const handleBanConfirm = () => {
    const action = user.is_banned ? "unbanned" : "banned";
    toast.success(`User ${user.name} ${action} successfully`, {
      description: user.is_banned
        ? "User can now access the platform"
        : banReason || "User has been restricted from accessing the platform",
    });

    setBanDialogOpen(false);
    setBanReason("");
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
                  value={editForm.phone}
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

              <div className="grid gap-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={editForm.avatar_url}
                  onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  In Phase 4, this will be a file upload
                </p>
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
                <Label className="text-sm text-muted-foreground">Account Status</Label>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      user.is_banned
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    )}
                  >
                    {user.is_banned ? "Banned" : "Active"}
                  </Badge>
                </div>
              </div>

              {user.is_banned && user.banned_reason && (
                <div>
                  <Label className="text-sm text-muted-foreground">Ban Reason</Label>
                  <p className="text-sm mt-1">{user.banned_reason}</p>
                </div>
              )}

              {user.is_banned && user.banned_at && (
                <div>
                  <Label className="text-sm text-muted-foreground">Banned On</Label>
                  <p className="text-sm mt-1">
                    {new Date(user.banned_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}

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

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setBanDialogOpen(true)}
              >
                {user.is_banned ? (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Unban User
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4 mr-2" />
                    Ban User
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ban/Unban Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{user.is_banned ? "Unban User" : "Ban User"}</DialogTitle>
            <DialogDescription>
              {user.is_banned
                ? `Restore access for ${user.name}?`
                : `Restrict ${user.name} from accessing the platform?`}
            </DialogDescription>
          </DialogHeader>
          {!user.is_banned && (
            <div className="grid gap-2 py-4">
              <Label htmlFor="ban-reason">Reason (Optional)</Label>
              <Textarea
                id="ban-reason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter reason for banning this user..."
                rows={3}
              />
            </div>
          )}
          {user.is_banned && user.banned_reason && (
            <div className="py-4">
              <Label>Ban Reason</Label>
              <p className="text-sm text-muted-foreground mt-1">{user.banned_reason}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBanConfirm} variant={user.is_banned ? "default" : "destructive"}>
              {user.is_banned ? "Unban User" : "Ban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
