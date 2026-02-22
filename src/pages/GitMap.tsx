import { motion } from "framer-motion";
import { GitFlowMap } from "@/components/GitFlowMap";

export default function GitMap() {
  return (
    <div className="container px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Mapa Visual do Git</h1>
        <p className="text-muted-foreground mb-8">
          Entenda o fluxo completo do Git — do seu editor até o repositório remoto.
          Clique em cada etapa para explorar.
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <GitFlowMap />
      </motion.div>
    </div>
  );
}
