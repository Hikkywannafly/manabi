import { notFound } from "next/navigation";
import { DashboardPage } from "@/components/layouts";
import { CollectionDetail } from "@/features/collections/components/collection-detail";
import { createClient } from "@/lib/supabase/server";

interface CollectionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: collection } = await supabase
    .from("collections")
    .select("name")
    .eq("id", id)
    .single();

  if (!collection) {
    notFound();
  }

  return (
    <DashboardPage title={collection.name}>
      <CollectionDetail collectionId={id} />
    </DashboardPage>
  );
}
