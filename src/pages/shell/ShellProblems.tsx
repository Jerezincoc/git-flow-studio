import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { shellProblems, shellProblemCategoryLabels } from "@/data/shellProblems";

const filterOptions = [
  { value: "all", label: "Todos" },
  ...Object.entries(shellProblemCategoryLabels).map(([value, label]) => ({ value, label })),
];

const difficultyLabel = { easy: "Fácil", medium: "Médio", hard: "Difícil" };
const difficultyColor = {
  easy: "text-green-400 bg-green-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  hard: "text-red-400 bg-red-400/10",
};

export default function ShellProblems() {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? shellProblems : shellProblems.filter((p) => p.category === filter);

  return (
    <div data-theme="shell" className="container px-4 py-12 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Problemas Comuns</h1>
        <p className="text-muted-foreground mb-6">
          {shellProblems.length} problemas documentados com causa, solução passo a passo e prevenção.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((problem, i) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.05, 0.3) }}
          >
            <Link
              to={`/shell/problems/${problem.id}`}
              className="glass-card p-5 block h-full hover:border-primary/40 transition-all hover:glow-sm group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                  {problem.title}
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 font-medium ${difficultyColor[problem.difficulty]}`}>
                  {difficultyLabel[problem.difficulty]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                {problem.symptom}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground">
                  {shellProblemCategoryLabels[problem.category]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {problem.steps.length} passos
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">Nenhum problema encontrado.</p>
      )}
    </div>
  );
}
