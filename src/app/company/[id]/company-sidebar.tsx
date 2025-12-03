"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Building2, ClipboardPlus, Layers, Users } from "lucide-react";
import Link from "next/link";

type Platoon = {
  id: string;
  name: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
};

export function CompanySidebar({
  companyId,
  companyName,
  platoons,
}: {
  companyId: string;
  companyName: string;
  platoons: Platoon[];
}) {
  const navigationItems = [
    {
      title: "Übersicht",
      url: `/company/${companyId}`,
      icon: Building2,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1.5">
          <h2 className="text-sm font-semibold">{companyName}</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Züge</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {platoons.map((platoon) => (
                <SidebarMenuItem key={platoon.id}>
                  <SidebarMenuButton asChild>
                    <Link href={`/company/${companyId}/platoon/${platoon.id}`}>
                      <Users />
                      <span>{platoon.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Ausbildungen</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/company/${companyId}/trainings/new`}>
                    <ClipboardPlus />
                    <span>Training anlegen</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/company/${companyId}/training-instances/new`}>
                    <Layers />
                    <span>Training-Instanz anlegen</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
