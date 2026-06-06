import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CopyButton } from "@/components/CopyButton";
import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuideStep {
  title: string;
  content: string;
  commands?: { code: string; description: string }[];
}

const guideSteps: GuideStep[] = [
  {
    title: "O que é Git?",
    content: "Git é um sistema de controle de versão que rastreia mudanças nos seus arquivos. Pense nele como um 'Ctrl+Z' super poderoso que funciona para projetos inteiros e permite que múltiplas pessoas trabalhem ao mesmo tempo.",
  },
  {
    title: "Instalando o Git",
    content: "Baixe e instale o Git no site oficial. Depois configure seu nome e email — eles aparecerão nos seus commits.",
    commands: [
      { code: 'git config --global user.name "Seu Nome"', description: "Configure seu nome" },
      { code: 'git config --global user.email "seu@email.com"', description: "Configure seu email" },
    ],
  },
  {
    title: "Seu primeiro repositório",
    content: "Um repositório é uma pasta monitorada pelo Git. Vamos criar um do zero.",
    commands: [
      { code: "mkdir meu-projeto\ncd meu-projeto", description: "Crie e entre na pasta" },
      { code: "git init", description: "Inicialize o repositório" },
    ],
  },
  {
    title: "Primeiro commit",
    content: "Um commit é um snapshot do seu projeto. É como salvar o jogo — você pode voltar a esse ponto a qualquer momento.",
    commands: [
      { code: 'echo "# Meu Projeto" > README.md', description: "Crie um arquivo" },
      { code: "git add README.md", description: "Adicione ao staging" },
      { code: 'git commit -m "primeiro commit"', description: "Faça o commit" },
    ],
  },
  {
    title: "Entendendo branches",
    content: "Branches são linhas paralelas de desenvolvimento. A branch principal (main) é a versão estável. Crie branches para features novas sem afetar o código principal.",
    commands: [
      { code: "git checkout -b minha-feature", description: "Crie e mude para nova branch" },
      { code: "git checkout main", description: "Volte para a main" },
      { code: "git merge minha-feature", description: "Integre a feature" },
    ],
  },
  {
    title: "Push para o GitHub",
    content: "O GitHub hospeda seus repositórios na nuvem. Crie um repositório no GitHub, conecte e envie seu código.",
    commands: [
      { code: "git remote add origin https://github.com/user/repo.git", description: "Conecte ao GitHub" },
      { code: "git push -u origin main", description: "Envie para o GitHub" },
    ],
  },
  {
    title: "Pull e colaboração",
    content: "Quando outras pessoas (ou você em outra máquina) enviam código, você precisa baixar essas atualizações. git fetch apenas baixa sem integrar; git pull baixa e já integra automaticamente.",
    commands: [
      { code: "git fetch origin", description: "Baixa atualizações sem integrar" },
      { code: "git pull origin main", description: "Baixa e integra na branch atual" },
      { code: "git log --oneline origin/main", description: "Veja o que chegou antes de integrar" },
    ],
  },
  {
    title: "Ignorando arquivos com .gitignore",
    content: "Nem todo arquivo deve ser rastreado pelo Git — dependências, variáveis de ambiente e builds gerados devem ficar fora. O arquivo .gitignore diz ao Git o que ignorar.",
    commands: [
      { code: "touch .gitignore", description: "Crie o arquivo .gitignore" },
      { code: "echo 'node_modules/' >> .gitignore\necho '.env' >> .gitignore\necho 'dist/' >> .gitignore", description: "Adicione padrões comuns" },
      { code: "git rm -r --cached node_modules/", description: "Remova do Git se já foi commitado" },
    ],
  },
];

export default function Guide() {
  const [completed, setCompleted] = useLocalStorage<number[]>("git-doc-guide-progress", []);
  const progress = Math.round((completed.length / guideSteps.length) * 100);

  const toggleStep = (idx: number) => {
    setCompleted((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="relative">
      {/* Progress bar sticky */}
      <div className="sticky top-14 z-40 bg-background/90 backdrop-blur border-b border-border/50 px-4 py-2">
        <div className="container max-w-3xl mx-auto flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs font-semibold text-primary shrink-0">{progress}% — {completed.length}/{guideSteps.length}</span>
        </div>
      </div>

      <div className="container px-4 py-12 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Guia para Iniciantes</h1>
        <p className="text-muted-foreground mb-8">Aprenda Git do zero com este guia passo a passo.</p>
      </motion.div>

        {/* Steps */}
        <div className="space-y-4">
          {guideSteps.map((step, i) => {
            const isDone = completed.includes(i);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`glass-card p-5 transition-all ${isDone ? "border-accent/40" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 pt-0.5">
                    <span className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${isDone ? "bg-accent/20 text-accent" : "bg-secondary text-muted-foreground"}`}>
                      {isDone ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{step.content}</p>
                    {step.commands && (
                      <div className="space-y-2 mb-3">
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
                    <Button
                      variant={isDone ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleStep(i)}
                      className={isDone ? "" : "btn-glow"}
                    >
                      {isDone ? "Desmarcar" : "Concluir etapa"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 mt-8 text-center border-primary/40 glow-md"
          >
            <span className="text-4xl mb-3 block">🎉</span>
            <h3 className="text-xl font-bold mb-2">Parabéns!</h3>
            <p className="text-muted-foreground text-sm">Você completou o guia para iniciantes. Agora explore os comandos e pratique!</p>
          </motion.div>
        )}
      </motion.div>
    </div>
    </div>
  );
}
