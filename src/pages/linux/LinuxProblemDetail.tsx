import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, Lightbulb, ShieldCheck } from "lucide-react";
import { getLinuxProblemById, linuxProblemCategoryLabels } from "@/data/linuxProblems";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";

const difficultyLabel = { easy: "Fácil", medium: "Médio", hard: "Difícil" };
const difficultyColor = {
  easy: "text-green-400 bg-green-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  hard: "text-red-400 bg-red-400/10",
};

export default function LinuxProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const problem = getLinuxProblemById(id ?? "");

  if (!problem) {
    return (
      <div className="container px-4 py-20 text-center">
        <p className="text-muted-foreground">Problema não encontrado.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/linux/problems">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div data-theme="linux" className="container px-4 py-10 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to="/linux/problems"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar aos problemas
        </Link>

        <div className="flex items-start gap-3 flex-wrap mb-2">
          <h1 className="text-2xl font-bold flex-1">{problem.title}</h1>
          <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${difficultyColor[problem.difficulty]}`}>
            {difficultyLabel[problem.difficulty]}
          </span>
        </div>
        <span className="text-xs bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground">
          {linuxProblemCategoryLabels[problem.category]}
        </span>

        {/* Sintoma */}
        <div className="mt-8 glass-card p-4 flex gap-3 border-destructive/20">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-destructive mb-1">Sintoma</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{problem.symptom}</p>
          </div>
        </div>

        {/* Causa */}
        <div className="mt-4 glass-card p-4 flex gap-3">
          <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-primary mb-1">Causa</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{problem.cause}</p>
          </div>
        </div>

        {/* Solução passo a passo */}
        <div className="mt-8">
          <h2 className="text-base font-semibold mb-4">Solução passo a passo</h2>
          <div className="space-y-4">
            {problem.steps.map((step, i) => (
              <div key={i} className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{step.description}</p>
                {step.code && (
                  <div className="flex items-start gap-2">
                    <pre className="code-block flex-1 text-xs whitespace-pre-wrap overflow-x-auto">{step.code}</pre>
                    <CopyButton text={step.code} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Prevenção */}
        {problem.prevention && (
          <div className="mt-6 glass-card p-4 flex gap-3 border-primary/20">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-primary mb-1">Prevenção</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{problem.prevention}</p>
            </div>
          </div>
        )}

        {/* Comandos relacionados */}
        {problem.relatedCommands.length > 0 && (
          <div className="mt-8">
            <h2 className="text-base font-semibold mb-3">Comandos relacionados</h2>
            <div className="flex flex-wrap gap-2">
              {problem.relatedCommands.map((cmd) => (
                <Link
                  key={cmd}
                  to={`/linux/commands/${cmd}`}
                  className="font-mono text-sm bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-lg text-primary transition-colors"
                >
                  {cmd}
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
