import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";
import { CheckCircle, XCircle, AlertTriangle, Wrench } from "lucide-react";

const types = [
  { type: "feat", emoji: "✨", color: "text-green-500", description: "Nova funcionalidade para o usuário", example: "feat: adiciona login com Google" },
  { type: "fix", emoji: "🐛", color: "text-red-500", description: "Correção de bug", example: "fix: corrige validação de e-mail no cadastro" },
  { type: "docs", emoji: "📚", color: "text-blue-500", description: "Apenas documentação (README, comentários, etc.)", example: "docs: atualiza instruções de instalação" },
  { type: "style", emoji: "💅", color: "text-purple-500", description: "Formatação, espaços, vírgulas — sem mudança de lógica", example: "style: formata arquivos com prettier" },
  { type: "refactor", emoji: "♻️", color: "text-yellow-500", description: "Refatoração de código sem nova feature nem bug fix", example: "refactor: extrai lógica de autenticação para hook" },
  { type: "test", emoji: "🧪", color: "text-cyan-500", description: "Adiciona ou corrige testes", example: "test: adiciona testes unitários para UserService" },
  { type: "chore", emoji: "🔧", color: "text-gray-500", description: "Tarefas de build, CI, dependências — sem mudança de código de produção", example: "chore: atualiza dependências do projeto" },
  { type: "perf", emoji: "⚡", color: "text-orange-500", description: "Melhoria de performance", example: "perf: otimiza query de busca de usuários" },
  { type: "ci", emoji: "🤖", color: "text-indigo-500", description: "Mudanças em configuração de CI/CD", example: "ci: adiciona step de lint no GitHub Actions" },
  { type: "build", emoji: "🏗️", color: "text-amber-500", description: "Mudanças no sistema de build ou dependências externas", example: "build: migra de webpack para vite" },
  { type: "revert", emoji: "⏪", color: "text-rose-500", description: "Reverte um commit anterior", example: "revert: feat: adiciona login com Google" },
];

const goodExamples = [
  { msg: 'feat(auth): adiciona autenticação via OAuth2', reason: "Tipo claro, escopo entre parênteses, descrição específica no imperativo" },
  { msg: 'fix(api): corrige timeout em requisições lentas', reason: "Explica o que foi corrigido sem ambiguidade" },
  { msg: 'refactor(checkout): extrai validação de endereço para serviço próprio', reason: "Descreve exatamente o que foi feito, sem detalhe desnecessário" },
  { msg: 'feat!: remove suporte ao Node.js 14', reason: "O ! indica breaking change de forma explícita" },
];

const badExamples = [
  { msg: 'fix stuff', reason: "Demasiado vago — o que foi corrigido?" },
  { msg: 'WIP', reason: "Work In Progress não deve ser commitado na branch principal" },
  { msg: 'ajustes finais', reason: "Sem informação útil sobre o que mudou" },
  { msg: 'updated login page and fixed some bugs and also refactored auth and added tests', reason: "Mistura múltiplas responsabilidades — divide em commits separados" },
];

