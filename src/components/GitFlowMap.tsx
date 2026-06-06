import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Folder, Package, Database, Cloud, ArrowRight, ArrowLeft } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

interface CommandDetail {
  cmd: string;
  description: string;
  example: string;
}

interface FlowStage {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  commands: CommandDetail[];
  description: string;
  status: string;
}

interface ArrowPair {
  forward: { cmd: string; tooltip: string };
  backward: { cmd: string; tooltip: string };
}

const stages: FlowStage[] = [
  {
    id: "working",
    label: "Working Directory",
    sublabel: "Seus arquivos",
    icon: Folder,
    status: "modified",
    description: "Onde você edita seus arquivos. As alterações aqui ainda não são rastreadas pelo Git.",
    commands: [
      { cmd: "git status", description: "Mostra arquivos modificados", example: "git status" },
      { cmd: "git diff", description: "Exibe as diferenças ainda não staged", example: "git diff arquivo.txt" },
      { cmd: "git restore", description: "Descarta alterações no arquivo", example: "git restore arquivo.txt" },
    ],
  },
  {
    id: "staging",
    label: "Staging Area",
    sublabel: "Preparação",
    icon: Package,
    status: "staged",
    description: "Área intermediária onde você seleciona quais alterações farão parte do próximo commit.",
    commands: [
      { cmd: "git add .", description: "Adiciona todos os arquivos modificados", example: "git add ." },
      { cmd: "git add -p", description: "Adiciona partes específicas de um arquivo", example: "git add -p arquivo.txt" },
      { cmd: "git reset HEAD", description: "Remove arquivo do stage sem descartar", example: "git reset HEAD arquivo.txt" },
    ],
  },
  {
    id: "local",
    label: "Repositório Local",
    sublabel: "Histórico",
    icon: Database,
    status: "committed",
    description: "Seu histórico de commits local. Contém todos os snapshots do projeto.",
    commands: [
      { cmd: "git commit -m", description: "Salva o snapshot com uma mensagem", example: 'git commit -m "feat: nova feature"' },
      { cmd: "git log --oneline", description: "Exibe histórico resumido de commits", example: "git log --oneline" },
      { cmd: "git reset --soft HEAD~1", description: "Desfaz o último commit mantendo as mudanças", example: "git reset --soft HEAD~1" },
    ],
  },
  {
    id: "remote",
    label: "Repositório Remoto",
    sublabel: "GitHub / GitLab",
    icon: Cloud,
    status: "synced",
    description: "O repositório na nuvem (GitHub, GitLab, etc). Compartilhado com a equipe.",
    commands: [
      { cmd: "git push origin", description: "Envia commits para o remoto", example: "git push origin main" },
      { cmd: "git pull", description: "Baixa e integra mudanças do remoto", example: "git pull origin main" },
      { cmd: "git clone", description: "Copia um repositório remoto localmente", example: "git clone https://github.com/user/repo.git" },
    ],
  },
];

const arrowPairs: ArrowPair[] = [
  {
    forward: { cmd: "git add", tooltip: "Move arquivos do working directory para o stage" },
    backward: { cmd: "git restore", tooltip: "Remove arquivos do stage de volta ao working directory" },
  },
  {
    forward: { cmd: "git commit", tooltip: "Salva o snapshot dos arquivos staged no histórico local" },
    backward: { cmd: "git reset", tooltip: "Desfaz commits, movendo mudanças de volta ao stage" },
  },
  {
    forward: { cmd: "git push", tooltip: "Envia commits locais para o repositório remoto" },
    backward: { cmd: "git pull", tooltip: "Baixa e integra commits do remoto no local" },
  },
];

const statusColors: Record<string, string> = {
  modified: "text-yellow-400",
  staged: "text-blue-400",
  committed: "text-green-400",
  synced: "text-accent",
};

interface Props {
  compact?: boolean;
}

