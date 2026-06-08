import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { GitBranch, Terminal, ArrowRight, Clock, Circle, Cpu } from "lucide-react";

/* ─── SVG animations ─────────────────────────────────────────────────── */

function GitAnimation() {
  const nodes = [
    { cx: 60,  cy: 260 }, { cx: 60,  cy: 200 }, { cx: 60,  cy: 140 },
    { cx: 60,  cy: 80  }, { cx: 140, cy: 110 }, { cx: 200, cy: 90  },
    { cx: 260, cy: 70  }, { cx: 140, cy: 170 }, { cx: 220, cy: 155 },
    { cx: 300, cy: 140 }, { cx: 60,  cy: 20  },
  ];
  const edges = [
    "M60,260 L60,200", "M60,200 L60,140", "M60,140 L60,80", "M60,80 L60,20",
    "M60,140 L140,110", "M140,110 L200,90", "M200,90 L260,70",
    "M60,200 L140,170", "M140,170 L220,155", "M220,155 L300,140",
  ];
  return (
    <svg viewBox="0 0 360 280" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      {edges.map((d, i) => (
        <motion.path
          key={i} d={d} stroke="currentColor" strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.3, 0.3, 0] }}
          transition={{ duration: 3.5, delay: i * 0.25, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={i} cx={n.cx} cy={n.cy} r="4" fill="none" stroke="currentColor" strokeWidth="1.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 1, 0], opacity: [0, 0.5, 0.5, 0] }}
          transition={{ duration: 3.5, delay: i * 0.2 + 0.3, repeat: Infinity, repeatDelay: 1.5, ease: "backOut" }}
        />
      ))}
    </svg>
  );
}

function TerminalAnimation({ lines }: { lines: string[] }) {
  return (
    <svg viewBox="0 0 320 200" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      {lines.map((line, i) => (
        <motion.text
          key={i} x="20" y={30 + i * 26}
          fontSize="11" fontFamily="JetBrains Mono, monospace" fill="currentColor"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: [0, 0.35, 0.35, 0], x: [-8, 0, 0, 0] }}
          transition={{ duration: 4, delay: i * 0.5, repeat: Infinity, repeatDelay: 2, ease: "easeOut" }}
        >
          {line}
        </motion.text>
      ))}
    </svg>
  );
}

/* ─── card config ─────────────────────────────────────────────────────── */

const docs = [
  {
    id: "git",
    name: "GitDoc",
    description: "31 comandos com flags detalhadas, mapa visual do fluxo, guia passo a passo e soluções para os 18 erros mais comuns.",
    path: "/git",
    icon: GitBranch,
    glow: "0 0 60px rgba(34,211,238,0.2)",
    border: "rgba(34,211,238,0.3)",
    symbolColor: "text-cyan-500",
    badge: "31 comandos",
    available: true,
    featured: true,
  },
  {
    id: "shell",
    name: "ShellDoc",
    description: "Cmdlets PowerShell e comandos Windows com pipeline explicado visualmente.",
    path: "/shell",
    icon: Terminal,
    glow: "0 0 60px rgba(99,102,241,0.18)",
    border: "rgba(99,102,241,0.3)",
    symbolColor: "text-indigo-400",
    badge: "em breve",
    available: false,
    featured: false,
  },
  {
    id: "ubuntu",
    name: "UbuntuDoc",
    description: "Terminal Linux, permissões, processos e scripts Bash no mesmo lugar.",
    path: "/ubuntu",
    icon: Circle,
    glow: "0 0 60px rgba(249,115,22,0.16)",
    border: "rgba(249,115,22,0.3)",
    symbolColor: "text-orange-400",
    badge: "em breve",
    available: false,
    featured: false,
  },
  {
    id: "win",
    name: "WinDoc",
    description: "CMD, variáveis de ambiente, batch scripts e administração Windows.",
    path: "/win",
    icon: Cpu,
    glow: "0 0 60px rgba(14,165,233,0.16)",
    border: "rgba(14,165,233,0.3)",
    symbolColor: "text-sky-400",
    badge: "em breve",
    available: false,
    featured: false,
  },
];

const terminalLines: Record<string, string[]> = {
  shell:  ["PS C:\\> Get-ChildItem", "| Where-Object { $_.Size -gt 0 }", "| Select-Object Name, Length", "| Sort-Object Length -Desc"],
  ubuntu: ["$ ls -la ~/projects", "drwxr-xr-x  user  4096 .", "$ sudo apt install curl", "$ chmod +x deploy.sh"],
  win:    ["C:\\Users\\dev> dir /s", "C:\\Users\\dev> ipconfig", "  IPv4: 192.168.1.1", "C:\\Users\\dev> tasklist"],
};

/* ─── card components ─────────────────────────────────────────────────── */

