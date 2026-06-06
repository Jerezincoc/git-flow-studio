import { motion } from "framer-motion";
import { GitFlowMap } from "@/components/GitFlowMap";
import { CopyButton } from "@/components/CopyButton";

const fullFlow = [
  { step: 1, cmd: "git init", description: "Inicializa um repositório Git na pasta atual" },
  { step: 2, cmd: "git add .", description: "Adiciona todos os arquivos ao stage" },
  { step: 3, cmd: 'git commit -m "primeiro commit"', description: "Salva o snapshot com uma mensagem" },
  { step: 4, cmd: "git remote add origin <url>", description: "Conecta seu repo local ao remoto" },
  { step: 5, cmd: "git push -u origin main", description: "Envia para o remoto e define o upstream" },
];

export default function GitMap() {
  return (
    <div className="container px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Mapa Visual do Git</h1>
        <p className="text-muted-foreground mb-8">
          Entenda o fluxo completo do Git — do seu editor até o repositório remoto.
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
          Sequência completa para subir seu projeto do zero para o GitHub.
        </p>
        <div className="flex flex-col gap-3 max-w-xl">
          {fullFlow.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.07 }}
              className="glass-card flex items-center gap-4 px-4 py-3"
            >
              <span className="text-muted-foreground text-xs font-mono w-4 shrink-0">{item.step}.</span>
              <div className="flex-1 min-w-0">
                <code className="font-mono text-xs text-primary block truncate">{item.cmd}</code>
                <p className="text-muted-foreground text-[11px] mt-0.5">{item.description}</p>
              </div>
              <CopyButton text={item.cmd} className="shrink-0" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
