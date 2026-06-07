import { motion } from "framer-motion";
import { Terminal, Clock } from "lucide-react";

export default function ShellComingSoon() {
  return (
    <div data-theme="shell" className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Terminal className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Em desenvolvimento</h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto flex items-center gap-2 justify-center">
          <Clock className="h-4 w-4 shrink-0" />
          Esta seção estará disponível em breve.
        </p>
      </motion.div>
    </div>
  );
}
