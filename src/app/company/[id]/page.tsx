import { notFound } from "next/navigation";
import CompanyDetail from "./company-detail";
import { getCompanyOverview } from "./company-actions";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const company = await getCompanyOverview(id);

  if (!company) {
    notFound();
  }

  return <CompanyDetail company={company} />;
}
