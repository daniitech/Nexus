import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Building2, Users, Briefcase, ListChecks } from "lucide-react";

export const Route = createFileRoute("/cadastro")({
  head: () => ({ meta: [{ title: "Cadastro Estrutural · NEXUS" }] }),
  component: CadastroPage,
});

type Row = { id: string; nome: string; meta?: string; status: "ativo" | "inativo" };

const seedMonitores: Row[] = [
  { id: "M001", nome: "Carla Mendes", meta: "Coordenação Cobrança", status: "ativo" },
  { id: "M002", nome: "Rafael Lima", meta: "Sup. Negociação", status: "ativo" },
  { id: "M003", nome: "Juliana Prado", meta: "Qualidade Pleno", status: "ativo" },
  { id: "M004", nome: "Thiago Souza", meta: "Qualidade Júnior", status: "inativo" },
];
const seedSetores: Row[] = [
  { id: "S01", nome: "Cobrança Ativa", meta: "Turno Manhã", status: "ativo" },
  { id: "S02", nome: "Cobrança Receptiva", meta: "Turno Tarde", status: "ativo" },
  { id: "S03", nome: "Negociação Especial", meta: "Integral", status: "ativo" },
];
const seedCarteiras: Row[] = [
  { id: "C01", nome: "Banco Volt", meta: "Cartão", status: "ativo" },
  { id: "C02", nome: "Banco Volt", meta: "Empréstimo", status: "ativo" },
  { id: "C03", nome: "Lumen Telecom", meta: "Pós-pago", status: "ativo" },
  { id: "C04", nome: "Aurora Crédito", meta: "Crediário", status: "inativo" },
];
const seedReq: Row[] = [
  { id: "R01", nome: "Saudação completa", meta: "Peso 5 · Crítico", status: "ativo" },
  { id: "R02", nome: "Sondagem da real situação", meta: "Peso 10", status: "ativo" },
  { id: "R03", nome: "Oferta da melhor proposta", meta: "Peso 15", status: "ativo" },
  { id: "R04", nome: "Confirmação de acordo", meta: "Peso 10 · Crítico", status: "ativo" },
  { id: "R05", nome: "Encerramento cordial", meta: "Peso 5", status: "ativo" },
];

function CadastroPage() {
  return (
    <PageShell
      title="Cadastro Estrutural"
      subtitle="Monitores, setores, carteiras e requisitos avaliados pelo NEXUS."
    >
      <Tabs defaultValue="monitores" className="w-full">
        <TabsList className="bg-card/60 backdrop-blur border border-border">
          <TabsTrigger value="monitores" className="gap-2">
            <Users className="h-4 w-4" /> Monitores
          </TabsTrigger>
          <TabsTrigger value="setores" className="gap-2">
            <Building2 className="h-4 w-4" /> Setores
          </TabsTrigger>
          <TabsTrigger value="carteiras" className="gap-2">
            <Briefcase className="h-4 w-4" /> Carteiras
          </TabsTrigger>
          <TabsTrigger value="requisitos" className="gap-2">
            <ListChecks className="h-4 w-4" /> Requisitos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitores">
          <CrudPanel label="Monitor" rows={seedMonitores} metaLabel="Cargo" />
        </TabsContent>
        <TabsContent value="setores">
          <CrudPanel label="Setor" rows={seedSetores} metaLabel="Turno" />
        </TabsContent>
        <TabsContent value="carteiras">
          <CrudPanel label="Carteira" rows={seedCarteiras} metaLabel="Produto" />
        </TabsContent>
        <TabsContent value="requisitos">
          <CrudPanel label="Requisito" rows={seedReq} metaLabel="Peso / Tipo" />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

function CrudPanel({
  label,
  rows,
  metaLabel,
}: {
  label: string;
  rows: Row[];
  metaLabel: string;
}) {
  const [list, setList] = useState(rows);
  const [nome, setNome] = useState("");
  const [meta, setMeta] = useState("");
  const [status, setStatus] = useState<"ativo" | "inativo">("ativo");

  const add = () => {
    if (!nome.trim()) return;
    setList([
      { id: `${label[0]}${String(list.length + 1).padStart(3, "0")}`, nome, meta, status },
      ...list,
    ]);
    setNome("");
    setMeta("");
  };

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_2fr]">
      <div
        data-laser-card
        className="glow-card flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-5"
      >
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Novo {label}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Adicione um novo registro à base estrutural.
          </p>
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider">Nome</Label>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder={`Nome do ${label.toLowerCase()}`}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider">{metaLabel}</Label>
          <Input value={meta} onChange={(e) => setMeta(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as "ativo" | "inativo")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={add} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_var(--primary)]">
          <Plus className="h-4 w-4" /> Cadastrar
        </Button>
      </div>

      <div className="glow-card rounded-xl border border-border bg-card/40 p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90px]">ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>{metaLabel}</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((r) => (
              <TableRow key={r.id} className="hover:bg-primary/5">
                <TableCell className="font-mono text-xs text-muted-foreground">{r.id}</TableCell>
                <TableCell className="font-medium">{r.nome}</TableCell>
                <TableCell className="text-muted-foreground">{r.meta}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      r.status === "ativo"
                        ? "border-success/40 bg-success/10 text-success"
                        : "border-muted text-muted-foreground"
                    }
                  >
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:text-destructive"
                    onClick={() => setList(list.filter((x) => x.id !== r.id))}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
