"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { InstagramEmbedFormState, updateInstagramEmbedFormState } from "@/actions/instagram";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process?: () => void;
      };
    };
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Saving..." : "Save Embed"}
    </Button>
  );
}

export function InstagramEmbedForm({
  initialEmbed,
  initialEnabled = false,
}: {
  initialEmbed?: string | null;
  initialEnabled?: boolean;
}) {
  const [localEnabled, setLocalEnabled] = useState(initialEnabled);
  const [state, action] = useFormState<InstagramEmbedFormState, FormData>(
    updateInstagramEmbedFormState,
    { message: "", success: null, embed: initialEmbed ?? "", enabled: initialEnabled }
  );

  const embedHtml = state.embed;
  const enabled = state.enabled;

  useEffect(() => {
    setLocalEnabled(state.enabled);
  }, [state.enabled]);

  useEffect(() => {
    if (!embedHtml) return;

    const process = () => window.instgrm?.Embeds?.process?.();

    if (window.instgrm?.Embeds) {
      process();
      return;
    }

    const scriptSrc = "https://www.instagram.com/embed.js";
    const existing = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", process, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.onload = process;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [embedHtml]);

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="embed">Instagram embed code</Label>
          <Textarea
            id="embed"
            name="embed"
            defaultValue={initialEmbed ?? ""}
            placeholder='<blockquote class="instagram-media" ...></blockquote><script async src="https://www.instagram.com/embed.js"></script>'
            className="min-h-[180px]"
          />
          <p className="text-sm text-muted-foreground">
            Paste the embed HTML from Instagram. We&apos;ll render it on the homepage Instagram
            section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input type="hidden" name="enabled" value={localEnabled ? "true" : "false"} />
          <Switch
            id="enabled"
            checked={localEnabled}
            onCheckedChange={setLocalEnabled}
            aria-label="Toggle Instagram section"
          />
          <Label htmlFor="enabled" className="text-sm">
            Show Instagram section on the homepage
          </Label>
        </div>

        {state.message && (
          <div
            className={cn(
              "text-sm rounded-md px-3 py-2 border",
              state.success ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
            )}
          >
            {state.message}
          </div>
        )}

        <SubmitButton />
      </form>

      <div className="space-y-2">
        <Label>Preview</Label>
        {embedHtml ? (
          <div
            className="border rounded-lg bg-background p-4"
            dangerouslySetInnerHTML={{ __html: embedHtml }}
          />
        ) : (
          <div className="border rounded-lg bg-muted/40 p-6 text-sm text-muted-foreground">
            No embed saved yet.
          </div>
        )}
      </div>
    </div>
  );
}
