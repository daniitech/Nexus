import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, FileDown, FileSpreadsheet, CheckCircle2, FileWarning } from "lucide-react";
import { downloadCSV, timestamp } from "@/lib/export";
import { toast } from "sonner";

type ExportKind = "monitorias" | "ranking" | "carteira" | "criticas";

const datasets: Record<ExportKind, { filename: string; rows: Record<string, unknown>[] }> = {
  monitorias: {
    filename: "monitorias_mes",
    rows: [
      { protocolo: "20260623-00481", operador: "André Castro", monitor: "Carla Mendes", carteira: "Banco Volt", score: 96, status: "Excelente" },
      { protocolo: "20260623-00478", operador: "Bruna Vidal", monitor: "Rafael Lima", carteira: "Lumen", score: 88, status: "Bom" },
      { protocolo: "20260623-00472", operador: "Júlia Bastos", monitor: "Juliana Prado", carteira: "Banco Volt", score: 54, status: "Crítico" },
      { protocolo: "20260623-00469", operador: "Caio Reis", monitor: "Carla Mendes", carteira: "Aurora", score: 91, status: "Excelente" },
      { protocolo: "20260623-00462", operador: "Diana Melo", monitor: "Thiago Souza", carteira: "Banco Volt", score: 82, status: "Bom" },
    ],
  },
  ranking: {
    filename: "ranking_operadores",
    rows: [
      { posicao: 1, operador: "André Castro", carteira: "Banco Volt", score_medio: 94.2, monitorias: 28 },
      { posicao: 2, operador: "Caio Reis", carteira: "Aurora", score_medio: 91.8, monitorias: 24 },
      { posicao: 3, operador: "Bruna Vidal", carteira: "Lumen", score_medio: 88.6, monitorias: 31 },
      { posicao: 4, operador: "Diana Melo", carteira: "Banco Volt", score_medio: 84.1, monitorias: 22 },
      { posicao: 5, operador: "Eduardo Salles", carteira: "Lumen", score_medio: 80.5, monitorias: 19 },
    ],
  },
  carteira: {
    filename: "score_por_carteira",
    rows: [
      { carteira: "Banco Volt", score_medio: 87.4, monitorias: 184, criticas: 6, conformidade_pct: 92.1 },
      { carteira: "Lumen", score_medio: 82.1, monitorias: 142, criticas: 9, conformidade_pct: 88.5 },
      { carteira: "Aurora", score_medio: 85.8, monitorias: 156, criticas: 4, conformidade_pct: 90.7 },
    ],
  },
  criticas: {
    filename: "auditorias_criticas",
    rows: [
      { protocolo: "20260623-00472", operador: "Júlia Bastos", monitor: "Juliana Prado", carteira: "Banco Volt", score: 54, falha: "Script regulatório" },
      { protocolo: "20260622-00441", operador: "Helena Tavares", monitor: "Carla Mendes", carteira: "Lumen", score: 48, falha: "LGPD - dados sensíveis" },
    ],
  },
};

export const Route = createFileRoute("/csv")({
  head: () => ({ meta: [{ title: "CSV · NEXUS" }] }),
  component: CSVPage,
});

const history = [
  { file: "monitorias_jun2026_w3.csv", rows: 482, status: "ok", date: "23/06 09:14" },
  { file: "operadores_abrlote.csv", rows: 64, status: "ok", date: "20/06 16:02" },
  { file: "carteiras_aurora.csv", rows: 18, status: "erro", date: "19/06 11:48" },
  { file: "monitorias_jun2026_w2.csv", rows: 511, status: "ok", date: "16/06 08:55" },
];

function CSVPage() {
  const [drag, setDrag] = useState(false);
  return (
    <PageShell
      title="Importar / Exportar CSV"
      subtitle="Movimente dados de monitorias, operadores e carteiras em lote."
    >
      <Tabs defaultValue="importar">
        <TabsList className="bg-card/60 border border-border">
          <TabsTrigger value="importar">Importar</TabsTrigger>
          <TabsTrigger value="exportar">Exportar</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="importar" className="mt-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
            }}
            data-laser-card
            className={`glow-card flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-10 text-center transition ${
              drag ? "border-primary bg-primary/5" : "border-border bg-card/30"
            }`}
          >
            <div className="grid h-16 w-16 place-items-center rounded-full border border-primary/40 bg-primary/10 text-primary shadow-[0_0_32px_var(--primary)]">
              <UploadCloud className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Solte o arquivo CSV aqui</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Aceitos: <span className="font-mono">.csv</span>, <span className="font-mono">.xlsx</span> · até 25 MB
              </p>
            </div>
            <Button className="gap-2 bg-primary text-primary-foreground shadow-[0_0_24px_var(--primary)]">
              <FileSpreadsheet className="h-4 w-4" /> Selecionar arquivo
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Hint title="Monitorias" desc="protocolo, operador, requisitos, score, observações" />
            <Hint title="Operadores" desc="id, nome, setor, carteira, status" />
            <Hint title="Carteiras" desc="código, descrição, produto, status" />
          </div>
        </TabsContent>

        <TabsContent value="exportar" className="mt-6 grid gap-4 md:grid-cols-2">
          <ExportCard kind="monitorias" label="Monitorias do mês" sub="CSV · histórico completo" />
          <ExportCard kind="ranking" label="Ranking de operadores" sub="CSV · com scores agregados" />
          <ExportCard kind="carteira" label="Score por carteira" sub="CSV · pivot de qualidade" />
          <ExportCard kind="criticas" label="Auditorias críticas" sub="CSV · apenas NC crítico" />
        </TabsContent>

        <TabsContent value="historico" className="mt-6">
          <div data-laser-card className="glow-card rounded-xl border border-border bg-card/40 p-2">
            <div className="divide-y divide-border">
              {history.map((h) => (
                <div key={h.file} className="flex items-center justify-between px-4 py-3 hover:bg-primary/5">
                  <div className="flex items-center gap-3">
                    {h.status === "ok" ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <FileWarning className="h-5 w-5 text-destructive" />
                    )}
                    <div>
                      <div className="font-mono text-sm">{h.file}</div>
                      <div className="text-xs text-muted-foreground">{h.date} · {h.rows} linhas</div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      h.status === "ok"
                        ? "border-success/40 bg-success/10 text-success"
                        : "border-destructive/40 bg-destructive/10 text-destructive"
                    }
                  >
                    {h.status === "ok" ? "Processado" : "Falha"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function Hint({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-primary">{title}</div>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

function ExportCard({ kind, label, sub }: { kind: ExportKind; label: string; sub: string }) {
  const handleDownload = () => {
    const ds = datasets[kind];
    downloadCSV(`nexus_${ds.filename}_${timestamp()}.csv`, ds.rows);
    toast.success(`Exportado: ${label} (${ds.rows.length} linhas)`);
  };
  return (
    <div data-laser-card className="glow-card flex items-center justify-between rounded-xl border border-border bg-card/40 p-5">
      <div>
        <div className="font-display font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <Button
        onClick={handleDownload}
        variant="outline"
        className="gap-2 border-primary/40 text-primary hover:bg-primary/10"
      >
        <FileDown className="h-4 w-4" /> Baixar
      </Button>
    </div>
  );
}
