import { PageHeader } from "@/components/state/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInstagramSettings } from "@/actions/instagram";
import { InstagramEmbedForm } from "./instagram-embed-form";

export const dynamic = "force-dynamic";

export default async function InstagramSettingsPage() {
  const settings = await getInstagramSettings();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Instagram Embed"
        description="Control the Instagram post shown on the homepage."
      />

      <Card>
        <CardHeader>
          <CardTitle>Embed Code</CardTitle>
        </CardHeader>
        <CardContent>
          <InstagramEmbedForm
            initialEmbed={settings.embed}
            initialEnabled={settings.enabled}
          />
        </CardContent>
      </Card>
    </div>
  );
}
