"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  name: string;
  onAvatarChange: (file: File | null) => void;
  variant?: "default" | "overlay";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AvatarUpload({
  currentAvatarUrl,
  name,
  onAvatarChange,
  variant = "default",
  className,
  size = "md",
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prevAvatarUrl, setPrevAvatarUrl] = useState(currentAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset preview if prop changes (e.g. after save)
  if (prevAvatarUrl !== currentAvatarUrl) {
    setPrevAvatarUrl(currentAvatarUrl);
    setPreviewUrl(null);
  }

  // Use local preview if available (new file), otherwise fallback to currentAvatarUrl prop
  const displayUrl = previewUrl || currentAvatarUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onAvatarChange(file);
  };

  const handleRemove = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPreviewUrl(null);
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-4xl",
  };

  if (variant === "overlay") {
    return (
      <div className={cn("relative group inline-block", className)}>
        <Avatar className={cn("border-2 border-stone-100", sizeClasses[size])}>
          <AvatarImage src={displayUrl || ""} alt={name} className="object-cover" />
          <AvatarFallback className={cn("bg-muted", textSizeClasses[size])}>
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={handleTriggerUpload}
        >
          <Upload className="w-6 h-6 text-white" />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  // Default variant (Admin style)
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Avatar className={cn("border", sizeClasses[size])}>
        <AvatarImage src={displayUrl || ""} alt={name} className="object-cover" />
        <AvatarFallback className={cn("bg-muted", textSizeClasses[size])}>
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTriggerUpload}
            className="text-xs"
          >
            <Upload className="h-3.5 w-3.5 mr-2" />
            Upload
          </Button>
          {displayUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-xs text-destructive hover:text-destructive"
            >
              <X className="h-3.5 w-3.5 mr-2" />
              Remove
            </Button>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">JPG, PNG or WEBP. Max 5MB.</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
