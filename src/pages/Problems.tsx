import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { problems } from "@/data/problems";
import { ArrowRight } from "lucide-react";

export default function Problems() {
  return (
    <div className="container px-4 py-12">
      <SEO title="Problemas Git" description="Soluções passo a passo para 18 situações reais do dia a dia com Git: conflitos, push rejeitado, commit na branch errada, stash perdido e muito mais." path="/problems" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Central de Problemas</h1>
        <p className="text-muted-foreground mb-8">Soluções passo a passo para situações reais do dia a dia com Git.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
        {problems.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.3) }}
          >
            <Link
              to={`/problems/${p.id}`}
              className="glass-card p-5 block h-full hover:border-primary/40 transition-all hover:glow-sm group"
            >
              <span className="text-2xl mb-3 block">{p.emoji}</span>
              <h3 className="font-semibold mb-1">{p.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
              <span className="flex items-center gap-1 text-xs text-primary font-medium">
                Ver solução <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
