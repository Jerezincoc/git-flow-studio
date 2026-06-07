import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { GitBranch, Terminal, ArrowRight, Clock } from "lucide-react";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const docs = [
  {
    id: "git",
    name: "GitDoc",
    tagline: "Controle de versão",
    description: "Referência completa de Git — 31 comandos com flags, exemplos práticos, mapa visual do fluxo e soluções para os erros mais comuns.",
    path: "/git",
    icon: GitBranch,
    color: "from-cyan-500/20 to-teal-500/10",
    border: "hover:border-cyan-500/40",
    glow: "hover:shadow-[0_0_40px_hsl(190_100%_50%/0.15)]",
    badge: { label: "31 comandos", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
    available: true,
  },
  {
    id: "shell",
    name: "ShellDoc",
    tagline: "PowerShell & Windows",
    description: "Referência visual de cmdlets PowerShell e comandos Windows essenciais — com flags, exemplos e dicas práticas.",
    path: "/shell",
    icon: Terminal,
    color: "from-blue-500/20 to-indigo-500/10",
    border: "hover:border-blue-500/40",
    glow: "hover:shadow-[0_0_40px_hsl(210_100%_56%/0.15)]",
    badge: { label: "em breve", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    available: false,
  },
  {
    id: "ubuntu",
    name: "UbuntuDoc",
    tagline: "Linux & Bash",
    description: "Comandos essenciais do Ubuntu e Bash — navegação, permissões, processos, rede e muito mais.",
    path: "/ubuntu",
    icon: Terminal,
    color: "from-orange-500/20 to-red-500/10",
    border: "hover:border-orange-500/40",
    glow: "hover:shadow-[0_0_40px_hsl(25_100%_50%/0.12)]",
    badge: { label: "em breve", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
    available: false,
  },
  {
    id: "win",
    name: "WinDoc",
    tagline: "CMD & Windows",
    description: "Prompt de comando Windows, batch scripts e administração do sistema via linha de comando.",
    path: "/win",
    icon: Terminal,
    color: "from-sky-500/20 to-blue-500/10",
    border: "hover:border-sky-500/40",
    glow: "hover:shadow-[0_0_40px_hsl(200_100%_50%/0.12)]",
    badge: { label: "em breve", color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
    available: false,
  },
];

export default function Hub() {
  return (
    <div className="min-h-screen flex flex-col bg-background hero-gradient bg-grid">
      <Helmet>
        <title>DevDocs — Referências visuais para desenvolvedores</title>
        <meta name="description" content="Hub de documentação visual interativa: GitDoc, ShellDoc, UbuntuDoc e WinDoc. Aprenda Git, PowerShell, Linux e Windows de forma prática." />
      </Helmet>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="w-full max-w-3xl"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              documentação visual
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              <span className="gradient-text">DevDocs</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Referências interativas para as ferramentas que você usa todos os dias.
            </p>
          </motion.div>

          {/* Cards */}
          <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {docs.map((doc) => {
              const Icon = doc.icon;
              const card = (
                <motion.div
                  variants={fadeUp}
                  key={doc.id}
                  className={`relative group bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 transition-all duration-300 ${doc.border} ${doc.glow} ${!doc.available ? "opacity-60" : "cursor-pointer"}`}
                >
                  {/* gradient bg */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${doc.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h2 className="font-bold text-lg leading-none">{doc.name}</h2>
                          <p className="text-xs text-muted-foreground mt-0.5">{doc.tagline}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono border px-2 py-0.5 rounded-full ${doc.badge.color}`}>
                        {doc.badge.label}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {doc.description}
                    </p>

                    {doc.available && (
                      <div className="flex items-center gap-1 text-xs font-medium text-primary">
                        Acessar
                        <ArrowRight className="h-3.5 w-3.5 translate-x-0 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                    {!doc.available && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Em desenvolvimento
                      </div>
                    )}
                  </div>
                </motion.div>
              );

              return doc.available ? (
                <Link key={doc.id} to={doc.path} className="block">
                  {card}
                </Link>
              ) : (
                <div key={doc.id}>{card}</div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      <footer className="border-t border-border/50 py-4">
        <p className="text-center text-xs text-muted-foreground">
          DevDocs — Documentação visual e interativa para desenvolvedores
        </p>
      </footer>
    </div>
  );
}
