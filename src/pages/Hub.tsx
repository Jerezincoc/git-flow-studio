import { motion, useAnimationControls } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { GitBranch, Terminal, ArrowRight, Clock, Circle, Cpu, Globe } from "lucide-react";

/* ---------- símbolos de fundo por card ---------- */
type Symbol = { text: string; x: string; y: string; rotate?: number; size?: string };

const bgSymbols: Record<string, Symbol[]> = {
  git: [
    { text: "git init",      x: "8%",  y: "12%", rotate: -12 },
    { text: "○──○──○",       x: "55%", y: "8%",  rotate: 5  },
    { text: "⎇ main",        x: "72%", y: "28%", rotate: 8  },
    { text: "git commit",    x: "5%",  y: "52%", rotate: -8 },
    { text: "HEAD~1",        x: "60%", y: "55%", rotate: 12 },
    { text: "git merge",     x: "30%", y: "78%", rotate: -6 },
    { text: "git push",      x: "75%", y: "72%", rotate: 4  },
    { text: "│\n○\n│\n○",   x: "44%", y: "30%", rotate: 0, size: "text-[10px]" },
    { text: "origin/main",   x: "18%", y: "88%", rotate: -4 },
  ],
  shell: [
    { text: "PS >_",           x: "6%",  y: "10%", rotate: -8  },
    { text: "Get-ChildItem",   x: "50%", y: "7%",  rotate: 5   },
    { text: "| Select-Object", x: "68%", y: "30%", rotate: 10  },
    { text: "$env:PATH",       x: "5%",  y: "55%", rotate: -10 },
    { text: "ForEach-Object",  x: "55%", y: "58%", rotate: -6  },
    { text: "Invoke-WebRequest",x:"15%", y: "78%", rotate: 4   },
    { text: "[string]",        x: "72%", y: "75%", rotate: 8   },
    { text: "Where-Object",    x: "35%", y: "88%", rotate: -3  },
    { text: "pipeline |>",     x: "42%", y: "42%", rotate: 12  },
  ],
  ubuntu: [
    { text: "$ sudo apt",      x: "6%",  y: "12%", rotate: -10 },
    { text: "chmod 755",       x: "55%", y: "8%",  rotate: 6   },
    { text: "~/projects",      x: "70%", y: "28%", rotate: -5  },
    { text: "grep -r",         x: "5%",  y: "50%", rotate: 8   },
    { text: "ls -la",          x: "58%", y: "55%", rotate: -8  },
    { text: "apt install",     x: "25%", y: "78%", rotate: 5   },
    { text: "bash script.sh",  x: "62%", y: "75%", rotate: -4  },
    { text: "cat /etc/hosts",  x: "10%", y: "86%", rotate: 3   },
    { text: "| grep",          x: "42%", y: "38%", rotate: 12  },
  ],
  win: [
    { text: "C:\\Users\\>",    x: "5%",  y: "10%", rotate: -8  },
    { text: "dir /s",          x: "55%", y: "8%",  rotate: 6   },
    { text: "ipconfig",        x: "68%", y: "30%", rotate: -6  },
    { text: "tasklist",        x: "6%",  y: "52%", rotate: 10  },
    { text: "reg query",       x: "52%", y: "55%", rotate: -10 },
    { text: "netstat -an",     x: "20%", y: "78%", rotate: 5   },
    { text: "bcdedit",         x: "65%", y: "75%", rotate: 8   },
    { text: "sfc /scannow",    x: "10%", y: "86%", rotate: -3  },
    { text: "powercfg /h off", x: "38%", y: "40%", rotate: 4   },
  ],
};

/* ---------- dados dos cards ---------- */
const docs = [
  {
    id: "git",
    name: "GitDoc",
    tagline: "Controle de versão",
    description: "31 comandos com flags, mapa visual do fluxo, guia passo a passo e soluções para os erros mais comuns.",
    path: "/git",
    icon: GitBranch,
    accentLight: "rgba(34,211,238,0.06)",
    accentDark:  "rgba(34,211,238,0.10)",
    glowColor:   "rgba(34,211,238,0.18)",
    borderHover: "rgba(34,211,238,0.35)",
    symbolColor: "text-cyan-400",
    badge: { label: "31 comandos", cls: "bg-white/5 text-white/50 border-white/10" },
    available: true,
  },
  {
    id: "shell",
    name: "ShellDoc",
    tagline: "PowerShell & Windows",
    description: "Cmdlets PowerShell e comandos Windows essenciais — com flags, exemplos e pipeline explicado visualmente.",
    path: "/shell",
    icon: Terminal,
    accentLight: "rgba(99,102,241,0.06)",
    accentDark:  "rgba(99,102,241,0.10)",
    glowColor:   "rgba(99,102,241,0.18)",
    borderHover: "rgba(99,102,241,0.35)",
    symbolColor: "text-indigo-400",
    badge: { label: "em breve", cls: "bg-white/5 text-white/50 border-white/10" },
    available: false,
  },
  {
    id: "ubuntu",
    name: "UbuntuDoc",
    tagline: "Linux & Bash",
    description: "Navegação, permissões, processos, rede e scripts Bash — tudo que você precisa no terminal Linux.",
    path: "/ubuntu",
    icon: Circle,
    accentLight: "rgba(249,115,22,0.06)",
    accentDark:  "rgba(249,115,22,0.10)",
    glowColor:   "rgba(249,115,22,0.16)",
    borderHover: "rgba(249,115,22,0.35)",
    symbolColor: "text-orange-400",
    badge: { label: "em breve", cls: "bg-white/5 text-white/50 border-white/10" },
    available: false,
  },
  {
    id: "win",
    name: "WinDoc",
    tagline: "CMD & Prompt Windows",
    description: "Prompt de comando Windows, variáveis de ambiente, batch scripts e administração via linha de comando.",
    path: "/win",
    icon: Cpu,
    accentLight: "rgba(14,165,233,0.06)",
    accentDark:  "rgba(14,165,233,0.10)",
    glowColor:   "rgba(14,165,233,0.16)",
    borderHover: "rgba(14,165,233,0.35)",
    symbolColor: "text-sky-400",
    badge: { label: "em breve", cls: "bg-white/5 text-white/50 border-white/10" },
    available: false,
  },
];

