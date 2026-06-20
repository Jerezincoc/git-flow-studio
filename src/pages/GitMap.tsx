import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ChevronDown, Lightbulb, Terminal } from "lucide-react";
import { GitFlowMap } from "@/components/GitFlowMap";
import { CopyButton } from "@/components/CopyButton";
import { SEO } from "@/components/SEO";

const fullFlow = [
  {
    step: 1,
    cmd: "git init",
    description: "Inicializa um repositorio Git na pasta atual.",
    commands: [
      { id: "init", label: "git init" },
      { id: "status", label: "git status" },
    ],
    tip: "Rode git status logo depois para confirmar que o diretorio foi reconhecido como repositorio.",
    problem: { id: "broken-repo", label: "Repositorio com comportamento estranho" },
  },
  {
    step: 2,
    cmd: "git add .",
    description: "Seleciona as mudancas que vao entrar no proximo snapshot.",
    commands: [
      { id: "add", label: "git add" },
      { id: "status", label: "git status" },
      { id: "restore", label: "git restore" },
    ],
    tip: "Use git add -p quando quiser separar mudancas em commits menores.",
    problem: { id: "restore-file", label: "Desfazer alteracoes de arquivo" },
  },
  {
    step: 3,
    cmd: 'git commit -m "primeiro commit"',
    description: "Registra o estado preparado no historico local.",
    commands: [
      { id: "commit", label: "git commit" },
      { id: "log", label: "git log" },
    ],
    tip: "Prefira mensagens curtas que expliquem a intencao, nao apenas o arquivo alterado.",
    problem: { id: "amend-last-commit", label: "Esqueci algo no ultimo commit" },
  },
  {
    step: 4,
    cmd: "git remote add origin <url>",
    description: "Conecta o repositorio local a um remoto.",
    commands: [
      { id: "remote", label: "git remote" },
      { id: "fetch", label: "git fetch" },
    ],
    tip: "Confira a URL com git remote -v antes do primeiro push.",
    problem: { id: "sync-fork", label: "Sincronizar fork ou remoto" },
  },
  {
    step: 5,
    cmd: "git push -u origin main",
    description: "Publica os commits e define o upstream da branch.",
    commands: [
      { id: "push", label: "git push" },
      { id: "pull", label: "git pull" },
    ],
    tip: "Antes de publicar em branch compartilhada, atualize sua base para reduzir rejeicoes.",
    problem: { id: "push-rejected", label: "Push rejeitado" },
  },
];

export default function GitMap() {
  const [openStep, setOpenStep] = useState(fullFlow[0].step);

  return (
    <div className="container px-4 py-12">
      <SEO title="Mapa Visual do Git" description="Visualize de forma interativa o fluxo completo do Git: Working Directory -> Stage -> Local Repo -> Remote. Entenda cada etapa com comandos e exemplos." path="/map" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Mapa Visual do Git</h1>
        <p className="text-muted-foreground mb-8">
          Entenda o fluxo completo do Git, do seu editor ate o repositorio remoto.
          Clique em cada etapa para explorar os comandos.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <GitFlowMap />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-14"
      >
        <h2 className="text-xl font-semibold mb-1">Fluxo do zero ao push</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Sequencia executiva para subir um projeto novo sem repetir a documentacao completa.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl">
          {fullFlow.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.07 }}
              className="glass-card overflow-hidden"
            >
              <button
                type="button"
                aria-expanded={openStep === item.step}
                onClick={() => setOpenStep((current) => current === item.step ? 0 : item.step)}
                className="w-full flex items-center gap-4 px-4 py-3 text-left"
              >
                <span className="text-muted-foreground text-xs font-mono w-4 shrink-0">{item.step}.</span>
                <span className="flex-1 min-w-0">
                  <code className="font-mono text-xs text-primary block truncate">{item.cmd}</code>
                  <span className="text-muted-foreground text-[11px] mt-0.5 block">{item.description}</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${openStep === item.step ? "rotate-180" : ""}`}
                />
              </button>

              {openStep === item.step && (
                <div className="border-t border-border/50 px-4 py-4 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium mb-2">
                      <Terminal className="h-3.5 w-3.5 text-primary" />
                      Comandos relacionados
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.commands.map((command) => (
                        <Link
                          key={command.id}
                          to={`/commands/${command.id}`}
                          className="rounded-md bg-secondary px-2.5 py-1 text-xs font-mono text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          {command.label}
                        </Link>
                      ))}
                      <CopyButton text={item.cmd} />
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                    <Lightbulb className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <span>{item.tip}</span>
                  </div>

                  <Link
                    to={`/problems/${item.problem.id}`}
                    className="flex items-center gap-2 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {item.problem.label}
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
