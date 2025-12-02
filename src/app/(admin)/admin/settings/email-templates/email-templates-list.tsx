"use client";

import { useEffect, useState } from "react";
import { EmailTemplate } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Editor } from "@tinymce/tinymce-react";
import { sendTestEmail, updateEmailTemplate } from "@/actions/email-templates";
import { toast } from "sonner";
import { Loader2, Mail, Save } from "lucide-react";

interface EmailTemplatesListProps {
  initialTemplates: EmailTemplate[];
  defaultTestEmail?: string | null;
}

export function EmailTemplatesList({ initialTemplates, defaultTestEmail }: EmailTemplatesListProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    initialTemplates[0]?.id || null
  );
  const [templates, setTemplates] = useState(initialTemplates);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testEmail, setTestEmail] = useState(defaultTestEmail || "");
  const [showTestOptions, setShowTestOptions] = useState(false);

  // Form state
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  const handleSelect = (template: EmailTemplate) => {
    setSelectedTemplateId(template.id);
    setSubject(template.subject);
    setContent(template.content);
  };

  useEffect(() => {
    if (selectedTemplate) {
      setSubject(selectedTemplate.subject);
      setContent(selectedTemplate.content);
    }
  }, [selectedTemplate?.id, selectedTemplate]);

  const handleSave = async () => {
    if (!selectedTemplate) return;

    setIsSaving(true);
    try {
      const result = await updateEmailTemplate(selectedTemplate.id, {
        subject,
        content,
      });

      if (result.success) {
        toast.success("Template updated successfully");
        // Update local state
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === selectedTemplate.id
              ? { ...t, subject, content, updated_at: new Date().toISOString() }
              : t
          )
        );
      } else {
        toast.error(result.error || "Failed to update template");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTest = async () => {
    if (!selectedTemplate) return;
    if (!testEmail) {
      toast.error("Enter a recipient email for the test.");
      return;
    }
    setIsSendingTest(true);
    try {
      const result = await sendTestEmail(
        selectedTemplate.id,
        testEmail,
        subject,
        content,
        selectedTemplate.variables || []
      );
      if (result.success) {
        toast.success("Test email sent");
      } else {
        toast.error(result.error || "Failed to send test email");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar List */}
      <div className="lg:col-span-3 space-y-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelect(template)}
            className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
              selectedTemplateId === template.id
                ? "bg-bakery-amber-100 text-bakery-amber-900 font-medium"
                : "hover:bg-stone-100"
            }`}
          >
            {template.name}
          </button>
        ))}
      </div>

      {/* Editor Area */}
      <div className="lg:col-span-9">
        {selectedTemplate ? (
          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-medium">Edit Template: {selectedTemplate.name}</CardTitle>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                <Button
                  onClick={() => {
                    if (!showTestOptions) {
                      setShowTestOptions(true);
                      return;
                    }
                    handleSendTest();
                  }}
                  variant="outline"
                  disabled={isSendingTest}
                >
                  {isSendingTest ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  Send Test
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showTestOptions && (
                <div className="space-y-2">
                  <Label htmlFor="test-email">Send test to</Label>
                  <Input
                    id="test-email"
                    type="email"
                    placeholder="you@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Content (HTML)</Label>
                <div className="border rounded-md overflow-hidden">
                  <Editor
                    apiKey="no-api-key"
                    tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.6.0/tinymce.min.js"
                    licenseKey="gpl"
                    value={content}
                    onEditorChange={(newContent) => setContent(newContent)}
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "code",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <p className="text-sm font-medium mb-2">Available Variables:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables?.map((variable) => (
                    <code
                      key={variable}
                      className="px-2 py-1 bg-white border rounded text-xs text-stone-600 font-mono cursor-pointer hover:bg-stone-100"
                      onClick={() => {
                        navigator.clipboard.writeText(`{{${variable}}}`);
                        toast.success(`Copied {{${variable}}} to clipboard`);
                      }}
                      title="Click to copy"
                    >
                      {`{{${variable}}}`}
                    </code>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground">
            Select a template to edit
          </div>
        )}
      </div>
    </div>
  );
}
