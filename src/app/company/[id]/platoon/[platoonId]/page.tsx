import { notFound } from "next/navigation";
import PlatoonDetail from "./platoon-detail";
import { getPlatoonDetail } from "./platoon-actions";

export default async function PlatoonPage({
  params,
}: {
  params: Promise<{ platoonId: string }>;
}) {
  const platoonId = (await params).platoonId;
  const platoon = await getPlatoonDetail(platoonId);

  if (!platoon) {
    notFound();
  }
  return <PlatoonDetail platoon={platoon} />;
}
