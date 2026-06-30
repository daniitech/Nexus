import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Phone,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard Geral · NEXUS" },
      {
        name: "description",
        content:
          "Painel macro com KPIs, evolução de notas, ranking e alertas de operadores em tempo real.",
      },
    ],
  }),
  component: DashboardPage,
});

const evolutionData = [
  { mes: "Jan", media: 82, meta: 88 },
  { mes: "Fev", media: 84, meta: 88 },
  { mes: "Mar", media: 86, meta: 88 },
  { mes: "Abr", media: 83, meta: 88 },
  { mes: "Mai", media: 87, meta: 88 },
  { mes: "Jun", media: 89, meta: 88 },
  { mes: "Jul", media: 91, meta: 88 },
];

const requisitos = [
  { nome: "Identif. do titular", conformidade: 96 },
  { nome: "Script de cobrança", conformidade: 91 },
  { nome: "LGPD", conformidade: 88 },
  { nome: "Negociação", conformidade: 84 },
  { nome: "Empatia", conformidade: 79 },
  { nome: "Encerramento", conformidade: 72 },
];

const ranking = [
  { pos: 1, nome: "Mariana Silva", carteira: "Itaú", nota: 97.4, trend: 2.1 },
  { pos: 2, nome: "Rafael Costa", carteira: "Santander", nota: 96.1, trend: 1.4 },
  { pos: 3, nome: "Aline Souza", carteira: "Bradesco", nota: 94.8, trend: 0.8 },
  { pos: 4, nome: "Bruno Pereira", carteira: "Itaú", nota: 93.2, trend: -0.6 },
  { pos: 5, nome: "Camila Rocha", carteira: "Cetelem", nota: 92.0, trend: 1.2 },
];

const alertas = [
  { nome: "Lucas Mendes", carteira: "Banco PAN", nota: 62, motivo: "NCG Grave (LGPD)" },
  { nome: "Patrícia Lima", carteira: "Bradesco", nota: 68, motivo: "Script fora do padrão" },
  { nome: "Tiago Faria", carteira: "Itaú", nota: 71, motivo: "Tom inadequado" },
];

