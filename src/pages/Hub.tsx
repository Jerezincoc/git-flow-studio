import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { GitBranch, Terminal, ArrowRight, Clock, Circle, Cpu } from "lucide-react";

/* ─── GitAnimation — branches contínuas sem lacuna ──────────────────── */

const GRAPH = {
  nodes: [
    { cx: 60, cy: 260 }, { cx: 60, cy: 200 }, { cx: 60, cy: 140 },
    { cx: 60, cy: 80  }, { cx: 60, cy: 20  },
    { cx: 140, cy: 110 }, { cx: 200, cy: 90  }, { cx: 265, cy: 68  },
    { cx: 140, cy: 170 }, { cx: 220, cy: 152 }, { cx: 300, cy: 138 },
  ],
  edges: [
    { d: "M60,260 L60,200", wave: 0 },
    { d: "M60,200 L60,140", wave: 0 },
    { d: "M60,140 L60,80",  wave: 0 },
    { d: "M60,80  L60,20",  wave: 0 },
    { d: "M60,140 L140,110",wave: 1 },
    { d: "M140,110 L200,90",wave: 1 },
    { d: "M200,90 L265,68", wave: 1 },
    { d: "M60,200 L140,170",wave: 2 },
    { d: "M140,170 L220,152",wave:2 },
    { d: "M220,152 L300,138",wave:2 },
  ],
};

// 3 waves sobrepostas — quando uma apaga a próxima já está a meio caminho
const WAVE_OFFSETS = [0, 2.5, 5]; // segundos de offset entre waves
const CYCLE = 8; // duração total de um ciclo por wave

function GitAnimation() {
  return (
    <svg
      viewBox="0 0 360 280"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {WAVE_OFFSETS.map((waveOffset, wi) =>
        GRAPH.edges.map((e, i) => {
          const delay = waveOffset + e.wave * 0.35 + i * 0.18;
          return (
            <motion.path
              key={`w${wi}-e${i}`}
              d={e.d}
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1, 0],
                opacity:    [0, 0.28, 0.28, 0],
              }}
              transition={{
                duration: CYCLE * 0.7,
                delay,
                repeat: Infinity,
                repeatDelay: CYCLE * 0.3,
                ease: "easeInOut",
              }}
            />
          );
        })
      )}
      {WAVE_OFFSETS.map((waveOffset, wi) =>
        GRAPH.nodes.map((n, i) => {
          const delay = waveOffset + i * 0.16 + 0.2;
          return (
            <motion.circle
              key={`w${wi}-n${i}`}
              cx={n.cx} cy={n.cy} r="3.5"
              fill="none" stroke="currentColor" strokeWidth="1.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale:   [0, 1, 1, 0],
                opacity: [0, 0.45, 0.45, 0],
              }}
              transition={{
                duration: CYCLE * 0.7,
                delay,
                repeat: Infinity,
                repeatDelay: CYCLE * 0.3,
                ease: "backOut",
              }}
            />
          );
        })
      )}
    </svg>
  );
}

/* ─── TerminalAnimation ──────────────────────────────────────────────── */

function TerminalAnimation({ lines }: { lines: string[] }) {
  const cycle = 7;
  return (
    <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      {[0, cycle * 0.55].map((waveOffset, wi) =>
        lines.map((line, i) => (
          <motion.text
            key={`w${wi}-l${i}`}
            x="16" y={28 + i * 24}
            fontSize="10.5"
            fontFamily="JetBrains Mono, monospace"
            fill="currentColor"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: [0, 0.32, 0.32, 0], x: [-6, 0, 0, 0] }}
            transition={{
              duration: cycle * 0.55,
              delay: waveOffset + i * 0.4,
              repeat: Infinity,
              repeatDelay: cycle * 0.45,
              ease: "easeOut",
            }}
          >
            {line}
          </motion.text>
        ))
      )}
    </svg>
  );
}

/* ─── dados ──────────────────────────────────────────────────────────── */

const stats = [
  { label: "comandos", value: "31" },
  { label: "problemas", value: "18" },
  { label: "flags documentadas", value: "120+" },
];

const smallPreviews: Record<string, string[]> = {
  shell:  ["Get-ChildItem", "Where-Object", "Select-Object", "Invoke-WebRequest"],
  ubuntu: ["sudo apt install", "chmod 755", "grep -r", "systemctl status"],
  win:    ["dir /s /b", "ipconfig /all", "tasklist /fi", "sfc /scannow"],
};

