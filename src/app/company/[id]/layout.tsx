import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { notFound } from "next/navigation";
import { getCompanyNavigation } from "./company-actions";
import { CompanySidebar } from "./company-sidebar";

export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const company = await getCompanyNavigation(id);

  if (!company) {
    notFound();
  }

  return (
    <SidebarProvider>
      <CompanySidebar
        companyId={id}
        companyName={company.name}
        platoons={company.platoons}
      />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
