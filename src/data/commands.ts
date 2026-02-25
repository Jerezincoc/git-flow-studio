export interface CommandVariation {
  command: string;
  description: string;
}

export interface CommandExample {
  code: string;
  description: string;
}

export interface GitCommand {
  id: string;
  name: string;
  description: string;
  syntax: string;
category:
  | "basics"
  | "branching"
  | "remote"
  | "info"
  | "undoing"
  | "workflow"
  | "stash"
  | "merge-rebase";
  uses: string[];
  variations: CommandVariation[];
  examples: CommandExample[];
  whenNotToUse: string[];
  relatedCommands: string[];
  deepDive?: string;
}

export const categoryLabels: Record<string, string> = {
  basics: "Básicos",
  branching: "Ramificação",
  remote: "Remoto",
  info: "Informação",
  undoing: "Desfazer",

  workflow: "Workflow",
  stash: "Stash",
  "merge-rebase": "Merge/Rebase",
};

export const commands: GitCommand[] = [
  {
    id: "init",
    name: "git init",
    description: "Cria um novo repositório Git vazio no diretório atual.",
    syntax: "git init [nome-do-diretório]",
    category: "basics",
    uses: [
      "Iniciar controle de versão em um projeto existente",
      "Criar um novo projeto do zero com Git",
    ],
    variations: [
      { command: "git init", description: "Inicializa no diretório atual" },
      { command: "git init meu-projeto", description: "Cria novo diretório e inicializa" },
      { command: "git init --bare", description: "Cria repositório bare (sem working directory)" },
    ],
    examples: [
      { code: "mkdir meu-projeto && cd meu-projeto\ngit init", description: "Criar e inicializar um projeto" },
      { code: "git init --initial-branch=main", description: "Inicializar com branch main" },
    ],
    whenNotToUse: [
      "Se o projeto já tem um repositório Git (pasta .git existe)",
      "Se você quer copiar um repositório existente (use git clone)",
    ],
    relatedCommands: ["clone", "remote"],
    deepDive: "O git init cria uma pasta oculta .git que contém toda a estrutura do repositório: objetos, referências, HEAD e configurações. Sem essa pasta, o Git não reconhece o diretório como repositório.",
  },
  {
    id: "clone",
    name: "git clone",
    description: "Copia um repositório remoto para sua máquina local.",
    syntax: "git clone <url> [diretório]",
    category: "basics",
    uses: [
      "Baixar um projeto do GitHub/GitLab",
      "Criar uma cópia local de um repositório remoto",
    ],
    variations: [
      { command: "git clone <url>", description: "Clone padrão" },
      { command: "git clone <url> meu-nome", description: "Clone com nome personalizado" },
      { command: "git clone --depth 1 <url>", description: "Clone raso (apenas último commit)" },
    ],
    examples: [
      { code: "git clone https://github.com/user/repo.git", description: "Clonar via HTTPS" },
      { code: "git clone git@github.com:user/repo.git", description: "Clonar via SSH" },
    ],
    whenNotToUse: [
      "Se o repositório já foi clonado localmente",
      "Se você só precisa de um arquivo específico",
    ],
    relatedCommands: ["init", "remote", "pull"],
  },
  {
    id: "add",
    name: "git add",
    description: "Adiciona arquivos ao staging area para o próximo commit.",
    syntax: "git add <arquivo(s)>",
    category: "basics",
    uses: [
      "Preparar alterações para commit",
      "Selecionar quais mudanças incluir no próximo commit",
    ],
    variations: [
      { command: "git add .", description: "Adiciona tudo no diretório atual" },
      { command: "git add -A", description: "Adiciona tudo (incluindo remoções)" },
      { command: "git add *.js", description: "Adiciona por padrão" },
      { command: "git add -p", description: "Adiciona interativamente (por hunks)" },
    ],
    examples: [
      { code: "git add index.html style.css", description: "Adicionar arquivos específicos" },
      { code: "git add src/", description: "Adicionar um diretório inteiro" },
    ],
    whenNotToUse: [
      "Se o arquivo deve ser ignorado (adicione ao .gitignore primeiro)",
      "Se você não tem certeza do que mudou (use git status antes)",
    ],
    relatedCommands: ["status", "commit", "reset"],
    deepDive: "O staging area (ou index) é uma área intermediária entre seu diretório de trabalho e o repositório. Ele permite que você selecione exatamente quais mudanças farão parte do próximo commit.",
  },
  {
    id: "commit",
    name: "git commit",
    description: "Salva as alterações do staging area no histórico do repositório.",
    syntax: 'git commit -m "mensagem"',
    category: "basics",
    uses: [
      "Salvar um ponto no histórico do projeto",
      "Registrar alterações com uma descrição",
    ],
    variations: [
      { command: 'git commit -m "msg"', description: "Commit com mensagem inline" },
      { command: "git commit -am \"msg\"", description: "Add + commit de arquivos rastreados" },
      { command: "git commit --amend", description: "Modificar o último commit" },
      { command: "git commit --allow-empty -m \"msg\"", description: "Commit vazio" },
    ],
    examples: [
      { code: 'git add .\ngit commit -m "feat: adiciona página de login"', description: "Fluxo típico de commit" },
      { code: 'git commit --amend -m "nova mensagem"', description: "Corrigir mensagem do último commit" },
    ],
    whenNotToUse: [
      "Se o staging area está vazio (nada foi adicionado com git add)",
      "Se você ainda não terminou a alteração lógica",
    ],
    relatedCommands: ["add", "status", "log", "reset"],
  },
  {
    id: "status",
    name: "git status",
    description: "Mostra o estado atual do repositório e dos arquivos.",
    syntax: "git status",
    category: "info",
    uses: [
      "Verificar quais arquivos foram modificados",
      "Ver o que está no staging area",
      "Saber em qual branch você está",
    ],
    variations: [
      { command: "git status", description: "Status completo" },
      { command: "git status -s", description: "Status resumido (short)" },
      { command: "git status --branch", description: "Inclui info da branch" },
    ],
    examples: [
      { code: "git status", description: "Ver estado atual" },
      { code: "git status -s", description: "Ver estado resumido" },
    ],
    whenNotToUse: ["Não há contraindicação — use sempre que quiser"],
    relatedCommands: ["add", "diff", "log"],
  },
  {
    id: "push",
    name: "git push",
    description: "Envia commits locais para o repositório remoto.",
    syntax: "git push [remote] [branch]",
    category: "remote",
    uses: [
      "Enviar suas alterações para o GitHub",
      "Compartilhar seu trabalho com a equipe",
      "Fazer backup remoto do código",
    ],
    variations: [
      { command: "git push", description: "Push para o remote/branch padrão" },
      { command: "git push origin main", description: "Push explícito" },
      { command: "git push -u origin main", description: "Push e configura upstream" },
      { command: "git push --force", description: "Força o push (CUIDADO!)" },
    ],
    examples: [
      { code: "git push -u origin main", description: "Primeiro push de uma branch" },
      { code: "git push", description: "Pushes subsequentes" },
    ],
    whenNotToUse: [
      "Se você tem commits que não deveriam ir para o remoto",
      "Evite --force em branches compartilhadas",
    ],
    relatedCommands: ["pull", "remote", "commit"],
  },
  {
    id: "pull",
    name: "git pull",
    description: "Baixa e integra alterações do repositório remoto.",
    syntax: "git pull [remote] [branch]",
    category: "remote",
    uses: [
      "Atualizar seu código com as mudanças da equipe",
      "Sincronizar o repositório local com o remoto",
    ],
    variations: [
      { command: "git pull", description: "Pull padrão (fetch + merge)" },
      { command: "git pull --rebase", description: "Pull com rebase (histórico linear)" },
      { command: "git pull origin main", description: "Pull explícito de branch" },
    ],
    examples: [
      { code: "git pull origin main", description: "Atualizar da branch main" },
      { code: "git pull --rebase", description: "Pull mantendo histórico linear" },
    ],
    whenNotToUse: [
      "Se você tem alterações não commitadas (faça commit ou stash antes)",
      "Se você não quer integrar automaticamente (use git fetch)",
    ],
    relatedCommands: ["push", "merge", "stash"],
  },
  {
    id: "branch",
    name: "git branch",
    description: "Lista, cria ou deleta branches.",
    syntax: "git branch [nome]",
    category: "branching",
    uses: [
      "Criar uma nova linha de desenvolvimento",
      "Listar branches existentes",
      "Deletar branches que não são mais necessárias",
    ],
    variations: [
      { command: "git branch", description: "Lista branches locais" },
      { command: "git branch nova-feature", description: "Cria nova branch" },
      { command: "git branch -d nome", description: "Deleta branch (se merged)" },
      { command: "git branch -a", description: "Lista todas (locais + remotas)" },
    ],
    examples: [
      { code: "git branch feature/login", description: "Criar branch para feature" },
      { code: "git branch -d feature/login", description: "Deletar branch após merge" },
    ],
    whenNotToUse: [
      "Se quer criar E mudar para a branch (use git checkout -b)",
    ],
    relatedCommands: ["checkout", "merge"],
  },
  {
    id: "checkout",
    name: "git checkout",
    description: "Troca de branch ou restaura arquivos.",
    syntax: "git checkout <branch|arquivo>",
    category: "branching",
    uses: [
      "Mudar para outra branch",
      "Criar e mudar para nova branch",
      "Restaurar arquivo para última versão commitada",
    ],
    variations: [
      { command: "git checkout main", description: "Mudar para branch main" },
      { command: "git checkout -b nova", description: "Criar e mudar para nova branch" },
      { command: "git checkout -- arquivo.txt", description: "Descartar mudanças em arquivo" },
    ],
    examples: [
      { code: "git checkout -b feature/api", description: "Criar branch e começar a trabalhar" },
      { code: "git checkout main", description: "Voltar para a branch principal" },
    ],
    whenNotToUse: [
      "Se você tem mudanças não salvas que conflitam com a branch destino",
    ],
    relatedCommands: ["branch", "merge", "stash"],
  },
  {
    id: "merge",
    name: "git merge",
    description: "Integra alterações de uma branch em outra.",
    syntax: "git merge <branch>",
    category: "branching",
    uses: [
      "Juntar o trabalho de uma feature branch na main",
      "Integrar alterações de outra pessoa",
    ],
    variations: [
      { command: "git merge feature", description: "Merge padrão" },
      { command: "git merge --no-ff feature", description: "Merge sem fast-forward" },
      { command: "git merge --abort", description: "Cancelar merge em andamento" },
    ],
    examples: [
      { code: "git checkout main\ngit merge feature/login", description: "Merge de feature na main" },
      { code: "git merge --abort", description: "Cancelar em caso de conflito" },
    ],
    whenNotToUse: [
      "Se a branch tem conflitos conhecidos que você não está pronto para resolver",
      "Se quer manter histórico linear (use rebase)",
    ],
    relatedCommands: ["branch", "checkout", "pull"],
  },
  {
    id: "log",
    name: "git log",
    description: "Mostra o histórico de commits do repositório.",
    syntax: "git log [opções]",
    category: "info",
    uses: [
      "Ver histórico de alterações",
      "Encontrar um commit específico",
      "Entender a evolução do projeto",
    ],
    variations: [
      { command: "git log", description: "Log completo" },
      { command: "git log --oneline", description: "Uma linha por commit" },
      { command: "git log --graph", description: "Visualização em grafo" },
      { command: "git log -5", description: "Últimos 5 commits" },
    ],
    examples: [
      { code: "git log --oneline --graph --all", description: "Visualizar todo o histórico" },
      { code: "git log --author=\"João\"", description: "Filtrar por autor" },
    ],
    whenNotToUse: ["Não há contraindicação"],
    relatedCommands: ["status", "diff"],
  },
  {
    id: "reset",
    name: "git reset",
    description: "Desfaz commits ou remove arquivos do staging area.",
    syntax: "git reset [modo] [commit]",
    category: "undoing",
    uses: [
      "Desfazer o último commit mantendo as alterações",
      "Remover arquivos do staging area",
      "Voltar o repositório para um estado anterior",
    ],
    variations: [
      { command: "git reset HEAD arquivo", description: "Remove do staging" },
      { command: "git reset --soft HEAD~1", description: "Desfaz commit, mantém staging" },
      { command: "git reset --mixed HEAD~1", description: "Desfaz commit e staging" },
      { command: "git reset --hard HEAD~1", description: "Desfaz tudo (PERIGOSO!)" },
    ],
    examples: [
      { code: "git reset --soft HEAD~1", description: "Desfazer último commit (manter alterações)" },
      { code: "git reset HEAD .", description: "Remover tudo do staging" },
    ],
    whenNotToUse: [
      "Em commits já enviados com push (pode causar problemas para outros)",
      "Se não tem certeza, prefira git revert",
    ],
    relatedCommands: ["commit", "checkout", "stash"],
    deepDive: "O git reset move o ponteiro HEAD para um commit anterior. --soft mantém tudo no staging, --mixed (padrão) mantém no working directory, --hard descarta tudo. CUIDADO com --hard, pois as alterações são perdidas permanentemente.",
  },
  {
  id: "fetch",
  name: "git fetch",
  description: "Baixa alterações do repositório remoto sem aplicar na sua branch atual.",
  syntax: "git fetch [remoto]",
  category: "remote",
  uses: [
    "Atualizar referências do remoto",
    "Ver mudanças antes de integrar"
  ],
  variations: [
    { command: "git fetch", description: "Busca do remoto padrão (origin)" },
    { command: "git fetch origin", description: "Busca apenas do origin" },
    { command: "git fetch --all", description: "Busca de todos os remotos" }
  ],
  examples: [
    { code: "git fetch origin", description: "Atualiza refs do origin" }
  ],
  whenNotToUse: [
    "Se você já quer integrar automaticamente (use git pull)"
  ],
  relatedCommands: ["pull", "remote", "log"]
},
{
  id: "diff",
  name: "git diff",
  description: "Mostra as diferenças entre arquivos, commits ou branches.",
  syntax: "git diff [opções]",
  category: "info",
  uses: [
    "Revisar mudanças antes de commitar",
    "Comparar branches ou commits"
  ],
  variations: [
    { command: "git diff", description: "Diferenças não adicionadas (unstaged)" },
    { command: "git diff --staged", description: "Diferenças já adicionadas (staged)" },
    { command: "git diff main..feature", description: "Compara duas branches" }
  ],
  examples: [
    { code: "git diff", description: "Ver mudanças locais" },
    { code: "git diff --staged", description: "Ver o que será commitado" }
  ],
  whenNotToUse: [
    "Se você quer ver histórico completo (use git log)"
  ],
  relatedCommands: ["status", "add", "log"]
},
{
  id: "stash",
  name: "git stash",
  description: "Salva temporariamente mudanças locais sem fazer commit.",
  syntax: "git stash [opções]",
  category: "undoing",
  uses: [
    "Trocar de branch sem commitar mudanças",
    "Guardar trabalho em progresso (WIP)"
  ],
  variations: [
    { command: "git stash", description: "Salva mudanças atuais" },
    { command: "git stash list", description: "Lista todos os stashes" },
    { command: "git stash pop", description: "Aplica e remove o último stash" },
    { command: "git stash apply", description: "Aplica sem remover do stash" }
  ],
  examples: [
    { code: "git stash", description: "Guardar mudanças temporariamente" },
    { code: "git stash pop", description: "Recuperar mudanças salvas" }
  ],
  whenNotToUse: [
    "Se o código já está pronto para commit"
  ],
  relatedCommands: ["checkout", "reset", "clean"]
},
{
  id: "rebase",
  name: "git rebase",
  description: "Reaplica commits em cima de outra base, reescrevendo o histórico.",
  syntax: "git rebase [branch]",
  category: "branching",
  uses: [
    "Manter histórico linear",
    "Atualizar branch de feature com a main"
  ],
  variations: [
    { command: "git rebase main", description: "Rebase da branch atual sobre main" },
    { command: "git rebase -i HEAD~3", description: "Rebase interativo dos últimos 3 commits" },
    { command: "git rebase --continue", description: "Continuar após resolver conflitos" },
    { command: "git rebase --abort", description: "Cancelar o rebase" }
  ],
  examples: [
    { code: "git fetch origin\ngit rebase origin/main", description: "Atualizar branch com main remota" }
  ],
  whenNotToUse: [
    "Em commits já publicados e usados por outras pessoas"
  ],
  relatedCommands: ["merge", "log", "cherry-pick"]
},
{
  id: "cherry-pick",
  name: "git cherry-pick",
  description: "Aplica um commit específico em outra branch.",
  syntax: "git cherry-pick <commit>",
  category: "branching",
  uses: [
    "Levar um fix específico para outra branch",
    "Aplicar apenas um commit isolado"
  ],
  variations: [
    { command: "git cherry-pick <sha>", description: "Aplica um commit específico" },
    { command: "git cherry-pick <sha1> <sha2>", description: "Aplica múltiplos commits" },
    { command: "git cherry-pick --continue", description: "Continuar após conflito" },
    { command: "git cherry-pick --abort", description: "Cancelar operação" }
  ],
  examples: [
    { code: "git cherry-pick a1b2c3d", description: "Aplicar commit específico" }
  ],
  whenNotToUse: [
    "Se você quer integrar uma branch inteira (use merge ou rebase)"
  ],
  relatedCommands: ["merge", "rebase", "log"]
},
{
  id: "revert",
  name: "git revert",
  description: "Cria um novo commit que desfaz as alterações de um commit anterior.",
  syntax: "git revert <commit>",
  category: "undoing",
  uses: [
    "Desfazer commits já publicados com segurança",
    "Manter histórico claro sem reescrever commits"
  ],
  variations: [
    { command: "git revert <sha>", description: "Reverte um commit específico" },
    { command: "git revert HEAD", description: "Reverte o último commit" },
    { command: "git revert --no-commit <sha>", description: "Reverte sem criar commit automático" }
  ],
  examples: [
    { code: "git revert HEAD", description: "Desfazer o último commit com um novo commit de reversão" }
  ],
  whenNotToUse: [
    "Se o commit ainda não foi publicado e você quer remover do histórico (use reset)"
  ],
  relatedCommands: ["reset", "reflog", "log"]
},
{
  id: "tag",
  name: "git tag",
  description: "Cria e gerencia tags para marcar versões no histórico.",
  syntax: "git tag [nome]",
  category: "info",
  uses: [
    "Marcar releases (ex: v1.0.0)",
    "Listar versões do projeto"
  ],
  variations: [
    { command: "git tag", description: "Lista todas as tags" },
    { command: "git tag v1.0.0", description: "Cria uma tag leve no commit atual" },
    { command: "git tag -a v1.0.0 -m \"mensagem\"", description: "Cria tag anotada" },
    { command: "git push origin --tags", description: "Envia tags para o remoto" }
  ],
  examples: [
    { code: "git tag -a v2.0.0 -m \"Release 2.0\"", description: "Criar tag anotada" },
    { code: "git push origin --tags", description: "Publicar tags no remoto" }
  ],
  whenNotToUse: [
    "Se você precisa continuar desenvolvimento (use branch)"
  ],
  relatedCommands: ["show", "log", "push"]
},
{
  id: "show",
  name: "git show",
  description: "Mostra detalhes completos de um commit, tag ou objeto.",
  syntax: "git show [ref]",
  category: "info",
  uses: [
    "Ver detalhes de um commit específico",
    "Inspecionar alterações de uma tag"
  ],
  variations: [
    { command: "git show HEAD", description: "Mostra o último commit" },
    { command: "git show <sha>", description: "Mostra commit específico" },
    { command: "git show v1.0.0", description: "Mostra detalhes de uma tag" }
  ],
  examples: [
    { code: "git show HEAD", description: "Ver detalhes do último commit" }
  ],
  whenNotToUse: [
    "Se você quer apenas listar commits (use git log)"
  ],
  relatedCommands: ["log", "diff", "tag"]
},
{
  id: "reflog",
  name: "git reflog",
  description: "Mostra o histórico de movimentações do HEAD (útil para recuperar estados perdidos).",
  syntax: "git reflog",
  category: "undoing",
  uses: [
    "Recuperar commits após reset ou rebase",
    "Encontrar estados anteriores do projeto"
  ],
  variations: [
    { command: "git reflog", description: "Lista movimentações do HEAD" },
    { command: "git reflog --date=relative", description: "Mostra datas relativas" }
  ],
  examples: [
    { code: "git reflog", description: "Encontrar commit perdido" },
    { code: "git reset --hard HEAD@{2}", description: "Voltar para estado anterior" }
  ],
  whenNotToUse: [
    "Se você quer apenas ver histórico normal (use git log)"
  ],
  relatedCommands: ["reset", "rebase", "log"]
},
{
  id: "blame",
  name: "git blame",
  description: "Mostra quem alterou cada linha de um arquivo e em qual commit.",
  syntax: "git blame <arquivo>",
  category: "info",
  uses: [
    "Descobrir quem modificou uma linha específica",
    "Investigar quando uma alteração foi feita"
  ],
  variations: [
    { command: "git blame arquivo.ts", description: "Mostra autoria por linha" },
    { command: "git blame -L 10,40 arquivo.ts", description: "Limita intervalo de linhas" },
    { command: "git blame -w arquivo.ts", description: "Ignora mudanças só de whitespace" }
  ],
  examples: [
    { code: "git blame src/app.ts", description: "Ver autoria linha por linha" }
  ],
  whenNotToUse: [
    "Se você quer ver mudanças agrupadas por commit (use git log -p)"
  ],
  relatedCommands: ["log", "show", "diff"]
},
{
  id: "clean",
  name: "git clean",
  description: "Remove arquivos não rastreados (untracked) do diretório.",
  syntax: "git clean -f",
  category: "undoing",
  uses: [
    "Remover arquivos não versionados",
    "Limpar arquivos gerados (build, cache)"
  ],
  variations: [
    { command: "git clean -n", description: "Mostra o que seria removido (dry-run)" },
    { command: "git clean -f", description: "Remove arquivos não rastreados" },
    { command: "git clean -fd", description: "Remove arquivos e diretórios não rastreados" },
    { command: "git clean -fx", description: "Remove inclusive arquivos ignorados (.gitignore)" }
  ],
  examples: [
    { code: "git clean -n", description: "Ver o que será apagado" },
    { code: "git clean -fd", description: "Limpar diretórios e arquivos untracked" }
  ],
  whenNotToUse: [
    "Se você tem arquivos importantes não versionados",
    "Sem rodar antes o -n para conferir"
  ],
  relatedCommands: ["status", "reset", "stash"]
},
{
  id: "rm",
  name: "git rm",
  description: "Remove arquivos do repositório e do stage.",
  syntax: "git rm <arquivo>",
  category: "basics",
  uses: [
    "Remover arquivos versionados",
    "Apagar arquivos do repositório corretamente"
  ],
  variations: [
    { command: "git rm arquivo.txt", description: "Remove arquivo do repo e do disco" },
    { command: "git rm --cached arquivo.txt", description: "Remove do repo mas mantém no disco" },
    { command: "git rm -r pasta/", description: "Remove diretório recursivamente" }
  ],
  examples: [
    { code: "git rm config.json", description: "Remover arquivo versionado" }
  ],
  whenNotToUse: [
    "Se o arquivo ainda não foi adicionado ao Git"
  ],
  relatedCommands: ["add", "reset", "restore"]
},

{
  id: "mv",
  name: "git mv",
  description: "Move ou renomeia arquivos rastreados pelo Git.",
  syntax: "git mv <origem> <destino>",
  category: "basics",
  uses: [
    "Renomear arquivos mantendo histórico",
    "Mover arquivos entre pastas"
  ],
  variations: [
    { command: "git mv antigo.txt novo.txt", description: "Renomeia arquivo" },
    { command: "git mv arquivo.txt pasta/", description: "Move arquivo para pasta" }
  ],
  examples: [
    { code: "git mv app.js src/app.js", description: "Mover arquivo para nova pasta" }
  ],
  whenNotToUse: [
    "Se o arquivo não está sendo rastreado pelo Git"
  ],
  relatedCommands: ["add", "rm", "status"]
},
{
  id: "restore",
  name: "git restore",
  description: "Restaura arquivos do stage ou de um commit específico.",
  syntax: "git restore <arquivo>",
  category: "undoing",
  uses: [
    "Desfazer mudanças locais",
    "Remover arquivo do stage"
  ],
  variations: [
    { command: "git restore arquivo.txt", description: "Descarta mudanças locais" },
    { command: "git restore --staged arquivo.txt", description: "Remove do stage" },
    { command: "git restore --source=HEAD~1 arquivo.txt", description: "Restaura versão de commit anterior" }
  ],
  examples: [
    { code: "git restore --staged index.js", description: "Tirar arquivo do stage" }
  ],
  whenNotToUse: [
    "Se você quer remover o commit inteiro (use reset ou revert)"
  ],
  relatedCommands: ["reset", "checkout", "revert"]
},
{
  id: "bisect",
  name: "git bisect",
  description: "Ajuda a encontrar qual commit introduziu um bug usando busca binária.",
  syntax: "git bisect [start|good|bad]",
  category: "info",
  uses: [
    "Descobrir qual commit quebrou o projeto",
    "Depuração eficiente em históricos grandes"
  ],
  variations: [
    { command: "git bisect start", description: "Inicia processo de bisect" },
    { command: "git bisect bad", description: "Marca commit atual como ruim" },
    { command: "git bisect good <sha>", description: "Marca commit como bom" },
    { command: "git bisect reset", description: "Finaliza o bisect" }
  ],
  examples: [
    { code: "git bisect start\ngit bisect bad\ngit bisect good v1.0.0", description: "Iniciar investigação de bug" }
  ],
  whenNotToUse: [
    "Se você já sabe exatamente qual commit causou o problema"
  ],
  relatedCommands: ["log", "revert", "checkout"]
},
{
  id: "worktree",
  name: "git worktree",
  description: "Permite ter múltiplas branches abertas ao mesmo tempo em diretórios diferentes.",
  syntax: "git worktree add <caminho> <branch>",
  category: "branching",
  uses: [
    "Trabalhar em múltiplas branches simultaneamente",
    "Evitar ficar trocando de branch no mesmo diretório"
  ],
  variations: [
    { command: "git worktree add ../nova-feature feature-branch", description: "Criar novo diretório com branch" },
    { command: "git worktree list", description: "Listar worktrees existentes" },
    { command: "git worktree remove <caminho>", description: "Remover worktree" }
  ],
  examples: [
    { code: "git worktree add ../hotfix hotfix-branch", description: "Abrir hotfix em outro diretório" }
  ],
  whenNotToUse: [
    "Se você só precisa trocar de branch normalmente"
  ],
  relatedCommands: ["branch", "checkout", "switch"]
},
{
  id: "submodule",
  name: "git submodule",
  description: "Gerencia repositórios dentro de outros repositórios.",
  syntax: "git submodule [add|update|init]",
  category: "remote",
  uses: [
    "Incluir dependências versionadas",
    "Gerenciar projetos externos dentro do seu repo"
  ],
  variations: [
    { command: "git submodule add <repo-url>", description: "Adicionar submódulo" },
    { command: "git submodule update --init --recursive", description: "Inicializar e atualizar submódulos" },
    { command: "git submodule foreach git pull", description: "Atualizar todos submódulos" }
  ],
  examples: [
    { code: "git submodule add https://github.com/user/lib.git", description: "Adicionar biblioteca como submódulo" }
  ],
  whenNotToUse: [
    "Se você pode usar gerenciador de pacotes (npm, pip, etc.)"
  ],
  relatedCommands: ["clone", "pull", "fetch"]
},

];

export function getCommandById(id: string): GitCommand | undefined {
  return commands.find((c) => c.id === id);
}

export function getCommandsByCategory(category: string): GitCommand[] {
  return commands.filter((c) => c.category === category);
}
