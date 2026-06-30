import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, AlertTriangle, CheckCircle2, XCircle, Minus, Zap } from "lucide-react";

export const Route = createFileRoute("/avaliacao")({
  head: () => ({ meta: [{ title: "Avaliação · NEXUS" }] }),
  component: AvaliacaoPage,
});

type Status = "conforme" | "nao_conforme" | "na";
type Req = {
  id: string;
  nome: string;
  peso: number;
  critico?: boolean;
  status: Status;
};

const requisitos: Req[] = [
  { id: "R01", nome: "Saudação completa e identificação", peso: 5, critico: true, status: "conforme" },
  { id: "R02", nome: "Confirmação de dados do cliente", peso: 10, status: "conforme" },
  { id: "R03", nome: "Sondagem da real situação financeira", peso: 10, status: "conforme" },
  { id: "R04", nome: "Oferta da melhor proposta de acordo", peso: 15, status: "nao_conforme" },
  { id: "R05", nome: "Argumentação técnica e empática", peso: 10, status: "conforme" },
  { id: "R06", nome: "Confirmação clara do acordo firmado", peso: 10, critico: true, status: "conforme" },
  { id: "R07", nome: "Encerramento cordial", peso: 5, status: "conforme" },
  { id: "R08", nome: "Aderência ao script de compliance", peso: 15, critico: true, status: "conforme" },
  { id: "R09", nome: "Postura e tom de voz", peso: 10, status: "na" },
  { id: "R10", nome: "Registro correto no sistema", peso: 10, status: "conforme" },
];

