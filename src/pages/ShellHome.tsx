import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Terminal, BookOpen, LayoutList, AlertTriangle, Layers, ArrowRight, Zap, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

const features = [
  { icon: BookOpen, label: "Guia", description: "Aprenda PowerShell do zero — shell, pipeline, objetos e scripts", path: "/shell/guide" },
  { icon: Terminal, label: "Cmdlets", description: "Referência completa com flags, exemplos e dicas práticas", path: "/shell/commands" },
  { icon: Layers, label: "Cenários", description: "10 situações do dia a dia com pipelines prontos para copiar e adaptar", path: "/shell/scenarios" },
  { icon: LayoutList, label: "Cheat Sheet", description: "Todos os cmdlets em uma página, filtrável por categoria", path: "/shell/cheatsheet" },
  { icon: AlertTriangle, label: "Problemas", description: "Soluções para os erros e situações mais comuns no PowerShell", path: "/shell/problems" },
  { icon: BookMarked, label: "Convenções", description: "Boas práticas: Verb-Noun, parâmetros, erros, output e documentação", path: "/shell/conventions" },
];

const highlights = [
  "Get-ChildItem", "Select-Object", "Where-Object", "ForEach-Object",
  "Invoke-WebRequest", "Get-Process", "Set-Content", "ConvertTo-Json",
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function ShellHome() {
  return (
    <div data-theme="shell" className="hero-gradient bg-grid">
      <SEO
        title="ShellDoc Home"
        description="Aprenda PowerShell e comandos Windows com referencia visual de cmdlets, flags, exemplos reais e solucoes para erros comuns."
        path="/shell"
      />
      {/* Hero */}
      <section className="container px-4 pt-20 pb-16 text-center">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">PowerShell & Windows</span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
          >
            <span className="gradient-text">Domine o Shell</span>
            <br />
            <span className="text-foreground">sem decorar nada</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Referência visual e interativa de cmdlets PowerShell e comandos Windows —
            com flags, exemplos reais e soluções para os erros mais comuns.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            <Button asChild className="btn-glow">
              <Link to="/shell/commands">Ver Cmdlets</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/shell/guide">Começar o Guia</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Cmdlets em destaque */}
      <section className="container px-4 pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto"
        >
          {highlights.map((cmd) => (
            <span
              key={cmd}
              className="font-mono text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg"
            >
              {cmd}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="container px-4 pb-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto"
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.path} variants={fadeUp}>
                <Link
                  to={f.path}
                  className="glass-card flex flex-col gap-2 p-4 h-full hover:border-primary/40 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">{f.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