const terminalLines: Record<string, string[]> = {
  shell:  ["PS> Get-ChildItem -Recurse", "| Where-Object { $_.Length -gt 0 }", "| Select-Object Name, Length", "| Sort-Object Length -Desc"],
  ubuntu: ["$ ls -la ~/projects", "$ sudo apt install curl -y", "$ chmod +x deploy.sh", "$ grep -r 'error' ./logs"],
  win:    ["C:\\> dir /s /b *.log", "C:\\> ipconfig /all", "C:\\> tasklist /fi \"STATUS eq running\"", "C:\\> sfc /scannow"],
};

const docs = [
  {
    id: "git", name: "GitDoc", path: "/git", icon: GitBranch,
    description: "31 comandos com flags detalhadas, mapa visual do fluxo, guia passo a passo e soluções para os 18 problemas mais comuns.",
    glow: "0 0 55px rgba(34,211,238,0.22)",
    border: "rgba(34,211,238,0.32)",
    accent: "rgba(34,211,238,0.07)",
    symbolColor: "text-cyan-500",
    available: true,
  },
  {
    id: "shell", name: "ShellDoc", path: "/shell", icon: Terminal,
    description: "Cmdlets PowerShell e comandos Windows com pipeline explicado visualmente.",
    glow: "0 0 55px rgba(99,102,241,0.2)",
    border: "rgba(99,102,241,0.32)",
    accent: "rgba(99,102,241,0.07)",
    symbolColor: "text-indigo-400",
    available: false,
  },
  {
    id: "ubuntu", name: "UbuntuDoc", path: "/ubuntu", icon: Circle,
    description: "Terminal Linux, permissões, processos e scripts Bash num só lugar.",
    glow: "0 0 55px rgba(249,115,22,0.18)",
    border: "rgba(249,115,22,0.32)",
    accent: "rgba(249,115,22,0.07)",
    symbolColor: "text-orange-400",
    available: false,
  },
  {
    id: "win", name: "WinDoc", path: "/win", icon: Cpu,
    description: "CMD, variáveis de ambiente, batch scripts e administração Windows.",
    glow: "0 0 55px rgba(14,165,233,0.18)",
    border: "rgba(14,165,233,0.32)",
    accent: "rgba(14,165,233,0.07)",
    symbolColor: "text-sky-400",
    available: false,
  },
];

/* ─── FeaturedCard ───────────────────────────────────────────────────── */

function FeaturedCard({ doc }: { doc: typeof docs[0] }) {
  const [hovered, setHovered] = useState(false);
  const Icon = doc.icon;

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ "--glow": doc.glow, "--border-h": doc.border, "--accent": doc.accent } as React.CSSProperties}
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[hsl(225,25%,6%)] cursor-pointer
        hover:border-[var(--border-h)] hover:shadow-[var(--glow)] transition-[border-color,box-shadow] duration-500"
    >
      {/* SVG de fundo */}
      <div className={`absolute inset-0 ${doc.symbolColor} pointer-events-none`}>
        <GitAnimation />
      </div>

      {/* máscara gradiente suave — sem divisão dura */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 100% 80% at 50% 110%, hsl(225,25%,6%) 30%, transparent 80%)" }}
      />
      {/* accent no hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.4 }}
        style={{ background: `radial-gradient(ellipse 70% 50% at 50% 100%, var(--accent), transparent)` }}
      />

      <div className="relative z-10 px-8 pt-8 pb-7 flex flex-col gap-4">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: -9, scale: 1.12, transition: { type: "spring", stiffness: 280 } } }}
            >
              <Icon className={`h-6 w-6 ${doc.symbolColor}`} />
            </motion.div>
            <span className="text-2xl font-bold tracking-tight text-white/90">{doc.name}</span>
          </div>
          <span className="text-[10px] font-mono text-white/25 border border-white/10 px-2 py-0.5 rounded-full">
            disponível
          </span>
        </div>

        {/* stats — sempre visíveis */}
        <div className="flex items-center gap-5">
          {stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1">
              <span className={`text-sm font-bold font-mono ${doc.symbolColor}`}>{s.value}</span>
              <span className="text-[11px] text-white/30">{s.label}</span>
            </div>
          ))}
        </div>

        {/* descrição — aparece no hover */}
        <AnimatePresence>
          {hovered && (
            <motion.p
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 4, height: 0 }}
              transition={{ duration: 0.22 }}
              className="text-sm text-white/50 leading-relaxed max-w-lg overflow-hidden"
            >
              {doc.description}
            </motion.p>
          )}
        </AnimatePresence>

        {/* footer */}
        <div className="flex items-center justify-between mt-1">
          <motion.div
            className="flex items-center gap-1.5 text-xs font-medium"
            variants={{ rest: { color: "rgba(255,255,255,0.3)" }, hover: { color: "rgba(255,255,255,0.9)" } }}
          >
            Começar
            <motion.span variants={{ rest: { x: 0 }, hover: { x: 5, transition: { type: "spring", stiffness: 380 } } }}>
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.span>
          </motion.div>

          {/* CTA secundário */}
          <Link
            to="/guide"
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] text-white/25 hover:text-white/60 transition-colors underline underline-offset-2"
          >
            novo aqui? → Guia para iniciantes
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── SmallCard ──────────────────────────────────────────────────────── */

