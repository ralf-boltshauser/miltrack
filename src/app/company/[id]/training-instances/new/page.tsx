import { notFound } from "next/navigation";
import { getCompanyRoster, listTrainings } from "../../company-actions";
import TrainingInstanceForm from "./training-instance-form";

export default async function NewTrainingInstancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const [company, trainings] = await Promise.all([
    getCompanyRoster(id),
    listTrainings(),
  ]);

  if (!company) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {company.name}
        </p>
        <h1 className="text-lg font-semibold">Neue Training-Instanz</h1>
        <p className="text-sm text-muted-foreground">
          Lege eine Instanz an und wähle Personen aus der Kompanie aus.
        </p>
      </div>

      <TrainingInstanceForm company={company} trainings={trainings} />
    </div>
  );
}