function ArrowConnector({ pair, compact }: { pair: ArrowPair; compact: boolean }) {
  const [tooltip, setTooltip] = useState<string | null>(null);

  if (compact) {
    return (
      <div className="flex md:hidden flex-col items-center">
        <span className="font-mono text-[10px] text-primary">{pair.forward.cmd}</span>
        <ArrowRight className="h-3.5 w-3.5 text-primary rotate-90" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center mx-1 my-2 md:my-0 relative">
      {/* Desktop */}
      <div className="hidden md:flex flex-col items-center gap-1">
        {/* Forward arrow */}
        <div
          className="flex items-center cursor-default"
          onMouseEnter={() => setTooltip(pair.forward.tooltip)}
          onMouseLeave={() => setTooltip(null)}
        >
          <div className="h-px w-6 bg-border" />
          <div className="flex flex-col items-center px-1">
            <span className="font-mono text-[10px] text-primary whitespace-nowrap">{pair.forward.cmd}</span>
            <ArrowRight className="h-3.5 w-3.5 text-primary mt-0.5" />
          </div>
          <div className="h-px w-6 bg-border" />
        </div>
        {/* Backward arrow */}
        <div
          className="flex items-center cursor-default opacity-50 hover:opacity-80 transition-opacity"
          onMouseEnter={() => setTooltip(pair.backward.tooltip)}
          onMouseLeave={() => setTooltip(null)}
        >
          <div className="h-px w-6 bg-border" />
          <div className="flex flex-col items-center px-1">
            <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground mb-0.5" />
            <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">{pair.backward.cmd}</span>
          </div>
          <div className="h-px w-6 bg-border" />
        </div>
        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute top-full mt-1 z-10 bg-popover border border-border rounded-md px-2 py-1 text-[10px] text-popover-foreground whitespace-nowrap shadow-md"
            >
              {tooltip}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Mobile */}
      <div className="flex md:hidden flex-col items-center">
        <span className="font-mono text-[10px] text-primary">{pair.forward.cmd}</span>
        <ArrowRight className="h-3.5 w-3.5 text-primary rotate-90" />
      </div>
    </div>
  );
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
                className={`flow-node flex flex-col items-center text-center cursor-pointer ${compact ? "p-3 min-w-[140px]" : "p-5 min-w-[180px]"} ${isActive ? "glow-md border-primary/60" : ""}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveStage(isActive ? null : stage.id)}
              >
                <Icon className={`${compact ? "h-5 w-5" : "h-7 w-7"} text-primary mb-2`} />
                <span className={`font-semibold ${compact ? "text-xs" : "text-sm"}`}>{stage.label}</span>
                <span className={`text-muted-foreground ${compact ? "text-[10px]" : "text-xs"} mt-0.5`}>{stage.sublabel}</span>
                {!compact && (
                  <span className={`font-mono text-[9px] mt-1.5 ${statusColors[stage.status]}`}>
                    ● {stage.status}
                  </span>
                )}
              </motion.div>

              {i < stages.length - 1 && (
                <ArrowConnector pair={arrowPairs[i]} compact={compact} />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {activeStage && (
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-5 mt-4 max-w-xl mx-auto"
          >
            {(() => {
              const s = stages.find((st) => st.id === activeStage)!;
              return (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-sm">{s.label}</h4>
                    <span className={`font-mono text-[9px] ${statusColors[s.status]}`}>● {s.status}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{s.description}</p>
                  <div className="flex flex-col gap-2">
                    {s.commands.map((c) => (
                      <div key={c.cmd} className="bg-secondary/50 rounded-md px-3 py-2">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-mono text-xs text-primary">{c.cmd}</span>
                          <CopyButton text={c.example} className="h-6 w-6" />
                        </div>
                        <p className="text-muted-foreground text-[11px]">{c.description}</p>
                        <code className="text-[10px] text-muted-foreground/70 font-mono">{c.example}</code>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {!compact && (
        <p className="text-center text-muted-foreground text-[11px] mt-6 opacity-60">
          Clique em um estágio para ver os comandos · Passe o mouse nas setas para entender o fluxo
        </p>
      )}
    </div>
  );
}
