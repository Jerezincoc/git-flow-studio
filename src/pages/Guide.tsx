import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/components/SEO";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CopyButton } from "@/components/CopyButton";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuideStep {
  title: string;
  content: string;
  tip?: string;
  commands?: { code: string; description: string }[];
}

const guideSteps: GuideStep[] = [
  {
    title: "O que é Git?",
    content: "Git é um sistema de controle de versão que rastreia mudanças nos seus arquivos. Pense nele como um 'Ctrl+Z' super poderoso que funciona para projetos inteiros e permite que múltiplas pessoas trabalhem ao mesmo tempo.",
    tip: "Git é local — funciona no seu computador sem precisar de internet. O GitHub é apenas onde você hospeda o repositório.",
    commands: [
      { code: "git --version", description: "Verifique se o Git está instalado" },
    ],
  },
  {
    title: "Instalando e configurando",
    content: "Baixe e instale o Git no site oficial (git-scm.com). Depois configure seu nome e email — eles aparecerão em todos os seus commits.",
    commands: [
      { code: "git --version", description: "Confirme que a instalação funcionou" },
      { code: 'git config --global user.name "Seu Nome"', description: "Configure seu nome" },
      { code: 'git config --global user.email "seu@email.com"', description: "Configure seu email" },
    ],
  },
  {
    title: "Seu primeiro repositório",
    content: "Um repositório é uma pasta monitorada pelo Git. Crie uma pasta, inicialize o repositório e veja o status inicial — você vai usar git status o tempo todo.",
    commands: [
      { code: "mkdir meu-projeto\ncd meu-projeto", description: "Crie e entre na pasta" },
      { code: "git init", description: "Inicialize o repositório" },
      { code: "git status", description: "Veja o estado inicial (No commits yet)" },
    ],
  },
  {
    title: "Primeiro commit",
    content: "Um commit é um snapshot do seu projeto — como salvar o jogo. O fluxo é sempre o mesmo: edita arquivo → git add → git commit.",
    tip: "git add seleciona o que vai pro commit. git commit salva o snapshot. Essa separação é intencional e muito útil.",
    commands: [
      { code: 'echo "# Meu Projeto" > README.md', description: "Crie um arquivo" },
      { code: "git add README.md", description: "Adicione ao staging" },
      { code: 'git commit -m "primeiro commit"', description: "Faça o commit" },
    ],
  },
  {
    title: "Entendendo branches",
    content: "Branches são linhas paralelas de desenvolvimento. A branch main é a versão estável. Crie branches para novas features sem afetar o código principal.",
    tip: "Sempre crie uma branch nova para cada feature ou correção. Nunca desenvolva direto na main.",
    commands: [
      { code: "git checkout -b minha-feature", description: "Crie e mude para nova branch" },
      { code: "git branch", description: "Liste todas as branches (* = atual)" },
      { code: "git checkout main", description: "Volte para a main" },
      { code: "git merge minha-feature", description: "Integre a feature" },
    ],
  },
  {
    title: "Push para o GitHub",
    content: "O GitHub hospeda seus repositórios na nuvem. Crie um repositório vazio no GitHub, conecte ao seu local e envie o código.",
    commands: [
      { code: "git remote add origin https://github.com/user/repo.git", description: "Conecte ao GitHub" },
      { code: "git push -u origin main", description: "Envie para o GitHub (-u define o upstream)" },
    ],
  },
  {
    title: "Pull e colaboração",
    content: "Quando outras pessoas (ou você em outra máquina) enviam código, você precisa baixar. git fetch apenas baixa; git pull baixa e já integra.",
    tip: "Prefira git fetch + git log para ver o que chegou antes de integrar. Evita surpresas.",
    commands: [
      { code: "git fetch origin", description: "Baixa atualizações sem integrar" },
      { code: "git log --oneline origin/main", description: "Veja o que chegou" },
      { code: "git pull origin main", description: "Baixa e integra na branch atual" },
    ],
  },
  {
    title: "Ignorando arquivos com .gitignore",
    content: "Nem todo arquivo deve ser rastreado — dependências, variáveis de ambiente e builds gerados devem ficar fora. O .gitignore diz ao Git o que ignorar.",
    tip: "Crie o .gitignore antes do primeiro commit. Se já commitou algo por engano, use git rm --cached.",
    commands: [
      { code: "touch .gitignore", description: "Crie o arquivo" },
      { code: "echo 'node_modules/' >> .gitignore\necho '.env' >> .gitignore\necho 'dist/' >> .gitignore", description: "Adicione padrões comuns" },
      { code: "git rm -r --cached node_modules/", description: "Remova do Git se já foi commitado" },
    ],
  },
];

