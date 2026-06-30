import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, TrendingDown, TrendingUp, Phone } from "lucide-react";

export const Route = createFileRoute("/operadores")({
  head: () => ({ meta: [{ title: "Operadores · NEXUS" }] }),
  component: OperadoresPage,
});

type Op = {
  id: string;
  nome: string;
  setor: string;
  carteira: string;
  score: number;
  monitorias: number;
  trend: number;
};

const ops: Op[] = [
  { id: "OP001", nome: "André Castro", setor: "Cobrança Ativa", carteira: "Banco Volt", score: 96, monitorias: 12, trend: 2.4 },
  { id: "OP002", nome: "Bruna Vidal", setor: "Receptiva", carteira: "Lumen Telecom", score: 93, monitorias: 11, trend: 1.1 },
  { id: "OP003", nome: "Caio Reis", setor: "Especial", carteira: "Aurora Crédito", score: 91, monitorias: 9, trend: 0.8 },
  { id: "OP004", nome: "Diana Melo", setor: "Cobrança Ativa", carteira: "Banco Volt", score: 88, monitorias: 14, trend: -0.6 },
  { id: "OP005", nome: "Eduardo Salles", setor: "Receptiva", carteira: "Lumen Telecom", score: 84, monitorias: 8, trend: 3.2 },
  { id: "OP006", nome: "Fernanda Rocha", setor: "Especial", carteira: "Aurora Crédito", score: 81, monitorias: 10, trend: -1.4 },
  { id: "OP007", nome: "Gabriel Nunes", setor: "Cobrança Ativa", carteira: "Banco Volt", score: 76, monitorias: 7, trend: 0.4 },
  { id: "OP008", nome: "Helena Tavares", setor: "Receptiva", carteira: "Lumen Telecom", score: 72, monitorias: 6, trend: -2.1 },
  { id: "OP009", nome: "Igor Pacheco", setor: "Especial", carteira: "Aurora Crédito", score: 68, monitorias: 5, trend: -3.4 },
  { id: "OP010", nome: "Júlia Bastos", setor: "Cobrança Ativa", carteira: "Banco Volt", score: 58, monitorias: 4, trend: -5.8 },
];

function OperadoresPage() {
  const [q, setQ] = useState("");
  const filtered = ops.filter((o) =>
    [o.nome, o.setor, o.carteira, o.id].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <PageShell
      title="Operadores"
      subtitle="Quadro completo da força de cobrança com performance de monitoria."
      actions={
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar operador..."
            className="w-72 pl-9"
          />
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((op) => (
          <OperadorCard key={op.id} op={op} />
        ))}
      </div>
    </PageShell>
  );
}

function OperadorCard({ op }: { op: Op }) {
  const initials = op.nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  const tone =
    op.score >= 90
      ? "success"
      : op.score >= 75
      ? "primary"
      : op.score >= 60
      ? "warning"
      : "destructive";
  const toneMap: Record<string, string> = {
    success: "border-success/30 text-success",
    primary: "border-primary/40 text-primary",
    warning: "border-warning/40 text-warning",
    destructive: "border-destructive/40 text-destructive",
  };
  return (
    <div
      data-laser-card
      className="glow-card group relative overflow-hidden rounded-xl border border-border bg-card/50 p-5 hover:border-primary/40 transition"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary/30 shadow-[0_0_18px_var(--primary)]">
            <AvatarFallback className="bg-card font-display font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-display font-semibold">{op.nome}</div>
            <div className="text-xs text-muted-foreground">{op.id}</div>
          </div>
        </div>
        <Badge variant="outline" className={toneMap[tone]}>
          {op.score}
        </Badge>
      </div>
      <Progress value={op.score} className="mt-4" />
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-muted-foreground">Setor</div>
          <div className="mt-0.5 font-medium">{op.setor}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Carteira</div>
          <div className="mt-0.5 font-medium">{op.carteira}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Monitorias</div>
          <div className="mt-0.5 flex items-center gap-1 font-mono">
            <Phone className="h-3 w-3" /> {op.monitorias}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
        <span className="text-muted-foreground">Tendência 30d</span>
        <span
          className={`flex items-center gap-1 font-mono ${
            op.trend >= 0 ? "text-success" : "text-destructive"
          }`}
        >
          {op.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {op.trend > 0 ? "+" : ""}
          {op.trend.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
