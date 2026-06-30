// Client-side CSV export helpers
export function toCSV<T extends Record<string, unknown>>(
  rows: T[],
  headers?: { key: keyof T; label: string }[],
): string {
  if (rows.length === 0) return "";
  const cols =
    headers ?? (Object.keys(rows[0]) as (keyof T)[]).map((k) => ({ key: k, label: String(k) }));
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = cols.map((c) => escape(c.label)).join(";");
  const body = rows.map((r) => cols.map((c) => escape(r[c.key])).join(";")).join("\n");
  return `\ufeff${head}\n${body}`;
}

export function downloadCSV<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T; label: string }[],
) {
  const csv = toCSV(rows, headers);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function timestamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
}
