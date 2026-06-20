import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Terminal, LayoutList, AlertTriangle, Layers, ArrowRight, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

const features = [
  { icon: Terminal, label: "Cmdlets", description: "Comandos essenciais de Linux com flags, exemplos e relações práticas", path: "/linux/commands" },
  { icon: Layers, label: "Cenários", description: "Situações reais de administração e troubleshooting no terminal", path: "/linux/scenarios" },
  { icon: LayoutList, label: "Cheat Sheet", description: "Referência rápida filtrável por categoria", path: "/linux/cheatsheet" },
  { icon: AlertTriangle, label: "Problemas", description: "Base reservada para problemas comuns de Linux", path: "/linux/problems" },
];

const highlights = [
  "ls", "grep -r", "find", "chmod", "systemctl", "tail -f", "curl", "ssh",
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function LinuxHome() {
  return (
    <div data-theme="linux" className="hero-gradient bg-grid">
      <SEO
        title="LinuxDoc Home"
        description="Referência visual de comandos Linux, cenários práticos de terminal, administração de processos, rede, permissões e arquivos."
        path="/linux"
      />
      <section className="container px-4 pt-20 pb-16 text-center">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-4">
            <Server className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Linux & Terminal</span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
          >
            <span className="gradient-text">Domine o Linux</span>
            <br />
            <span className="text-foreground">pelo terminal</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Comandos essenciais, cenários reais e referência rápida para navegar, buscar, automatizar e diagnosticar sistemas Linux.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            <Button asChild className="btn-glow">
              <Link to="/linux/commands">Ver Cmdlets</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/linux/scenarios">Ver Cenários</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

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
