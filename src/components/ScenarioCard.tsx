import { useState } from "react";
import { ChevronDown, ChevronUp, Tag, FlaskConical } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import type { Scenario } from "@/data/scenarios";
import { scenarioDifficultyLabels } from "@/data/scenarios";

const difficultyColor: Record<string, string> = {
  easy:   "text-green-400 bg-green-400/10 border-green-400/20",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  hard:   "text-red-400 bg-red-400/10 border-red-400/20",
};

interface Props {
  scenario: Scenario;
  index: number;
}

export function ScenarioCard({ scenario, index }: Props) {
  const [open, setOpen] = useState(false);
  const [anatomyOpen, setAnatomyOpen] = useState(false);
  const codeBlock = scenario.commands.join("\n");

  return (
    <div className="glass-card overflow-hidden">
      {/* Header — sempre visível, clicável para expandir */}
      <button
        className="w-full text-left p-5 flex items-start gap-4 hover:bg-primary/5 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-2xl font-mono font-bold text-primary/30 select-none w-7 shrink-0 mt-0.5">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-sm">{scenario.title}</h3>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-md border ${difficultyColor[scenario.difficulty]}`}
            >
              {scenarioDifficultyLabels[scenario.difficulty]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{scenario.goal}</p>
        </div>

        <span className="shrink-0 text-muted-foreground mt-0.5">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {/* Corpo expandido */}
      {open && (
        <div className="border-t border-border/50 px-5 pb-5 pt-4 space-y-4">
          {/* Bloco de comandos */}
          <div className="relative">
            <pre className="bg-black/40 rounded-lg p-4 text-xs font-mono text-green-300 overflow-x-auto leading-relaxed whitespace-pre">
              {codeBlock}
            </pre>
            <div className="absolute top-2 right-2">
              <CopyButton text={codeBlock} />
            </div>
          </div>

          {/* Anatomy — toggle separado */}
          {scenario.anatomy && scenario.anatomy.length > 0 && (
            <div>
              <button
                onClick={() => setAnatomyOpen((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
              >
                <FlaskConical className="h-3.5 w-3.5 text-primary/60 group-hover:text-primary transition-colors" />
                <span>Entendendo o comando</span>
                {anatomyOpen
                  ? <ChevronUp className="h-3 w-3 ml-0.5" />
                  : <ChevronDown className="h-3 w-3 ml-0.5" />}
              </button>

              {anatomyOpen && (
                <div className="mt-3 space-y-2 border-l-2 border-primary/20 pl-4">
                  {scenario.anatomy.map((item, i) => (
                    <div key={i} className="flex items-baseline gap-2 text-xs leading-relaxed">
                      <code className="font-mono text-primary/90 bg-primary/8 px-1.5 py-0.5 rounded shrink-0">
                        {item.part}
                      </code>
                      <span className="text-muted-foreground shrink-0">→</span>
                      <span className="text-foreground/80">{item.explanation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
            {scenario.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
