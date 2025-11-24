import { PageHeader } from "@/components/state/page-header";
import { mockUsers } from "@/lib/mocks/users";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  const users = mockUsers;

  return (
    <div>
      <PageHeader title="Users" description="Manage user accounts" />

      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-muted/30">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {user.email}
                </td>
                <td className="p-4">
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge
                    variant={user.email_verified ? "default" : "secondary"}
                  >
                    {user.email_verified ? "Verified" : "Unverified"}
                  </Badge>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
