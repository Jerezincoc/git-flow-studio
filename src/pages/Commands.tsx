import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { commands, categoryLabels, levelLabels } from "@/data/commands";
import { useState } from "react";
import { Star } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const filterOptions = [
  { value: "all", label: "Todos" },
  { value: "favorites", label: "⭐ Favoritos" },
  ...Object.entries(categoryLabels).map(([value, label]) => ({ value, label })),
];

const levelOptions = [
  { value: "all", label: "Todos os níveis" },
  ...Object.entries(levelLabels).map(([value, label]) => ({ value, label })),
];

const categories = Object.keys(categoryLabels);
const levels = Object.keys(levelLabels);

export default function Commands() {
  const [filter, setFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [favorites, setFavorites] = useLocalStorage<string[]>("git-doc-favorites", []);

  const filtered = commands
    .filter((c) => {
      if (filter === "favorites") return favorites.includes(c.id);
      if (filter !== "all") return c.category === filter;
      return true;
    })
    .filter((c) => levelFilter === "all" || c.level === levelFilter);

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  return (
    <div className="container px-4 py-12">
      <SEO title="Comandos Git" description="Referência completa de 31 comandos Git com flags, variações, exemplos práticos e curiosidades. Filtre por categoria e copie direto da página." path="/commands" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Comandos Git</h1>
        <p className="text-muted-foreground mb-6">Documentação completa e interativa de cada comando.</p>
      </motion.div>

      {/* Mobile: dropdowns */}
      <div className="sm:hidden mb-6 flex flex-col gap-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {levelOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Desktop: botões */}
      <div className="hidden sm:flex flex-col gap-2 mb-8">
        <div className="flex flex-wrap gap-2">
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
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setLevelFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${levelFilter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            Todos os níveis
          </button>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${levelFilter === lvl ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
              {levelLabels[lvl]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cmd, i) => (
          <motion.div
            key={cmd.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/commands/${cmd.id}`}
              className="glass-card p-5 block h-full hover:border-primary/40 transition-all hover:glow-sm group"
            >
              <div className="flex items-start justify-between mb-2">
                <code className="text-primary font-mono font-semibold">{cmd.name}</code>
                <button onClick={(e) => toggleFav(cmd.id, e)} className="text-muted-foreground hover:text-primary transition-colors">
                  <Star className={`h-4 w-4 ${favorites.includes(cmd.id) ? "fill-primary text-primary" : ""}`} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{cmd.description}</p>
              <span className="text-xs bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground">{categoryLabels[cmd.category]}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">Nenhum comando encontrado.</p>
      )}
    </div>
  );
}
