"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/state/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Send } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const WysiwygEditor = dynamic(
  () => import("@/components/admin/wysiwyg-editor").then((mod) => mod.WysiwygEditor),
  {
    ssr: false,
    loading: () => <div className="h-[300px] w-full border rounded-lg bg-muted/20 animate-pulse" />,
  }
);

export default function NewNewsPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    status: "draft" as "draft" | "published",
    publishedAt: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(
      formData.status === "published"
        ? "Post published successfully!"
        : "Draft saved successfully!",
      {
        description: formData.title,
      }
    );

    setIsSubmitting(false);
    router.push("/admin/news");
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/admin/news">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Link>
        </Button>
        <PageHeader title="Create New Post" description="Write a new update for your customers" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  Post Content
                </Heading>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Summer Menu Launch"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">
                    Summary <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="summary"
                    required
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Brief description for the list view..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">
                    Content <span className="text-red-600">*</span>
                  </Label>
                  <WysiwygEditor
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  Publishing
                </Heading>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "draft" | "published") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Publish Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                  />
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      "Saving..."
                    ) : formData.status === "published" ? (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Publish Post
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
