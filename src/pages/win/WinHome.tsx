import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, LayoutList, Layers, MonitorCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

const features = [
  { icon: MonitorCog,   label: "Comandos",   description: "Comandos essenciais do Windows CMD com flags, exemplos e relações práticas", path: "/win/commands" },
  { icon: Layers,       label: "Cenários",   description: "Rotinas reais de suporte, rede, disco, serviços e automação no Windows", path: "/win/scenarios" },
  { icon: LayoutList,   label: "Cheat Sheet",description: "Referência rápida filtrável por categoria", path: "/win/cheatsheet" },
  { icon: AlertTriangle,label: "Problemas",  description: "Diagnósticos comuns de Windows com passos de correção", path: "/win/problems" },
];

const highlights = ["ipconfig", "netstat -ano", "tasklist", "sfc /scannow", "robocopy", "reg query", "sc query", "findstr /s"];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function WinHome() {
  return (
    <div data-theme="win" className="min-h-screen hero-gradient bg-grid">
      <SEO
        title="WinDoc Home"
        description="Referencia visual de comandos Windows, cenarios de CMD, suporte, rede, disco, Registro e administracao de servicos."
        path="/win"
      />
      <section className="container px-4 pt-20 pb-16 text-center">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            <span className="gradient-text">Domine o Windows</span>
            <br />
            <span className="text-foreground">pelo CMD</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Comandos essenciais, cenarios praticos e referencia rapida para diagnosticar rede, processos, servicos, disco e Registro.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            <Button asChild className="btn-glow">
              <Link to="/win/commands">Ver Comandos</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/win/scenarios">Ver Cenarios</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section className="container px-4 pb-12">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {highlights.map((cmd) => (
            <span key={cmd} className="font-mono text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg">
              {cmd}
            </span>
          ))}
        </motion.div>
      </section>

      <section className="container px-4 pb-20">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.path} variants={fadeUp}>
                <Link to={feature.path} className="glass-card flex flex-col gap-2 p-4 h-full hover:border-primary/40 transition-colors group">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">{feature.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
