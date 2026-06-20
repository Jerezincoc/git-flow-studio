import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Printer } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { SEO } from "@/components/SEO";
import { winCommands, winCategoryLabels } from "@/data/winCommands";

const filterOptions = [
  { value: "all", label: "Todos" },
  ...Object.entries(winCategoryLabels).map(([value, label]) => ({ value, label })),
];

export default function WinCheatSheet() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? winCommands : winCommands.filter((command) => command.category === filter);
  const grouped = Object.entries(winCategoryLabels)
    .map(([category, label]) => ({ category, label, items: filtered.filter((command) => command.category === category) }))
    .filter((group) => group.items.length > 0);

  return (
    <div data-theme="win" className="container px-4 py-12 max-w-5xl">
      <SEO title="WinDoc Cheat Sheet" description="Referencia rapida de comandos Windows CMD organizados por categoria, com sintaxe e copia rapida." path="/win/cheatsheet" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-2 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold">Cheat Sheet</h1>
            <p className="text-muted-foreground mt-1">Referencia rapida de comandos Windows. Filtre por categoria e copie a sintaxe.</p>
          </div>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors print:hidden">
            <Printer className="h-4 w-4" />
            Imprimir / Salvar PDF
          </button>
        </div>

        <div className="overflow-x-auto -mx-4 px-4 pb-1 print:hidden">
          <div className="flex gap-2 mb-8 w-max min-w-full">
            {filterOptions.map((option) => (
              <button key={option.value} onClick={() => setFilter(option.value)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === option.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          {grouped.map((group) => (
            <section key={group.category}>
              <h2 className="text-base font-semibold mb-3 text-primary border-b border-border/50 pb-2">{group.label}</h2>
              <div className="space-y-1">
                {group.items.map((command) => (
                  <div key={command.id} className="grid grid-cols-[auto_1fr_auto] gap-3 items-center px-3 py-2.5 rounded-lg hover:bg-secondary/40 transition-colors group">
                    <code className="font-mono text-sm text-primary font-semibold whitespace-nowrap">{command.name}</code>
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground truncate">{command.description}</p>
                      <code className="text-xs text-muted-foreground/60 font-mono">{command.syntax}</code>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                      <CopyButton text={command.syntax} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-12 text-center print:hidden">
          {filtered.length} comandos - <Link to="/win/commands" className="hover:text-primary">Ver documentacao completa</Link>
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