/* ---------- variantes de animação ---------- */
const symbolVariants = {
  rest: { opacity: 0, y: 6, transition: { duration: 0.2 } },
  hover: (i: number) => ({
    opacity: 0.13,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.04, ease: "easeOut" },
  }),
};

const iconVariants = {
  rest:  { scale: 1,    rotate: 0 },
  hover: { scale: 1.12, rotate: -6, transition: { type: "spring", stiffness: 300, damping: 18 } },
};

const arrowVariants = {
  rest:  { x: 0, opacity: 0.7 },
  hover: { x: 5, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 20 } },
};

/* ---------- Card component ---------- */
function DocCard({ doc }: { doc: typeof docs[0] }) {
  const controls = useAnimationControls();
  const Icon = doc.icon;
  const symbols = bgSymbols[doc.id] ?? [];

  return (
    <motion.div
      animate={controls}
      initial="rest"
      whileHover="hover"
      onHoverStart={() => controls.start("hover")}
      onHoverEnd={() => controls.start("rest")}
      style={{
        "--glow": doc.glowColor,
        "--border-hover": doc.borderHover,
      } as React.CSSProperties}
      className={`relative overflow-hidden rounded-2xl border border-white/8 bg-card/60 backdrop-blur-xl p-6 transition-[border-color,box-shadow] duration-300
        hover:border-[var(--border-hover)] hover:shadow-[0_0_40px_var(--glow)]
        ${doc.available ? "cursor-pointer" : "opacity-55"}`}
    >
      {/* Fundo de símbolos animados */}
      {symbols.map((s, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={symbolVariants}
          className={`absolute font-mono whitespace-pre select-none pointer-events-none ${s.size ?? "text-[11px]"} ${doc.symbolColor}`}
          style={{ left: s.x, top: s.y, rotate: s.rotate ?? 0 }}
        >
          {s.text}
        </motion.span>
      ))}

      {/* Gradiente de accent no hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        variants={{
          rest:  { opacity: 0 },
          hover: { opacity: 1, transition: { duration: 0.35 } },
        }}
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 120%, ${doc.accentDark}, transparent)`,
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              variants={iconVariants}
              className="h-10 w-10 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center"
            >
              <Icon className="h-5 w-5 text-foreground/70" />
            </motion.div>
            <div>
              <h2 className="font-bold text-base leading-none text-foreground">{doc.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{doc.tagline}</p>
            </div>
          </div>
          <span className={`text-[10px] font-mono border px-2 py-0.5 rounded-full ${doc.badge.cls}`}>
            {doc.badge.label}
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          {doc.description}
        </p>

        {doc.available ? (
          <div className="flex items-center gap-1 text-xs font-medium text-foreground/60">
            Acessar
            <motion.span variants={arrowVariants} className="inline-flex">
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
            <Clock className="h-3 w-3" />
            Em desenvolvimento
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ---------- Hub ---------- */
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp   = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Hub() {
  return (
    <div className="min-h-screen flex flex-col bg-background bg-grid">
      <Helmet>
        <title>DevDocs — Referências visuais para desenvolvedores</title>
        <meta name="description" content="Hub de documentação visual interativa: GitDoc, ShellDoc, UbuntuDoc e WinDoc." />
      </Helmet>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <motion.div initial="hidden" animate="show" variants={stagger} className="w-full max-w-3xl">

          <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              documentação visual
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
              Dev<span className="text-foreground/40">Docs</span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Referências interativas para as ferramentas que você usa todos os dias.
            </p>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {docs.map((doc) => (
              <motion.div key={doc.id} variants={fadeUp}>
                {doc.available ? (
                  <Link to={doc.path} className="block">
                    <DocCard doc={doc} />
                  </Link>
                ) : (
                  <DocCard doc={doc} />
                )}
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </div>

      <footer className="border-t border-border/30 py-4">
        <p className="text-center text-xs text-muted-foreground/50">
          DevDocs — Documentação visual e interativa para desenvolvedores
        </p>
      </footer>
    </div>
  );
}
