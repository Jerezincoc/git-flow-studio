import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { commands, categoryLabels } from "@/data/commands";
import { CopyButton } from "@/components/CopyButton";
import { Printer, ExternalLink } from "lucide-react";
import { useState } from "react";

const filterOptions = [
  { value: "all", label: "Todos" },
  ...Object.entries(categoryLabels).map(([value, label]) => ({ value, label })),
];

export default function CheatSheet() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? commands : commands.filter((c) => c.category === filter);

  const grouped = filterOptions
    .filter((o) => o.value !== "all")
    .map((o) => ({
      category: o.value,
      label: o.label,
      items: filtered.filter((c) => c.category === o.value),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="container px-4 py-12 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-2 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold">Cheat Sheet</h1>
            <p className="text-muted-foreground mt-1">Referência rápida de todos os comandos. Clique em qualquer um para ver detalhes.</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors print:hidden"
          >
            <Printer className="h-4 w-4" />
            Imprimir / Salvar PDF
          </button>
        </div>

        <SEO title="Git Cheat Sheet" description="Referência rápida de todos os 31 comandos Git organizados por categoria. Filtre, copie a sintaxe ou imprima como PDF." path="/cheatsheet" />

        {/* Filtros — scroll horizontal no mobile */}
        <div className="overflow-x-auto -mx-4 px-4 pb-1 print:hidden">
        <div className="flex gap-2 mb-8 w-max min-w-full">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        </div>

        {/* Tabela por categoria */}
        <div className="space-y-10">
          {grouped.map((group) => (
            <section key={group.category}>
              <h2 className="text-base font-semibold mb-3 text-primary border-b border-border/50 pb-2">
                {group.label}
              </h2>
              <div className="space-y-1">
                {group.items.map((cmd) => (
                  <div
                    key={cmd.id}
                    className="grid grid-cols-[auto_1fr_auto] gap-3 items-center px-3 py-2.5 rounded-lg hover:bg-secondary/40 transition-colors group"
                  >
                    <code className="font-mono text-sm text-primary font-semibold whitespace-nowrap">
                      {cmd.name}
                    </code>
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground truncate">{cmd.description}</p>
                      <code className="text-xs text-muted-foreground/70 font-mono">{cmd.syntax}</code>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                      <CopyButton text={cmd.syntax} />
                      <Link
                        to={`/commands/${cmd.id}`}
                        className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                        title="Ver detalhes"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-12 text-center print:hidden">
          {filtered.length} comandos · <Link to="/commands" className="hover:text-primary">Ver documentação completa →</Link>
        </p>
      </motion.div>

      <style>{`
        @media print {
          header, footer, nav { display: none !important; }
          .container { max-width: 100% !important; padding: 0 !important; }
          h1 { font-size: 1.5rem !important; }
          body { background: white !important; color: black !important; }
          code { background: #f4f4f4 !important; color: #333 !important; }
        }
      `}</style>
    </div>
  );
}
