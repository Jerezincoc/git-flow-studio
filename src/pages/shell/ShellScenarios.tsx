import { motion } from "framer-motion";
import { useState } from "react";
import { scenarios, scenarioDifficultyLabels } from "@/data/scenarios";
import { ScenarioCard } from "@/components/ScenarioCard";
import { SEO } from "@/components/SEO";

const difficulties = ["easy", "medium", "hard"] as const;

const filterOptions = [
  { value: "all", label: "Todos" },
  ...difficulties.map((d) => ({ value: d, label: scenarioDifficultyLabels[d] })),
];

export default function ShellScenarios() {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? scenarios : scenarios.filter((s) => s.difficulty === filter);

  return (
    <div data-theme="shell" className="container px-4 py-12 max-w-3xl">
      <SEO
        title="Cenários PowerShell"
        description="10 cenários práticos e completos de PowerShell — do básico ao avançado, com comandos prontos para copiar."
        path="/shell/scenarios"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Cenários Práticos</h1>
        <p className="text-muted-foreground mb-6">
          {scenarios.length} cenários do dia a dia com comandos prontos para copiar e adaptar.
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {filtered.map((scenario, i) => (
          <ScenarioCard key={scenario.id} scenario={scenario} index={i} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">Nenhum cenário encontrado.</p>
      )}
    </div>
  );
}
