"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { updateNewsPost } from "@/actions/news";
import { useEffect, useState } from "react";
import { ImageGallery } from "@/components/admin/image-gallery";

const WysiwygEditor = dynamic(
  () => import("@/components/admin/wysiwyg-editor").then((mod) => mod.WysiwygEditor),
  {
    ssr: false,
    loading: () => <div className="h-[300px] w-full border rounded-lg bg-muted/20 animate-pulse" />,
  }
);

// Form validation schema
const newsPostFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  summary: z.string().min(1, "Summary is required").max(300, "Summary is too long"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().min(1, "Publish date is required"),
});

type NewsPostForm = z.infer<typeof newsPostFormSchema>;

interface EditNewsPostClientProps {
  post: {
    title: string;
    excerpt: string;
    content: string;
    is_published: boolean;
    published_at: string | null;
    image_url?: string | null;
  };
  id: string;
}

export function EditNewsPostClient({ post, id }: EditNewsPostClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>(post.image_url || "");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsPostForm>({
    resolver: zodResolver(newsPostFormSchema),
    defaultValues: {
      title: post.title,
      summary: post.excerpt,
      content: post.content,
      status: post.is_published ? "published" : "draft",
      publishedAt: post.published_at
        ? new Date(post.published_at).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    },
  });

  const status = useWatch({
    control,
    name: "status",
  });

  useEffect(() => {
    reset({
      title: post.title,
      summary: post.excerpt,
      content: post.content,
      status: post.is_published ? "published" : "draft",
      publishedAt: post.published_at
        ? new Date(post.published_at).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
    setSelectedImage(post.image_url || "");
    setIsLoading(false);
  }, [post, reset]);

  const onSubmit = async (data: NewsPostForm) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("summary", data.summary);
      formData.append("content", data.content);
      formData.append("status", data.status);
      formData.append("publishedAt", data.publishedAt);

      // Handle image if selected
      if (selectedImage) {
        // If it's a blob URL (newly uploaded), convert to file
        if (selectedImage.startsWith("blob:")) {
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          const file = new File([blob], "news-image.jpg", { type: blob.type });
          formData.append("image", file);
        } else {
          // If it's a path from the gallery, send it as image_url
          formData.append("image_url", selectedImage);
        }
      }

      const result = await updateNewsPost(id, formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success(
        data.status === "published" ? "Post updated successfully!" : "Draft updated successfully!",
        {
          description: data.title,
        }
      );

      router.push("/admin/news");
    } catch (error) {
      toast.error("Failed to update post", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/admin/news">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Link>
        </Button>
        <PageHeader title="Edit Post" description="Update your news post" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
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
                  <Input id="title" {...register("title")} placeholder="e.g., Summer Menu Launch" />
                  {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">
                    Summary <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="summary"
                    {...register("summary")}
                    placeholder="Brief description for the list view..."
                  />
                  {errors.summary && (
                    <p className="text-sm text-red-600">{errors.summary.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">
                    Content <span className="text-red-600">*</span>
                  </Label>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <WysiwygEditor
                        id="content"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-600">{errors.content.message}</p>
                  )}
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
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publishedAt">Publish Date</Label>
                  <Input id="publishedAt" type="date" {...register("publishedAt")} />
                  {errors.publishedAt && (
                    <p className="text-sm text-red-600">{errors.publishedAt.message}</p>
                  )}
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      "Saving..."
                    ) : status === "published" ? (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Update & Publish
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Draft
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  Featured Image
                </Heading>
              </CardHeader>
              <CardContent>
                <ImageGallery
                  selectedImage={selectedImage}
                  onImageSelect={setSelectedImage}
                  category="news"
                  allowUpload={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
