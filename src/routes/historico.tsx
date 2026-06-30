import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, AlertTriangle, FileDown } from "lucide-react";
import { downloadCSV, timestamp } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/historico")({
  head: () => ({ meta: [{ title: "Histórico Geral · NEXUS" }] }),
  component: HistoricoPage,
});

const log = [
  { id: "20260623-00481", data: "23/06 14:21", operador: "André Castro", monitor: "Carla Mendes", carteira: "Banco Volt", score: 96, status: "Excelente", critico: false },
  { id: "20260623-00478", data: "23/06 13:48", operador: "Bruna Vidal", monitor: "Rafael Lima", carteira: "Lumen", score: 88, status: "Bom", critico: false },
  { id: "20260623-00472", data: "23/06 12:09", operador: "Júlia Bastos", monitor: "Juliana Prado", carteira: "Banco Volt", score: 54, status: "Crítico", critico: true },
  { id: "20260623-00469", data: "23/06 11:32", operador: "Caio Reis", monitor: "Carla Mendes", carteira: "Aurora", score: 91, status: "Excelente", critico: false },
  { id: "20260623-00462", data: "23/06 10:51", operador: "Diana Melo", monitor: "Thiago Souza", carteira: "Banco Volt", score: 82, status: "Bom", critico: false },
  { id: "20260623-00455", data: "23/06 10:14", operador: "Igor Pacheco", monitor: "Rafael Lima", carteira: "Aurora", score: 62, status: "Atenção", critico: false },
  { id: "20260623-00448", data: "23/06 09:33", operador: "Eduardo Salles", monitor: "Juliana Prado", carteira: "Lumen", score: 78, status: "Bom", critico: false },
  { id: "20260622-00441", data: "22/06 17:22", operador: "Helena Tavares", monitor: "Carla Mendes", carteira: "Lumen", score: 48, status: "Crítico", critico: true },
  { id: "20260622-00432", data: "22/06 16:05", operador: "Fernanda Rocha", monitor: "Thiago Souza", carteira: "Aurora", score: 73, status: "Atenção", critico: false },
  { id: "20260622-00428", data: "22/06 15:18", operador: "Gabriel Nunes", monitor: "Rafael Lima", carteira: "Banco Volt", score: 80, status: "Bom", critico: false },
];

function HistoricoPage() {
  const [q, setQ] = useState("");
  const filtered = log.filter((l) =>
    [l.id, l.operador, l.monitor, l.carteira, l.status].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  const exportar = () => {
    downloadCSV(
      `nexus_historico_${timestamp()}.csv`,
      filtered,
      [
        { key: "id", label: "Protocolo" },
        { key: "data", label: "Data" },
        { key: "operador", label: "Operador" },
        { key: "monitor", label: "Monitor" },
        { key: "carteira", label: "Carteira" },
        { key: "score", label: "Score" },
        { key: "status", label: "Status" },
        { key: "critico", label: "Crítico" },
      ],
    );
    toast.success(`Exportado: ${filtered.length} auditorias`);
  };

  return (
    <PageShell
      title="Histórico Geral"
      subtitle="Trilha completa de auditorias realizadas — com filtros, busca e acesso ao detalhe."
      actions={
        <Button onClick={exportar} className="gap-2 bg-primary text-primary-foreground shadow-[0_0_24px_var(--primary)]">
          <FileDown className="h-4 w-4" /> Exportar CSV
        </Button>
      }
    >
      <div data-laser-card className="glow-card rounded-xl border border-border bg-card/40 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar protocolo, operador, monitor..."
              className="pl-9"
            />
          </div>
          <Select>
            <SelectTrigger><SelectValue placeholder="Carteira" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas carteiras</SelectItem>
              <SelectItem value="volt">Banco Volt</SelectItem>
              <SelectItem value="lumen">Lumen</SelectItem>
              <SelectItem value="aurora">Aurora</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="ex">Excelente</SelectItem>
              <SelectItem value="bo">Bom</SelectItem>
              <SelectItem value="at">Atenção</SelectItem>
              <SelectItem value="cr">Crítico</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger><SelectValue placeholder="Período" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div data-laser-card className="glow-card mt-6 rounded-xl border border-border bg-card/40 p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Protocolo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Operador</TableHead>
              <TableHead>Monitor</TableHead>
              <TableHead>Carteira</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((l) => (
              <TableRow key={l.id} className="hover:bg-primary/5">
                <TableCell className="font-mono text-xs">
                  <div className="flex items-center gap-2">
                    {l.id}
                    {l.critico && (
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{l.data}</TableCell>
                <TableCell className="font-medium">{l.operador}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{l.monitor}</TableCell>
                <TableCell className="text-sm">{l.carteira}</TableCell>
                <TableCell className="text-right font-mono font-semibold text-primary">{l.score}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      l.status === "Excelente"
                        ? "border-success/40 bg-success/10 text-success"
                        : l.status === "Bom"
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : l.status === "Atenção"
                        ? "border-warning/40 bg-warning/10 text-warning"
                        : "border-destructive/40 bg-destructive/10 text-destructive"
                    }
                  >
                    {l.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" className="gap-1.5 text-xs hover:text-primary">
                    <Eye className="h-3.5 w-3.5" /> Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageShell>
  );
}
