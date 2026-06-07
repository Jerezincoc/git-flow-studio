import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { getProblemById } from "@/data/problems";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const problem = getProblemById(id || "");

  if (!problem) {
    return (
      <div className="container px-4 py-20 text-center">
        <p className="text-muted-foreground">Problema não encontrado.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/problems">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-10 max-w-3xl">
      <SEO
        title={`${problem.title} — Como resolver`}
        description={`${problem.description} Veja o passo a passo completo para resolver esse problema no Git.`}
        path={`/problems/${problem.id}`}
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/problems" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar aos problemas
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{problem.emoji}</span>
          <h1 className="text-3xl font-bold">{problem.title}</h1>
        </div>
        <p className="text-muted-foreground mb-8">{problem.description}</p>

        <h2 className="text-lg font-semibold mb-4">Passo a passo</h2>
        <div className="space-y-4">
          {problem.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  {step.command && (
                    <div className="flex items-center gap-2">
                      <pre className="code-block flex-1 whitespace-pre-wrap overflow-x-auto text-xs">{step.command}</pre>
                      <CopyButton text={step.command} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5 mt-8 border-accent/30"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-1">Resultado esperado</h3>
              <p className="text-sm text-muted-foreground">{problem.expectedResult}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
