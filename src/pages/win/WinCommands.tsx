import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { winCommands, winCategoryLabels, winLevelLabels } from "@/data/winCommands";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SEO } from "@/components/SEO";

const levels = Object.keys(winLevelLabels);
const filterOptions = [
  { value: "all", label: "Todos" },
  { value: "favorites", label: "Favoritos" },
  ...Object.entries(winCategoryLabels).map(([value, label]) => ({ value, label })),
];
const levelOptions = [
  { value: "all", label: "Todos os niveis" },
  ...Object.entries(winLevelLabels).map(([value, label]) => ({ value, label })),
];

export default function WinCommands() {
  const [filter, setFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [favorites, setFavorites] = useLocalStorage<string[]>("win-doc-favorites", []);

  const filtered = winCommands
    .filter((command) => {
      if (filter === "favorites") return favorites.includes(command.id);
      if (filter !== "all") return command.category === filter;
      return true;
    })
    .filter((command) => levelFilter === "all" || command.level === levelFilter);

  const toggleFav = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setFavorites((prev) => prev.includes(id) ? prev.filter((favorite) => favorite !== id) : [...prev, id]);
  };

  return (
    <div data-theme="win" className="container px-4 py-12">
      <SEO title="Comandos Windows" description="Referencia completa de comandos Windows CMD essenciais com flags, exemplos praticos, categorias e favoritos." path="/win/commands" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Comandos Windows</h1>
        <p className="text-muted-foreground mb-6">{winCommands.length} comandos essenciais para CMD, rede, sistema, Registro e disco.</p>
      </motion.div>

      <div className="sm:hidden mb-6 flex flex-col gap-2">
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary">
          {filterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <select value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)} className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary">
          {levelOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>

      <div className="hidden sm:flex flex-col gap-2 mb-8">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button key={option.value} onClick={() => setFilter(option.value)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === option.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
              {option.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setLevelFilter("all")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${levelFilter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
            Todos os niveis
          </button>
          {levels.map((level) => (
            <button key={level} onClick={() => setLevelFilter(level)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${levelFilter === level ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
              {winLevelLabels[level]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((command, index) => (
          <motion.div key={command.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.04, 0.3) }}>
            <Link to={`/win/commands/${command.id}`} className="glass-card p-5 block h-full hover:border-primary/40 transition-all hover:glow-sm group">
              <div className="flex items-start justify-between mb-2">
                <code className="text-primary font-mono font-semibold">{command.name}</code>
                <button onClick={(event) => toggleFav(command.id, event)} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Alternar favorito">
                  <Star className={`h-4 w-4 ${favorites.includes(command.id) ? "fill-primary text-primary" : ""}`} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{command.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground">{winCategoryLabels[command.category]}</span>
                <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-md text-primary">{winLevelLabels[command.level]}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">Nenhum comando encontrado.</p>}
    </div>
  );
}
