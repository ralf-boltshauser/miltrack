import { notFound } from "next/navigation";
import { getPlatoonById } from "./platoon-actions";

export default async function PlatoonPage({
  params,
}: {
  params: Promise<{ platoonId: string }>;
}) {
  const platoonId = (await params).platoonId;
  const platoon = await getPlatoonById(platoonId);

  if (!platoon) {
    notFound();
  }
  return <div>PlatoonPage</div>;
}
