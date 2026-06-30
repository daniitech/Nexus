import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Database,
  ClipboardCheck,
  FileSpreadsheet,
  Users,
  UserCog,
  Grid3x3,
  History,
  Zap,
} from "lucide-react";

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
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard Geral", url: "/", icon: LayoutDashboard },
  { title: "Cadastro Estrutural", url: "/cadastro", icon: Database },
  { title: "Avaliação", url: "/avaliacao", icon: ClipboardCheck },
  { title: "Importar / Exportar CSV", url: "/csv", icon: FileSpreadsheet },
  { title: "Monitores", url: "/monitores", icon: UserCog },
  { title: "Operadores", url: "/operadores", icon: Users },
  { title: "Quadrantes", url: "/quadrantes", icon: Grid3x3 },
  { title: "Histórico Geral", url: "/historico", icon: History },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow pulse-neon">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-widest neon-text">NEXUS</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                MONITOR DE QUALIDADE
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Administração
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary shadow-[inset_0_0_20px_oklch(0.58_0.24_22/0.15)]"
                          : "hover:bg-sidebar-accent/50 hover:text-primary"
                      }
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed && (
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>Sistema online</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
