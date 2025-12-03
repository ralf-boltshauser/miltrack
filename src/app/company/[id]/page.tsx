import { notFound } from "next/navigation";
import { getCompanyById } from "./company-actions";
import CompanyDetail from "./company-detail";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const company = await getCompanyById(id);

  if (!company) {
    notFound();
  }

  return <CompanyDetail company={company} />;
}
