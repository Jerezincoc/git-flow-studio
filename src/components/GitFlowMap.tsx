import { motion } from "framer-motion";
import { useState } from "react";
import { Folder, Package, Database, Cloud, ArrowRight } from "lucide-react";

interface FlowStage {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  commands: string[];
  description: string;
}

const stages: FlowStage[] = [
  {
    id: "working",
    label: "Working Directory",
    sublabel: "Seus arquivos",
    icon: Folder,
    commands: ["git add", "git checkout"],
    description: "Onde você edita seus arquivos. As alterações aqui ainda não são rastreadas pelo Git.",
  },
  {
    id: "staging",
    label: "Staging Area",
    sublabel: "Preparação",
    icon: Package,
    commands: ["git commit", "git reset"],
    description: "Área intermediária onde você seleciona quais alterações farão parte do próximo commit.",
  },
  {
    id: "local",
    label: "Repositório Local",
    sublabel: "Histórico",
    icon: Database,
    commands: ["git push", "git log"],
    description: "Seu histórico de commits local. Contém todos os snapshots do projeto.",
  },
  {
    id: "remote",
    label: "Repositório Remoto",
    sublabel: "GitHub / GitLab",
    icon: Cloud,
    commands: ["git pull", "git clone"],
    description: "O repositório na nuvem (GitHub, GitLab, etc). Compartilhado com a equipe.",
  },
];

const arrowCommands = ["git add", "git commit", "git push"];

interface Props {
  compact?: boolean;
}

export function GitFlowMap({ compact = false }: Props) {
  const [activeStage, setActiveStage] = useState<string | null>(null);

  return (
    <div className="w-full">
      <div className={`flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0 ${compact ? "" : "py-8"}`}>
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = activeStage === stage.id;
          return (
            <div key={stage.id} className="flex flex-col md:flex-row items-center">
              <motion.div
                className={`flow-node flex flex-col items-center text-center ${compact ? "p-3 min-w-[140px]" : "p-5 min-w-[180px]"} ${isActive ? "glow-md border-primary/60" : ""}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveStage(isActive ? null : stage.id)}
              >
                <Icon className={`${compact ? "h-5 w-5" : "h-7 w-7"} text-primary mb-2`} />
                <span className={`font-semibold ${compact ? "text-xs" : "text-sm"}`}>{stage.label}</span>
                <span className={`text-muted-foreground ${compact ? "text-[10px]" : "text-xs"} mt-0.5`}>{stage.sublabel}</span>
              </motion.div>

              {i < stages.length - 1 && (
                <div className="flex flex-col md:flex-row items-center mx-1 my-2 md:my-0">
                  <div className="hidden md:flex items-center">
                    <div className="h-px w-6 bg-border" />
                    <div className="flex flex-col items-center px-1">
                      <span className="font-mono text-[10px] text-primary whitespace-nowrap">{arrowCommands[i]}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-primary mt-0.5" />
                    </div>
                    <div className="h-px w-6 bg-border" />
                  </div>
                  <div className="flex md:hidden flex-col items-center">
                    <span className="font-mono text-[10px] text-primary">{arrowCommands[i]}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-primary rotate-90" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activeStage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="glass-card p-5 mt-4 max-w-lg mx-auto"
        >
          {(() => {
            const s = stages.find((st) => st.id === activeStage)!;
            return (
              <>
                <h4 className="font-semibold text-sm mb-2">{s.label}</h4>
                <p className="text-muted-foreground text-sm mb-3">{s.description}</p>
                <div className="flex flex-wrap gap-2">
                  {s.commands.map((c) => (
                    <span key={c} className="font-mono text-xs bg-secondary px-2.5 py-1 rounded-md text-primary">{c}</span>
                  ))}
                </div>
              </>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}
