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
  description: "Registra as alterações adicionadas ao stage como um novo snapshot no histórico do repositório.",
  syntax: "git commit -m \"mensagem\"",
  category: "basics",

  uses: [
    "Salvar alterações versionadas no histórico",
    "Criar checkpoints do desenvolvimento",
    "Registrar progresso de features ou correções",
    "Manter histórico rastreável e organizado"
  ],

  variations: [
    {
      command: "git commit -m \"mensagem\"",
      description: "Cria commit com mensagem direta (forma mais comum)"
    },
    {
      command: "git commit",
      description: "Abre editor padrão para escrever mensagem detalhada"
    },
    {
      command: "git commit -am \"mensagem\"",
      description: "Adiciona automaticamente arquivos já rastreados e faz commit"
    },
    {
      command: "git commit --amend",
      description: "Altera o último commit (mensagem ou conteúdo)"
    },
    {
      command: "git commit --amend --no-edit",
      description: "Atualiza último commit sem alterar mensagem"
    },
    {
      command: "git commit --allow-empty -m \"mensagem\"",
      description: "Cria commit mesmo sem alterações (útil para pipelines)"
    },
    {
      command: "git commit --author=\"Nome <email>\"",
      description: "Define autor manualmente"
    },
    {
      command: "git commit --no-verify",
      description: "Ignora hooks (ex: pre-commit)"
    }
  ],

  examples: [
    {
      code: "git add .\ngit commit -m \"feat: implement login validation\"",
      description: "Fluxo comum de adicionar e commitar alterações"
    },
    {
      code: "git commit --amend -m \"fix: correct validation logic\"",
      description: "Corrigir mensagem ou incluir alterações esquecidas"
    },
    {
      code: "git commit -am \"fix: adjust button style\"",
      description: "Commit rápido de arquivos já rastreados"
    }
  ],

  whenNotToUse: [
    "Quando você ainda não adicionou arquivos ao stage (use git add primeiro)",
    "Para desfazer commits publicados (use git revert)",
    "Se quiser apagar commit do histórico (use git reset com cuidado)"
  ],

  relatedCommands: [
    "add",
    "status",
    "reset",
    "revert",
    "log"
  ],

  deepDive:
    "O commit cria um snapshot imutável identificado por um SHA. Ele registra o estado do stage, não do working directory. Alterações não adicionadas (unstaged) não entram no commit. O uso excessivo de --amend em commits já publicados pode causar conflitos ao forçar push."
  },
 {
  id: "push",
  name: "git push",
  description: "Envia commits locais para um repositório remoto (ex: origin) atualizando branches e/ou tags.",
  syntax: "git push [remoto] [branch]",
  category: "remote",

  uses: [
    "Publicar commits no remoto",
    "Atualizar uma branch remota com seu trabalho",
    "Enviar tags (releases) para o remoto",
    "Configurar upstream para push/pull mais simples"
  ],

  variations: [
    {
      command: "git push",
      description: "Faz push da branch atual para o upstream configurado"
    },
    {
      command: "git push origin main",
      description: "Envia a branch local main para o remoto origin"
    },
    {
      command: "git push -u origin feature/login",
      description: "Envia a branch e define upstream (depois disso, 'git push' sozinho funciona)"
    },
    {
      command: "git push --force-with-lease",
      description: "Força push de forma mais segura (falha se o remoto mudou desde seu último fetch)"
    },
    {
      command: "git push --force",
      description: "Força push ignorando mudanças no remoto (perigoso: pode sobrescrever trabalho de outros)"
    },
    {
      command: "git push origin --delete feature/login",
      description: "Apaga uma branch no remoto"
    },
    {
      command: "git push origin --tags",
      description: "Envia todas as tags locais para o remoto"
    }
  ],

  examples: [
    {
      code: "git push -u origin feature/login",
      description: "Primeiro push de uma branch nova (configura upstream)"
    },
    {
      code: "git fetch origin\ngit rebase origin/main\ngit push --force-with-lease",
      description: "Após rebase (reescreve histórico), fazer push com segurança"
    },
    {
      code: "git push origin --delete feature/login",
      description: "Excluir branch remota depois que PR foi mergeado"
    }
  ],

  whenNotToUse: [
    "Evite usar --force em branches compartilhadas",
    "Não force push em main/develop (a menos que a política do time permita e você saiba o impacto)",
    "Se você não fez fetch recentemente e pretende usar --force-with-lease"
  ],

  relatedCommands: [
    "pull",
    "fetch",
    "rebase",
    "tag",
    "remote"
  ],

  deepDive:
    "Push atualiza refs remotas. O flag -u cria o vínculo upstream entre sua branch local e a remota (facilita push/pull sem argumentos). Se você reescreveu histórico (rebase/amend), o remoto vai divergir e você pode precisar de --force-with-lease, que é mais seguro porque impede sobrescrever mudanças remotas que você não viu."
},
  
   {
  id: "pull",
  name: "git pull",
  description: "Baixa mudanças do remoto e integra na branch atual (equivale a: git fetch + merge, ou fetch + rebase).",
  syntax: "git pull [remoto] [branch]",
  category: "remote",

  uses: [
    "Atualizar sua branch local com mudanças do remoto",
    "Integrar rapidamente o que chegou na main/develop",
    "Sincronizar antes de abrir PR ou continuar trabalho"
  ],

  variations: [
    {
      command: "git pull",
      description: "Puxa do upstream configurado e faz merge (comportamento padrão em muitos setups)"
    },
    {
      command: "git pull origin main",
      description: "Puxa explicitamente do origin/main e integra na branch atual"
    },
    {
      command: "git pull --rebase",
      description: "Puxa e faz rebase em vez de merge (histórico mais linear)"
    },
    {
      command: "git pull --ff-only",
      description: "Só atualiza se for fast-forward (evita merge commit inesperado)"
    },
    {
      command: "git pull --autostash",
      description: "Cria stash automático antes de rebase/merge e reaplica ao final"
    }
  ],

  examples: [
    {
      code: "git pull",
      description: "Atualizar sua branch usando upstream"
    },
    {
      code: "git pull --rebase",
      description: "Atualizar mantendo histórico linear (muito usado em feature branches)"
    },
    {
      code: "git pull --ff-only",
      description: "Atualizar sem risco de criar merge commit local"
    }
  ],

  whenNotToUse: [
    "Se você quer controlar o processo em 2 etapas (prefira git fetch + git log + merge/rebase)",
    "Se você tem mudanças locais não commitadas e não quer risco de conflito (faça commit ou stash primeiro)",
    "Quando você precisa revisar o que chegou antes de integrar"
  ],

  relatedCommands: [
    "fetch",
    "merge",
    "rebase",
    "push",
    "status",
    "stash"
  ],

  deepDive:
    "Por baixo, pull faz 'fetch' e depois integra. A integração pode ser merge (cria merge commit se necessário) ou rebase (reaplica seus commits sobre a base nova). Para evitar merges locais indesejados, use --ff-only. Se sua equipe padroniza rebase em branches de feature, use --rebase (ou configure pull.rebase=true)."
},