function SmallCard({ doc }: { doc: typeof docs[0] }) {
  const [hovered, setHovered] = useState(false);
  const Icon = doc.icon;
  const lines = terminalLines[doc.id];
  const previews = smallPreviews[doc.id] ?? [];

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ "--border-h": doc.border } as React.CSSProperties}
      className="relative overflow-hidden rounded-2xl border border-white/[0.05] bg-[hsl(225,25%,6%)]
        hover:border-[var(--border-h)] transition-[border-color,opacity] duration-500 opacity-50 hover:opacity-85"
    >
      {lines && (
        <div className={`absolute inset-0 ${doc.symbolColor} pointer-events-none`}>
          <TerminalAnimation lines={lines} />
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 100% 70% at 50% 110%, hsl(225,25%,6%) 20%, transparent 80%)" }}
      />

      <div className="relative z-10 p-5 flex flex-col gap-3 min-h-[148px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-3.5 w-3.5 ${doc.symbolColor}`} />
            <span className="font-semibold text-sm text-white/80">{doc.name}</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-white/25">
            <Clock className="h-2.5 w-2.5" />
            em breve
          </div>
        </div>

        {/* preview de cmdlets — sempre visível */}
        <div className="flex flex-wrap gap-1">
          {previews.map((p) => (
            <span key={p} className="font-mono text-[9px] text-white/25 bg-white/[0.04] px-1.5 py-0.5 rounded">
              {p}
            </span>
          ))}
        </div>

        {/* descrição no hover */}
        <AnimatePresence>
          {hovered && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-[11px] text-white/38 leading-relaxed"
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

const fadeUp = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.11 } } };

export default function Hub() {
  const [featured, ...rest] = docs;

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(225,30%,4%)]">
      <Helmet>
        <title>DevDocs — Referências visuais para desenvolvedores</title>
        <meta name="description" content="Hub de documentação visual interativa: GitDoc, ShellDoc, UbuntuDoc e WinDoc." />
      </Helmet>

      {/* grid de fundo */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-16">
        <motion.div initial="hidden" animate="show" variants={stagger} className="w-full max-w-2xl flex flex-col gap-3">

          {/* wordmark */}
          <motion.div variants={fadeUp} className="mb-6 text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/20 mb-3">
              documentação visual
            </p>
            <h1 className="text-5xl font-black tracking-tight">
              <span className="text-white/85">Dev</span><span className="text-white/18 font-light">Docs</span>
            </h1>
            <p className="text-xs text-white/25 mt-2 font-mono">
              git · shell · linux · windows
            </p>
          </motion.div>

          {/* card principal */}
          <motion.div variants={fadeUp}>
            <Link to={featured.path}>
              <FeaturedCard doc={featured} />
            </Link>
          </motion.div>

          {/* cards em breve */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
            {rest.map((doc) => (
              <SmallCard key={doc.id} doc={doc} />
            ))}
          </motion.div>

        </motion.div>
      </div>

      <footer className="relative border-t border-white/[0.04] py-4">
        <p className="text-center text-[10px] text-white/15 font-mono">
          devdocs · documentação visual e interativa
        </p>
      </footer>
    </div>
  );
}
