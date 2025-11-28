import { redirect } from "next/navigation";
import { getNewsPostById } from "@/actions/news";
import { EditNewsPostClient } from "./edit-client";

export default async function EditNewsPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await getNewsPostById(id);

  if (!post) {
    redirect("/admin/news");
  }

  return <EditNewsPostClient post={post} id={id} />;
}
