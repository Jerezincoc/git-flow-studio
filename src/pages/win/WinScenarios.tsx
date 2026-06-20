import { motion } from "framer-motion";
import { useState } from "react";
import { ScenarioCard } from "@/components/ScenarioCard";
import { SEO } from "@/components/SEO";
import { winScenarios, winScenarioDifficultyLabels } from "@/data/winScenarios";

const difficulties = ["easy", "medium", "hard"] as const;
const filterOptions = [
  { value: "all", label: "Todos" },
  ...difficulties.map((difficulty) => ({ value: difficulty, label: winScenarioDifficultyLabels[difficulty] })),
];

export default function WinScenarios() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? winScenarios : winScenarios.filter((scenario) => scenario.difficulty === filter);

  return (
    <div data-theme="win" className="container px-4 py-12 max-w-3xl">
      <SEO title="Cenarios Windows" description="10 cenarios praticos de Windows CMD com comandos prontos para copiar, anatomia e contexto de uso." path="/win/scenarios" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Cenarios Praticos</h1>
        <p className="text-muted-foreground mb-6">{winScenarios.length} cenarios para rede, processos, backup, servicos, Registro e automacao.</p>
      </motion.div>

      <div className="sm:hidden mb-6">
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary">
          {filterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>

      <div className="hidden sm:flex flex-wrap gap-2 mb-8">
        {filterOptions.map((option) => (
          <button key={option.value} onClick={() => setFilter(option.value)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === option.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
            {option.label}
          </button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3">
        {filtered.map((scenario, index) => <ScenarioCard key={scenario.id} scenario={scenario} index={index} />)}
      </motion.div>

      {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">Nenhum cenario encontrado.</p>}
    </div>
  );
}
