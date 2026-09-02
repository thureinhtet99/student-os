import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { DashboardContent } from "../dashboard/dashboard-content"
import { TeachersContent } from "../dashboard/teachers-content"
import { StudentsScreen } from "@/components/student/students-screen" 

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Page() {
    const [activePage, setActivePage] = React.useState("/dashboard")
    return (
        <SidebarProvider
        style={
            {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
        }
        >
        <AppSidebar variant="inset" activePage={activePage} setActivePage={setActivePage} />      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">

            {activePage === "/dashboard" && <DashboardContent />}
            
           {activePage === "/students" && (
                <StudentsScreen />
            )}
            {activePage === "/teachers" && <TeachersContent />}

            {!["/dashboard", "/students", "/teachers"].includes(activePage) && (
              <div className="p-6 text-muted-foreground text-center">
                Coming Soon Page: {activePage}
              </div>
            )}

            
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
