import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
} from "recharts";
import { Award, AlertTriangle, TrendingUp, Target } from "lucide-react";

export const Route = createFileRoute("/quadrantes")({
  head: () => ({ meta: [{ title: "Quadrantes · NEXUS" }] }),
  component: QuadrantesPage,
});

const data = [
  { nome: "André Castro", x: 96, y: 92 },
  { nome: "Bruna Vidal", x: 93, y: 88 },
  { nome: "Caio Reis", x: 91, y: 78 },
  { nome: "Diana Melo", x: 88, y: 82 },
  { nome: "Eduardo Salles", x: 84, y: 70 },
  { nome: "Fernanda Rocha", x: 81, y: 64 },
  { nome: "Gabriel Nunes", x: 76, y: 58 },
  { nome: "Helena Tavares", x: 72, y: 88 },
  { nome: "Igor Pacheco", x: 68, y: 42 },
  { nome: "Júlia Bastos", x: 58, y: 38 },
  { nome: "Lucas Vieira", x: 65, y: 80 },
  { nome: "Mariana Aoki", x: 90, y: 55 },
];

function QuadrantesPage() {
  const quad = (x: number, y: number) =>
    x >= 80 && y >= 70 ? "estrela" : x >= 80 ? "potencial" : y >= 70 ? "atencao" : "critico";

  const counts = data.reduce(
    (acc, d) => {
      acc[quad(d.x, d.y)]++;
      return acc;
    },
    { estrela: 0, potencial: 0, atencao: 0, critico: 0 } as Record<string, number>
  );

  return (
    <PageShell
      title="Matriz de Quadrantes"
      subtitle="Performance × Conversão — segmentação estratégica da operação."
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <QuadCard icon={<Award />} label="Estrelas" value={counts.estrela} tone="success" desc="Alta qualidade + alta conversão" />
        <QuadCard icon={<TrendingUp />} label="Potenciais" value={counts.potencial} tone="primary" desc="Qualidade alta, conversão baixa" />
        <QuadCard icon={<Target />} label="Em Atenção" value={counts.atencao} tone="warning" desc="Conversão boa, qualidade baixa" />
        <QuadCard icon={<AlertTriangle />} label="Críticos" value={counts.critico} tone="destructive" desc="Requer ação imediata" />
      </div>

      <div
        data-laser-card
        className="glow-card rounded-xl border border-border bg-card/40 p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold">Mapa Estratégico</h3>
            <p className="text-xs text-muted-foreground">
              Eixo X: Score de qualidade · Eixo Y: % de conversão em acordo
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Legend tone="success" label="Estrela" />
            <Legend tone="primary" label="Potencial" />
            <Legend tone="warning" label="Atenção" />
            <Legend tone="destructive" label="Crítico" />
          </div>
        </div>

        <div className="h-[480px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 25 / 0.4)" />
              <XAxis
                type="number"
                dataKey="x"
                name="Qualidade"
                domain={[40, 100]}
                stroke="oklch(0.65 0.02 25)"
                label={{ value: "Qualidade →", position: "insideBottom", offset: -10, fill: "oklch(0.6 0.02 25)" }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Conversão"
                domain={[30, 100]}
                stroke="oklch(0.65 0.02 25)"
                label={{ value: "Conversão →", angle: -90, position: "insideLeft", fill: "oklch(0.6 0.02 25)" }}
              />
              <ZAxis range={[200, 200]} />
              <ReferenceLine x={80} stroke="oklch(0.58 0.24 22 / 0.5)" strokeDasharray="4 4" />
              <ReferenceLine y={70} stroke="oklch(0.58 0.24 22 / 0.5)" strokeDasharray="4 4" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3", stroke: "oklch(0.58 0.24 22)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const p = payload[0].payload as (typeof data)[0];
                  return (
                    <div className="rounded-lg border border-primary/40 bg-card/95 p-3 text-xs shadow-[0_0_24px_var(--primary)]">
                      <div className="font-display font-bold">{p.nome}</div>
                      <div className="mt-1 text-muted-foreground">Qualidade: <span className="text-primary font-mono">{p.x}</span></div>
                      <div className="text-muted-foreground">Conversão: <span className="text-primary font-mono">{p.y}%</span></div>
                    </div>
                  );
                }}
              />
              <Scatter
                data={data}
                fill="oklch(0.58 0.24 22)"
                stroke="oklch(0.7 0.2 25)"
                strokeWidth={1.5}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageShell>
  );
}

function QuadCard({
  icon,
  label,
  value,
  tone,
  desc,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "success" | "primary" | "warning" | "destructive";
  desc: string;
}) {
  const map: Record<string, string> = {
    success: "border-success/40 text-success",
    primary: "border-primary/40 text-primary",
    warning: "border-warning/40 text-warning",
    destructive: "border-destructive/40 text-destructive",
  };
  return (
    <div data-laser-card className={`glow-card rounded-xl border bg-card/40 p-5 ${map[tone]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em]">{label}</span>
        <div className="opacity-80">{icon}</div>
      </div>
      <div className="mt-3 font-display text-4xl font-bold">{value}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{desc}</div>
    </div>
  );
}

function Legend({ tone, label }: { tone: string; label: string }) {
  const map: Record<string, string> = {
    success: "bg-success",
    primary: "bg-primary",
    warning: "bg-warning",
    destructive: "bg-destructive",
  };
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <span className={`h-2 w-2 rounded-full ${map[tone]}`} />
      {label}
    </div>
  );
}
