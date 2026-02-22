import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FolderPlus, Save, Upload, GitBranch, Undo, Wrench, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GitFlowMap } from "@/components/GitFlowMap";
import { CopyButton } from "@/components/CopyButton";
import { useState } from "react";

interface Objective {
  icon: React.ElementType;
  title: string;
  description: string;
  steps: { text: string; command?: string }[];
  link?: string;
}

const objectives: Objective[] = [
  {
    icon: FolderPlus,
    title: "Iniciar um repositório",
    description: "Começar a usar Git em um projeto",
    steps: [
      { text: "Navegue até a pasta do projeto", command: "cd meu-projeto" },
      { text: "Inicialize o repositório", command: "git init" },
      { text: "Adicione os arquivos", command: "git add ." },
      { text: "Faça o primeiro commit", command: 'git commit -m "primeiro commit"' },
    ],
  },
  {
    icon: Save,
    title: "Salvar alterações",
    description: "Registrar mudanças no histórico",
    steps: [
      { text: "Veja o que mudou", command: "git status" },
      { text: "Adicione ao staging", command: "git add ." },
      { text: "Faça o commit", command: 'git commit -m "sua mensagem"' },
    ],
  },
  {
    icon: Upload,
    title: "Enviar para o GitHub",
    description: "Publicar código no repositório remoto",
    steps: [
      { text: "Adicione o remote", command: "git remote add origin <url>" },
      { text: "Envie para o remoto", command: "git push -u origin main" },
    ],
  },
  {
    icon: GitBranch,
    title: "Trabalhar com branches",
    description: "Criar linhas paralelas de desenvolvimento",
    steps: [
      { text: "Crie uma branch", command: "git checkout -b minha-feature" },
      { text: "Trabalhe e faça commits normalmente" },
      { text: "Volte para main", command: "git checkout main" },
      { text: "Integre a branch", command: "git merge minha-feature" },
    ],
  },
  {
    icon: Undo,
    title: "Desfazer algo",
    description: "Reverter alterações ou commits",
    steps: [
      { text: "Desfazer alterações em arquivo", command: "git checkout -- arquivo.txt" },
      { text: "Remover do staging", command: "git reset HEAD arquivo.txt" },
      { text: "Desfazer último commit", command: "git reset --soft HEAD~1" },
    ],
  },
  {
    icon: Wrench,
    title: "Resolver problemas",
    description: "Soluções para situações comuns",
    link: "/problems",
    steps: [],
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Index() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="hero-gradient bg-grid">
      {/* Hero */}
      <section className="container px-4 pt-20 pb-16 text-center">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
          >
            <span className="gradient-text">Git Visual Doc</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            Interactive Edition
          </motion.p>
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground max-w-xl mx-auto mb-8">
            Aprenda Git de forma visual e interativa — sem ler documentação chata.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            <Button asChild className="btn-glow">
              <Link to="/guide">Começar o Guia</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/commands">Ver Comandos</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Objectives */}
      <section className="container px-4 pb-16">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center mb-8"
        >
          O que você quer fazer?
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          {objectives.map((obj, i) => {
            const Icon = obj.icon;
            const isExpanded = expandedIdx === i;
            const hasSteps = obj.steps.length > 0;

            return (
              <motion.div key={i} variants={fadeUp}>
                {obj.link && !hasSteps ? (
                  <Link to={obj.link} className="objective-card block h-full">
                    <Icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">{obj.title}</h3>
                    <p className="text-sm text-muted-foreground">{obj.description}</p>
                    <ArrowRight className="h-4 w-4 text-primary mt-3" />
                  </Link>
                ) : (
                  <div
                    className="objective-card"
                    onClick={() => setExpandedIdx(isExpanded ? null : i)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <Icon className="h-8 w-8 text-primary mb-3" />
                        <h3 className="font-semibold mb-1">{obj.title}</h3>
                        <p className="text-sm text-muted-foreground">{obj.description}</p>
                      </div>
                      {hasSteps && (
                        isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground mt-1" /> : <ChevronDown className="h-4 w-4 text-muted-foreground mt-1" />
                      )}
                    </div>
                    {isExpanded && hasSteps && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 space-y-2"
                      >
                        {obj.steps.map((step, si) => (
                          <div key={si} className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-mono mt-0.5">
                              {si + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm">{step.text}</p>
                              {step.command && (
                                <div className="flex items-center gap-1 mt-1">
                                  <code className="code-block py-1 px-2 text-xs flex-1">{step.command}</code>
                                  <CopyButton text={step.command} />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Git Flow Map */}
      <section className="container px-4 pb-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center mb-2"
        >
          Mapa Visual do Git
        </motion.h2>
        <p className="text-center text-sm text-muted-foreground mb-8">
          Clique em cada etapa para saber mais
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GitFlowMap />
        </motion.div>
      </section>
    </div>
  );
}