const tools = [
  { name: "Commitizen", desc: "CLI interativo que guia você a escrever commits no formato correto", url: "https://commitizen-tools.github.io/commitizen/" },
  { name: "commitlint", desc: "Valida mensagens de commit automaticamente (integra com Husky)", url: "https://commitlint.js.org/" },
  { name: "Husky", desc: "Configura Git hooks facilmente — bloqueia commit com mensagem inválida", url: "https://typicode.github.io/husky/" },
  { name: "Conventional Changelog", desc: "Gera CHANGELOG.md automaticamente a partir dos commits", url: "https://github.com/conventional-changelog/conventional-changelog" },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Conventions() {
  return (
    <div className="container px-4 py-12 max-w-3xl">
      <motion.div initial="hidden" animate="show" variants={stagger}>
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Convenções de Commit</h1>
          <p className="text-muted-foreground">
            O padrão <strong>Conventional Commits</strong> torna o histórico legível por humanos e máquinas —
            facilita geração automática de changelogs, versionamento semântico e revisão de código.
          </p>
        </motion.div>

        {/* Formato */}
        <motion.section variants={fadeUp} className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Formato</h2>
          <div className="glass-card p-4 font-mono text-sm mb-4">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-green-500 font-bold">tipo</span>
              <span className="text-muted-foreground">(</span>
              <span className="text-blue-500">escopo</span>
              <span className="text-muted-foreground">)</span>
              <span className="text-yellow-500 font-bold">!</span>
              <span className="text-muted-foreground">: </span>
              <span className="text-foreground">descrição curta no imperativo</span>
            </div>
            <div className="mt-2 text-muted-foreground text-xs space-y-0.5">
              <div><span className="text-foreground">corpo</span> (opcional — detalha o porquê da mudança)</div>
              <div></div>
              <div><span className="text-foreground">BREAKING CHANGE:</span> descrição (opcional — indica mudança incompatível)</div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><span className="text-green-500 font-mono font-semibold">tipo</span> — obrigatório. Define a natureza da mudança (feat, fix, docs…)</p>
            <p><span className="text-blue-500 font-mono font-semibold">escopo</span> — opcional. Especifica o contexto afetado (auth, api, ui…)</p>
            <p><span className="text-yellow-500 font-mono font-semibold">!</span> — opcional. Indica breaking change (equivale a BREAKING CHANGE no rodapé)</p>
            <p><span className="font-mono font-semibold">descrição</span> — obrigatória. Curta, no imperativo, sem maiúscula inicial, sem ponto final</p>
          </div>
        </motion.section>

        {/* Tipos */}
        <motion.section variants={fadeUp} className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Tipos</h2>
          <div className="space-y-2">
            {types.map((t) => (
              <div key={t.type} className="glass-card p-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 w-32 shrink-0">
                    <span>{t.emoji}</span>
                    <code className={`font-mono text-sm font-bold ${t.color}`}>{t.type}</code>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">{t.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs text-muted-foreground/70 font-mono truncate">{t.example}</code>
                      <CopyButton text={t.example} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Breaking Changes */}
        <motion.section variants={fadeUp} className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Breaking Changes</h2>
          <div className="glass-card p-4 border border-destructive/30">
            <div className="flex gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Indica mudança incompatível com versões anteriores. Deve incrementar o <strong>MAJOR</strong> no versionamento semântico.
              </p>
            </div>
            <div className="space-y-2">
              {[
                { code: 'feat!: remove endpoint /v1/users', label: "Usando ! no tipo" },
                { code: 'feat(api)!: altera formato de resposta da autenticação', label: "Com escopo + !" },
                { code: 'feat: nova versão da API\n\nBREAKING CHANGE: /v1/users foi removido, use /v2/users', label: "Usando rodapé BREAKING CHANGE" },
              ].map((ex, i) => (
                <div key={i}>
                  <p className="text-xs text-muted-foreground mb-1">{ex.label}</p>
                  <div className="flex items-start gap-2">
                    <pre className="code-block flex-1 text-xs whitespace-pre-wrap">{ex.code}</pre>
                    <CopyButton text={ex.code} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Bons vs Ruins */}
        <motion.section variants={fadeUp} className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Exemplos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-green-500 flex items-center gap-1 mb-3">
                <CheckCircle className="h-4 w-4" /> Bons commits
              </h3>
              <div className="space-y-2">
                {goodExamples.map((ex, i) => (
                  <div key={i} className="glass-card p-3 border border-green-500/20">
                    <div className="flex items-start gap-2 mb-1">
                      <code className="font-mono text-xs text-foreground flex-1">{ex.msg}</code>
                      <CopyButton text={ex.msg} />
                    </div>
                    <p className="text-xs text-muted-foreground">{ex.reason}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-destructive flex items-center gap-1 mb-3">
                <XCircle className="h-4 w-4" /> Ruins
              </h3>
              <div className="space-y-2">
                {badExamples.map((ex, i) => (
                  <div key={i} className="glass-card p-3 border border-destructive/20">
                    <code className="font-mono text-xs text-muted-foreground line-through block mb-1">{ex.msg}</code>
                    <p className="text-xs text-muted-foreground">{ex.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Dicas rápidas */}
        <motion.section variants={fadeUp} className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Regras de ouro</h2>
          <ul className="space-y-2">
            {[
              "Use o imperativo: 'adiciona', 'corrige', 'remove' — não 'adicionado' ou 'adicionando'",
              "Limite a descrição a ~72 caracteres para caber em git log --oneline",
              "Use o corpo para explicar o PORQUÊ, não o que — o código já mostra o que mudou",
              "Um commit = um propósito. Se você precisou de 'e' para descrever, considere dividir",
              "Nunca commite código que quebra a build — a main deve sempre estar deployável",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Ferramentas */}
        <motion.section variants={fadeUp}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Ferramentas para automatizar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tools.map((tool) => (
              <div key={tool.name} className="glass-card p-4">
                <p className="font-semibold text-sm mb-1">{tool.name}</p>
                <p className="text-xs text-muted-foreground">{tool.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Especificação completa:{" "}
            <a
              href="https://www.conventionalcommits.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              conventionalcommits.org
            </a>
          </p>
        </motion.section>
      </motion.div>
    </div>
  );
}
