import { notFound } from "next/navigation";
import {
  getPlatoonIdFromTrainingInstance,
  getTrainingInstanceByIdForPlatoon,
} from "./training-instance-actions";
import TrainingInstanceDetail from "./training-instance-detail";

export default async function TrainingInstancePage({
  params,
}: {
  params: Promise<{ trainingInstanceId: string }>;
}) {
  const resolvedParams = await params;
  const trainingInstanceId = resolvedParams.trainingInstanceId;

  // First, get platoonId from the training instance data
  const platoonId = await getPlatoonIdFromTrainingInstance(trainingInstanceId);

  if (!platoonId || !trainingInstanceId) {
    notFound();
  }

  const trainingInstance = await getTrainingInstanceByIdForPlatoon(
    trainingInstanceId,
    platoonId
  );

  if (!trainingInstance) {
    notFound();
  }

  return (
    <TrainingInstanceDetail
      trainingInstance={trainingInstance}
      platoonId={platoonId}
    />
  );
}
