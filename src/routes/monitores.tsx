import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardCheck, Target, Activity } from "lucide-react";

export const Route = createFileRoute("/monitores")({
  head: () => ({ meta: [{ title: "Monitores · NEXUS" }] }),
  component: MonitoresPage,
});

const monitores = [
  { id: "M001", nome: "Carla Mendes", cargo: "Coord. Qualidade", aud: 142, meta: 150, scoreMedio: 87.4, calibracao: 96 },
  { id: "M002", nome: "Rafael Lima", cargo: "Sup. Negociação", aud: 128, meta: 130, scoreMedio: 84.1, calibracao: 92 },
  { id: "M003", nome: "Juliana Prado", cargo: "Qualidade Pleno", aud: 110, meta: 120, scoreMedio: 89.7, calibracao: 98 },
  { id: "M004", nome: "Thiago Souza", cargo: "Qualidade Júnior", aud: 78, meta: 90, scoreMedio: 81.2, calibracao: 88 },
];

function MonitoresPage() {
  return (
    <PageShell
      title="Monitores"
      subtitle="Equipe de qualidade — produtividade de auditoria, calibração e score médio aplicado."
    >
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <KPI icon={<ClipboardCheck className="h-4 w-4" />} label="Auditorias no mês" value="458" sub="meta 490" />
        <KPI icon={<Target className="h-4 w-4" />} label="Score médio aplicado" value="85.6" sub="+1.4 vs mês anterior" />
        <KPI icon={<Activity className="h-4 w-4" />} label="Calibração média" value="93.5%" sub="entre monitores" />
      </div>

      <div data-laser-card className="glow-card rounded-xl border border-border bg-card/40 p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Monitor</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead className="text-right">Auditorias</TableHead>
              <TableHead className="text-right">Meta</TableHead>
              <TableHead className="text-right">Score Médio</TableHead>
              <TableHead className="text-right">Calibração</TableHead>
              <TableHead>Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monitores.map((m) => {
              const pct = Math.round((m.aud / m.meta) * 100);
              const initials = m.nome.split(" ").map((n) => n[0]).slice(0, 2).join("");
              return (
                <TableRow key={m.id} className="hover:bg-primary/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-primary/30">
                        <AvatarFallback className="bg-card text-xs font-bold text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{m.nome}</div>
                        <div className="text-xs text-muted-foreground">{m.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.cargo}</TableCell>
                  <TableCell className="text-right font-mono">{m.aud}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">{m.meta}</TableCell>
                  <TableCell className="text-right font-mono text-primary">{m.scoreMedio}</TableCell>
                  <TableCell className="text-right font-mono">{m.calibracao}%</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        pct >= 100
                          ? "border-success/40 bg-success/10 text-success"
                          : pct >= 85
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-warning/40 bg-warning/10 text-warning"
                      }
                    >
                      {pct}% da meta
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </PageShell>
  );
}

function KPI({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div data-laser-card className="glow-card rounded-xl border border-border bg-card/40 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <div className="grid h-8 w-8 place-items-center rounded-md border border-primary/30 bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      <div className="mt-3 font-display text-3xl font-bold neon-text">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