function AvaliacaoPage() {
  const [list, setList] = useState(requisitos);
  const [obs, setObs] = useState("");

  const { score, pesoTotal, criticoFalhou } = useMemo(() => {
    let total = 0;
    let ok = 0;
    let critFail = false;
    for (const r of list) {
      if (r.status === "na") continue;
      total += r.peso;
      if (r.status === "conforme") ok += r.peso;
      if (r.status === "nao_conforme" && r.critico) critFail = true;
    }
    const score = total === 0 ? 0 : Math.round((ok / total) * 100);
    return { score, pesoTotal: total, criticoFalhou: critFail };
  }, [list]);

  const setStatus = (id: string, status: Status) =>
    setList((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  return (
    <PageShell
      title="Avaliação / Auditoria"
      subtitle="Monitoria assistida de ligação — pontuação automática com requisitos críticos."
      actions={
        <Button className="gap-2 bg-primary text-primary-foreground shadow-[0_0_30px_var(--primary)] hover:bg-primary/90">
          <Save className="h-4 w-4" /> Salvar Auditoria
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Header */}
          <div data-laser-card className="glow-card rounded-xl border border-border bg-card/40 p-5">
            <div className="grid gap-4 md:grid-cols-4">
              <FieldSelect label="Operador" options={["André Castro", "Bruna Vidal", "Caio Reis", "Diana Melo"]} />
              <FieldSelect label="Setor" options={["Cobrança Ativa", "Receptiva", "Especial"]} />
              <FieldSelect label="Carteira" options={["Banco Volt - Cartão", "Lumen Telecom", "Aurora Crédito"]} />
              <Field label="Protocolo" placeholder="20260624-00481" />
              <Field label="Data" type="date" />
              <Field label="Duração (min)" placeholder="07:42" />
              <FieldSelect label="Resultado" options={["Acordo", "Sem Acordo", "Promessa", "Recusa"]} />
              <FieldSelect label="Monitor" options={["Carla Mendes", "Rafael Lima", "Juliana Prado"]} />
            </div>
          </div>

          <Tabs defaultValue="checklist">
            <TabsList className="bg-card/60 border border-border">
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="observacoes">Observações</TabsTrigger>
            </TabsList>

            <TabsContent value="checklist" className="mt-4 space-y-2">
              {list.map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[60px_1fr_auto] items-center gap-4 rounded-lg border border-border bg-card/30 px-4 py-3 hover:border-primary/30 transition-colors"
                >
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{r.nome}</span>
                      {r.critico && (
                        <Badge className="border-destructive/40 bg-destructive/10 text-destructive text-[10px]">
                          <AlertTriangle className="mr-1 h-3 w-3" /> Crítico
                        </Badge>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">Peso {r.peso}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusPill
                      active={r.status === "conforme"}
                      tone="success"
                      onClick={() => setStatus(r.id, "conforme")}
                      icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                      label="C"
                    />
                    <StatusPill
                      active={r.status === "nao_conforme"}
                      tone="destructive"
                      onClick={() => setStatus(r.id, "nao_conforme")}
                      icon={<XCircle className="h-3.5 w-3.5" />}
                      label="NC"
                    />
                    <StatusPill
                      active={r.status === "na"}
                      tone="muted"
                      onClick={() => setStatus(r.id, "na")}
                      icon={<Minus className="h-3.5 w-3.5" />}
                      label="N/A"
                    />
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="observacoes" className="mt-4">
              <div className="rounded-xl border border-border bg-card/40 p-4">
                <Label className="text-xs uppercase tracking-wider">
                  Feedback ao operador
                </Label>
                <Textarea
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  rows={8}
                  className="mt-2"
                  placeholder="Descreva pontos fortes, oportunidades de melhoria e ações recomendadas..."
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Score Sidebar */}
        <div className="space-y-4">
          <div
            data-laser-card
            className="glow-card relative overflow-hidden rounded-xl border border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 p-6"
          >
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-primary">
              <Zap className="h-3 w-3" /> Score em tempo real
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-6xl font-bold neon-text">{score}</span>
              <span className="text-2xl text-muted-foreground">%</span>
            </div>
            <Progress value={score} className="mt-4" />
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-muted-foreground">Peso avaliado</div>
                <div className="mt-1 font-mono text-base">{pesoTotal}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Itens NC</div>
                <div className="mt-1 font-mono text-base text-destructive">
                  {list.filter((r) => r.status === "nao_conforme").length}
                </div>
              </div>
            </div>
            {criticoFalhou && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Requisito crítico não conforme — auditoria sinalizada para revisão da
                  supervisão.
                </span>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card/40 p-5">
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Classificação
            </h4>
            <div className="mt-3 space-y-2 text-sm">
              <RangeRow label="Excelente" range="90 – 100" tone="success" hit={score >= 90} />
              <RangeRow label="Bom" range="75 – 89" tone="primary" hit={score >= 75 && score < 90} />
              <RangeRow label="Atenção" range="60 – 74" tone="warning" hit={score >= 60 && score < 75} />
              <RangeRow label="Crítico" range="0 – 59" tone="destructive" hit={score < 60} />
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</Label>
      <Input {...props} />
    </div>
  );
}

function FieldSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="space-y-2">
      <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecionar..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function StatusPill({
  active,
  tone,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  tone: "success" | "destructive" | "muted";
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  const tones: Record<string, string> = {
    success: "border-success/40 bg-success/15 text-success shadow-[0_0_18px_oklch(0.7_0.18_150/0.4)]",
    destructive: "border-destructive/40 bg-destructive/15 text-destructive shadow-[0_0_18px_var(--destructive)]",
    muted: "border-muted-foreground/30 bg-muted/30 text-muted-foreground",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition ${
        active ? tones[tone] : "border-border bg-transparent text-muted-foreground hover:border-primary/30"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function RangeRow({ label, range, tone, hit }: { label: string; range: string; tone: string; hit: boolean }) {
  const map: Record<string, string> = {
    success: "bg-success/15 text-success border-success/30",
    primary: "bg-primary/15 text-primary border-primary/30",
    warning: "bg-warning/15 text-warning border-warning/30",
    destructive: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return (
    <div
      className={`flex items-center justify-between rounded-md border px-3 py-1.5 ${
        hit ? map[tone] : "border-border bg-muted/10 text-muted-foreground"
      }`}
    >
      <span className="font-medium">{label}</span>
      <span className="font-mono text-xs">{range}</span>
    </div>
  );
}