function FeaturedCard({ doc }: { doc: typeof docs[0] }) {
  const controls = useAnimationControls();
  const [hovered, setHovered] = useState(false);
  const Icon = doc.icon;

  return (
    <motion.div
      animate={controls}
      initial="rest"
      whileHover="hover"
      onHoverStart={() => { controls.start("hover"); setHovered(true); }}
      onHoverEnd={() => { controls.start("rest"); setHovered(false); }}
      style={{ "--glow": doc.glow, "--border-h": doc.border } as React.CSSProperties}
      className="relative overflow-hidden rounded-2xl border border-white/6 bg-[hsl(225,25%,7%)] cursor-pointer
        hover:border-[var(--border-h)] hover:shadow-[var(--glow)] transition-[border-color,box-shadow] duration-500"
    >
      {/* background animation */}
      <div className={`absolute inset-0 ${doc.symbolColor} opacity-100 pointer-events-none`}>
        <GitAnimation />
      </div>
      {/* gradient mask bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(225,25%,7%)] via-[hsl(225,25%,7%)/70%] to-transparent pointer-events-none" />

      <div className="relative z-10 p-8 flex flex-col gap-5 min-h-[200px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              variants={{ rest: { rotate: 0 }, hover: { rotate: -8, scale: 1.1, transition: { type: "spring", stiffness: 300 } } }}
            >
              <Icon className={`h-6 w-6 ${doc.symbolColor}`} />
            </motion.div>
            <span className="text-2xl font-bold tracking-tight">{doc.name}</span>
          </div>
          <span className="text-[10px] font-mono text-white/30 border border-white/10 px-2 py-0.5 rounded-full">
            {doc.badge}
          </span>
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-white/55 leading-relaxed max-w-lg"
            >
              {doc.description}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.div
          className="flex items-center gap-1.5 text-xs font-medium mt-auto"
          variants={{ rest: { color: "rgba(255,255,255,0.35)" }, hover: { color: "rgba(255,255,255,0.85)" } }}
        >
          Acessar
          <motion.span variants={{ rest: { x: 0 }, hover: { x: 4, transition: { type: "spring", stiffness: 400 } } }}>
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SmallCard({ doc }: { doc: typeof docs[0] }) {
  const [hovered, setHovered] = useState(false);
  const Icon = doc.icon;
  const lines = terminalLines[doc.id];

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ "--border-h": doc.border } as React.CSSProperties}
      className="relative overflow-hidden rounded-2xl border border-white/6 bg-[hsl(225,25%,7%)]
        hover:border-[var(--border-h)] transition-[border-color] duration-500 opacity-55 hover:opacity-80"
    >
      {/* background animation */}
      {lines && (
        <div className={`absolute inset-0 ${doc.symbolColor} pointer-events-none`}>
          <TerminalAnimation lines={lines} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(225,25%,7%)] via-[hsl(225,25%,7%)/80%] to-transparent pointer-events-none" />

      <div className="relative z-10 p-5 flex flex-col gap-3 min-h-[140px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${doc.symbolColor}`} />
            <span className="font-semibold text-sm">{doc.name}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-white/30">
            <Clock className="h-2.5 w-2.5" />
            em breve
          </div>
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-white/40 leading-relaxed"
            >
              {doc.description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Hub ─────────────────────────────────────────────────────────────── */

import { useState } from "react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function Hub() {
  const featured = docs[0];
  const rest = docs.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(225,30%,4%)]">
      <Helmet>
        <title>DevDocs — Referências visuais para desenvolvedores</title>
        <meta name="description" content="Hub de documentação visual interativa: GitDoc, ShellDoc, UbuntuDoc e WinDoc." />
      </Helmet>

      {/* grid sutil no fundo */}
      <div className="fixed inset-0 bg-[image:linear-gradient(hsl(225,15%,14%/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(225,15%,14%/0.3)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-20">
        <motion.div initial="hidden" animate="show" variants={stagger} className="w-full max-w-2xl flex flex-col gap-3">

          {/* wordmark */}
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/25 mb-3">dev docs</p>
            <h1 className="text-5xl font-black tracking-tight text-white/90">
              Dev<span className="text-white/20">Docs</span>
            </h1>
          </motion.div>

          {/* featured */}
          <motion.div variants={fadeUp}>
            <Link to={featured.path}>
              <FeaturedCard doc={featured} />
            </Link>
          </motion.div>

          {/* rest */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
            {rest.map((doc) => (
              <SmallCard key={doc.id} doc={doc} />
            ))}
          </motion.div>

        </motion.div>
      </div>

      <footer className="relative border-t border-white/5 py-4">
        <p className="text-center text-[11px] text-white/20">
          DevDocs · documentação visual e interativa
        </p>
      </footer>
    </div>
  );
}
