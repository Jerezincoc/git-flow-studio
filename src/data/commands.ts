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
  category: "basics" | "branching" | "remote" | "info" | "undoing";
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
];

export function getCommandById(id: string): GitCommand | undefined {
  return commands.find((c) => c.id === id);
}

export function getCommandsByCategory(category: string): GitCommand[] {
  return commands.filter((c) => c.category === category);
}
