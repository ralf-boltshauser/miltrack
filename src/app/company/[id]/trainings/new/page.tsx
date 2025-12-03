import { notFound } from "next/navigation";
import { getCompanyNavigation } from "../../company-actions";
import TrainingCreateForm from "./training-create-form";

export default async function NewTrainingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const company = await getCompanyNavigation(id);

  if (!company) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {company.name}
        </p>
        <h1 className="text-lg font-semibold">Neues Training anlegen</h1>
        <p className="text-sm text-muted-foreground">
          Erstelle ein neues Training, das später für Instanzen genutzt werden kann.
        </p>
      </div>

      <TrainingCreateForm />
    </div>
  );
}