export default function Guide() {
  const [currentStep, setCurrentStep] = useLocalStorage<number>("git-doc-guide-step", 0);
  const [completed, setCompleted] = useLocalStorage<number[]>("git-doc-guide-progress", []);

  const step = guideSteps[currentStep];
  const isDone = completed.includes(currentStep);
  const progress = Math.round((completed.length / guideSteps.length) * 100);
  const isLast = currentStep === guideSteps.length - 1;

  const toggleDone = () => {
    setCompleted((prev) =>
      prev.includes(currentStep)
        ? prev.filter((i) => i !== currentStep)
        : [...prev, currentStep]
    );
  };

  const goNext = () => {
    if (!isDone) {
      setCompleted((prev) => [...prev, currentStep]);
    }
    if (!isLast) setCurrentStep(currentStep + 1);
  };

  const goPrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="relative">
      <SEO title="Guia para Iniciantes" description="Aprenda Git do zero com um guia passo a passo: instalação, primeiro commit, branches, push para GitHub, pull e .gitignore. Interativo e progressivo." path="/guide" />
      {/* Progress bar sticky */}
      <div className="sticky top-14 z-40 bg-background/90 backdrop-blur border-b border-border/50 px-4 py-2">
        <div className="container max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="text-xs font-semibold text-primary shrink-0">
            {completed.length}/{guideSteps.length} concluídos
          </span>
        </div>
      </div>

      <div className="container px-4 py-12 max-w-2xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Guia para Iniciantes</h1>
          <p className="text-muted-foreground">Aprenda Git do zero, um passo por vez.</p>
        </motion.div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5 mb-8 flex-wrap">
          {guideSteps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`transition-all rounded-full ${
                i === currentStep
                  ? "w-6 h-2.5 bg-primary"
                  : completed.includes(i)
                  ? "w-2.5 h-2.5 bg-accent"
                  : "w-2.5 h-2.5 bg-secondary hover:bg-secondary/60"
              }`}
              title={guideSteps[i].title}
            />
          ))}
        </div>

        {/* Step card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className={`glass-card p-6 mb-6 ${isDone ? "border-accent/40" : ""}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-muted-foreground">
                Passo {currentStep + 1} de {guideSteps.length}
              </span>
              {isDone && (
                <span className="flex items-center gap-1 text-xs text-accent font-medium">
                  <Check className="h-3.5 w-3.5" /> Concluído
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold mb-3">{step.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.content}</p>

            {step.tip && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 mb-4">
                <p className="text-xs text-primary leading-relaxed">
                  <span className="font-semibold">Dica:</span> {step.tip}
                </p>
              </div>
            )}

            {step.commands && (
              <div className="space-y-3">
                {step.commands.map((cmd, ci) => (
                  <div key={ci}>
                    <p className="text-xs text-muted-foreground mb-1">{cmd.description}</p>
                    <div className="flex items-center gap-2">
                      <pre className="code-block flex-1 whitespace-pre-wrap overflow-x-auto text-xs">{cmd.code}</pre>
                      <CopyButton text={cmd.code} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </Button>

          <button
            onClick={toggleDone}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            {isDone ? "Desmarcar como concluído" : "Marcar como concluído"}
          </button>

          {isLast ? (
            <Button
              size="sm"
              onClick={toggleDone}
              className={isDone ? "" : "btn-glow"}
              disabled={isDone}
            >
              {isDone ? "Guia completo ✓" : "Concluir"}
            </Button>
          ) : (
            <Button size="sm" onClick={goNext} className="flex items-center gap-1 btn-glow">
              {isDone ? "Próximo" : "Concluir e avançar"} <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Completion */}
        <AnimatePresence>
          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card p-6 mt-8 text-center border-primary/40 glow-md"
            >
              <span className="text-4xl mb-3 block">🎉</span>
              <h3 className="text-xl font-bold mb-2">Guia completo!</h3>
              <p className="text-muted-foreground text-sm">Agora explore os comandos e o mapa visual para aprofundar.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
