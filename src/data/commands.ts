export interface CommandVariation {
  command: string;
  description: string;
}

export interface CommandExample {
  code: string;
  description: string;
}

export interface GitFlag {
  flag: string;
  description: string;
  example?: string;
  danger?: boolean;
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
  | "undoing";
  uses: string[];
  variations: CommandVariation[];
  examples: CommandExample[];
  whenNotToUse: string[];
  relatedCommands: string[];
  deepDive?: string;
  flags?: GitFlag[];
  curiosities?: string[];
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
    flags: [
      { flag: "--bare", description: "Cria repositório sem working directory — usado em servidores Git" },
      { flag: "-b / --initial-branch", description: "Define o nome da branch inicial (ex: -b main)" },
      { flag: "--quiet / -q", description: "Suprime mensagens de saída" },
      { flag: "--shared", description: "Configura permissões para repositório compartilhado entre grupos de usuários" },
    ],
    curiosities: [
      "O git init cria apenas uma pasta .git com ~9 arquivos/pastas. Tudo que o Git precisa para controle de versão cabe em menos de 1KB inicialmente.",
      "Diferente de outros sistemas de versão (SVN, CVS), o Git não precisa de servidor central. Um repositório é completamente autocontido e funcional offline.",
    ],
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
      { command: "git clone <url>", description: "Clone padrão (todas as branches e histórico)" },
      { command: "git clone <url> meu-nome", description: "Clone para diretório com nome personalizado" },
      { command: "git clone --depth 1 <url>", description: "Clone raso: apenas o commit mais recente (mais rápido, menor)" },
      { command: "git clone --branch develop <url>", description: "Clona e já entra na branch especificada" },
      { command: "git clone --single-branch --branch main <url>", description: "Clona apenas uma branch (sem baixar as outras)" },
      { command: "git clone --recurse-submodules <url>", description: "Clona e inicializa submódulos automaticamente" },
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
    flags: [
      { flag: "--depth <n>", description: "Limita o histórico ao número n de commits (clone raso — mais rápido e leve)" },
      { flag: "-b / --branch <nome>", description: "Clona e já faz checkout da branch especificada em vez da padrão" },
      { flag: "--single-branch", description: "Baixa apenas a branch clonada, sem baixar as demais" },
      { flag: "--recurse-submodules", description: "Inicializa e clona submódulos automaticamente" },
      { flag: "--no-tags", description: "Não baixa as tags do remoto" },
      { flag: "--mirror", description: "Cria clone espelho completo (bare + todas as refs) — usado para backup de repositórios" },
      { flag: "-q / --quiet", description: "Suprime saída de progresso" },
    ],
    curiosities: [
      "git clone é tão eficiente que transfere apenas os objetos únicos — se dois commits compartilham 99% dos arquivos, apenas o 1% diferente é transferido.",
      "O nome 'origin' dado ao remoto após clone é apenas uma convenção do Git. Você pode renomeá-lo livremente com git remote rename sem efeito no funcionamento.",
    ],
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
    flags: [
      { flag: "-A / --all", description: "Adiciona todas as mudanças: modificados, novos e deletados" },
      { flag: "-p / --patch", description: "Modo interativo: escolhe hunks individualmente para ter controle preciso sobre o que entra no commit" },
      { flag: "-u / --update", description: "Adiciona apenas arquivos já rastreados (ignora arquivos novos)" },
      { flag: "-n / --dry-run", description: "Simula o add sem realmente adicionar — útil para verificar o que seria incluído" },
      { flag: "-f / --force", description: "Força adicionar arquivo ignorado pelo .gitignore", danger: true },
      { flag: "-e / --edit", description: "Abre editor para revisar e editar o patch antes de aplicar ao stage" },
    ],
    curiosities: [
      "git add -p (patch mode) é uma das features mais poderosas e subestimadas do Git — permite commitar apenas parte de um arquivo, separando alterações em commits distintos sem editar o arquivo.",
      "O staging area foi chamado por Linus Torvalds de 'cache' nos primórdios do Git, por isso ainda aparece como --cached em vários outros comandos como diff e rm.",
    ],
  },
  {
    id: "status",
    name: "git status",
    description: "Mostra o estado atual do working directory e do staging area: arquivos modificados, novos, deletados e o que está no stage.",
    syntax: "git status [opções]",
    category: "basics",
    uses: [
      "Verificar o que mudou antes de commitar",
      "Ver quais arquivos estão no stage",
      "Conferir se há conflitos de merge",
      "Entender o estado do repositório em qualquer momento",
    ],
    variations: [
      { command: "git status", description: "Saída completa e legível (padrão)" },
      { command: "git status -s", description: "Saída compacta (short): duas colunas — stage | working dir" },
      { command: "git status -b", description: "Inclui info da branch no formato compacto" },
      { command: "git status -sb", description: "Compacto + branch (combinação mais usada no dia a dia)" },
      { command: "git status -u", description: "Controla exibição de untracked: -uno omite, -uall expande subdiretórios" },
      { command: "git status --ignored", description: "Mostra também arquivos ignorados (.gitignore)" },
    ],
    examples: [
      { code: "git status", description: "Ver estado atual completo antes de commitar" },
      { code: "git status -sb", description: "Visão rápida: branch + mudanças compactas" },
      { code: "git add .\ngit status -s", description: "Verificar o que entrou no stage após git add" },
    ],
    whenNotToUse: [
      "Não existe caso onde status seja prejudicial — é sempre seguro e não altera nada",
    ],
    relatedCommands: ["add", "commit", "diff", "restore"],
    deepDive:
      "Na saída compacta (-s), a primeira coluna indica o estado no stage e a segunda no working directory. Letras comuns: M (modified), A (added), D (deleted), ? (untracked), ! (ignored). É um dos comandos mais usados no Git — rodar status antes de qualquer operação é uma boa prática.",
    flags: [
      { flag: "-s / --short", description: "Saída compacta: duas colunas indicando estado no stage e no working dir" },
      { flag: "-b / --branch", description: "Mostra info da branch mesmo no modo compacto (-s)" },
      { flag: "-u / --untracked-files", description: "Controla exibição de untracked: -uno omite, -uall expande subdiretórios" },
      { flag: "--ignored", description: "Mostra também arquivos ignorados pelo .gitignore" },
      { flag: "--porcelain", description: "Saída estável para scripts — garante formato consistente entre versões do Git" },
    ],
    curiosities: [
      "git status é somente leitura — nunca altera nada no repositório. É sempre seguro de executar em qualquer situação.",
      "Na saída compacta (-s), a combinação '??' significa arquivo novo não rastreado. 'M ' (com espaço) significa modificado no stage; ' M' (espaço à esquerda) modificado no working dir.",
    ],
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
    "O commit cria um snapshot imutável identificado por um SHA. Ele registra o estado do stage, não do working directory. Alterações não adicionadas (unstaged) não entram no commit. O uso excessivo de --amend em commits já publicados pode causar conflitos ao forçar push.",
  flags: [
    { flag: "-m", description: "Define a mensagem do commit diretamente na linha de comando sem abrir editor" },
    { flag: "-a / --all", description: "Adiciona automaticamente ao stage arquivos rastreados modificados antes de commitar" },
    { flag: "--amend", description: "Reescreve o último commit — altera mensagem e/ou conteúdo. Não usar em commits já publicados", danger: true },
    { flag: "--no-edit", description: "Usa a mesma mensagem do commit anterior ao fazer --amend" },
    { flag: "-v / --verbose", description: "Mostra o diff no editor ao escrever a mensagem (contexto do que está sendo commitado)" },
    { flag: "--no-verify", description: "Ignora hooks pre-commit e commit-msg (ex: linters, testes)", danger: true },
    { flag: "--author", description: "Define o autor manualmente no formato \"Nome <email>\"" },
    { flag: "--allow-empty", description: "Permite criar commit mesmo sem alterações no stage (útil para acionar pipelines de CI)" },
    { flag: "--date", description: "Define data e hora do commit manualmente" },
    { flag: "--squash", description: "Prepara um commit de squash para uso posterior com rebase interativo" },
  ],
  curiosities: [
    "O SHA de cada commit é calculado com base no conteúdo, no SHA do commit pai, no autor e no timestamp. Alterar qualquer detalhe — até um espaço na mensagem — gera um SHA completamente diferente.",
    "O Git não armazena 'diffs' entre versões — ele armazena snapshots completos de cada arquivo. A eficiência de espaço vem da deduplicação de objetos idênticos (blobs), não de deltas.",
    "A mensagem de commit de Linus Torvalds no primeiro commit do kernel Linux tem apenas 6 palavras: 'Initial git repository build'.",
  ],
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
    "Push atualiza refs remotas. O flag -u cria o vínculo upstream entre sua branch local e a remota (facilita push/pull sem argumentos). Se você reescreveu histórico (rebase/amend), o remoto vai divergir e você pode precisar de --force-with-lease, que é mais seguro porque impede sobrescrever mudanças remotas que você não viu.",
  flags: [
    { flag: "-u / --set-upstream", description: "Define o upstream da branch — depois 'git push' funciona sem argumentos" },
    { flag: "--force-with-lease", description: "Força push apenas se o remoto não mudou desde seu último fetch — mais seguro que --force", danger: true },
    { flag: "--force / -f", description: "Sobrescreve o histórico remoto ignorando divergências — pode apagar trabalho de outros", danger: true },
    { flag: "--tags", description: "Envia todas as tags locais para o remoto" },
    { flag: "--delete", description: "Apaga uma branch ou tag no remoto" },
    { flag: "-n / --dry-run", description: "Simula o push sem executar — útil para conferir o que seria enviado" },
    { flag: "--no-verify", description: "Ignora hooks pre-push", danger: true },
    { flag: "--all", description: "Envia todas as branches locais para o remoto" },
  ],
  curiosities: [
    "--force-with-lease verifica internamente se o SHA remoto bate com sua última referência conhecida. É uma proteção contra 'pisar no trabalho de outro' sem perceber.",
    "Fazer git push --force em branches compartilhadas é considerado uma das piores práticas do Git — equivale a reescrever um capítulo publicado de um livro que outros já leram e referenciaram.",
  ],
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
    "Por baixo, pull faz 'fetch' e depois integra. A integração pode ser merge (cria merge commit se necessário) ou rebase (reaplica seus commits sobre a base nova). Para evitar merges locais indesejados, use --ff-only. Se sua equipe padroniza rebase em branches de feature, use --rebase (ou configure pull.rebase=true).",
  flags: [
    { flag: "--rebase", description: "Aplica seus commits sobre a base atualizada em vez de criar merge commit — mantém histórico linear" },
    { flag: "--ff-only", description: "Só atualiza se for fast-forward — falha ao invés de criar merge commit acidental" },
    { flag: "--autostash", description: "Faz stash automático antes de integrar e reaplicar ao final" },
    { flag: "--no-commit", description: "Integra as mudanças mas não cria commit automaticamente" },
    { flag: "--squash", description: "Comprime todos os commits recebidos em um único conjunto de mudanças" },
    { flag: "--depth <n>", description: "Aprofunda um clone raso baixando mais histórico" },
  ],
  curiosities: [
    "git pull é literalmente um atalho para dois comandos: git fetch + git merge (ou rebase). Separar em dois passos dá mais controle — você pode revisar o que chegou antes de integrar.",
    "A opção pull.rebase=true nas configs faz todo git pull usar rebase automaticamente — é a configuração preferida de times que prezam por histórico linear.",
  ],
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
      command: "git merge --squash feature/login",
      description: "Comprime todos os commits da branch em um único conjunto de mudanças no stage (você faz o commit manualmente)"
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
    "Merge pode acontecer de duas formas: fast-forward (sem merge commit) quando a branch atual está atrás e basta avançar o ponteiro, ou merge commit quando há divergência e o Git precisa criar um commit de integração. Em conflitos, resolva arquivos manualmente, rode 'git add' nos resolvidos e finalize com 'git commit' (ou use 'git merge --abort' para cancelar).",
  flags: [
    { flag: "--no-ff", description: "Força criação de merge commit mesmo em fast-forward — preserva o contexto da branch no histórico" },
    { flag: "--ff-only", description: "Só permite merge se for fast-forward — falha se precisar de merge commit" },
    { flag: "--squash", description: "Comprime todos os commits da branch em um único conjunto de mudanças no stage — você faz o commit manualmente" },
    { flag: "--abort", description: "Cancela merge em andamento e volta ao estado anterior" },
    { flag: "--no-commit", description: "Faz o merge mas não cria o commit automaticamente" },
    { flag: "-m", description: "Define a mensagem do merge commit" },
    { flag: "-s / --strategy", description: "Define a estratégia de merge (ex: ort, recursive, ours, theirs)" },
  ],
  curiosities: [
    "Fast-forward merge não cria nenhum commit novo — apenas move o ponteiro da branch para frente. É o merge mais simples e não deixa rastro de 'houve uma branch aqui'.",
    "A estratégia 'ort' (Ostensibly Recursive's Twin) substituiu 'recursive' como padrão no Git 2.33. É mais rápida e produz menos conflitos em merges complexos.",
  ],
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
    "Uma branch no Git é apenas um ponteiro leve para um commit. Criar branch é instantâneo e barato. O flag -d protege contra apagar branch que ainda não foi mergeada; -D ignora essa proteção. Branches remotas não são apagadas com git branch -d, e sim com 'git push origin --delete nome'. Para manter repositório limpo, combine 'git fetch --prune' com 'git branch --merged'. Em fluxos profissionais (Git Flow, Trunk Based), branches são efêmeras e devem ser removidas após integração.",
  flags: [
    { flag: "-v / --verbose", description: "Mostra o último commit de cada branch na listagem" },
    { flag: "-a / --all", description: "Lista branches locais e remotas" },
    { flag: "-r / --remotes", description: "Lista apenas branches remotas" },
    { flag: "-d / --delete", description: "Remove branch local (modo seguro — falha se não foi mergeada)" },
    { flag: "-D", description: "Remove branch local forçando, mesmo sem merge", danger: true },
    { flag: "-m / --move", description: "Renomeia branch local" },
    { flag: "--merged", description: "Lista branches já mergeadas na branch atual (candidatas a deleção)" },
    { flag: "--no-merged", description: "Lista branches ainda não mergeadas" },
    { flag: "--set-upstream-to", description: "Define manualmente a branch remota rastreada (upstream)" },
  ],
  curiosities: [
    "Uma branch no Git é literalmente um arquivo de texto com 41 bytes: o SHA do commit para onde aponta + quebra de linha. Criar branch é instantâneo e tem custo de armazenamento quase zero.",
    "Ao contrário de outros sistemas como SVN, branches no Git não têm custo de criação ou armazenamento. A filosofia 'branch early, branch often' é uma consequência direta disso.",
  ],
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
    "git switch foi introduzido para separar responsabilidades do antigo git checkout. Ele lida apenas com troca de branches, tornando o fluxo mais seguro e previsível. Em detached HEAD, commits feitos não pertencem a nenhuma branch até que você crie uma nova com 'git switch -c nome'. A flag '-' é extremamente útil para alternar rapidamente entre duas branches.",
  flags: [
    { flag: "-c / --create", description: "Cria branch nova e já entra nela" },
    { flag: "-d / --detach", description: "Entra em modo detached HEAD em um commit específico" },
    { flag: "--discard-changes", description: "Descarta alterações locais ao trocar de branch", danger: true },
    { flag: "--merge", description: "Tenta preservar mudanças locais fazendo merge automático ao trocar de branch" },
    { flag: "-", description: "Atalho para voltar à branch anterior — alternância rápida entre duas branches" },
    { flag: "-q / --quiet", description: "Suprime mensagens de saída" },
  ],
  curiosities: [
    "git switch foi introduzido no Git 2.23 (2019) para separar as três responsabilidades que o sobrecarregado git checkout acumulou ao longo dos anos.",
    "Detached HEAD não é um estado de erro — é um modo legítimo para explorar commits antigos. O perigo é fazer novos commits nesse estado sem criar uma branch para não perdê-los.",
  ],
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
    "git log é extremamente poderoso. A combinação --oneline --graph --decorate --all oferece uma visualização clara do fluxo de branches. Filtros como --since, --author e ranges (A..B) ajudam a investigar mudanças específicas. Para análise profunda, combine com -p ou --stat.",
  flags: [
    { flag: "--oneline", description: "Uma linha por commit: SHA curto + mensagem" },
    { flag: "--graph", description: "Desenha gráfico ASCII das branches no histórico" },
    { flag: "--decorate", description: "Mostra onde estão HEAD, branches e tags no histórico" },
    { flag: "--all", description: "Inclui histórico de todas as branches e tags" },
    { flag: "-p / --patch", description: "Mostra o diff completo de cada commit" },
    { flag: "--stat", description: "Resumo de arquivos e linhas alteradas por commit" },
    { flag: "-n <número>", description: "Limita o número de commits exibidos (ex: -n 10)" },
    { flag: "--author", description: "Filtra por nome ou e-mail do autor" },
    { flag: "--since / --after", description: "Filtra commits após uma data (ex: --since=\"2 days ago\")" },
    { flag: "--until / --before", description: "Filtra commits antes de uma data" },
    { flag: "--follow", description: "Segue histórico de um arquivo mesmo após rename" },
    { flag: "--format / --pretty", description: "Controla formato de saída (oneline, short, full, format:...)" },
    { flag: "--no-merges", description: "Omite merge commits do histórico" },
  ],
  curiosities: [
    "git log --oneline --graph --decorate --all é tão usado que muitos times criam um alias 'git lg' nas configurações globais do Git.",
    "O Git armazena dois tipos de autoria: author (quem escreveu o código) e committer (quem criou o commit). Em open source com patches por e-mail, esses podem ser pessoas diferentes.",
  ],
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
    "O reset altera onde o HEAD aponta. --soft move apenas o ponteiro, --mixed altera também o stage (padrão), e --hard altera stage e working directory apagando mudanças locais. Caso algo seja apagado por engano, muitas vezes é possível recuperar usando git reflog.",
  flags: [
    { flag: "--soft", description: "Move o HEAD mas mantém alterações no stage — útil para refazer o commit" },
    { flag: "--mixed", description: "Move o HEAD e limpa o stage, mas mantém as mudanças no working directory (padrão)" },
    { flag: "--hard", description: "Move o HEAD e APAGA tudo: stage e working directory", danger: true },
    { flag: "--merge", description: "Volta HEAD mas preserva diferenças não commitadas quando possível" },
    { flag: "--keep", description: "Similar ao --merge mas falha se houver mudanças conflitantes com os commits resetados" },
    { flag: "HEAD~n", description: "Referência relativa: volta n commits (ex: HEAD~1 = commit anterior)" },
  ],
  curiosities: [
    "git reset --hard apaga alterações permanentemente do working directory — mas os commits removidos ficam no reflog por 30 dias por padrão, permitindo recuperação com git reflog + git reset.",
    "A diferença entre --soft, --mixed e --hard é o que acontece com stage e working directory. O ponteiro HEAD sempre se move nos três modos.",
  ],
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
    "git fetch atualiza apenas as referências remotas (ex: origin/main) sem tocar no seu working directory. É a forma mais segura de se atualizar antes de integrar mudanças. A flag --prune mantém seu ambiente limpo removendo branches remotas que foram deletadas no servidor.",
  flags: [
    { flag: "--all", description: "Busca de todos os remotos configurados" },
    { flag: "-p / --prune", description: "Remove refs locais de branches remotas que já foram deletadas" },
    { flag: "--tags", description: "Busca todas as tags do remoto" },
    { flag: "--depth <n>", description: "Limita o histórico baixado — útil para aprofundar clone raso" },
    { flag: "--dry-run", description: "Mostra o que seria buscado sem executar" },
    { flag: "-q / --quiet", description: "Suprime mensagens de progresso" },
    { flag: "--no-tags", description: "Não baixa tags automaticamente" },
  ],
  curiosities: [
    "git fetch é completamente seguro de executar a qualquer momento — nunca altera seu working directory ou branches locais. Só atualiza as referências remotas (origin/main etc.).",
    "Após um fetch, origin/main e sua branch main local são ponteiros independentes. Você pode comparar com git log HEAD..origin/main antes de decidir como integrar.",
  ],
},
{
  id: "remote",
  name: "git remote",
  description: "Gerencia conexões com repositórios remotos: adiciona, lista, renomeia, remove e inspeciona.",
  syntax: "git remote [opções]",
  category: "remote",
  uses: [
    "Adicionar origem remota a um repositório local",
    "Listar remotos configurados",
    "Trocar a URL do remoto (ex: de HTTPS para SSH)",
    "Remover ou renomear remotos",
  ],
  variations: [
    { command: "git remote -v", description: "Lista remotos com suas URLs (fetch e push)" },
    { command: "git remote add origin <url>", description: "Adiciona remoto chamado 'origin'" },
    { command: "git remote add upstream <url>", description: "Adiciona segundo remoto (comum em forks)" },
    { command: "git remote remove origin", description: "Remove um remoto" },
    { command: "git remote rename origin novo-nome", description: "Renomeia um remoto" },
    { command: "git remote set-url origin <nova-url>", description: "Altera a URL de um remoto (ex: HTTPS → SSH)" },
    { command: "git remote show origin", description: "Exibe detalhes completos do remoto: branches rastreadas, status" },
    { command: "git remote prune origin", description: "Remove referências locais de branches remotas deletadas" },
  ],
  examples: [
    { code: "git remote add origin git@github.com:user/repo.git", description: "Conectar repo local ao GitHub via SSH" },
    { code: "git remote -v", description: "Confirmar URL configurada (útil após troca de HTTPS para SSH)" },
    { code: "git remote set-url origin git@github.com:user/repo.git", description: "Trocar URL de HTTPS para SSH sem reconfigurar tudo" },
    { code: "git remote show origin", description: "Ver quais branches remotas estão sendo rastreadas" },
  ],
  whenNotToUse: [
    "Se você clonou o repo (origin já é configurado automaticamente)",
    "Para navegar entre branches remotas (use fetch + switch)",
  ],
  relatedCommands: ["fetch", "push", "pull", "clone"],
  deepDive:
    "O nome 'origin' é apenas uma convenção — pode ser qualquer nome. Em forks, é comum ter 'origin' apontando para seu fork e 'upstream' para o repo original. O comando 'git remote show' é especialmente útil para entender quais branches locais rastreiam quais remotas e se estão desatualizadas.",
  flags: [
    { flag: "-v / --verbose", description: "Lista remotos com URLs de fetch e push" },
    { flag: "add <nome> <url>", description: "Adiciona novo remoto com o nome especificado" },
    { flag: "remove / rm <nome>", description: "Remove um remoto e suas referências locais" },
    { flag: "rename <antigo> <novo>", description: "Renomeia um remoto" },
    { flag: "set-url <nome> <url>", description: "Altera a URL de um remoto existente (ex: HTTPS → SSH)" },
    { flag: "show <nome>", description: "Exibe informações detalhadas: branches rastreadas, status de sincronização" },
    { flag: "prune <nome>", description: "Remove refs locais de branches remotas já deletadas no servidor" },
  ],
  curiosities: [
    "O nome 'origin' dado ao remoto após clone é apenas uma convenção do Git. Em forks, é comum ter 'origin' (seu fork) e 'upstream' (repo original) — dois remotos para o mesmo projeto.",
    "git remote -v mostra URLs separadas para fetch e push. Você pode configurá-las diferente — útil em repositórios mirror ou setups especiais de CI/CD.",
  ],
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
    { command: "git diff", description: "Diferenças não adicionadas ao stage (unstaged)" },
    { command: "git diff --staged", description: "Diferenças já adicionadas ao stage (o que entrará no commit)" },
    { command: "git diff HEAD", description: "Tudo que mudou desde o último commit (staged + unstaged)" },
    { command: "git diff main..feature", description: "Compara duas branches" },
    { command: "git diff <sha1> <sha2>", description: "Compara dois commits específicos" },
    { command: "git diff --name-only", description: "Mostra apenas os nomes dos arquivos alterados" },
    { command: "git diff --stat", description: "Resumo de arquivos alterados com contagem de linhas" },
    { command: "git diff --word-diff", description: "Diff por palavra em vez de linha (útil em textos e mensagens)" },
    { command: "git diff -- arquivo.ts", description: "Diff de um arquivo específico" },
    { command: "git diff --ignore-all-space", description: "Ignora diferenças de espaço/indentação" },
  ],
  examples: [
    { code: "git diff", description: "Ver mudanças locais antes de adicionar ao stage" },
    { code: "git diff --staged", description: "Revisar exatamente o que vai entrar no commit" },
    { code: "git diff --stat main..feature", description: "Resumo rápido do que uma branch muda em relação à main" },
    { code: "git diff --name-only HEAD~3 HEAD", description: "Quais arquivos mudaram nos últimos 3 commits" },
  ],
  whenNotToUse: [
    "Se você quer ver histórico completo (use git log)",
    "Se quer ver o diff de um commit específico (use git show <sha>)",
  ],
  relatedCommands: ["status", "add", "log", "show"],
  flags: [
    { flag: "--staged / --cached", description: "Mostra diferenças no stage (o que entrará no próximo commit)" },
    { flag: "--name-only", description: "Mostra apenas os nomes dos arquivos alterados, sem o diff" },
    { flag: "--name-status", description: "Mostra nomes e tipo de mudança (M=modified, A=added, D=deleted)" },
    { flag: "--stat", description: "Resumo: quantas linhas adicionadas/removidas por arquivo" },
    { flag: "--word-diff", description: "Diff por palavra em vez de linha — útil para textos e mensagens" },
    { flag: "-w / --ignore-all-space", description: "Ignora mudanças de espaço e indentação" },
    { flag: "--color-words", description: "Realça apenas as palavras alteradas com cor" },
    { flag: "-U <n>", description: "Define quantas linhas de contexto exibir ao redor das mudanças" },
    { flag: "--diff-filter", description: "Filtra por tipo de mudança (ex: --diff-filter=M mostra só modificados)" },
  ],
  curiosities: [
    "git diff sem argumentos mostra unstaged, git diff --staged mostra staged, e git diff HEAD mostra tudo. Confundir os três é um dos erros mais comuns no dia a dia.",
    "O formato de saída do diff (prefixo + e - nas linhas) é o 'unified diff' — um padrão criado nos anos 80 que ainda é amplamente usado em patches e code reviews.",
  ]
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
    "Stash salva seu estado local e volta o working directory para um estado limpo. 'apply' reaplica sem remover da lista; 'pop' reaplica e remove. Use mensagens (-m) e sempre confira com 'stash show -p' quando estiver lidando com múltiplos stashes. Em casos de conflito ao aplicar, resolva como um merge normal e faça commit se necessário.",
  flags: [
    { flag: "-m / --message", description: "Adiciona descrição ao stash — muito recomendado para não perder contexto" },
    { flag: "-u / --include-untracked", description: "Inclui arquivos não rastreados no stash" },
    { flag: "-a / --all", description: "Inclui untracked + arquivos ignorados pelo .gitignore", danger: true },
    { flag: "-p / --patch", description: "Modo interativo: escolhe quais mudanças guardar no stash" },
    { flag: "--keep-index", description: "Guarda o working directory mas mantém o stage intacto" },
    { flag: "pop", description: "Reaplica o último stash e o remove da lista" },
    { flag: "apply", description: "Reaplica um stash sem removê-lo da lista (útil para aplicar em várias branches)" },
    { flag: "drop", description: "Remove um stash específico da lista" },
    { flag: "clear", description: "Apaga TODOS os stashes — irreversível", danger: true },
  ],
  curiosities: [
    "Stash internamente cria 2 ou 3 commits especiais referenciados por refs/stash. Eles não aparecem em git log mas estão fisicamente no repositório.",
    "git stash é efêmero por design — não foi feito para armazenamento de longo prazo. Para guardar trabalho por mais tempo, uma branch de WIP (work in progress) é mais adequada.",
  ],
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
    "O rebase reescreve o histórico criando novos commits com novos SHAs. Diferente do merge, ele não cria um merge commit, mantendo o histórico linear. Caso já tenha feito push da branch, será necessário usar 'git push --force-with-lease' (com cuidado). Em caso de conflito, o Git pausa o processo até que os arquivos sejam corrigidos manualmente.",
  flags: [
    { flag: "-i / --interactive", description: "Modo interativo: reordena, edita, squash ou apaga commits antes de publicar" },
    { flag: "--onto <nova-base>", description: "Move commits para uma base completamente diferente" },
    { flag: "--autostash", description: "Faz stash automático antes do rebase e reaplicar ao final" },
    { flag: "--continue", description: "Continua após resolver conflito" },
    { flag: "--abort", description: "Cancela rebase e volta ao estado anterior" },
    { flag: "--skip", description: "Pula o commit atual com conflito e continua" },
    { flag: "--no-verify", description: "Ignora hooks durante o rebase", danger: true },
    { flag: "--autosquash", description: "Reorganiza automaticamente commits marcados como fixup! ou squash!" },
  ],
  curiosities: [
    "Rebase nunca 'move' commits — ele cria commits novos com o mesmo diff e depois apaga os originais. Por isso os SHAs sempre mudam após um rebase.",
    "git rebase -i é uma máquina do tempo: permite reordenar, editar, juntar ou apagar qualquer commit do histórico local antes de publicar.",
  ],
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
    { command: "git cherry-pick <sha>", description: "Aplica um commit específico na branch atual" },
    { command: "git cherry-pick <sha1> <sha2>", description: "Aplica múltiplos commits (na ordem informada)" },
    { command: "git cherry-pick <sha1>..<sha2>", description: "Aplica range de commits (exclui sha1, inclui sha2)" },
    { command: "git cherry-pick <sha1>^..<sha2>", description: "Aplica range incluindo o primeiro commit (sha1)" },
    { command: "git cherry-pick -n <sha>", description: "Aplica as mudanças no stage SEM criar commit automaticamente" },
    { command: "git cherry-pick -e <sha>", description: "Abre editor para editar a mensagem antes de commitar" },
    { command: "git cherry-pick -x <sha>", description: "Adiciona referência ao commit original na mensagem ('cherry picked from...')" },
    { command: "git cherry-pick --continue", description: "Continua após resolver conflito" },
    { command: "git cherry-pick --abort", description: "Cancela e volta ao estado anterior" },
    { command: "git cherry-pick --skip", description: "Pula o commit atual com conflito e continua o range" },
  ],
  examples: [
    { code: "git cherry-pick a1b2c3d", description: "Levar um fix específico para outra branch" },
    { code: "git cherry-pick -n a1b2c3d\ngit diff --staged\ngit commit -m \"feat: port login fix\"", description: "Aplicar mudanças sem commit automático para revisar antes" },
    { code: "git cherry-pick abc123^..def456", description: "Aplicar sequência completa de commits entre dois SHAs" },
  ],
  whenNotToUse: [
    "Se você quer integrar uma branch inteira (use merge ou rebase)",
    "Se os commits têm dependências entre si — cherry-pick individual pode quebrar contexto",
  ],
  relatedCommands: ["merge", "rebase", "log", "show"],
  flags: [
    { flag: "-n / --no-commit", description: "Aplica as mudanças no stage sem criar commit automaticamente — útil para combinar múltiplos cherry-picks em um commit" },
    { flag: "-e / --edit", description: "Abre editor para editar a mensagem antes de commitar" },
    { flag: "-x", description: "Adiciona referência ao commit original na mensagem ('cherry picked from...')" },
    { flag: "--continue", description: "Continua após resolver conflito" },
    { flag: "--abort", description: "Cancela e volta ao estado anterior" },
    { flag: "--skip", description: "Pula o commit atual com conflito e continua o range" },
    { flag: "-m <número>", description: "Em merge commits, define qual branch pai usar como base (1 ou 2)" },
  ],
  curiosities: [
    "cherry-pick cria um commit completamente novo — o SHA será diferente do original mesmo que o diff seja idêntico. Dois commits com o mesmo diff mas SHAs distintos coexistem no histórico.",
    "O termo 'cherry-pick' vem da metáfora de escolher cerejas específicas de uma árvore em vez de colher tudo de uma vez.",
  ]
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
    { command: "git revert <sha>", description: "Cria commit que reverte as mudanças de um commit específico" },
    { command: "git revert HEAD", description: "Reverte o último commit" },
    { command: "git revert HEAD~3..HEAD", description: "Reverte os últimos 3 commits (cria um commit por reversão)" },
    { command: "git revert -n <sha>", description: "Aplica a reversão no stage sem criar commit automaticamente" },
    { command: "git revert --no-edit <sha>", description: "Reverte sem abrir editor para editar mensagem (aceita mensagem padrão)" },
    { command: "git revert --continue", description: "Continua após resolver conflito de reversão" },
    { command: "git revert --abort", description: "Cancela o revert em andamento" },
  ],
  examples: [
    { code: "git revert HEAD --no-edit", description: "Reverter último commit rápido sem editar mensagem" },
    { code: "git revert -n a1b2c3d\ngit revert -n b2c3d4e\ngit commit -m \"revert: remove feature X\"", description: "Reverter múltiplos commits em um único commit de reversão" },
  ],
  whenNotToUse: [
    "Se o commit ainda não foi publicado e você quer remover do histórico (use reset)"
  ],
  relatedCommands: ["reset", "reflog", "log"],
  flags: [
    { flag: "--no-edit", description: "Aceita a mensagem padrão de reversão sem abrir editor" },
    { flag: "-n / --no-commit", description: "Aplica a reversão no stage sem criar commit — útil para combinar múltiplos reverts em um único commit" },
    { flag: "--continue", description: "Continua após resolver conflito de reversão" },
    { flag: "--abort", description: "Cancela o revert em andamento" },
    { flag: "-m <número>", description: "Em merge commits, define qual branch pai é o 'mainline' (1 ou 2) — obrigatório ao reverter um merge" },
  ],
  curiosities: [
    "git revert é a forma correta de desfazer em histórico público: cria um novo commit que inverte o efeito de outro, sem reescrever o histórico.",
    "Reverter um merge commit é especialmente delicado: se você reverter e depois tentar re-mergear a branch, o Git vai ignorar os commits já revertidos. É necessário reverter o próprio revert antes de re-mergear.",
  ],
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
    { command: "git tag -l \"v1.*\"", description: "Lista tags com filtro por padrão" },
    { command: "git tag v1.0.0", description: "Cria tag leve no commit atual (sem metadados extras)" },
    { command: "git tag -a v1.0.0 -m \"mensagem\"", description: "Cria tag anotada (recomendada para releases — inclui autor, data e mensagem)" },
    { command: "git tag -a v1.0.0 <sha>", description: "Cria tag em um commit anterior específico" },
    { command: "git tag -d v1.0.0", description: "Deleta uma tag local" },
    { command: "git push origin --tags", description: "Envia todas as tags para o remoto" },
    { command: "git push origin v1.0.0", description: "Envia uma tag específica para o remoto" },
    { command: "git push origin --delete v1.0.0", description: "Deleta uma tag no remoto" },
  ],
  examples: [
    { code: "git tag -a v2.0.0 -m \"Release 2.0\"", description: "Criar tag anotada para release" },
    { code: "git push origin v2.0.0", description: "Publicar tag específica no remoto" },
    { code: "git tag -d v2.0.0\ngit push origin --delete v2.0.0", description: "Deletar tag local e remota" },
  ],
  whenNotToUse: [
    "Se você precisa continuar desenvolvimento (use branch)"
  ],
  relatedCommands: ["show", "log", "push"],
  flags: [
    { flag: "-a / --annotate", description: "Cria tag anotada com autor, data e mensagem — recomendada para releases" },
    { flag: "-m / --message", description: "Define a mensagem da tag anotada" },
    { flag: "-d / --delete", description: "Deleta tag local" },
    { flag: "-l / --list", description: "Lista tags com suporte a filtro por padrão (ex: -l \"v1.*\")" },
    { flag: "-f / --force", description: "Força criação de tag mesmo se já existe com esse nome", danger: true },
    { flag: "-s / --sign", description: "Cria tag assinada com GPG" },
    { flag: "-v / --verify", description: "Verifica assinatura GPG de uma tag" },
  ],
  curiosities: [
    "Existem dois tipos de tags: leves (apenas um ponteiro para um commit) e anotadas (um objeto completo com autor, data, mensagem e opcionalmente assinatura GPG). Para releases, sempre use tags anotadas.",
    "Tags não se movem — ao contrário de branches. Uma vez criada, v1.0.0 sempre apontará para o mesmo commit, a menos que você a delete e recrie.",
  ],
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
  relatedCommands: ["log", "diff", "tag"],
  flags: [
    { flag: "--stat", description: "Mostra resumo de arquivos alterados no commit" },
    { flag: "--name-only", description: "Mostra apenas nomes dos arquivos alterados" },
    { flag: "-p / --patch", description: "Mostra o diff completo (padrão para commits)" },
    { flag: "--format / --pretty", description: "Controla formato de saída (oneline, short, full, format:...)" },
    { flag: "--no-patch / -s", description: "Suprime o diff — mostra apenas o cabeçalho do commit" },
  ],
  curiosities: [
    "git show funciona com qualquer objeto Git: commits, tags, trees e blobs. 'git show HEAD:arquivo.ts' mostra o conteúdo de um arquivo em um commit específico sem fazer checkout.",
  ],
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
  relatedCommands: ["reset", "rebase", "log"],
  flags: [
    { flag: "--date=relative", description: "Mostra datas relativas ('2 hours ago', '3 days ago')" },
    { flag: "--all", description: "Mostra reflog de todas as refs (branches, stash, etc.)" },
    { flag: "-n <número>", description: "Limita o número de entradas exibidas" },
    { flag: "--expire", description: "Define o prazo de expiração das entradas" },
    { flag: "show <branch>", description: "Mostra o reflog de uma branch específica" },
  ],
  curiosities: [
    "O reflog é local — não é enviado ao remoto com git push. Cada máquina tem seu próprio reflog independente.",
    "Por padrão, o reflog mantém entradas por 90 dias (30 dias para entradas não acessíveis por nenhuma branch). Configurável com gc.reflogExpire.",
  ],
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
  relatedCommands: ["log", "show", "diff"],
  flags: [
    { flag: "-L <início>,<fim>", description: "Limita análise a um intervalo de linhas específico" },
    { flag: "-w", description: "Ignora mudanças apenas de whitespace — não atribui culpa por ajuste de indentação" },
    { flag: "-e / --show-email", description: "Mostra e-mail do autor em vez do nome" },
    { flag: "--since", description: "Ignora commits antes da data especificada" },
    { flag: "-M", description: "Detecta linhas movidas dentro do mesmo arquivo" },
    { flag: "-C", description: "Detecta linhas copiadas de outros arquivos" },
    { flag: "--ignore-rev <sha>", description: "Ignora um commit específico (ex: commit de formatação automática)" },
  ],
  curiosities: [
    "git blame mostra o último commit que alterou cada linha, não necessariamente quem a escreveu. Reformatações e refactors podem 'culpar' a pessoa errada.",
    "Combinando blame com git log -p é possível fazer arqueologia de código: rastrear a evolução de uma linha ao longo de toda a história do projeto.",
  ],
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
  relatedCommands: ["status", "reset", "stash"],
  flags: [
    { flag: "-n / --dry-run", description: "Mostra o que seria removido sem executar — sempre use antes de -f" },
    { flag: "-f / --force", description: "Executa a remoção de arquivos não rastreados" },
    { flag: "-d", description: "Remove também diretórios não rastreados" },
    { flag: "-x", description: "Remove também arquivos ignorados pelo .gitignore", danger: true },
    { flag: "-X", description: "Remove APENAS arquivos ignorados (mantém untracked não ignorados)" },
    { flag: "-i / --interactive", description: "Modo interativo para escolher quais arquivos remover" },
  ],
  curiosities: [
    "git clean é irreversível — diferente de reset, não há reflog para arquivos untracked. Uma vez removidos, não há como recuperar. Por isso -n (dry-run) é essencial antes de -f.",
  ],
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
  relatedCommands: ["add", "reset", "restore"],
  flags: [
    { flag: "--cached", description: "Remove do tracking do Git mas mantém o arquivo no disco — útil quando você quer adicionar algo ao .gitignore que já foi commitado" },
    { flag: "-r", description: "Remove recursivamente — necessário para diretórios" },
    { flag: "-f / --force", description: "Força remoção mesmo com mudanças locais não commitadas", danger: true },
    { flag: "-n / --dry-run", description: "Mostra o que seria removido sem executar" },
  ],
  curiosities: [
    "git rm --cached é um dos comandos mais úteis quando você acidentalmente commita um arquivo que deveria estar no .gitignore. Remove do tracking sem apagar do disco.",
  ],
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
  relatedCommands: ["add", "rm", "status"],
  flags: [
    { flag: "-f / --force", description: "Força a operação mesmo se o destino já existe", danger: true },
    { flag: "-n / --dry-run", description: "Mostra o que seria feito sem executar" },
    { flag: "-v / --verbose", description: "Mostra os arquivos sendo movidos/renomeados" },
  ],
  curiosities: [
    "O Git não rastreia renomeações de arquivos explicitamente — ele detecta por similaridade de conteúdo após o fato. git mv é um atalho para 'mv + git rm + git add', garantindo que a detecção funcione corretamente.",
  ],
},
{
  id: "config",
  name: "git config",
  description: "Lê e define configurações do Git: identidade, editor, aliases, comportamentos padrão e muito mais.",
  syntax: "git config [--global | --local | --system] <chave> <valor>",
  category: "basics",
  uses: [
    "Configurar nome e e-mail do usuário (obrigatório no primeiro uso)",
    "Definir editor padrão (VS Code, Vim, etc.)",
    "Criar aliases para comandos longos",
    "Ajustar comportamentos padrão (pull.rebase, push.default, etc.)",
    "Inspecionar todas as configurações ativas",
  ],
  variations: [
    { command: "git config --global user.name \"Seu Nome\"", description: "Define nome do autor (global)" },
    { command: "git config --global user.email \"email@exemplo.com\"", description: "Define e-mail do autor (global)" },
    { command: "git config --list", description: "Lista todas as configurações ativas (global + local)" },
    { command: "git config --list --show-origin", description: "Lista configurações mostrando de qual arquivo vêm" },
    { command: "git config --global core.editor \"code --wait\"", description: "Define VS Code como editor padrão" },
    { command: "git config --global pull.rebase true", description: "Faz pull usar rebase por padrão em vez de merge" },
    { command: "git config --global alias.st status", description: "Cria alias: 'git st' vira 'git status'" },
    { command: "git config --global alias.lg \"log --oneline --graph --decorate --all\"", description: "Alias para log visual com grafo" },
    { command: "git config --local user.email \"trabalho@empresa.com\"", description: "Define e-mail só para o repo atual (sobrescreve o global)" },
    { command: "git config --unset <chave>", description: "Remove uma configuração específica" },
  ],
  examples: [
    { code: "git config --global user.name \"João Silva\"\ngit config --global user.email \"joao@email.com\"", description: "Setup inicial obrigatório (identidade do autor)" },
    { code: "git config --global alias.lg \"log --oneline --graph --decorate --all\"\ngit lg", description: "Criar e usar alias para log visual" },
    { code: "git config --list --show-origin", description: "Depurar qual arquivo está definindo qual configuração" },
  ],
  whenNotToUse: [
    "Use --local quando a config for específica do projeto (ex: e-mail corporativo em um repo específico)",
    "Evite usar --system a menos que queira afetar todos os usuários da máquina",
  ],
  relatedCommands: ["init", "remote", "commit"],
  deepDive:
    "O Git possui três níveis de configuração: --system (toda a máquina), --global (seu usuário) e --local (repositório atual). O nível mais específico sempre sobrescreve o mais geral. Aliases são uma das features mais subestimadas do config — transformar 'log --oneline --graph --decorate --all' em 'git lg' muda o fluxo de trabalho.",
  flags: [
    { flag: "--global", description: "Aplica configuração a todos os repos do usuário atual (~/.gitconfig)" },
    { flag: "--local", description: "Aplica configuração apenas ao repo atual (.git/config) — sobrescreve global" },
    { flag: "--system", description: "Aplica configuração a todos os usuários da máquina (/etc/gitconfig)" },
    { flag: "--list / -l", description: "Lista todas as configurações ativas" },
    { flag: "--show-origin", description: "Mostra de qual arquivo vem cada configuração — útil para depurar conflitos" },
    { flag: "--unset", description: "Remove uma configuração específica" },
    { flag: "--edit / -e", description: "Abre o arquivo de configuração no editor padrão" },
    { flag: "--get", description: "Retorna o valor de uma chave específica" },
  ],
  curiosities: [
    "O Git tem três níveis de configuração: --system (toda a máquina), --global (seu usuário) e --local (repositório). O mais específico sempre vence — você pode ter um e-mail diferente por projeto.",
    "Aliases no git config são uma das features mais subestimadas: 'git config --global alias.lg \"log --oneline --graph --decorate --all\"' e 'git lg' passa a funcionar em qualquer repo.",
  ],
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
  relatedCommands: ["reset", "checkout", "revert"],
  flags: [
    { flag: "--staged", description: "Remove arquivo do stage sem descartar as mudanças no working directory" },
    { flag: "--source=<ref>", description: "Restaura versão de um commit, branch ou tag específica" },
    { flag: "--worktree", description: "Descarta mudanças no working directory (comportamento padrão)" },
    { flag: "-p / --patch", description: "Modo interativo: escolhe quais hunks restaurar" },
  ],
  curiosities: [
    "git restore foi introduzido no Git 2.23 junto com git switch para separar as responsabilidades do git checkout. Restore lida com arquivos; switch lida com branches.",
  ],
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
  relatedCommands: ["log", "revert", "checkout"],
  flags: [
    { flag: "start", description: "Inicia o processo de bisect" },
    { flag: "bad", description: "Marca o commit atual como ruim (contém o bug)" },
    { flag: "good <sha>", description: "Marca um commit como bom (sem o bug)" },
    { flag: "reset", description: "Finaliza o bisect e volta ao estado original" },
    { flag: "run <script>", description: "Automatiza o bisect — executa script para testar cada commit (0=bom, não-zero=ruim)" },
    { flag: "skip", description: "Pula um commit (ex: quando não compila ou não é testável)" },
  ],
  curiosities: [
    "git bisect usa busca binária — em um histórico de 1000 commits, encontra o commit problemático em no máximo 10 tentativas. Sem bisect, você testaria até 1000.",
    "git bisect run <script> automatiza completamente o processo: o script retorna 0 para 'bom' e não-zero para 'ruim'. O Git navega pelo histórico sozinho até encontrar o commit culpado.",
  ],
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
  relatedCommands: ["branch", "checkout", "switch"],
  flags: [
    { flag: "add <caminho> <branch>", description: "Cria novo diretório de trabalho com a branch especificada" },
    { flag: "list", description: "Lista todos os worktrees ativos com seus caminhos e branches" },
    { flag: "remove <caminho>", description: "Remove um worktree" },
    { flag: "--force", description: "Força a operação mesmo com mudanças não commitadas", danger: true },
    { flag: "prune", description: "Remove worktrees inválidos ou deletados manualmente" },
    { flag: "lock", description: "Protege um worktree de ser removido por prune" },
  ],
  curiosities: [
    "git worktree permite ter múltiplos checkouts do mesmo repositório em diretórios diferentes — útil para trabalhar em hotfix enquanto uma feature está em andamento, sem stash ou commit parcial.",
  ],
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
  relatedCommands: ["clone", "pull", "fetch"],
  flags: [
    { flag: "add <url>", description: "Adiciona repositório externo como submódulo" },
    { flag: "init", description: "Inicializa submódulos definidos no .gitmodules" },
    { flag: "update --init --recursive", description: "Inicializa e atualiza todos os submódulos recursivamente" },
    { flag: "foreach <comando>", description: "Executa um comando em cada submódulo" },
    { flag: "status", description: "Mostra estado atual de cada submódulo" },
    { flag: "--recursive", description: "Aplica a operação em submódulos aninhados" },
    { flag: "deinit", description: "Desregistra um submódulo (remove do .gitmodules e apaga seu conteúdo local)" },
  ],
  curiosities: [
    "Submodules fixam um commit específico de outro repositório — não uma branch. Atualizar o submódulo significa criar um novo commit no repo pai com o ponteiro novo.",
    "A maioria dos times modernos prefere gerenciadores de pacotes (npm, pip, cargo) a submodules para dependências externas. Submodules fazem mais sentido quando você precisa modificar o código da dependência.",
  ],
},

];

export function getCommandById(id: string): GitCommand | undefined {
  return commands.find((c) => c.id === id);
}

export function getCommandsByCategory(category: string): GitCommand[] {
  return commands.filter((c) => c.category === category);
}
