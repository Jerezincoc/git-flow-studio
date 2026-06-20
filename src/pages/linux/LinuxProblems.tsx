import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";

export default function LinuxProblems() {
  return (
    <div data-theme="linux" className="container px-4 py-12 max-w-4xl">
      <SEO
        title="Problemas Linux"
        description="Base de problemas comuns do LinuxDoc em preparação."
        path="/linux/problems"
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Problemas Comuns</h1>
        <p className="text-muted-foreground mb-8">
          A base de problemas do LinuxDoc será preenchida nas próximas iterações.
        </p>
      </motion.div>

      <div className="glass-card p-6">
        <p className="text-sm text-muted-foreground">
          Por enquanto, use os cenários práticos para troubleshooting de disco, permissões, processos, rede, serviços e logs.
        </p>
      </div>
    </div>
  );
}
