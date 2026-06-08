import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Star } from "lucide-react";
import { shellCommands, shellCategoryLabels } from "@/data/shellCommands";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const categories = Object.keys(shellCategoryLabels);

const filterOptions = [
  { value: "all",       label: "Todos" },
  { value: "favorites", label: "⭐ Favoritos" },
  ...Object.entries(shellCategoryLabels).map(([value, label]) => ({ value, label })),
];

export default function ShellCommands() {
  const [filter, setFilter] = useState("all");
  const [favorites, setFavorites] = useLocalStorage<string[]>("shell-doc-favorites", []);

  const filtered =
    filter === "all"       ? shellCommands :
    filter === "favorites" ? shellCommands.filter((c) => favorites.includes(c.id)) :
                             shellCommands.filter((c) => c.category === filter);

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <div data-theme="shell" className="container px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Cmdlets PowerShell</h1>
        <p className="text-muted-foreground mb-6">
          {shellCommands.length} cmdlets documentados com flags, variações e exemplos práticos.
        </p>
      </motion.div>

      {/* Mobile: dropdown */}
      <div className="sm:hidden mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Desktop: botões */}
      <div className="hidden sm:flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter("favorites")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${filter === "favorites" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
        >
          <Star className="h-3 w-3" /> Favoritos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            {shellCategoryLabels[cat]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cmd, i) => (
          <motion.div
            key={cmd.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.3) }}
          >
            <Link
              to={`/shell/commands/${cmd.id}`}
              className="glass-card p-5 block h-full hover:border-primary/40 transition-all hover:glow-sm group"
            >
              <div className="flex items-start justify-between mb-2">
                <code className="text-primary font-mono font-semibold">{cmd.name}</code>
                <button onClick={(e) => toggleFav(cmd.id, e)} className="text-muted-foreground hover:text-primary transition-colors">
                  <Star className={`h-4 w-4 ${favorites.includes(cmd.id) ? "fill-primary text-primary" : ""}`} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{cmd.description}</p>
              <span className="text-xs bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground">
                {shellCategoryLabels[cmd.category]}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">Nenhum cmdlet encontrado.</p>
      )}
    </div>
  );
}
