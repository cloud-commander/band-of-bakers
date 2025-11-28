import { getEmailTemplates } from "@/actions/email-templates";
import { EmailTemplatesList } from "./email-templates-list";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export default async function EmailTemplatesPage() {
  const templates = await getEmailTemplates();

  return (
    <div className="space-y-6">
      <div>
        <Heading level={2}>Email Templates</Heading>
        <p className="text-muted-foreground">Manage automated email notifications.</p>
      </div>
      <Separator />
      <EmailTemplatesList initialTemplates={templates} />
    </div>
  );
}
