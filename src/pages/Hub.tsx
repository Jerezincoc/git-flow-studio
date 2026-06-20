import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { GitBranch, Terminal, ArrowRight, Clock, Cpu } from "lucide-react";
import { GIT_LAST_PATH_KEY } from "@/components/Layout";
import { SHELL_LAST_PATH_KEY } from "@/components/ShellLayout";
import { LINUX_LAST_PATH_KEY } from "@/components/LinuxLayout";
import { SEO } from "@/components/SEO";

/* ─── Ícone Linux ───────────────────────────────────────────────────── */

function LinuxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── GitAnimation ───────────────────────────────────────────────────── */

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
const WAVE_OFFSETS = [0, 2.5, 5];
const CYCLE = 8;

function GitAnimation() {
  return (
    <svg viewBox="0 0 360 280" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      {WAVE_OFFSETS.map((wo, wi) =>
        GRAPH.edges.map((e, i) => (
          <motion.path key={`w${wi}-e${i}`} d={e.d} stroke="currentColor" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0,1,1,0], opacity: [0,0.28,0.28,0] }}
            transition={{ duration: CYCLE*0.7, delay: wo + e.wave*0.35 + i*0.18, repeat: Infinity, repeatDelay: CYCLE*0.3, ease:"easeInOut" }}
          />
        ))
      )}
      {WAVE_OFFSETS.map((wo, wi) =>
        GRAPH.nodes.map((n, i) => (
          <motion.circle key={`w${wi}-n${i}`} cx={n.cx} cy={n.cy} r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0,1,1,0], opacity: [0,0.45,0.45,0] }}
            transition={{ duration: CYCLE*0.7, delay: wo + i*0.16 + 0.2, repeat: Infinity, repeatDelay: CYCLE*0.3, ease:"backOut" }}
          />
        ))
      )}
    </svg>
  );
}

/* ─── ShellAnimation — linhas de terminal aparecendo ────────────────── */

const SHELL_LINES = [
  { text: "Get-ChildItem -Recurse *.ps1", x: 24, y: 48  },
  { text: "Where-Object { $_.CPU -gt 10 }", x: 24, y: 90  },
  { text: "Select-Object Name, CPU, Id", x: 24, y: 132 },
  { text: "Sort-Object -Descending", x: 24, y: 174 },
  { text: "Invoke-WebRequest $url", x: 24, y: 216 },
  { text: "ForEach-Object { $_ * 2 }", x: 24, y: 248 },
];
const PROMPT_OFFSETS = [0, 1.8, 3.6, 5.4, 7.2, 9.0];
const SHELL_CYCLE = 12;

function ShellAnimation() {
  return (
    <svg viewBox="0 0 360 280" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      {SHELL_LINES.map((line, i) => {
        const delay = PROMPT_OFFSETS[i % PROMPT_OFFSETS.length];
        return (
          <g key={i}>
            {/* prompt PS> */}
            <motion.text x={line.x} y={line.y} fontSize="11" fontFamily="monospace" fill="currentColor"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.55, 0.55, 0] }}
              transition={{ duration: SHELL_CYCLE * 0.75, delay, repeat: Infinity, repeatDelay: SHELL_CYCLE * 0.25, ease: "easeInOut" }}
            >
              PS&gt;
            </motion.text>
            {/* comando */}
            <motion.text x={line.x + 36} y={line.y} fontSize="11" fontFamily="monospace" fill="currentColor"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.32, 0.32, 0] }}
              transition={{ duration: SHELL_CYCLE * 0.75, delay: delay + 0.4, repeat: Infinity, repeatDelay: SHELL_CYCLE * 0.25, ease: "easeInOut" }}
            >
              {line.text}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── dados por layer ────────────────────────────────────────────────── */

export const LAST_LAYER_KEY = "devdocs-last-layer";

const lastPathKeys: Record<string, string> = {
  git:   GIT_LAST_PATH_KEY,
  shell: SHELL_LAST_PATH_KEY,
  linux: LINUX_LAST_PATH_KEY,
};

const docStats: Record<string, { value: string; label: string }[]> = {
  git: [
    { value: "31",   label: "comandos" },
    { value: "18",   label: "problemas" },
    { value: "120+", label: "flags" },
  ],
  shell: [
    { value: "33",   label: "cmdlets" },
    { value: "15",   label: "problemas" },
    { value: "9",    label: "anatomias" },
  ],
  linux: [
    { value: "23",   label: "comandos" },
    { value: "8",    label: "cenários" },
    { value: "4",    label: "categorias" },
  ],
};

const docGuideLinks: Record<string, string | undefined> = {
  git:   "/guide",
  shell: "/shell/guide",
};

const docAnimations: Record<string, React.FC> = {
  git:   GitAnimation,
  shell: ShellAnimation,
  linux: ShellAnimation,
};

