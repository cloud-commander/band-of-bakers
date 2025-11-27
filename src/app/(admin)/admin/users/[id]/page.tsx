import { getUserById } from "@/actions/users";
import { UserDetailClient } from "./user-detail-client";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserById(id);

  return <UserDetailClient user={user} />;
}
