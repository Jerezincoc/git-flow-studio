# Git Flow Studio — Documentação Técnica Completa

> Plataforma visual e interativa de documentação para Git e PowerShell, construída com React + TypeScript + Vite.

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Arquitetura e Fluxo de Dados](#arquitetura-e-fluxo-de-dados)
5. [Módulos da Aplicação](#módulos-da-aplicação)
   - [Hub (Página Inicial)](#hub-página-inicial)
   - [GitDoc](#gitdoc)
   - [ShellDoc](#shelldoc)
6. [Roteamento](#roteamento)
7. [Componentes Principais](#componentes-principais)
8. [Estrutura de Dados](#estrutura-de-dados)
9. [Sistema de Estilização](#sistema-de-estilização)
10. [Hooks e Utilitários](#hooks-e-utilitários)
11. [Funcionalidades de UX](#funcionalidades-de-ux)
12. [Configurações e Build](#configurações-e-build)
13. [Como Contribuir](#como-contribuir)
14. [Roadmap](#roadmap)

---

## Visão Geral

**Git Flow Studio** é uma SPA (Single Page Application) moderna projetada para ser ao mesmo tempo uma ferramenta de aprendizado e uma referência profissional de uso diário. A plataforma reúne dois grandes módulos de documentação:

| Módulo | Descrição | Cor temática |
|--------|-----------|--------------|
| **GitDoc** | 31 comandos Git com exemplos, flags, variações, problemas e guia passo a passo | Cyan (`hsl(190, 100%, 50%)`) |
| **ShellDoc** | 33 cmdlets PowerShell com a mesma riqueza de conteúdo do GitDoc | Blue (`hsl(210, 100%, 56%)`) |

Dois módulos adicionais estão planejados e indicados no Hub como "em breve":

- **UbuntuDoc** — comandos Linux/Bash
- **WinDoc** — Windows CMD e scripts

---

## Stack Tecnológica

### Núcleo

| Categoria | Tecnologia | Versão |
|-----------|-----------|--------|
| Framework UI | React | 18.3 |
| Linguagem | TypeScript | 5.8 |
| Build tool | Vite + SWC | 5.4 |
| Estilização | TailwindCSS | 3.4 |
| Roteamento | React Router | 6.30 |

### Componentes e UI

| Biblioteca | Papel |
|-----------|-------|
| **shadcn/ui** | Sistema de componentes (baseado em Radix UI) |
| **Radix UI** | Primitivos acessíveis (Dialog, Tabs, Tooltip, Popover, etc.) |
| **Framer Motion** | Animações e transições suaves |
| **Lucide React** | Ícones SVG (0.462) |
| **next-themes** | Gerenciamento de tema (dark/light) |

### Estado e Dados

| Biblioteca | Papel |
|-----------|-------|
| **TanStack Query (React Query)** | Fetching e caching de dados (v5.83) |
| **React Hook Form** | Gerenciamento de formulários (v7.61) |
| **Zod** | Validação de schemas (v3.25) |
| **LocalStorage** | Persistência de favoritos, histórico e último caminho |

### Utilitários

| Biblioteca | Papel |
|-----------|-------|
| **clsx + tailwind-merge** | Composição segura de classes Tailwind |
| **class-variance-authority** | Variantes de componentes (CVA) |
| **Sonner** | Notificações toast |
| **react-helmet-async** | SEO por página (meta tags, OG, Twitter) |
| **date-fns** | Manipulação de datas |
| **cmdk** | Command palette |
| **vaul** | Drawer/sheet component |
| **react-resizable-panels** | Painéis redimensionáveis |

### Testes

| Ferramenta | Escopo |
|-----------|--------|
| **Vitest** | Testes unitários e de integração |
| **Playwright** | Testes end-to-end |
| **React Testing Library** | Testes de componentes |

### Infraestrutura

- **Vercel** — deploy contínuo (configurado via `vercel.json`)
- **ESLint 9** — linting com TypeScript ESLint 8.38

---

## Estrutura de Pastas

```
git-flow-studio/
├── public/                        # Assets estáticos (favicons, manifest)
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui — 60+ componentes prontos
│   │   ├── Layout.tsx             # Layout wrapper do GitDoc
│   │   ├── ShellLayout.tsx        # Layout wrapper do ShellDoc
│   │   ├── Hub.tsx                # Componente da Hub page
│   │   ├── SearchDialog.tsx       # Command palette global (Cmd+K)
│   │   ├── GitFlowMap.tsx         # Diagrama visual do fluxo Git
│   │   ├── CopyButton.tsx         # Botão de cópia com feedback
│   │   ├── SEO.tsx                # Gerenciador de meta tags por página
│   │   ├── NavLink.tsx            # Link de navegação ativo
│   │   └── ThemeToggle.tsx        # Toggle dark/light mode
│   ├── pages/
│   │   ├── Hub.tsx                # Página inicial (seletor de módulos)
│   │   ├── Index.tsx              # GitDoc home
│   │   ├── Commands.tsx           # Lista de comandos Git
│   │   ├── CommandDetail.tsx      # Detalhe de um comando Git
│   │   ├── Problems.tsx           # Lista de problemas Git
│   │   ├── ProblemDetail.tsx      # Detalhe de um problema Git
│   │   ├── Guide.tsx              # Guia passo a passo Git
│   │   ├── GitMap.tsx             # Mapa visual Git
│   │   ├── CheatSheet.tsx         # Cheat Sheet imprimível (Git)
│   │   ├── Conventions.tsx        # Conventional Commits
│   │   ├── ShellHome.tsx          # ShellDoc home
│   │   ├── NotFound.tsx           # Página 404
│   │   └── shell/
│   │       ├── ShellCommands.tsx
│   │       ├── ShellCommandDetail.tsx
│   │       ├── ShellCheatSheet.tsx
│   │       ├── ShellGuide.tsx
│   │       ├── ShellProblems.tsx
│   │       ├── ShellProblemDetail.tsx
│   │       └── ShellComingSoon.tsx
│   ├── data/
│   │   ├── commands.ts            # 31 comandos Git (1865 linhas)
│   │   ├── problems.ts            # 18+ problemas Git com soluções
│   │   ├── shellCommands.ts       # 33 cmdlets PowerShell (1459 linhas)
│   │   └── shellProblems.ts       # Problemas e soluções PowerShell
│   ├── hooks/
│   │   ├── useLocalStorage.ts     # Estado persistido em localStorage
│   │   ├── use-mobile.tsx         # Detecção de breakpoint mobile
│   │   └── use-toast.ts           # Hook de notificações toast
│   ├── lib/
│   │   └── utils.ts               # cn() — combina clsx + tailwind-merge
│   ├── test/
│   │   ├── example.test.ts
│   │   └── setup.ts
│   ├── App.tsx                    # Componente raiz com todas as rotas
│   ├── main.tsx                   # Entry point ReactDOM
│   ├── index.css                  # Estilos globais + Tailwind directives
│   └── vite-env.d.ts
├── index.html                     # HTML shell (pt-BR, dark mode por padrão)
├── package.json
├── tsconfig.json                  # Path alias @/* → ./src/*
├── tailwind.config.ts             # Tema customizado e animações
├── vite.config.ts                 # Dev server porta 8080, alias @/*
├── vitest.config.ts
├── eslint.config.js
├── postcss.config.js
├── components.json                # Configuração shadcn/ui
└── vercel.json                    # Configuração de deploy
```

---

## Arquitetura e Fluxo de Dados

### Padrão geral

A aplicação segue uma arquitetura **data-driven** com dados estáticos definidos em arquivos TypeScript dentro de `src/data/`. Não há backend nem API externa — toda a informação está bundled na aplicação.

```
src/data/*.ts
      │
      ▼
  pages/*.tsx  ──(props/direct import)──►  components/*.tsx
      │
      ▼
  Layout / ShellLayout   (nav, search, theme)
      │
      ▼
  index.html  ◄──  App.tsx (React Router)
```

### Persistência local

Três informações são salvas em `localStorage`:

| Chave | Conteúdo | Usado por |
|-------|---------|-----------|
| `gitFavorites` | Array de IDs de comandos Git favoritados | Commands.tsx, CommandDetail.tsx |
| `shellFavorites` | Array de IDs de cmdlets favoritados | ShellCommands.tsx |
| `lastVisitedPath` | Último path de módulo visitado | Hub.tsx (featured card dinâmico) |

---

## Módulos da Aplicação

### Hub (Página Inicial)

**Rota:** `/`

O Hub é o ponto de entrada da plataforma. Exibe cards para cada módulo disponível com:

- **Featured Card dinâmico** — o módulo visitado por último (lido do `localStorage`) ganha destaque animado com transição suave via Framer Motion.
- **Cards secundários** — os demais módulos aparecem em grid menor.
- **Cards "em breve"** — UbuntuDoc e WinDoc aparecem com badge de "Em breve" e estão desabilitados.
- **Animações de entrada** — cada card aparece com `fade-in-up` escalonado.

---

### GitDoc

Módulo de documentação do Git. Todas as páginas são envoltas pelo `<Layout>`.

#### Páginas

| Página | Rota | Descrição |
|--------|------|-----------|
| **Index** | `/git` | Hero page com objetivos e destaques do módulo |
| **Commands** | `/git/commands` | Lista filtrável de 31 comandos por categoria |
| **CommandDetail** | `/git/commands/:id` | Página completa de um único comando |
| **Guide** | `/git/guide` | Guia de aprendizado com 8+ capítulos expansíveis |
| **Problems** | `/git/problems` | 18+ problemas comuns com cards clicáveis |
| **ProblemDetail** | `/git/problems/:id` | Solução passo a passo de um problema |
| **CheatSheet** | `/git/cheatsheet` | Referência compacta filtrável e imprimível |
| **Conventions** | `/git/conventions` | Guia de Conventional Commits |
| **GitMap** | `/git/map` | Diagrama visual interativo do fluxo Git |

#### Funcionalidades específicas

- **Filtros por categoria**: Basics, Branching, Remote, Info, Undoing
- **Sistema de favoritos**: toggle com ícone estrela, persistido em localStorage
- **Tabs em CommandDetail**: Sintaxe, Variações, Flags, Exemplos, Curiosidades
- **Deep Dive**: explicação aprofundada em CommandDetail
- **Quando não usar**: aviso de boas práticas em cada comando
- **Cross-linking**: links diretos para comandos relacionados
- **Histórico de visitas**: rastreia páginas visitadas para preencher a search palette com "Recentes"
- **Print CSS**: CheatSheet tem estilos de impressão para exportar como PDF

---

### ShellDoc

Módulo espelho do GitDoc, com foco em cmdlets PowerShell.

**Tema visual**: azul (`data-theme="shell"`) em contraste ao cyan do GitDoc.

#### Páginas

| Página | Rota | Descrição |
|--------|------|-----------|
| **ShellHome** | `/shell` | Hero page do módulo PowerShell |
| **ShellCommands** | `/shell/commands` | 33 cmdlets filtráveis por categoria |
| **ShellCommandDetail** | `/shell/commands/:id` | Detalhe completo de um cmdlet |
| **ShellGuide** | `/shell/guide` | Guia de aprendizado PowerShell |
| **ShellProblems** | `/shell/problems` | Problemas e erros comuns |
| **ShellProblemDetail** | `/shell/problems/:id` | Solução de um erro PowerShell |
| **ShellCheatSheet** | `/shell/cheatsheet` | Referência compacta filtrável |

#### Categorias de cmdlets

| Categoria | Exemplos |
|-----------|---------|
| Navigation | `Set-Location`, `Get-Location`, `Push-Location` |
| Files | `New-Item`, `Remove-Item`, `Copy-Item`, `Move-Item` |
| Content | `Get-Content`, `Set-Content`, `Add-Content` |
| Pipeline | `Where-Object`, `Select-Object`, `ForEach-Object` |
| System | `Get-Process`, `Stop-Process`, `Get-Service` |
| Network | `Invoke-WebRequest`, `Test-Connection` |

---

## Roteamento

Todas as rotas estão definidas em `src/App.tsx` usando React Router v6:

```
/                          → Hub
/git                       → GitDoc Index
/git/commands              → Commands
/git/commands/:id          → CommandDetail
/git/guide                 → Guide
/git/problems              → Problems
/git/problems/:id          → ProblemDetail
/git/cheatsheet            → CheatSheet
/git/conventions           → Conventions
/git/map                   → GitMap
/shell                     → ShellHome
/shell/commands            → ShellCommands
/shell/commands/:id        → ShellCommandDetail
/shell/guide               → ShellGuide
/shell/problems            → ShellProblems
/shell/problems/:id        → ShellProblemDetail
/shell/cheatsheet          → ShellCheatSheet
*                          → NotFound (404)
```

**Nota:** as rotas legadas `/` e `/commands` (sem prefixo `/git`) são mantidas via redirect ou alias para compatibilidade retroativa.

---

## Componentes Principais

### `Layout.tsx`

Header fixo do GitDoc com:
- Branding + logo
- Links de navegação principal
- Botão de busca (abre SearchDialog)
- ThemeToggle
- Menu mobile (Sheet do Radix)
- Persiste o `lastVisitedPath` em localStorage ao navegar

### `ShellLayout.tsx`

Versão espelho do Layout com tema azul e navegação ShellDoc.

### `SearchDialog.tsx`

Command palette global ativado por `Cmd+K` / `Ctrl+K`. Funcionalidades:

- **Grupos de resultado**: Recentes (histórico), Comandos Git, Problemas Git, Páginas estáticas
- **Busca fuzzy**: filtra por `name`, `description`, variações e flags
- **Atalho de teclado**: fechamento via `Escape`
- **Navegação por teclado**: setas up/down + Enter para navegar

### `GitFlowMap.tsx`

Diagrama visual de 4 estágios do fluxo Git:

```
Working Directory → Staging Area → Local Repository → Remote Repository
     (git add)         (git commit)       (git push)
```

- Cards de estágio com comandos associados
- Setas de fluxo animadas
- Efeitos de hover e ativação
- Sequence "zero to push" para iniciantes

### `CopyButton.tsx`

Botão de cópia para clipboard com:
- Feedback visual (ícone Check por 2s após copiar)
- Animação de transição suave
- Suporte a qualquer texto como prop

### `SEO.tsx`

Wrapper de `react-helmet-async` que injeta por página:
- `<title>` dinâmico
- `<meta name="description">`
- Open Graph (og:title, og:description, og:image)
- Twitter Card
- URL canônica

### `ThemeToggle.tsx`

Botão que alterna entre dark e light mode via `next-themes`. Persiste no sistema e respeita a preferência do SO.

---

## Estrutura de Dados

### `GitCommand` (`src/data/commands.ts`)

```typescript
interface GitCommand {
  id: string;                      // slug único (ex: "git-commit")
  name: string;                    // nome do comando (ex: "git commit")
  description: string;             // descrição curta
  syntax: string;                  // sintaxe principal
  category: "basics" | "branching" | "remote" | "info" | "undoing";
  uses: string[];                  // casos de uso
  variations: CommandVariation[];  // variações com sintaxe e descrição
  examples: CommandExample[];      // exemplos com código e explicação
  whenNotToUse: string[];          // anti-patterns e avisos
  relatedCommands: string[];       // IDs de comandos relacionados
  deepDive?: string;               // explicação aprofundada (markdown-like)
  flags?: GitFlag[];               // flags individuais documentadas
  curiosities?: string[];          // fatos curiosos sobre o comando
}

interface CommandVariation {
  syntax: string;
  description: string;
}

interface CommandExample {
  code: string;
  explanation: string;
}

interface GitFlag {
  flag: string;
  description: string;
}
```

**Total: 31 comandos, 120+ flags documentadas.**

Comandos cobertos (por categoria):

| Categoria | Comandos |
|-----------|---------|
| **Basics** | `init`, `clone`, `add`, `commit`, `status`, `log`, `diff` |
| **Branching** | `branch`, `checkout`, `switch`, `merge`, `rebase`, `stash`, `worktree` |
| **Remote** | `remote`, `fetch`, `pull`, `push`, `submodule` |
| **Info** | `show`, `blame`, `bisect`, `shortlog`, `describe` |
| **Undoing** | `reset`, `revert`, `restore`, `rm`, `clean`, `reflog` |

---

### `GitProblem` (`src/data/problems.ts`)

```typescript
interface GitProblem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  steps: ProblemStep[];
  expectedResult: string;
}

interface ProblemStep {
  description: string;
  command?: string;        // comando a executar (exibido com CopyButton)
  warning?: string;        // aviso de risco
  note?: string;           // nota informativa
}
```

**18+ cenários documentados**, incluindo:
- Commit na branch errada
- Conflitos de merge
- Desfazer commits (locais e já publicados)
- Recuperar arquivos deletados
- Detached HEAD
- Arquivos grandes no histórico
- Credenciais incorretas
- Divergência entre local e remoto

---

### `ShellCommand` (`src/data/shellCommands.ts`)

Mesma estrutura de `GitCommand`, adaptada para PowerShell. 33 cmdlets com:
- Sintaxe com partes rotuladas (ex: `[CmdletName] [-Parameter] [<Value>]`)
- Exemplos práticos
- Flags e aliases
- Cross-links entre cmdlets relacionados

---

## Sistema de Estilização

### Tema de cores (CSS variables)

Definidas em `src/index.css` com suporte a dark/light:

```css
/* Dark mode (padrão) */
--background: hsl(225, 30%, 5%);
--foreground: hsl(210, 40%, 98%);
--primary: hsl(190, 100%, 50%);      /* GitDoc: cyan */
--card: hsl(225, 25%, 8%);
--border: hsl(225, 20%, 15%);
--muted: hsl(225, 15%, 20%);
```

O ShellDoc sobrescreve a primary via `data-theme="shell"`:

```css
[data-theme="shell"] {
  --primary: hsl(210, 100%, 56%);    /* azul */
}
```

### Classes utilitárias customizadas

| Classe | Efeito |
|--------|--------|
| `.glass-card` | `backdrop-blur` + borda sutil + fundo semitransparente |
| `.glow-cyan` | `box-shadow` com brilho cyan |
| `.glow-blue` | `box-shadow` com brilho azul |
| `.gradient-text` | Texto com gradiente linear |
| `.btn-glow` | Botão com efeito de glow no hover |
| `.code-block` | Área de código com font JetBrains Mono e fundo escuro |
| `.hero-gradient` | Gradiente de fundo para seções hero |
| `.flow-node` | Nó do diagrama de fluxo com borda animada |
| `.objective-card` | Card com transform de hover e gradiente sutil |

### Animações customizadas (Tailwind + Framer Motion)

**Via Tailwind:**
- `animate-fade-in` — opacidade 0 → 1
- `animate-fade-in-up` — opacidade + translate Y
- `animate-scale-in` — escala 0.95 → 1
- `animate-pulse-glow` — pulsação de glow

**Via Framer Motion:**
- Transições de página (entrada de módulo no Hub)
- Stagger em listas de comandos
- Hover states com spring animations
- Featured card com layout animation

### Fontes

Definidas no `index.html` via Google Fonts:

- **Inter** — UI geral (body, headings)
- **JetBrains Mono** — código, comandos, sintaxe

---

## Hooks e Utilitários

### `useLocalStorage<T>(key, initialValue)`

Hook genérico para persistir estado no localStorage:

```typescript
const [favorites, setFavorites] = useLocalStorage<string[]>("gitFavorites", []);
```

Sincroniza automaticamente entre rerenders e abas (não usa BroadcastChannel — simples e direto).

### `useMobile()`

Retorna `boolean` indicando se a viewport está abaixo do breakpoint mobile (`< 768px`). Usado para mostrar o menu Sheet em vez da navbar completa.

### `useToast()`

Hook de integração com o Sonner para disparar toasts informativos. Usado em ações como favoritar um comando.

### `cn(...inputs)` (`src/lib/utils.ts`)

Combina `clsx` + `tailwind-merge` para composição segura de classes Tailwind sem conflitos:

```typescript
import { cn } from "@/lib/utils";

cn("px-4 py-2", isActive && "bg-primary", className)
```

---

## Funcionalidades de UX

### 1. Sistema de Favoritos

- Ícone de estrela em cada card de comando
- Toggle: adicionar/remover do array em localStorage
- Seção "Favoritos" aparece no topo da lista quando há itens salvos
- Funciona independentemente entre GitDoc e ShellDoc

### 2. Command Palette (Busca Global)

- Atalho: `Cmd+K` (Mac) / `Ctrl+K` (Windows/Linux)
- Busca em tempo real em todos os comandos e problemas
- Grupos: Recentes, Comandos, Problemas, Páginas
- Navegação 100% via teclado

### 3. Histórico de Visitas

- Cada página visitada é adicionada a um array em localStorage
- Exibido como grupo "Recentes" na SearchDialog
- Limpo automaticamente após N itens (evita crescimento infinito)

### 4. Cópia com Feedback Visual

- Botão de cópia em todos os blocos de código
- Ícone alterna de `Copy` para `Check` por 2 segundos
- Usa a Web Clipboard API (`navigator.clipboard.writeText`)

### 5. Cheat Sheet Imprimível

- Página `/git/cheatsheet` tem CSS de impressão dedicado
- Remove sidebar, header e controles interativos na impressão
- Organiza comandos em grid de 2 colunas para economizar papel
- Suporta exportação como PDF pelo browser

### 6. Featured Card Dinâmico no Hub

- O último módulo visitado (Git ou Shell) fica em destaque
- Lido de `lastVisitedPath` no localStorage ao montar o Hub
- Animação de troca suave via `AnimatePresence` do Framer Motion

### 7. Design Responsivo

- Breakpoints: mobile (`< 768px`), tablet (`768px – 1024px`), desktop (`> 1024px`)
- Mobile: navegação via Sheet (drawer lateral)
- Grid de comandos: 1 coluna → 2 → 3 colunas
- Hero sections adaptadas para telas menores

---

## Configurações e Build

### Scripts disponíveis

```bash
npm run dev        # Inicia dev server em http://localhost:8080
npm run build      # Build de produção em /dist
npm run build:dev  # Build com sourcemaps para debug
npm run preview    # Preview do build de produção localmente
npm run lint       # ESLint em todo o projeto
npm run test       # Vitest (modo watch)
npm run test:run   # Vitest (execução única, para CI)
```

### Vite (`vite.config.ts`)

- **Compiler**: SWC (mais rápido que Babel)
- **Dev server**: porta `8080`, HMR ativado
- **Plugin**: `lovable-tagger` para rastreamento de componentes
- **Alias**: `@/*` resolve para `./src/*`

### TypeScript (`tsconfig.json`)

- **Target**: ESNext
- **Path alias**: `@/*` → `./src/*`
- **Configurações relaxadas**: `noImplicitAny: false`, `noUnusedLocals: false` (para agilidade de desenvolvimento)
- **Strict mode**: parcialmente ativo

### Tailwind (`tailwind.config.ts`)

- **Content**: varre `./src/**/*.{ts,tsx}`
- **Dark mode**: via classe `.dark` (gerenciado por `next-themes`)
- **Extend**: animações customizadas (`fade-in`, `fade-in-up`, `scale-in`, `pulse-glow`), variáveis de sidebar

### Vercel (`vercel.json`)

Configurado com rewrite para SPA:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Garante que o React Router funcione corretamente em produção para rotas não-root.

---

## Como Contribuir

### Adicionando um novo comando Git

Edite `src/data/commands.ts` e adicione um objeto ao array `commands`:

```typescript
{
  id: "meu-comando",
  name: "git meu-comando",
  description: "Descrição curta do que ele faz",
  syntax: "git meu-comando [opções] <arquivo>",
  category: "basics",             // basics | branching | remote | info | undoing
  uses: [
    "Use quando precisar de X",
    "Use quando o cenário Y ocorrer"
  ],
  variations: [
    { syntax: "git meu-comando --flag", description: "Faz Z" }
  ],
  examples: [
    { code: "git meu-comando arquivo.txt", explanation: "Aplica o comando no arquivo" }
  ],
  flags: [
    { flag: "--verbose", description: "Exibe saída detalhada" }
  ],
  whenNotToUse: [
    "Não use se o repositório estiver em estado de rebase"
  ],
  relatedCommands: ["git-add", "git-commit"],
  deepDive: "Explicação técnica aprofundada aqui...",
  curiosities: ["Fato curioso sobre o comando"]
}
```

### Adicionando um novo problema Git

Edite `src/data/problems.ts`:

```typescript
{
  id: "meu-problema",
  title: "Fiz X e aconteceu Y",
  description: "Descrição do cenário problemático",
  emoji: "🔥",
  steps: [
    { description: "Verifique o estado atual", command: "git status" },
    { description: "Aplique a correção", command: "git reset HEAD~1", warning: "Isso altera o histórico!" },
    { description: "Confirme o resultado", note: "Seus arquivos voltam para staging" }
  ],
  expectedResult: "Descrição do estado esperado após seguir os passos"
}
```

### Adicionando cmdlets PowerShell

Siga a mesma estrutura em `src/data/shellCommands.ts` e `src/data/shellProblems.ts`.

### Criando um novo módulo (ex: UbuntuDoc)

1. Crie `src/data/ubuntuCommands.ts` com a estrutura de dados
2. Crie `src/components/UbuntuLayout.tsx` (copie e adapte `ShellLayout.tsx`)
3. Crie as páginas em `src/pages/ubuntu/`
4. Adicione as rotas em `src/App.tsx`
5. Atualize o Hub para remover o "em breve" do card Ubuntu
6. Defina o tema de cor em `src/index.css` com `[data-theme="ubuntu"]`

---

## Roadmap

### Planejado

- [ ] **UbuntuDoc** — Comandos Linux/Bash (estrutura já presente no Hub)
- [ ] **WinDoc** — Windows CMD e scripts `.bat`/`.ps1` avançados
- [ ] **Sistema multi-tag** — filtrar por múltiplas categorias simultaneamente
- [ ] **Níveis de dificuldade** — Iniciante / Intermediário / Avançado por comando
- [ ] **Modo comparação** — colocar dois comandos lado a lado
- [ ] **Internacionalização** — suporte a EN e PT-BR
- [ ] **Pipeline de deploy** — documentação de CI/CD
- [ ] **Modo offline** — PWA com Service Worker

### Melhorias contínuas

- Expand da base de problemas (Git e Shell)
- Mais exemplos práticos em cada comando
- Testes e2e com Playwright cobrindo rotas críticas
- Métricas de uso com analytics privacy-friendly

---

## Autor

Desenvolvido por **Jerezincoc** — [@Jerezincoc](https://github.com/Jerezincoc)

Repositório: [github.com/Jerezincoc/git-flow-studio](https://github.com/Jerezincoc/git-flow-studio)

Licença: **MIT** — livre para usar, modificar e distribuir.