const smallPreviews: Record<string, string[]> = {
  git:    ["git commit", "git rebase", "git cherry-pick", "git bisect"],
  shell:  ["Get-ChildItem", "Where-Object", "Select-Object", "Invoke-WebRequest"],
  linux:  ["find -type f", "chmod 755", "grep -r", "systemctl status"],
  win:    ["dir /s /b", "ipconfig /all", "tasklist /fi", "sfc /scannow"],
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
    description: "33 cmdlets PowerShell com flags, variações, exemplos e a anatomia de cada sintaxe explicada em português.",
    glow: "0 0 55px rgba(99,102,241,0.2)",
    border: "rgba(99,102,241,0.32)",
    accent: "rgba(99,102,241,0.07)",
    symbolColor: "text-indigo-400",
    available: true,
  },
  {
    id: "linux", name: "LinuxDoc", path: "/linux", icon: LinuxIcon,
    description: "Comandos Linux, permissões, processos, rede, serviços e cenários práticos de terminal num só lugar.",
    glow: "0 0 55px rgba(34,197,94,0.18)",
    border: "rgba(34,197,94,0.32)",
    accent: "rgba(34,197,94,0.07)",
    symbolColor: "text-green-400",
    available: true,
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

function FeaturedCard({ doc, destination }: { doc: typeof docs[0]; destination: string }) {
  const [hovered, setHovered] = useState(false);
  const Icon = doc.icon;
  const Animation = docAnimations[doc.id] ?? GitAnimation;
  const stats = docStats[doc.id] ?? docStats.git;
  const guideLink = docGuideLinks[doc.id];

  return (
    <Link to={destination}>
      <motion.div
        initial="rest"
        whileHover="hover"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{ "--glow": doc.glow, "--border-h": doc.border, "--accent": doc.accent } as React.CSSProperties}
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[hsl(225,25%,6%)] cursor-pointer
          hover:border-[var(--border-h)] hover:shadow-[var(--glow)] transition-[border-color,box-shadow] duration-500"
      >
        {/* animação de fundo específica do layer */}
        <div className={`absolute inset-0 ${doc.symbolColor} pointer-events-none`}>
          <Animation />
        </div>

        {/* máscara gradiente */}
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
              <motion.div variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: -9, scale: 1.12, transition: { type: "spring", stiffness: 280 } } }}>
                <Icon className={`h-6 w-6 ${doc.symbolColor}`} />
              </motion.div>
              <span className="text-2xl font-bold tracking-tight text-white/90">{doc.name}</span>
            </div>
            <span className="text-[10px] font-mono text-white/25 border border-white/10 px-2 py-0.5 rounded-full">
              disponível
            </span>
          </div>

          {/* stats */}
          <div className="flex items-center gap-5">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-1">
                <span className={`text-sm font-bold font-mono ${doc.symbolColor}`}>{s.value}</span>
                <span className="text-[11px] text-white/30">{s.label}</span>
              </div>
            ))}
          </div>

          {/* descrição no hover */}
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
            {guideLink && (
              <Link
                to={guideLink}
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] text-white/25 hover:text-white/60 transition-colors underline underline-offset-2"
              >
                novo aqui? → Guia para iniciantes
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── SmallCard ──────────────────────────────────────────────────────── */

function SmallCard({ doc, destination }: { doc: typeof docs[0]; destination: string }) {
  const [hovered, setHovered] = useState(false);
  const Icon = doc.icon;
  const previews = smallPreviews[doc.id] ?? [];

  const inner = (
    <div className="relative z-10 p-5 flex flex-col gap-3 min-h-[148px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-3.5 w-3.5 ${doc.symbolColor}`} />
          <span className="font-semibold text-sm text-white/80">{doc.name}</span>
        </div>
        {!doc.available && (
          <div className="flex items-center gap-1 text-[9px] text-white/25">
            <Clock className="h-2.5 w-2.5" />
            em breve
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {previews.map((p) => (
          <span key={p} className="font-mono text-[9px] text-white/25 bg-white/[0.04] px-1.5 py-0.5 rounded">
            {p}
          </span>
        ))}
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.p
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="text-[11px] text-white/[0.38] leading-relaxed"
          >
            {doc.description}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  const motionProps = {
    initial: "rest", whileHover: "hover",
    onHoverStart: () => setHovered(true),
    onHoverEnd:   () => setHovered(false),
    style: { "--border-h": doc.border } as React.CSSProperties,
    className: `relative overflow-hidden rounded-2xl border border-white/[0.05] bg-[hsl(225,25%,6%)]
      hover:border-[var(--border-h)] transition-[border-color,opacity] duration-500
      ${doc.available ? "cursor-pointer" : "opacity-50 hover:opacity-85"}`,
  };

  if (doc.available) {
    return (
      <motion.div {...motionProps}>
        <Link to={destination} className="block">{inner}</Link>
      </motion.div>
    );
  }
  return <motion.div {...motionProps}>{inner}</motion.div>;
}

/* ─── Hub ─────────────────────────────────────────────────────────────── */

const fadeUp = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.11 } } };

export default function Hub() {
  // determina qual layer foi visitado por último
  const lastLayer = localStorage.getItem(LAST_LAYER_KEY) ?? "git";
  const featuredIndex = docs.findIndex((d) => d.id === lastLayer && d.available);
  const featuredDoc = docs[featuredIndex !== -1 ? featuredIndex : 0];
  const restDocs = docs.filter((d) => d.id !== featuredDoc.id);

  const getDestination = (doc: typeof docs[0]) => {
    const key = lastPathKeys[doc.id];
    return (key && localStorage.getItem(key)) ?? doc.path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(225,30%,4%)]">
      <SEO
        title="Hub"
        description="Hub de documentacao visual interativa do Git Flow Studio: GitDoc, ShellDoc, LinuxDoc e WinDoc."
        path="/"
      />

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

          {/* card principal — último layer visitado */}
          <motion.div variants={fadeUp}>
            <AnimatePresence mode="wait">
              <motion.div
                key={featuredDoc.id}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.32, ease: "easeInOut" }}
              >
                <FeaturedCard doc={featuredDoc} destination={getDestination(featuredDoc)} />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* demais cards */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {restDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                >
                  <SmallCard doc={doc} destination={getDestination(doc)} />
                </motion.div>
              ))}
            </AnimatePresence>
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
