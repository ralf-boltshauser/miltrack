import { notFound } from "next/navigation";
import {
  getPlatoonById,
  getTrainingInstancesForPlatoon,
} from "./platoon-actions";
import PlatoonDetail from "./platoon-detail";

export default async function PlatoonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const platoon = await getPlatoonById(id);
  const trainingInstances = await getTrainingInstancesForPlatoon(id);

  if (!platoon) {
    notFound();
  }
  if (!trainingInstances) {
    notFound();
  }

  return (
    <PlatoonDetail platoon={platoon} trainingInstances={trainingInstances} />
  );
}
