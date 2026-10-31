import { requireAdmin } from "@/lib/auth";
import { getServerClient } from "@/lib/supabase/server";
import { SCHEMA_BY_KEY } from "../content/schemas";
import { ContentEditor } from "../content/content-editor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminSettingsPage() {
  const user = await requireAdmin();
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("site_content")
    .select("content,status")
    .eq("key", "contact")
    .maybeSingle();

  const contactSchema = SCHEMA_BY_KEY.contact;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Public contact details and information about this admin account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>
            GitHub link and email shown in the About section and Footer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentEditor
            schema={contactSchema}
            initial={data?.content as Record<string, unknown> | undefined}
            status={data?.status}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin account</CardTitle>
          <CardDescription>
            Signed in as <span className="font-medium">{user.email}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Access is controlled by the <code>admin_users</code> allowlist table
            in Supabase. Only emails listed there pass the server-side admin
            check (<code>is_admin()</code>).
          </p>
          <p>
            To add or remove an administrator, edit <code>admin_users</code> in
            the Supabase SQL Editor and create the matching Authentication user.
            This is intentionally not editable from the dashboard to avoid
            locking yourself out.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}