function Kpi({
  label,
  value,
  delta,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  delta: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  const positive = delta.startsWith("+");
  return (
    <div
      data-laser-card
      className="glow-card relative overflow-hidden rounded-xl p-5"
    >
      {accent && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      )}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 font-display text-3xl font-bold tracking-tight">{value}</div>
          <div
            className={`mt-2 inline-flex items-center gap-1 text-xs ${
              positive ? "text-success" : "text-primary"
            }`}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {delta} <span className="text-muted-foreground">vs. mês anterior</span>
          </div>
        </div>
        <div
          className={`grid h-10 w-10 place-items-center rounded-lg border border-primary/30 ${
            accent ? "bg-primary/15 text-primary shadow-[0_0_18px_var(--primary)]" : "bg-card text-primary"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <PageShell
      title="Dashboard Geral"
      subtitle="Visão macro da operação · filtros por monitor, carteira, operador e período"
      actions={
        <>
          <button className="rounded-md border border-border/60 bg-card/40 px-3 py-2 text-xs text-muted-foreground transition hover:border-primary/60 hover:text-primary">
            Últimos 30 dias
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-[0_0_20px_oklch(0.58_0.24_22/0.4)] transition hover:bg-primary-glow">
            <Sparkles className="h-3.5 w-3.5" /> Insight IA
          </button>
        </>
      }
    >
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Média Geral" value="87.6" delta="+2.4" icon={TrendingUp} accent />
        <Kpi label="Avaliações no Mês" value="1.284" delta="+18%" icon={Phone} />
        <Kpi label="NCG Grave" value="12" delta="-30%" icon={AlertTriangle} />
        <Kpi label="Top Performer" value="97.4" delta="+1.1" icon={Award} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div data-laser-card className="glow-card lg:col-span-2 rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Evolução da nota média
              </h3>
              <p className="text-xs text-muted-foreground">
                Últimos 7 meses · meta operacional 88
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] text-primary">
              <Activity className="h-3 w-3" /> ao vivo
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={evolutionData}>
              <defs>
                <linearGradient id="colorMedia" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.68 0.27 22)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.58 0.24 22)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 22 / 0.3)" />
              <XAxis dataKey="mes" stroke="oklch(0.66 0.02 20)" fontSize={11} />
              <YAxis domain={[60, 100]} stroke="oklch(0.66 0.02 20)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.15 0.012 20)",
                  border: "1px solid oklch(0.58 0.24 22 / 0.4)",
                  borderRadius: 8,
                  color: "white",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="media"
                stroke="oklch(0.7 0.27 22)"
                strokeWidth={2.5}
                fill="url(#colorMedia)"
              />
              <Area
                type="monotone"
                dataKey="meta"
                stroke="oklch(0.66 0.02 20)"
                strokeWidth={1}
                strokeDasharray="4 4"
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div data-laser-card className="glow-card rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Requisitos × conformidade
            </h3>
            <p className="text-xs text-muted-foreground">% de aderência da operação</p>
          </div>
          <div className="space-y-3">
            {requisitos.map((r) => (
              <div key={r.nome} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground/90">{r.nome}</span>
                  <span
                    className={
                      r.conformidade >= 90
                        ? "text-success font-semibold"
                        : r.conformidade >= 80
                        ? "text-warning font-semibold"
                        : "text-primary font-semibold"
                    }
                  >
                    {r.conformidade}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                    style={{
                      width: `${r.conformidade}%`,
                      boxShadow: "0 0 12px var(--primary)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ranking + Alertas */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div data-laser-card className="glow-card lg:col-span-2 rounded-xl p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
            Ranking geral de operadores
          </h3>
          <div className="overflow-hidden rounded-lg border border-border/40">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Operador</th>
                  <th className="px-4 py-2 text-left">Carteira</th>
                  <th className="px-4 py-2 text-right">Nota</th>
                  <th className="px-4 py-2 text-right">Tendência</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((r) => (
                  <tr
                    key={r.pos}
                    className="border-t border-border/30 transition hover:bg-primary/5"
                  >
                    <td className="px-4 py-3 font-display font-bold text-primary">
                      {String(r.pos).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3">{r.nome}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.carteira}</td>
                    <td className="px-4 py-3 text-right font-semibold">{r.nota.toFixed(1)}</td>
                    <td
                      className={`px-4 py-3 text-right text-xs ${
                        r.trend > 0 ? "text-success" : "text-primary"
                      }`}
                    >
                      {r.trend > 0 ? "▲" : "▼"} {Math.abs(r.trend).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div data-laser-card className="glow-card rounded-xl p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4 text-primary" />
            Alertas críticos
          </h3>
          <div className="space-y-3">
            {alertas.map((a) => (
              <div
                key={a.nome}
                className="rounded-lg border border-primary/20 bg-primary/5 p-3 transition hover:border-primary/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{a.nome}</span>
                  <span className="font-display text-lg font-bold neon-text">{a.nota}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {a.carteira} · {a.motivo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Volumetria por carteira */}
      <div data-laser-card className="glow-card rounded-xl p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
          Volumetria por carteira (mês corrente)
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={[
              { carteira: "Itaú", volume: 412 },
              { carteira: "Santander", volume: 308 },
              { carteira: "Bradesco", volume: 264 },
              { carteira: "PAN", volume: 158 },
              { carteira: "Cetelem", volume: 142 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 22 / 0.3)" />
            <XAxis dataKey="carteira" stroke="oklch(0.66 0.02 20)" fontSize={11} />
            <YAxis stroke="oklch(0.66 0.02 20)" fontSize={11} />
            <Tooltip
              cursor={{ fill: "oklch(0.58 0.24 22 / 0.08)" }}
              contentStyle={{
                background: "oklch(0.15 0.012 20)",
                border: "1px solid oklch(0.58 0.24 22 / 0.4)",
                borderRadius: 8,
                color: "white",
                fontSize: 12,
              }}
            />
            <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Cell
                  key={i}
                  fill={`oklch(${0.5 + i * 0.05} 0.24 22)`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </PageShell>
  );
}