{
  id: "merge",
  name: "git merge",
  description: "Integra mudanças de outra branch na branch atual, criando (ou não) um merge commit.",
  syntax: "git merge <branch>",
  category: "branching",

  uses: [
    "Integrar uma feature na main/develop",
    "Atualizar sua branch com mudanças de outra branch",
    "Unir históricos preservando contexto de ramificações"
  ],

  variations: [
    {
      command: "git merge feature/login",
      description: "Faz merge da branch feature/login na branch atual"
    },
    {
      command: "git merge --no-ff feature/login",
      description: "Força criação de merge commit mesmo que seja possível fast-forward (mantém o 'nó' da feature no histórico)"
    },
    {
      command: "git merge --ff-only feature/login",
      description: "Só permite merge se for fast-forward (falha se precisar de merge commit)"
    },
    {
      command: "git merge --abort",
      description: "Cancela o merge em andamento (após conflito) e retorna ao estado anterior"
    }
  ],

  examples: [
    {
      code: "git checkout main\ngit pull\ngit merge feature/login",
      description: "Integrar uma feature na main (merge normal)"
    },
    {
      code: "git checkout develop\ngit merge --no-ff feature/login",
      description: "Manter histórico de feature com merge commit (muito comum em Git Flow)"
    },
    {
      code: "git merge --ff-only hotfix/patch-1",
      description: "Garantir que não será criado merge commit"
    }
  ],

  whenNotToUse: [
    "Se você quer histórico linear e a equipe prefere rebase (use git rebase antes do PR)",
    "Se você está no meio de mudanças locais não commitadas (faça commit/stash antes)",
    "Se a branch foi reescrita e está divergente do remoto (confira com fetch/log antes)"
  ],

  relatedCommands: [
    "rebase",
    "branch",
    "log",
    "status",
    "revert"
  ],

  deepDive:
    "Merge pode acontecer de duas formas: fast-forward (sem merge commit) quando a branch atual está atrás e basta avançar o ponteiro, ou merge commit quando há divergência e o Git precisa criar um commit de integração. Em conflitos, resolva arquivos manualmente, rode 'git add' nos resolvidos e finalize com 'git commit' (ou use 'git merge --abort' para cancelar)."
},
{
  id: "branch",
  name: "git branch",
  description: "Cria, lista, renomeia e remove branches. Uma branch é apenas um ponteiro móvel para um commit.",
  syntax: "git branch [opções] [nome]",
  category: "branching",

  uses: [
    "Criar branches de feature, hotfix ou release",
    "Isolar desenvolvimento sem afetar main/develop",
    "Visualizar branches locais e remotas",
    "Limpar branches já integradas",
    "Renomear ou reorganizar fluxo de trabalho"
  ],

  variations: [
    {
      command: "git branch",
      description: "Lista branches locais (a atual é marcada com *)"
    },
    {
      command: "git branch -v",
      description: "Lista branches mostrando o último commit de cada uma"
    },
    {
      command: "git branch -a",
      description: "Lista branches locais e remotas"
    },
    {
      command: "git branch -r",
      description: "Lista apenas branches remotas"
    },
    {
      command: "git branch feature/login",
      description: "Cria nova branch a partir do commit atual (não troca para ela)"
    },
    {
      command: "git branch feature/login origin/main",
      description: "Cria branch baseada explicitamente em outra branch"
    },
    {
      command: "git branch -d feature/login",
      description: "Remove branch local se já estiver mergeada (modo seguro)"
    },
    {
      command: "git branch -D feature/login",
      description: "Remove branch local forçando (mesmo sem merge)"
    },
    {
      command: "git branch --merged",
      description: "Lista branches já mergeadas na branch atual"
    },
    {
      command: "git branch --no-merged",
      description: "Lista branches ainda não mergeadas"
    },
    {
      command: "git branch -m antigo novo",
      description: "Renomeia branch local"
    },
    {
      command: "git branch --set-upstream-to=origin/main",
      description: "Define manualmente a branch remota rastreada (upstream)"
    }
  ],

  examples: [
    {
      code: "git branch feature/auth",
      description: "Criar branch de feature"
    },
    {
      code: "git branch --merged\n# depois:\ngit branch -d feature/antiga",
      description: "Fluxo comum para limpar branches já integradas"
    },
    {
      code: "git branch -m main master",
      description: "Renomear branch principal (exemplo histórico)"
    },
    {
      code: "git push -u origin feature/auth",
      description: "Publicar branch e definir upstream"
    },
    {
      code: "git push origin --delete feature/antiga",
      description: "Remover branch no remoto após merge"
    }
  ],

  whenNotToUse: [
    "Para trocar de branch (use git switch)",
    "Para integrar branches (use git merge ou rebase)",
    "Para desfazer commits (use reset ou revert)"
  ],

  relatedCommands: [
    "switch",
    "merge",
    "rebase",
    "push",
    "fetch",
    "log"
  ],

  deepDive:
    "Uma branch no Git é apenas um ponteiro leve para um commit. Criar branch é instantâneo e barato. O flag -d protege contra apagar branch que ainda não foi mergeada; -D ignora essa proteção. Branches remotas não são apagadas com git branch -d, e sim com 'git push origin --delete nome'. Para manter repositório limpo, combine 'git fetch --prune' com 'git branch --merged'. Em fluxos profissionais (Git Flow, Trunk Based), branches são efêmeras e devem ser removidas após integração."
},
{
  id: "switch",
  name: "git switch",
  description: "Troca de branch de forma clara e segura. É a alternativa moderna ao uso de 'git checkout' para navegação entre branches.",
  syntax: "git switch [opções] <branch>",
  category: "branching",

  uses: [
    "Trocar de branch",
    "Criar branch nova e já entrar nela",
    "Recuperar branch remota localmente",
    "Sair de detached HEAD criando uma branch"
  ],

  variations: [
    {
      command: "git switch main",
      description: "Troca para a branch main"
    },
    {
      command: "git switch -c feature/login",
      description: "Cria branch nova e já muda para ela"
    },
    {
      command: "git switch -c feature/login origin/feature/login",
      description: "Cria branch local rastreando branch remota e já entra nela"
    },
    {
      command: "git switch -d <sha>",
      description: "Vai para um commit específico (detached HEAD)"
    },
    {
      command: "git switch -",
      description: "Volta para a branch anterior"
    },
    {
      command: "git switch --detach <sha>",
      description: "Entra explicitamente em modo detached HEAD"
    },
    {
      command: "git switch --discard-changes main",
      description: "Troca de branch descartando alterações locais"
    },
    {
      command: "git switch --merge main",
      description: "Tenta trocar preservando mudanças locais (faz merge automático se possível)"
    }
  ],

  examples: [
    {
      code: "git switch main",
      description: "Trocar para main"
    },
    {
      code: "git switch -c feature/auth",
      description: "Criar nova branch e começar a trabalhar"
    },
    {
      code: "git switch -",
      description: "Alternar rapidamente entre duas branches (muito usado)"
    },
    {
      code: "git switch --detach a1b2c3d",
      description: "Explorar commit antigo sem estar em uma branch"
    }
  ],

  whenNotToUse: [
    "Para restaurar arquivos (use git restore)",
    "Para navegar e alterar arquivos de commits antigos (use git restore ou git show)",
    "Evite permanecer em detached HEAD se pretende continuar desenvolvendo"
  ],

  relatedCommands: [
    "branch",
    "restore",
    "merge",
    "rebase",
    "status"
  ],

  deepDive:
    "git switch foi introduzido para separar responsabilidades do antigo git checkout. Ele lida apenas com troca de branches, tornando o fluxo mais seguro e previsível. Em detached HEAD, commits feitos não pertencem a nenhuma branch até que você crie uma nova com 'git switch -c nome'. A flag '-' é extremamente útil para alternar rapidamente entre duas branches."
},
{
  id: "log",
  name: "git log",
  description: "Exibe o histórico de commits do repositório com diversas opções de visualização e filtro.",
  syntax: "git log [opções]",
  category: "info",

  uses: [
    "Visualizar histórico de commits",
    "Analisar mudanças recentes",
    "Investigar bugs ou regressões",
    "Entender fluxo de branches"
  ],

  variations: [
    {
      command: "git log",
      description: "Lista commits detalhados (autor, data, mensagem)"
    },
    {
      command: "git log --oneline",
      description: "Mostra histórico resumido (1 linha por commit)"
    },
    {
      command: "git log --oneline --graph --decorate --all",
      description: "Visualização gráfica das branches (modo profissional)"
    },
    {
      command: "git log -p",
      description: "Mostra o diff completo de cada commit"
    },
    {
      command: "git log --stat",
      description: "Mostra resumo de arquivos alterados por commit"
    },
    {
      command: "git log -n 5",
      description: "Limita aos últimos 5 commits"
    },
    {
      command: "git log --author=\"Nome\"",
      description: "Filtra commits por autor"
    },
    {
      command: "git log --since=\"2 days ago\"",
      description: "Filtra commits por data"
    },
    {
      command: "git log branchA..branchB",
      description: "Mostra commits que estão em branchB e não em branchA"
    }
  ],

  examples: [
    {
      code: "git log --oneline --graph --decorate --all",
      description: "Visualizar histórico completo com gráfico de branches"
    },
    {
      code: "git log -p -n 3",
      description: "Ver detalhes dos últimos 3 commits"
    },
    {
      code: "git log --author=\"João\" --since=\"1 week ago\"",
      description: "Filtrar commits de um autor recente"
    }
  ],

  whenNotToUse: [
    "Se você quer apenas ver alterações de um arquivo específico (use git blame ou git diff)",
    "Se precisa ver movimentação do HEAD após reset/rebase (use git reflog)"
  ],

  relatedCommands: [
    "show",
    "diff",
    "reflog",
    "blame",
    "branch"
  ],

  deepDive:
    "git log é extremamente poderoso. A combinação --oneline --graph --decorate --all oferece uma visualização clara do fluxo de branches. Filtros como --since, --author e ranges (A..B) ajudam a investigar mudanças específicas. Para análise profunda, combine com -p ou --stat."
},
{
  id: "reset",
  name: "git reset",
  description: "Move o ponteiro do HEAD para outro commit, podendo alterar o stage e o working directory.",
  syntax: "git reset [--soft | --mixed | --hard] <commit>",
  category: "undoing",

  uses: [
    "Desfazer commits locais",
    "Remover arquivos do stage",
    "Voltar o projeto para um estado anterior",
    "Reorganizar commits antes de publicar"
  ],

  variations: [
    {
      command: "git reset --soft HEAD~1",
      description: "Volta um commit mantendo alterações no stage"
    },
    {
      command: "git reset --mixed HEAD~1",
      description: "Volta um commit removendo do stage mas mantendo alterações no working directory (padrão)"
    },
    {
      command: "git reset --hard HEAD~1",
      description: "Volta um commit apagando alterações do stage e do working directory"
    },
    {
      command: "git reset <arquivo>",
      description: "Remove arquivo do stage (equivalente a restore --staged)"
    },
    {
      command: "git reset --hard <sha>",
      description: "Volta totalmente para um commit específico"
    }
  ],

  examples: [
    {
      code: "git reset --soft HEAD~1",
      description: "Desfazer último commit mantendo arquivos prontos para novo commit"
    },
    {
      code: "git reset --hard a1b2c3d",
      description: "Voltar completamente para um commit específico"
    },
    {
      code: "git reset index.js",
      description: "Remover arquivo do stage"
    }
  ],

  whenNotToUse: [
    "Em commits já publicados (use git revert em vez disso)",
    "Sem verificar antes com git log ou git reflog",
    "Sem entender que --hard apaga alterações permanentemente"
  ],

  relatedCommands: [
    "revert",
    "reflog",
    "restore",
    "log"
  ],

  deepDive:
    "O reset altera onde o HEAD aponta. --soft move apenas o ponteiro, --mixed altera também o stage (padrão), e --hard altera stage e working directory apagando mudanças locais. Caso algo seja apagado por engano, muitas vezes é possível recuperar usando git reflog."
},
  {
  id: "fetch",
  name: "git fetch",
  description: "Baixa commits, branches e tags do remoto sem integrar automaticamente na sua branch atual.",
  syntax: "git fetch [remoto] [branch]",
  category: "remote",

  uses: [
    "Atualizar referências remotas antes de integrar",
    "Analisar mudanças do remoto sem alterar sua branch",
    "Sincronizar refs antes de rebase ou merge",
    "Evitar surpresas ao usar pull diretamente"
  ],

  variations: [
    {
      command: "git fetch",
      description: "Busca do remoto padrão (origin)"
    },
    {
      command: "git fetch origin",
      description: "Busca explicitamente do remoto origin"
    },
    {
      command: "git fetch origin main",
      description: "Busca apenas a branch main do remoto"
    },
    {
      command: "git fetch --all",
      description: "Busca de todos os remotos configurados"
    },
    {
      command: "git fetch --prune",
      description: "Remove referências locais de branches remotas que já foram apagadas"
    },
    {
      command: "git fetch --tags",
      description: "Atualiza todas as tags do remoto"
    }
  ],

  examples: [
    {
      code: "git fetch origin\ngit log HEAD..origin/main --oneline",
      description: "Ver commits que chegaram na main antes de integrar"
    },
    {
      code: "git fetch --prune",
      description: "Limpar branches remotas que não existem mais"
    },
    {
      code: "git fetch origin\ngit rebase origin/main",
      description: "Fluxo seguro antes de rebase"
    }
  ],

  whenNotToUse: [
    "Se você quer integrar automaticamente (use git pull)",
    "Se você já sabe que precisa aplicar as mudanças imediatamente"
  ],

  relatedCommands: [
    "pull",
    "merge",
    "rebase",
    "log",
    "remote"
  ],

  deepDive:
    "git fetch atualiza apenas as referências remotas (ex: origin/main) sem tocar no seu working directory. É a forma mais segura de se atualizar antes de integrar mudanças. A flag --prune mantém seu ambiente limpo removendo branches remotas que foram deletadas no servidor."
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
  description: "Guarda mudanças locais (working tree e/ou stage) temporariamente para voltar depois, sem precisar commitar.",
  syntax: "git stash [push|pop|apply|list|show|drop|clear] ...",
  category: "undoing",

  uses: [
    "Trocar de branch sem commitar trabalho incompleto",
    "Guardar mudanças rápidas antes de puxar/mesclar/rebasear",
    "Salvar experimentos locais temporários"
  ],

  variations: [
    {
      command: "git stash push -m \"msg\"",
      description: "Cria stash com mensagem (recomendado para não virar bagunça)"
    },
    {
      command: "git stash -u",
      description: "Inclui arquivos não rastreados (untracked) no stash"
    },
    {
      command: "git stash -a",
      description: "Inclui untracked + ignored (bem perigoso, use com cautela)"
    },
    {
      command: "git stash list",
      description: "Lista todos os stashes (stash@{0}, stash@{1}...)"
    },
    {
      command: "git stash show -p",
      description: "Mostra o diff completo do stash"
    },
    {
      command: "git stash apply",
      description: "Aplica o stash e MANTÉM ele na lista"
    },
    {
      command: "git stash pop",
      description: "Aplica o stash e REMOVE ele da lista"
    },
    {
      command: "git stash apply stash@{2}",
      description: "Aplica um stash específico"
    },
    {
      command: "git stash drop stash@{2}",
      description: "Remove um stash específico"
    },
    {
      command: "git stash clear",
      description: "Apaga TODOS os stashes (irreversível na prática)"
    }
  ],

  examples: [
    {
      code: "git stash push -m \"wip: ajustes no layout\"",
      description: "Guardar trabalho incompleto com uma descrição"
    },
    {
      code: "git stash list\ngit stash show -p stash@{0}",
      description: "Listar e inspecionar conteúdo do stash antes de aplicar"
    },
    {
      code: "git stash pop",
      description: "Aplicar o último stash e remover da lista"
    },
    {
      code: "git stash -u\n# troca de branch / puxa mudanças\n\ngit stash pop",
      description: "Fluxo comum: stash incluindo untracked, atualizar branch e recuperar mudanças"
    }
  ],

  whenNotToUse: [
    "Se a mudança já está pronta e deve ser compartilhada (faça commit em uma branch)",
    "Como armazenamento de longo prazo (stash não é backlog; prefira branch + commit)",
    "Evite stash clear sem ter certeza (perda total)"
  ],

  relatedCommands: [
    "status",
    "switch",
    "checkout",
    "pull",
    "rebase",
    "clean"
  ],

  deepDive:
    "Stash salva seu estado local e volta o working directory para um estado limpo. 'apply' reaplica sem remover da lista; 'pop' reaplica e remove. Use mensagens (-m) e sempre confira com 'stash show -p' quando estiver lidando com múltiplos stashes. Em casos de conflito ao aplicar, resolva como um merge normal e faça commit se necessário."
},
{
  id: "rebase",
  name: "git rebase",
  description: "Reaplica commits de uma branch sobre outra base, reescrevendo o histórico para manter uma linha linear.",
  syntax: "git rebase <base-branch>",
  category: "branching",

  uses: [
    "Atualizar uma branch de feature com a main",
    "Manter histórico linear (sem merge commit)",
    "Organizar commits antes de subir (squash, reorder, edit)"
  ],

  variations: [
    {
      command: "git rebase main",
      description: "Reaplica commits da branch atual sobre a main"
    },
    {
      command: "git rebase origin/main",
      description: "Rebase usando referência remota atualizada"
    },
    {
      command: "git rebase -i HEAD~3",
      description: "Rebase interativo dos últimos 3 commits (editar, squash, reorder)"
    },
    {
      command: "git rebase --continue",
      description: "Continua rebase após resolver conflito"
    },
    {
      command: "git rebase --abort",
      description: "Cancela o rebase e volta ao estado anterior"
    },
    {
      command: "git rebase --onto nova-base antiga-base",
      description: "Move uma sequência de commits para outra base específica"
    }
  ],

  examples: [
    {
      code: "git checkout feature/login\ngit fetch origin\ngit rebase origin/main",
      description: "Atualizar branch de feature antes de abrir PR"
    },
    {
      code: "git rebase -i HEAD~5",
      description: "Reorganizar últimos 5 commits (squash ou editar mensagens)"
    }
  ],

  whenNotToUse: [
    "Quando os commits já foram publicados e outras pessoas dependem deles",
    "Em branches compartilhadas por múltiplos desenvolvedores",
    "Sem entender que o SHA dos commits será alterado"
  ],

  relatedCommands: [
    "merge",
    "log",
    "cherry-pick",
    "reflog"
  ],

  deepDive:
    "O rebase reescreve o histórico criando novos commits com novos SHAs. Diferente do merge, ele não cria um merge commit, mantendo o histórico linear. Caso já tenha feito push da branch, será necessário usar 'git push --force-with-lease' (com cuidado). Em caso de conflito, o Git pausa o processo até que os arquivos sejam corrigidos manualmente."
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
