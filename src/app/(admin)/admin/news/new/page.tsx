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

export default function NewNewsPostPage() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsPostForm>({
    resolver: zodResolver(newsPostFormSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      status: "draft",
      publishedAt: new Date().toISOString().split("T")[0],
    },
  });

  const status = useWatch({
    control,
    name: "status",
  });

  const onSubmit = async (data: NewsPostForm) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch("/api/news", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        data.status === "published" ? "Post published successfully!" : "Draft saved successfully!",
        {
          description: data.title,
        }
      );

      router.push("/admin/news");
    } catch (error) {
      toast.error("Failed to save post", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
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
