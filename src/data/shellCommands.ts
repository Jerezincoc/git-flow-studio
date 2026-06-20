export interface ShellFlag {
  flag: string;
  description: string;
  example?: string;
  danger?: boolean;
}

export interface ShellVariation {
  command: string;
  description: string;
}

export interface ShellExample {
  code: string;
  description: string;
}

export interface SyntaxPart {
  part: string;
  label: string;
  description: string;
  optional?: boolean;
}

export interface ShellCommand {
  id: string;
  name: string;
  description: string;
  syntax: string;
  category:
    | "navigation"
    | "files"
    | "content"
    | "pipeline"
    | "system"
    | "network"
    | "strings"
    | "modules"
    | "environment"
    | "scheduling"
    | "security"
    | "registry"
    | "remoting";
  level: "básico" | "intermediário" | "avançado";
  uses: string[];
  variations: ShellVariation[];
  examples: ShellExample[];
  whenNotToUse: string[];
  relatedCommands: string[];
  deepDive?: string;
  flags?: ShellFlag[];
  curiosities?: string[];
  syntaxBreakdown?: SyntaxPart[];
}

export const shellLevelLabels: Record<string, string> = {
  "básico": "Básico",
  "intermediário": "Intermediário",
  "avançado": "Avançado",
};

export const shellCategoryLabels: Record<string, string> = {
  navigation:  "Navegação",
  files:       "Arquivos",
  content:     "Conteúdo",
  pipeline:    "Pipeline",
  system:      "Sistema",
  network:     "Rede",
  strings:     "Strings",
  modules:     "Módulos",
  environment: "Ambiente",
  scheduling:  "Agendamento",
  security:    "Segurança",
  registry:    "Registro",
  remoting:    "Remoting",
};

export const shellCommands: ShellCommand[] = [
  /* ─── NAVEGAÇÃO ──────────────────────────────────────────────────── */
  {
    id: "get-childitem",
    name: "Get-ChildItem",
    description: "Lista arquivos e pastas de um diretório. Equivalente ao ls no Linux e dir no CMD.",
    syntax: "Get-ChildItem [[-Path] <string>] [-Filter <string>] [-Recurse] [-Hidden] [-Force]",
    category: "navigation",
    level: "básico",
    uses: [
      "Listar arquivos de uma pasta",
      "Buscar arquivos por extensão ou padrão",
      "Verificar conteúdo de diretórios recursivamente",
      "Listar arquivos ocultos",
    ],
    variations: [
      { command: "Get-ChildItem", description: "Lista o diretório atual" },
      { command: "Get-ChildItem C:\\Users", description: "Lista diretório específico" },
      { command: "Get-ChildItem -Recurse", description: "Lista recursivamente todos os subdiretórios" },
      { command: "Get-ChildItem -Filter *.txt", description: "Filtra por extensão" },
      { command: "Get-ChildItem -Hidden", description: "Mostra apenas arquivos ocultos" },
      { command: "Get-ChildItem -Force", description: "Inclui arquivos ocultos e do sistema" },
      { command: "gci", description: "Alias curto para Get-ChildItem" },
      { command: "ls", description: "Alias Unix-style disponível no PowerShell" },
      { command: "dir", description: "Alias CMD-style disponível no PowerShell" },
    ],
    examples: [
      { code: "Get-ChildItem -Path C:\\Projects -Filter *.ps1 -Recurse", description: "Busca todos os scripts .ps1 recursivamente" },
      { code: "Get-ChildItem | Where-Object { $_.Length -gt 1MB }", description: "Lista arquivos maiores que 1MB" },
      { code: "Get-ChildItem -Force | Select-Object Name, Attributes", description: "Lista tudo incluindo ocultos com atributos" },
    ],
    whenNotToUse: [
      "Quando precisa de busca avançada por conteúdo — use Select-String",
      "Para listar processos ou serviços — use Get-Process ou Get-Service",
    ],
    relatedCommands: ["set-location", "get-item", "select-object", "where-object"],
    deepDive: "Get-ChildItem retorna objetos FileInfo e DirectoryInfo, não texto puro. Isso significa que você pode acessar propriedades como .Length, .LastWriteTime, .Extension diretamente no pipeline — muito mais poderoso que o ls do bash.",
    flags: [
      { flag: "-Path <string>",    description: "Caminho do diretório a listar (padrão: diretório atual)" },
      { flag: "-Filter <string>",  description: "Filtra por padrão (ex: *.log) — mais rápido que Where-Object" },
      { flag: "-Recurse",          description: "Lista recursivamente todos os subdiretórios" },
      { flag: "-Depth <int>",      description: "Limita a profundidade da recursão" },
      { flag: "-Hidden",           description: "Lista apenas arquivos/pastas ocultos" },
      { flag: "-Force",            description: "Inclui arquivos ocultos e do sistema" },
      { flag: "-File",             description: "Retorna apenas arquivos (sem pastas)" },
      { flag: "-Directory",        description: "Retorna apenas diretórios (sem arquivos)" },
      { flag: "-Exclude <string[]>",description: "Exclui itens que correspondem ao padrão" },
    ],
    curiosities: [
      "Get-ChildItem funciona com provedores além do sistema de arquivos — você pode usar 'Get-ChildItem HKLM:\\Software' para listar chaves do Registro do Windows.",
      "O alias 'ls' no PowerShell chama Get-ChildItem, não o binário ls do Unix — por isso o output tem colunas diferentes quando você está no PowerShell vs WSL.",
    ],
    syntaxBreakdown: [
      { part: "Get-ChildItem", label: "Cmdlet", description: "O nome do comando. No PowerShell todo comando segue o padrão Verbo-Substantivo: 'Get' = obter/listar, 'ChildItem' = itens filhos (arquivos e pastas dentro de um diretório)." },
      { part: "[[-Path] <string>]", label: "Parâmetro -Path", description: "O caminho do diretório que você quer listar. Os colchetes duplos [[ ]] indicam que é completamente opcional — se omitido, lista o diretório atual. O <string> significa que espera um texto com o caminho.", optional: true },
      { part: "[-Filter <string>]", label: "Parâmetro -Filter", description: "Um padrão de filtro para mostrar só certos arquivos. Por exemplo: *.txt mostra só arquivos .txt, log* mostra arquivos que começam com 'log'. O asterisco (*) é um coringa que significa 'qualquer coisa'.", optional: true },
      { part: "[-Recurse]", label: "Flag -Recurse", description: "Uma flag (chave) que não precisa de valor — é só ligar ou desligar. Quando presente, o comando entra em todas as subpastas também. Sem ela, lista só o diretório imediato.", optional: true },
      { part: "[-Hidden]", label: "Flag -Hidden", description: "Mostra arquivos e pastas ocultos (aqueles que normalmente ficam invisíveis no Explorer). No Windows, arquivos ocultos têm o atributo 'H' nas propriedades.", optional: true },
      { part: "[-Force]", label: "Flag -Force", description: "Força a listagem de arquivos ocultos E arquivos de sistema (ainda mais protegidos). Diferente de -Hidden, que só mostra ocultos.", optional: true },
    ],
  },
  {
    id: "set-location",
    name: "Set-Location",
    description: "Muda o diretório de trabalho atual. Equivalente ao cd em todos os shells.",
    syntax: "Set-Location [[-Path] <string>]",
    category: "navigation",
    level: "básico",
    uses: [
      "Navegar entre diretórios",
      "Voltar ao diretório anterior",
      "Ir para o diretório home do usuário",
    ],
    variations: [
      { command: "Set-Location C:\\Projects", description: "Navega para diretório específico" },
      { command: "Set-Location ..", description: "Volta um nível" },
      { command: "Set-Location ~", description: "Vai para o diretório home" },
      { command: "Set-Location -", description: "Volta ao diretório anterior (toggle)" },
      { command: "cd C:\\Projects", description: "Alias CMD-style" },
      { command: "sl C:\\Projects", description: "Alias curto" },
    ],
    examples: [
      { code: "Set-Location C:\\Users\\$env:USERNAME\\Documents", description: "Navega para Documentos do usuário atual" },
      { code: "cd ..\\..", description: "Volta dois níveis" },
      { code: "Set-Location -", description: "Alterna entre o diretório atual e o anterior" },
    ],
    whenNotToUse: [
      "Quando precisa executar algo em outro diretório pontualmente — use Push-Location / Pop-Location",
    ],
    relatedCommands: ["get-childitem", "get-location", "push-location"],
    flags: [
      { flag: "-Path <string>",       description: "Caminho de destino" },
      { flag: "-LiteralPath <string>",description: "Caminho literal (não interpreta wildcards)" },
      { flag: "-PassThru",            description: "Retorna o objeto PathInfo do novo diretório" },
    ],
    curiosities: [
      "Set-Location -  (com hífen) é um dos recursos menos conhecidos — alterna entre o diretório atual e o anterior como o 'cd -' do bash.",
      "Push-Location e Pop-Location funcionam como uma pilha de histórico de diretórios, permitindo voltar para posições anteriores em sequência.",
    ],
    syntaxBreakdown: [
      { part: "Set-Location", label: "Cmdlet", description: "Verbo 'Set' = definir/mudar. 'Location' = localização (diretório atual). Traduzindo literalmente: 'Definir Localização'." },
      { part: "[[-Path] <string>]", label: "Parâmetro -Path", description: "O caminho para onde você quer ir. Pode ser absoluto (C:\\Users\\João) ou relativo (..\\pasta). O '..' significa 'pasta pai' (um nível acima). O '~' atalha para seu diretório de usuário.", optional: true },
    ],
  },
  {
    id: "get-item",
    name: "Get-Item",
    description: "Obtém o objeto que representa um arquivo, pasta, chave de registro ou outro item de um provedor.",
    syntax: "Get-Item [-Path] <string[]>",
    category: "navigation",
    level: "intermediário",
    uses: [
      "Obter metadados de um arquivo específico",
      "Verificar propriedades de um item",
      "Acessar chaves do registro",
    ],
    variations: [
      { command: "Get-Item arquivo.txt", description: "Obtém objeto do arquivo" },
      { command: "Get-Item C:\\Windows", description: "Obtém objeto do diretório" },
      { command: "Get-Item HKLM:\\Software\\Microsoft", description: "Acessa chave do registro" },
      { command: "Get-Item env:PATH", description: "Obtém variável de ambiente" },
    ],
    examples: [
      { code: "(Get-Item arquivo.txt).Length", description: "Obtém o tamanho do arquivo em bytes" },
      { code: "(Get-Item arquivo.txt).LastWriteTime", description: "Data/hora da última modificação" },
      { code: "Get-Item * | Select-Object Name, Length, LastWriteTime", description: "Metadados de todos os itens" },
    ],
    whenNotToUse: [
      "Para listar múltiplos itens — use Get-ChildItem",
      "Para buscar por padrão — use Get-ChildItem com -Filter",
    ],
    relatedCommands: ["get-childitem", "set-item", "remove-item"],
    flags: [
      { flag: "-Path <string[]>",       description: "Caminho do item (suporta wildcards)" },
      { flag: "-LiteralPath <string[]>",description: "Caminho literal sem interpretação de wildcards" },
      { flag: "-Force",                 description: "Acessa itens ocultos ou protegidos pelo sistema" },
    ],
    curiosities: [
      "Get-Item funciona com múltiplos 'provedores' do PowerShell — sistema de arquivos, registro, variáveis de ambiente, certificados e até funções do próprio shell são acessíveis com a mesma sintaxe.",
    ],
  },

  /* ─── ARQUIVOS ───────────────────────────────────────────────────── */
  {
    id: "copy-item",
    name: "Copy-Item",
    description: "Copia arquivos ou pastas de um local para outro.",
    syntax: "Copy-Item [-Path] <string[]> [[-Destination] <string>]",
    category: "files",
    level: "básico",
    uses: [
      "Copiar arquivos para outro diretório",
      "Criar backup de um arquivo",
      "Copiar estrutura de pastas recursivamente",
    ],
    variations: [
      { command: "Copy-Item arquivo.txt C:\\Backup", description: "Copia arquivo para pasta" },
      { command: "Copy-Item C:\\Origem C:\\Destino -Recurse", description: "Copia pasta inteira recursivamente" },
      { command: "Copy-Item *.log C:\\Logs", description: "Copia múltiplos arquivos por padrão" },
      { command: "cp arquivo.txt backup.txt", description: "Alias cp disponível" },
    ],
    examples: [
      { code: "Copy-Item -Path C:\\projeto -Destination C:\\backup\\projeto -Recurse", description: "Backup completo de uma pasta" },
      { code: "Copy-Item *.config -Destination C:\\deploy -Force", description: "Copia configs sobrescrevendo se existirem" },
      { code: "Get-ChildItem *.log | Copy-Item -Destination C:\\Logs", description: "Copia via pipeline" },
    ],
    whenNotToUse: [
      "Para mover (e não copiar) — use Move-Item",
      "Para sincronizar diretórios com delta — use robocopy",
    ],
    relatedCommands: ["move-item", "remove-item", "new-item"],
    flags: [
      { flag: "-Path <string[]>",      description: "Origem (suporta wildcards)" },
      { flag: "-Destination <string>", description: "Destino da cópia" },
      { flag: "-Recurse",              description: "Copia subdiretórios recursivamente" },
      { flag: "-Force",                description: "Sobrescreve itens existentes no destino" },
      { flag: "-Filter <string>",      description: "Filtra itens de origem por padrão" },
      { flag: "-Exclude <string[]>",   description: "Exclui itens por padrão" },
      { flag: "-PassThru",             description: "Retorna o objeto copiado" },
      { flag: "-WhatIf",               description: "Simula a operação sem executar" },
    ],
    curiosities: [
      "Copy-Item aceita caminhos UNC (\\\\servidor\\compartilhamento) — você pode copiar arquivos diretamente entre servidores na rede sem mapear drive.",
    ],
  },
  {
    id: "move-item",
    name: "Move-Item",
    description: "Move ou renomeia arquivos e pastas.",
    syntax: "Move-Item [-Path] <string[]> [[-Destination] <string>]",
    category: "files",
    level: "básico",
    uses: [
      "Mover arquivos para outro diretório",
      "Renomear arquivos ou pastas",
      "Reorganizar estrutura de diretórios",
    ],
    variations: [
      { command: "Move-Item arquivo.txt C:\\Destino", description: "Move arquivo para pasta" },
      { command: "Move-Item antigo.txt novo.txt", description: "Renomeia arquivo" },
      { command: "Move-Item C:\\Origem\\* C:\\Destino", description: "Move todos os itens da pasta" },
      { command: "mv arquivo.txt backup\\", description: "Alias mv disponível" },
    ],
    examples: [
      { code: "Move-Item -Path *.log -Destination C:\\Logs -Force", description: "Move todos os logs sobrescrevendo" },
      { code: "Move-Item relatorio.txt \"relatorio $(Get-Date -Format yyyy-MM-dd).txt\"", description: "Renomeia com data atual" },
      { code: "Get-ChildItem *.tmp | Move-Item -Destination C:\\Temp", description: "Move temporários via pipeline" },
    ],
    whenNotToUse: [
      "Para copiar sem remover o original — use Copy-Item",
      "Para renomear em massa com padrões complexos — use Rename-Item com pipeline",
    ],
    relatedCommands: ["copy-item", "rename-item", "remove-item"],
    flags: [
      { flag: "-Path <string[]>",      description: "Origem" },
      { flag: "-Destination <string>", description: "Destino" },
      { flag: "-Force",                description: "Sobrescreve itens existentes no destino" },
      { flag: "-WhatIf",               description: "Simula sem executar" },
      { flag: "-PassThru",             description: "Retorna o objeto movido" },
    ],
    curiosities: [
      "No mesmo volume (mesmo disco), Move-Item é instantâneo — o Windows apenas atualiza a entrada na tabela de alocação sem copiar dados. Entre volumes diferentes, ele copia e depois apaga a origem.",
    ],
  },
  {
    id: "remove-item",
    name: "Remove-Item",
    description: "Exclui arquivos, pastas ou outros itens.",
    syntax: "Remove-Item [-Path] <string[]> [-Recurse] [-Force]",
    category: "files",
    level: "básico",
    uses: [
      "Apagar arquivos",
      "Remover pastas com conteúdo",
      "Limpar arquivos temporários por padrão",
    ],
    variations: [
      { command: "Remove-Item arquivo.txt", description: "Remove arquivo" },
      { command: "Remove-Item C:\\Temp -Recurse", description: "Remove pasta e todo seu conteúdo" },
      { command: "Remove-Item *.log", description: "Remove por padrão" },
      { command: "Remove-Item pasta -Recurse -Force", description: "Remove sem confirmação, mesmo itens protegidos" },
      { command: "rm arquivo.txt", description: "Alias rm disponível" },
      { command: "del arquivo.txt", description: "Alias CMD-style" },
    ],
    examples: [
      { code: "Remove-Item -Path C:\\Temp\\* -Recurse -Force", description: "Limpa pasta Temp completamente" },
      { code: "Get-ChildItem *.log | Remove-Item", description: "Remove todos os logs via pipeline" },
      { code: "Remove-Item -WhatIf -Path *.tmp -Recurse", description: "Simula o que seria removido sem apagar" },
    ],
    whenNotToUse: [
      "Quando não tem certeza do que será removido — use -WhatIf primeiro",
      "Para mover para lixeira — Remove-Item apaga permanentemente sem lixeira",
    ],
    relatedCommands: ["copy-item", "move-item", "get-childitem"],
    deepDive: "Remove-Item com -Recurse -Force apaga permanentemente sem ir para a lixeira. Não há desfazer nativo no PowerShell para isso. Use -WhatIf antes de executar em produção.",
    flags: [
      { flag: "-Path <string[]>", description: "Item(s) a remover (suporta wildcards)" },
      { flag: "-Recurse",         description: "Remove subdiretórios e seu conteúdo" },
      { flag: "-Force",           description: "Remove itens ocultos, somente-leitura e do sistema", danger: true },
      { flag: "-WhatIf",          description: "Mostra o que seria removido sem executar" },
      { flag: "-Confirm",         description: "Solicita confirmação antes de cada remoção" },
      { flag: "-Exclude <string[]>", description: "Exclui itens por padrão" },
    ],
    curiosities: [
      "Remove-Item -Recurse em versões antigas do PowerShell às vezes falhava em pastas com muitos arquivos. A solução era usar rd /s /q no CMD ou Remove-Item em duas passagens.",
      "Para enviar à lixeira em vez de apagar permanentemente, use o .NET: (New-Object -ComObject Shell.Application).Namespace(0).ParseName($path).InvokeVerb('delete')",
    ],
  },
  {
    id: "new-item",
    name: "New-Item",
    description: "Cria novos arquivos, pastas, chaves de registro ou outros itens.",
    syntax: "New-Item [-Path] <string> -ItemType <string> [-Value <string>]",
    category: "files",
    level: "básico",
    uses: [
      "Criar arquivos vazios",
      "Criar estrutura de diretórios",
      "Criar arquivos com conteúdo inicial",
    ],
    variations: [
      { command: "New-Item arquivo.txt -ItemType File", description: "Cria arquivo vazio" },
      { command: "New-Item pasta -ItemType Directory", description: "Cria diretório" },
      { command: "New-Item -Path C:\\a\\b\\c -ItemType Directory -Force", description: "Cria hierarquia de pastas" },
      { command: "New-Item arquivo.txt -Value 'conteúdo'", description: "Cria arquivo com conteúdo" },
      { command: "ni arquivo.txt -ItemType File", description: "Alias ni disponível" },
      { command: "mkdir nova-pasta", description: "Alias mkdir para diretórios" },
    ],
    examples: [
      { code: "New-Item -Path .\\src\\components -ItemType Directory -Force", description: "Cria pasta de componentes" },
      { code: "New-Item .env -ItemType File -Value \"NODE_ENV=development\"", description: "Cria .env com conteúdo inicial" },
      { code: "1..5 | ForEach-Object { New-Item \"arquivo$_.txt\" -ItemType File }", description: "Cria 5 arquivos em sequência" },
    ],
    whenNotToUse: [
      "Para copiar um arquivo existente como base — use Copy-Item",
    ],
    relatedCommands: ["remove-item", "copy-item", "set-content"],
    flags: [
      { flag: "-Path <string>",      description: "Caminho do novo item" },
      { flag: "-ItemType <string>",  description: "Tipo: File, Directory, SymbolicLink, Junction, HardLink" },
      { flag: "-Value <string>",     description: "Conteúdo inicial do item" },
      { flag: "-Force",              description: "Cria itens intermediários / sobrescreve existentes" },
      { flag: "-Name <string>",      description: "Nome do item (alternativo ao -Path)" },
    ],
    curiosities: [
      "New-Item cria links simbólicos com -ItemType SymbolicLink — equivalente ao 'ln -s' do Linux, sem precisar de ferramentas externas.",
    ],
  },
  {
    id: "rename-item",
    name: "Rename-Item",
    description: "Renomeia um arquivo, pasta ou outro item.",
    syntax: "Rename-Item [-Path] <string> [-NewName] <string>",
    category: "files",
    level: "básico",
    uses: [
      "Renomear arquivo ou pasta",
      "Renomear em massa via pipeline",
      "Alterar extensão de arquivos",
    ],
    variations: [
      { command: "Rename-Item arquivo.txt novo.txt", description: "Renomeia arquivo" },
      { command: "Rename-Item pasta nova-pasta", description: "Renomeia pasta" },
      { command: "Get-ChildItem *.txt | Rename-Item -NewName { $_.Name -replace '.txt','.bak' }", description: "Renomeia todos os .txt para .bak" },
    ],
    examples: [
      { code: "Rename-Item -Path relatorio.docx -NewName \"relatorio-$(Get-Date -Format yyyyMMdd).docx\"", description: "Renomeia com timestamp" },
      { code: "Get-ChildItem *.jpeg | Rename-Item -NewName { $_.BaseName + '.jpg' }", description: "Converte extensão .jpeg para .jpg em massa" },
      { code: "1..10 | ForEach-Object { Rename-Item \"file$_.txt\" \"documento$_.txt\" }", description: "Renomeia sequência de arquivos" },
    ],
    whenNotToUse: [
      "Para mover o arquivo — use Move-Item",
      "Para copiar com outro nome — use Copy-Item",
    ],
    relatedCommands: ["move-item", "copy-item", "get-childitem"],
    flags: [
      { flag: "-Path <string>",    description: "Item a renomear" },
      { flag: "-NewName <string>", description: "Novo nome (suporta scriptblock para renomeação em massa)" },
      { flag: "-Force",            description: "Força renomeação de itens protegidos" },
      { flag: "-PassThru",         description: "Retorna o objeto renomeado" },
      { flag: "-WhatIf",           description: "Simula sem executar" },
    ],
    curiosities: [
      "O -NewName aceita scriptblocks ({ }) que recebem o objeto atual via $_. Isso permite renomear em massa com lógica complexa — substituição de padrões, adição de prefixos/sufixos, formatação de datas.",
    ],
  },

  /* ─── CONTEÚDO ───────────────────────────────────────────────────── */
  {
    id: "get-content",
    name: "Get-Content",
    description: "Lê o conteúdo de um arquivo e retorna como array de linhas ou string.",
    syntax: "Get-Content [-Path] <string[]> [-TotalCount <int>] [-Tail <int>]",
    category: "content",
    level: "básico",
    uses: [
      "Ler conteúdo de arquivos de texto",
      "Monitorar arquivos de log em tempo real",
      "Processar arquivo linha por linha no pipeline",
    ],
    variations: [
      { command: "Get-Content arquivo.txt", description: "Lê todas as linhas" },
      { command: "Get-Content arquivo.txt -TotalCount 10", description: "Lê as primeiras 10 linhas (como head)" },
      { command: "Get-Content arquivo.txt -Tail 20", description: "Lê as últimas 20 linhas (como tail)" },
      { command: "Get-Content log.txt -Wait", description: "Monitora arquivo em tempo real (como tail -f)" },
      { command: "cat arquivo.txt", description: "Alias cat disponível" },
      { command: "gc arquivo.txt", description: "Alias curto gc" },
    ],
    examples: [
      { code: "Get-Content .\\config.json | ConvertFrom-Json", description: "Lê e parseia JSON" },
      { code: "Get-Content log.txt -Tail 50 -Wait", description: "Monitora as últimas 50 linhas de log ao vivo" },
      { code: "Get-Content hosts.txt | ForEach-Object { Test-Connection $_ -Count 1 }", description: "Testa conectividade para lista de hosts" },
    ],
    whenNotToUse: [
      "Para arquivos binários — use [System.IO.File]::ReadAllBytes()",
      "Para arquivos muito grandes — prefira StreamReader para não carregar tudo na memória",
    ],
    relatedCommands: ["set-content", "add-content", "select-string"],
    flags: [
      { flag: "-Path <string[]>",   description: "Arquivo(s) a ler" },
      { flag: "-TotalCount <int>",  description: "Número de linhas do início (equivalente ao head)" },
      { flag: "-Tail <int>",        description: "Número de linhas do final (equivalente ao tail)" },
      { flag: "-Wait",              description: "Aguarda novas linhas em tempo real (equivalente ao tail -f)" },
      { flag: "-Raw",               description: "Retorna o conteúdo como string única em vez de array de linhas" },
      { flag: "-Encoding <string>", description: "Especifica a codificação (UTF8, ASCII, Unicode, etc.)" },
      { flag: "-Delimiter <string>",description: "Usa delimitador personalizado em vez de newline" },
    ],
    curiosities: [
      "Get-Content -Wait não para de rodar sozinho — ele monitora o arquivo indefinidamente. Use Ctrl+C para interromper. É muito útil para debugar aplicações que escrevem logs em tempo real.",
      "Por padrão, Get-Content retorna um array de strings (uma por linha). Com -Raw, retorna uma string única com newlines preservados — importante para expressões regex multilinha.",
    ],
    syntaxBreakdown: [
      { part: "Get-Content", label: "Cmdlet", description: "'Get' = obter/ler. 'Content' = conteúdo. Lê o que está dentro de um arquivo e traz para o PowerShell trabalhar." },
      { part: "[-Path] <string[]>", label: "Parâmetro -Path", description: "O caminho do arquivo a ler. O <string[]> com colchetes após significa que aceita múltiplos arquivos separados por vírgula. Ex: Get-Content a.txt, b.txt lê os dois arquivos." },
      { part: "[-TotalCount <int>]", label: "Parâmetro -TotalCount", description: "Quantas linhas ler do começo do arquivo. O <int> significa que espera um número inteiro. É equivalente ao comando 'head' do Linux.", optional: true },
      { part: "[-Tail <int>]", label: "Parâmetro -Tail", description: "Quantas linhas ler do final do arquivo. Equivalente ao 'tail' do Linux. Muito usado para ver as últimas entradas de um log.", optional: true },
    ],
  },
  {
    id: "set-content",
    name: "Set-Content",
    description: "Escreve ou sobrescreve o conteúdo de um arquivo.",
    syntax: "Set-Content [-Path] <string[]> [-Value] <Object[]>",
    category: "content",
    level: "básico",
    uses: [
      "Escrever conteúdo em um arquivo (sobrescrevendo)",
      "Criar arquivo com conteúdo",
      "Atualizar conteúdo de arquivos de configuração",
    ],
    variations: [
      { command: "Set-Content arquivo.txt 'conteúdo'", description: "Escreve string no arquivo" },
      { command: "'linha1','linha2' | Set-Content arquivo.txt", description: "Escreve array de linhas" },
      { command: "Set-Content arquivo.txt $variavel", description: "Escreve valor de variável" },
    ],
    examples: [
      { code: "Set-Content -Path .env -Value \"NODE_ENV=production\"", description: "Cria/sobrescreve arquivo .env" },
      { code: "Get-Content modelo.txt -replace 'NOME','João' | Set-Content resultado.txt", description: "Substitui texto e salva" },
      { code: "Set-Content -Path log.txt -Value '' -Encoding UTF8", description: "Limpa arquivo de log" },
    ],
    whenNotToUse: [
      "Para adicionar sem sobrescrever — use Add-Content",
      "Para edições pontuais no meio do arquivo — prefira manipulação com -replace e Set-Content",
    ],
    relatedCommands: ["get-content", "add-content", "new-item"],
    flags: [
      { flag: "-Path <string[]>",   description: "Arquivo(s) de destino" },
      { flag: "-Value <Object[]>",  description: "Conteúdo a escrever" },
      { flag: "-Encoding <string>", description: "Codificação do arquivo (UTF8, ASCII, Unicode...)" },
      { flag: "-Force",             description: "Sobrescreve arquivos somente-leitura" },
      { flag: "-NoNewline",         description: "Não adiciona newline ao final" },
      { flag: "-PassThru",          description: "Retorna o conteúdo escrito" },
    ],
    curiosities: [
      "Set-Content e o operador > (redirecionamento) fazem a mesma coisa, mas Set-Content dá mais controle — você pode especificar encoding, usar -Force e integrar melhor no pipeline.",
    ],
  },
  {
    id: "add-content",
    name: "Add-Content",
    description: "Adiciona conteúdo ao final de um arquivo sem sobrescrever.",
    syntax: "Add-Content [-Path] <string[]> [-Value] <Object[]>",
    category: "content",
    level: "básico",
    uses: [
      "Anexar linhas a arquivos de log",
      "Adicionar entradas a arquivos de configuração",
      "Acumular resultados em um arquivo",
    ],
    variations: [
      { command: "Add-Content log.txt 'nova entrada'", description: "Adiciona linha ao final" },
      { command: "Add-Content -Path hosts.txt -Value '192.168.1.1 servidor'", description: "Adiciona entrada ao hosts" },
      { command: "Get-Date | Add-Content log.txt", description: "Adiciona timestamp atual" },
    ],
    examples: [
      { code: "Add-Content -Path app.log -Value \"[$(Get-Date)] Iniciado\"", description: "Log com timestamp" },
      { code: "1..100 | ForEach-Object { Add-Content numeros.txt $_ }", description: "Escreve 100 linhas numeradas" },
      { code: "Get-ChildItem *.ps1 | Select-Object -Expand FullName | Add-Content scripts.txt", description: "Salva lista de scripts em arquivo" },
    ],
    whenNotToUse: [
      "Para sobrescrever — use Set-Content",
      "Para inserir no meio do arquivo — leia com Get-Content, modifique e escreva com Set-Content",
    ],
    relatedCommands: ["set-content", "get-content"],
    flags: [
      { flag: "-Path <string[]>",   description: "Arquivo(s) de destino" },
      { flag: "-Value <Object[]>",  description: "Conteúdo a adicionar" },
      { flag: "-Encoding <string>", description: "Codificação (deve bater com a do arquivo existente)" },
      { flag: "-Force",             description: "Adiciona mesmo em arquivos somente-leitura" },
      { flag: "-NoNewline",         description: "Não adiciona newline após o conteúdo" },
    ],
    curiosities: [
      "Add-Content é thread-safe para escritas concorrentes em alguns cenários, mas para logs de alta frequência em múltiplos processos, prefira Mutex ou soluções de logging dedicadas.",
    ],
  },
  {
    id: "select-string",
    name: "Select-String",
    description: "Busca texto ou padrões regex dentro de arquivos ou strings. Equivalente ao grep.",
    syntax: "Select-String [-Pattern] <string[]> [-Path] <string[]>",
    category: "content",
    level: "intermediário",
    uses: [
      "Buscar texto em arquivos",
      "Filtrar linhas por padrão regex",
      "Buscar recursivamente em múltiplos arquivos",
    ],
    variations: [
      { command: "Select-String 'erro' arquivo.log", description: "Busca texto simples" },
      { command: "Select-String -Pattern 'erro|warning' *.log", description: "Busca múltiplos padrões" },
      { command: "Select-String 'TODO' -Path src\\*.ps1 -Recurse", description: "Busca recursivamente" },
      { command: "Select-String '\\d{3}-\\d{4}' contatos.txt", description: "Busca por regex" },
      { command: "sls 'erro' *.log", description: "Alias sls disponível" },
    ],
    examples: [
      { code: "Get-Content app.log | Select-String -Pattern 'ERROR|FATAL'", description: "Filtra só linhas de erro" },
      { code: "Select-String -Path C:\\src\\*.ps1 -Pattern 'TODO' -CaseSensitive", description: "Busca TODOs em scripts" },
      { code: "Select-String '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b' *.txt | Select-Object Filename, LineNumber, Line", description: "Extrai endereços IP de arquivos" },
    ],
    whenNotToUse: [
      "Para substituição de texto — use -replace com Get-Content + Set-Content",
      "Para busca em arquivos binários",
    ],
    relatedCommands: ["get-content", "where-object", "get-childitem"],
    flags: [
      { flag: "-Pattern <string[]>",  description: "Padrão de texto ou regex a buscar" },
      { flag: "-Path <string[]>",     description: "Arquivo(s) onde buscar (suporta wildcards)" },
      { flag: "-Recurse",             description: "Busca em subdiretórios" },
      { flag: "-CaseSensitive",       description: "Ativa diferenciação de maiúsculas/minúsculas" },
      { flag: "-NotMatch",            description: "Retorna linhas que NÃO correspondem ao padrão" },
      { flag: "-SimpleMatch",         description: "Trata o padrão como texto literal (desativa regex)" },
      { flag: "-List",                description: "Retorna apenas o primeiro match por arquivo" },
      { flag: "-AllMatches",          description: "Retorna todos os matches em cada linha" },
      { flag: "-Context <int,int>",   description: "Inclui N linhas antes e depois do match (como grep -C)" },
    ],
    curiosities: [
      "Select-String retorna objetos MatchInfo, não strings. Isso significa que você acessa .Filename, .LineNumber, .Line e .Matches separadamente — muito mais rico que o output do grep.",
      "Por padrão, Select-String é case-insensitive — ao contrário do grep. Use -CaseSensitive para o comportamento oposto.",
    ],
  },

  /* ─── PIPELINE ───────────────────────────────────────────────────── */
  {
    id: "select-object",
    name: "Select-Object",
    description: "Seleciona propriedades específicas de objetos ou limita a quantidade de objetos retornados.",
    syntax: "Select-Object [[-Property] <Object[]>] [-First <int>] [-Last <int>] [-Unique]",
    category: "pipeline",
    level: "intermediário",
    uses: [
      "Selecionar colunas específicas de um objeto",
      "Limitar número de resultados (head/tail)",
      "Criar objetos com propriedades calculadas",
      "Remover duplicatas",
    ],
    variations: [
      { command: "Get-Process | Select-Object Name, CPU", description: "Seleciona propriedades específicas" },
      { command: "Get-ChildItem | Select-Object -First 10", description: "Primeiros 10 itens" },
      { command: "Get-ChildItem | Select-Object -Last 5", description: "Últimos 5 itens" },
      { command: "Get-ChildItem | Select-Object -Unique", description: "Remove duplicatas" },
      { command: "select Name, CPU", description: "Alias select disponível" },
    ],
    examples: [
      { code: "Get-Process | Select-Object Name, Id, @{N='MemoMB';E={[math]::Round($_.WorkingSet/1MB,2)}} | Sort-Object MemoMB -Descending", description: "Processos com memória em MB" },
      { code: "Get-ChildItem -Recurse | Select-Object -ExpandProperty FullName", description: "Lista caminhos completos como strings" },
      { code: "Import-Csv dados.csv | Select-Object Nome, Email | Export-Csv saida.csv -NoTypeInformation", description: "Filtra colunas de CSV" },
    ],
    whenNotToUse: [
      "Para filtrar por condição — use Where-Object",
      "Para transformar cada item individualmente — use ForEach-Object",
    ],
    relatedCommands: ["where-object", "foreach-object", "sort-object"],
    flags: [
      { flag: "-Property <Object[]>",   description: "Propriedades a selecionar (suporta propriedades calculadas)" },
      { flag: "-First <int>",           description: "Retorna os primeiros N objetos" },
      { flag: "-Last <int>",            description: "Retorna os últimos N objetos" },
      { flag: "-Skip <int>",            description: "Pula os primeiros N objetos" },
      { flag: "-Unique",                description: "Retorna apenas objetos únicos" },
      { flag: "-ExpandProperty <string>",description: "Extrai uma propriedade como tipo primitivo em vez de objeto" },
      { flag: "-ExcludeProperty <string[]>", description: "Exclui propriedades específicas" },
    ],
    curiosities: [
      "Propriedades calculadas com @{Name='X'; Expression={...}} transformam o Select-Object em uma ferramenta de projeção poderosa — você pode criar colunas calculadas, converter unidades, formatar valores, tudo inline.",
    ],
    syntaxBreakdown: [
      { part: "Select-Object", label: "Cmdlet", description: "'Select' = selecionar/escolher. 'Object' = objeto. Escolhe quais partes (propriedades) de um objeto você quer manter — como escolher colunas de uma tabela." },
      { part: "[[-Property] <Object[]>]", label: "Parâmetro -Property", description: "Os nomes das propriedades que você quer. Ex: Name, CPU. O <Object[]> significa que aceita múltiplos valores. Você pode escrever só os nomes: Select-Object Name, CPU.", optional: true },
      { part: "[-First <int>]", label: "Parâmetro -First", description: "Pega apenas os primeiros N resultados. Ex: -First 5 retorna só os 5 primeiros itens. Equivalente ao 'head' do Linux.", optional: true },
      { part: "[-Last <int>]", label: "Parâmetro -Last", description: "Pega apenas os últimos N resultados. Equivalente ao 'tail' do Linux.", optional: true },
      { part: "[-Unique]", label: "Flag -Unique", description: "Remove resultados duplicados. Se dois objetos tiverem os mesmos valores nas propriedades selecionadas, apenas um aparece.", optional: true },
    ],
  },
  {
    id: "where-object",
    name: "Where-Object",
    description: "Filtra objetos no pipeline com base em uma condição. Equivalente ao filter/grep para objetos.",
    syntax: "Where-Object [-FilterScript] <ScriptBlock>",
    category: "pipeline",
    level: "intermediário",
    uses: [
      "Filtrar processos por nome ou uso de CPU/memória",
      "Filtrar arquivos por tamanho, data ou extensão",
      "Filtrar qualquer coleção de objetos por propriedade",
    ],
    variations: [
      { command: "Get-Process | Where-Object { $_.CPU -gt 10 }", description: "Processos com CPU > 10%" },
      { command: "Get-ChildItem | Where-Object { $_.Length -gt 1MB }", description: "Arquivos maiores que 1MB" },
      { command: "Get-Service | Where-Object Status -eq 'Running'", description: "Sintaxe simplificada (PS 3+)" },
      { command: "where", description: "Alias where disponível" },
      { command: "?",     description: "Alias ? disponível" },
    ],
    examples: [
      { code: "Get-Process | Where-Object { $_.WorkingSet -gt 200MB } | Select-Object Name, Id", description: "Processos usando mais de 200MB de RAM" },
      { code: "Get-ChildItem -Recurse | Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) }", description: "Arquivos modificados na última semana" },
      { code: "Get-Service | Where-Object { $_.Status -eq 'Stopped' -and $_.StartType -eq 'Automatic' }", description: "Serviços automáticos parados" },
    ],
    whenNotToUse: [
      "Para filtrar texto em arquivos — use Select-String",
      "Quando o cmdlet de origem já tem -Filter nativo — use-o em vez do Where-Object (é mais eficiente pois filtra na fonte)",
    ],
    relatedCommands: ["select-object", "foreach-object", "sort-object"],
    flags: [
      { flag: "-FilterScript <ScriptBlock>", description: "Bloco de condição — $_ representa o objeto atual" },
      { flag: "-Property <string>",          description: "Nome da propriedade (sintaxe simplificada PS3+)" },
      { flag: "-EQ / -NE / -GT / -LT",      description: "Operadores de comparação (sintaxe simplificada)" },
      { flag: "-Like / -Match",              description: "Comparação por wildcard ou regex (sintaxe simplificada)" },
      { flag: "-Not",                        description: "Inverte a condição" },
    ],
    curiosities: [
      "O alias '?' para Where-Object é um dos mais curtos do PowerShell — Get-Process | ? CPU -gt 10 é um filtro completo em 27 caracteres.",
      "Where-Object filtra objetos já em memória. Para grandes volumes de dados, é mais eficiente usar os parâmetros -Filter dos próprios cmdlets (como Get-ChildItem -Filter) que filtram na fonte.",
    ],
    syntaxBreakdown: [
      { part: "Where-Object", label: "Cmdlet", description: "'Where' = onde/quando (condição). 'Object' = objeto. Filtra a coleção mantendo apenas os objetos que atendem à condição — como um filtro de café que só deixa passar o líquido." },
      { part: "[-FilterScript] <ScriptBlock>", label: "Bloco de condição { }", description: "As chaves { } definem um bloco de código (ScriptBlock). Tudo dentro é a condição que cada objeto precisa atender para passar. $_ é a variável especial que representa 'o objeto atual que está sendo avaliado'." },
      { part: "$_", label: "Variável automática $_", description: "Representa o objeto atual no pipeline — o item que está sendo testado agora. Se você tem Get-Process | Where-Object { $_.CPU -gt 10 }, o $_ é cada processo individualmente enquanto Where-Object os percorre." },
      { part: "-gt 10", label: "Operador de comparação", description: "'-gt' significa 'greater than' (maior que). Outros operadores: -lt (menor que), -eq (igual), -ne (diferente), -ge (maior ou igual), -le (menor ou igual), -like (parecido com wildcard *), -match (expressão regular)." },
    ],
  },
  {
    id: "foreach-object",
    name: "ForEach-Object",
    description: "Executa um bloco de código para cada objeto no pipeline.",
    syntax: "ForEach-Object [-Process] <ScriptBlock>",
    category: "pipeline",
    level: "intermediário",
    uses: [
      "Transformar cada item no pipeline",
      "Executar ações em cada elemento de uma coleção",
      "Processar arquivos, processos ou serviços individualmente",
    ],
    variations: [
      { command: "1..5 | ForEach-Object { $_ * 2 }", description: "Dobra cada número" },
      { command: "Get-ChildItem | ForEach-Object { $_.Name }", description: "Extrai propriedade de cada item" },
      { command: "Get-Process | ForEach-Object Name", description: "Sintaxe simplificada (PS 7+)" },
      { command: "foreach", description: "Alias foreach disponível" },
      { command: "%",       description: "Alias % disponível (mais curto)" },
    ],
    examples: [
      { code: "Get-ChildItem *.txt | ForEach-Object { (Get-Content $_) -replace 'antigo','novo' | Set-Content $_ }", description: "Substitui texto em todos os .txt" },
      { code: "1..10 | ForEach-Object { Start-Job -ScriptBlock { param($n) $n * $n } -ArgumentList $_ }", description: "Paraleliza cálculos com jobs" },
      { code: "Import-Csv servidores.csv | ForEach-Object { Test-Connection $_.IP -Count 1 -Quiet }", description: "Testa conectividade de lista de servidores" },
    ],
    whenNotToUse: [
      "Para simples filtragem — use Where-Object",
      "Para selecionar propriedades — use Select-Object -ExpandProperty",
      "Para grandes volumes onde performance importa — use foreach ($x in $col) que é mais rápido que ForEach-Object no pipeline",
    ],
    relatedCommands: ["where-object", "select-object", "sort-object"],
    flags: [
      { flag: "-Process <ScriptBlock>",  description: "Bloco executado para cada objeto — $_ é o objeto atual" },
      { flag: "-Begin <ScriptBlock>",    description: "Bloco executado uma vez antes do primeiro objeto" },
      { flag: "-End <ScriptBlock>",      description: "Bloco executado uma vez após o último objeto" },
      { flag: "-Parallel <ScriptBlock>", description: "Execução paralela (PowerShell 7+)", },
      { flag: "-ThrottleLimit <int>",    description: "Número máximo de threads paralelas (com -Parallel)" },
    ],
    curiosities: [
      "ForEach-Object -Parallel (PowerShell 7+) permite paralelismo real com múltiplas threads. Para tarefas I/O-bound como downloads ou conexões de rede, pode reduzir o tempo total drasticamente.",
      "O alias % é tão curto que pipelines complexos ficam legíveis: Get-Process | ? CPU -gt 10 | % Name — 36 chars para filtrar processos pesados e listar nomes.",
    ],
    syntaxBreakdown: [
      { part: "ForEach-Object", label: "Cmdlet", description: "'ForEach' = para cada. 'Object' = objeto. Pega cada objeto que chega pelo pipeline e executa o bloco de código nele — um por um, em sequência." },
      { part: "[-Process] <ScriptBlock>", label: "Bloco de ação { }", description: "O código que roda para cada objeto. $_ é o objeto atual. Tudo que você escrever aqui acontece para cada item individualmente." },
      { part: "$_", label: "Variável automática $_", description: "Dentro do bloco { }, $_ representa o objeto atual que está sendo processado nessa iteração. Se você está iterando sobre arquivos, $_ é o arquivo atual; sobre processos, é o processo atual." },
      { part: "[-Parallel]", label: "Flag -Parallel (PS7+)", description: "Processa múltiplos objetos ao mesmo tempo em threads separadas, em vez de um por vez. Útil quando cada item demora (download, conexão de rede). Requer PowerShell 7+.", optional: true },
    ],
  },
  {
    id: "sort-object",
    name: "Sort-Object",
    description: "Ordena objetos por uma ou mais propriedades.",
    syntax: "Sort-Object [[-Property] <Object[]>] [-Descending] [-Unique]",
    category: "pipeline",
    level: "intermediário",
    uses: [
      "Ordenar processos por uso de CPU ou memória",
      "Ordenar arquivos por tamanho ou data",
      "Ordenar qualquer coleção por múltiplos critérios",
    ],
    variations: [
      { command: "Get-Process | Sort-Object CPU -Descending", description: "Processos por CPU (maior primeiro)" },
      { command: "Get-ChildItem | Sort-Object Length", description: "Arquivos do menor ao maior" },
      { command: "Get-ChildItem | Sort-Object LastWriteTime -Descending", description: "Arquivos mais recentes primeiro" },
      { command: "sort CPU -Descending", description: "Alias sort disponível" },
    ],
    examples: [
      { code: "Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 Name, CPU", description: "Top 5 processos por CPU" },
      { code: "Get-ChildItem -Recurse | Sort-Object Length -Descending | Select-Object -First 10 Name, Length", description: "10 arquivos maiores" },
      { code: "Import-Csv dados.csv | Sort-Object @{E='Departamento'}, @{E='Nome'}", description: "Ordena CSV por múltiplas colunas" },
    ],
    whenNotToUse: [
      "Quando a ordem não importa para o resultado — Sort-Object carrega todos os objetos na memória antes de ordenar",
    ],
    relatedCommands: ["select-object", "where-object", "group-object", "measure-object"],
    flags: [
      { flag: "-Property <Object[]>", description: "Propriedade(s) para ordenar (suporta hashtable com Expression)" },
      { flag: "-Descending",          description: "Ordena do maior para o menor" },
      { flag: "-Unique",              description: "Remove duplicatas após ordenar" },
      { flag: "-Stable",              description: "Mantém a ordem original de elementos iguais (PS 6+)" },
      { flag: "-Top <int>",           description: "Retorna apenas os N primeiros após ordenar (mais eficiente que Sort + Select -First)" },
      { flag: "-Bottom <int>",        description: "Retorna apenas os N últimos após ordenar" },
    ],
    curiosities: [
      "Sort-Object -Top N é mais eficiente que Sort-Object | Select-Object -First N porque usa um algoritmo de heap parcial que não precisa ordenar toda a coleção — apenas encontra os N maiores.",
    ],
  },
  {
    id: "measure-object",
    name: "Measure-Object",
    description: "Calcula propriedades numéricas ou de texto de objetos: count, soma, média, min e max.",
    syntax: "Measure-Object [[-Property] <string[]>] [-Sum] [-Average] [-Minimum] [-Maximum] [-Count]",
    category: "pipeline",
    level: "intermediário",
    uses: [
      "Contar quantidade de arquivos ou processos",
      "Calcular tamanho total de arquivos",
      "Obter estatísticas de colunas numéricas",
      "Contar linhas, palavras e caracteres de um arquivo",
    ],
    variations: [
      { command: "Get-ChildItem | Measure-Object", description: "Conta itens no pipeline" },
      { command: "Get-ChildItem | Measure-Object -Property Length -Sum", description: "Soma tamanhos de arquivos" },
      { command: "Get-Content arquivo.txt | Measure-Object -Line -Word -Character", description: "Conta linhas, palavras e chars (wc)" },
      { command: "measure", description: "Alias measure disponível" },
    ],
    examples: [
      { code: "Get-ChildItem -Recurse | Measure-Object -Property Length -Sum | Select-Object -Expand Sum", description: "Tamanho total de uma pasta em bytes" },
      { code: "Get-Process | Measure-Object -Property CPU -Average -Maximum | Select-Object Average, Maximum", description: "Estatísticas de CPU dos processos" },
      { code: "Get-Content log.txt | Measure-Object -Line", description: "Conta linhas do arquivo (como wc -l)" },
    ],
    whenNotToUse: [
      "Para agrupamentos — use Group-Object",
      "Para cálculos matemáticos complexos — use [math] diretamente",
    ],
    relatedCommands: ["sort-object", "group-object", "select-object"],
    flags: [
      { flag: "-Property <string[]>", description: "Propriedade numérica para calcular" },
      { flag: "-Sum",                 description: "Calcula a soma" },
      { flag: "-Average",             description: "Calcula a média" },
      { flag: "-Minimum",             description: "Encontra o valor mínimo" },
      { flag: "-Maximum",             description: "Encontra o valor máximo" },
      { flag: "-Line",                description: "Conta linhas (em strings/texto)" },
      { flag: "-Word",                description: "Conta palavras" },
      { flag: "-Character",           description: "Conta caracteres" },
    ],
    curiosities: [
      "Get-ChildItem -Recurse | Measure-Object -Property Length -Sum é a forma PowerShell de 'du -sh' do Linux — calcula o tamanho total de uma pasta incluindo subdiretórios.",
    ],
  },
  {
    id: "group-object",
    name: "Group-Object",
    description: "Agrupa objetos que têm o mesmo valor em uma propriedade especificada.",
    syntax: "Group-Object [[-Property] <Object[]>] [-NoElement] [-AsHashTable]",
    category: "pipeline",
    level: "intermediário",
    uses: [
      "Agrupar processos por status ou nome",
      "Agrupar arquivos por extensão",
      "Contar ocorrências de valores",
      "Criar tabelas de frequência",
    ],
    variations: [
      { command: "Get-Process | Group-Object -Property Company", description: "Agrupa processos por empresa" },
      { command: "Get-ChildItem | Group-Object Extension", description: "Agrupa arquivos por extensão" },
      { command: "Get-ChildItem | Group-Object Extension | Sort-Object Count -Descending", description: "Extensões mais frequentes" },
      { command: "group Extension", description: "Alias group disponível" },
    ],
    examples: [
      { code: "Get-EventLog -LogName System -Newest 1000 | Group-Object EntryType | Sort-Object Count -Desc", description: "Frequência de tipos de eventos do sistema" },
      { code: "Get-ChildItem -Recurse | Group-Object Extension | Select-Object Name, Count | Sort-Object Count -Desc", description: "Contagem de arquivos por extensão" },
      { code: "Get-Process | Group-Object -Property Company -NoElement | Sort-Object Count -Desc | Select-Object -First 10", description: "Top 10 empresas por número de processos" },
    ],
    whenNotToUse: [
      "Para filtragem — use Where-Object",
      "Para cálculos numéricos — use Measure-Object",
    ],
    relatedCommands: ["measure-object", "sort-object", "select-object"],
    flags: [
      { flag: "-Property <Object[]>", description: "Propriedade para agrupar" },
      { flag: "-NoElement",           description: "Não inclui os objetos agrupados (apenas nome e contagem)" },
      { flag: "-AsHashTable",         description: "Retorna resultado como hashtable em vez de GroupInfo" },
      { flag: "-AsString",            description: "Converte a chave de agrupamento para string" },
      { flag: "-CaseSensitive",       description: "Agrupa com diferenciação de maiúsculas/minúsculas" },
    ],
    curiosities: [
      "Group-Object -AsHashTable retorna um hashtable onde a chave é o valor agrupado e o valor é o array de objetos. Útil para lookups rápidos por valor de propriedade sem percorrer toda a lista.",
    ],
  },

  /* ─── SISTEMA ────────────────────────────────────────────────────── */
  {
    id: "get-process",
    name: "Get-Process",
    description: "Lista processos em execução no sistema local ou remoto.",
    syntax: "Get-Process [[-Name] <string[]>] [-Id <int[]>] [-ComputerName <string[]>]",
    category: "system",
    level: "básico",
    uses: [
      "Verificar processos em execução",
      "Encontrar o PID de um processo pelo nome",
      "Monitorar uso de CPU e memória",
    ],
    variations: [
      { command: "Get-Process", description: "Lista todos os processos" },
      { command: "Get-Process chrome", description: "Filtra pelo nome" },
      { command: "Get-Process -Id 1234", description: "Busca pelo PID" },
      { command: "Get-Process | Sort-Object CPU -Desc | Select-Object -First 10", description: "Top 10 por CPU" },
      { command: "ps", description: "Alias ps disponível" },
      { command: "gps", description: "Alias gps disponível" },
    ],
    examples: [
      { code: "Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 5 Name, Id, @{N='RAM(MB)';E={[math]::Round($_.WorkingSet/1MB,1)}}", description: "Top 5 processos por RAM" },
      { code: "Get-Process -Name chrome,firefox,msedge | Measure-Object WorkingSet -Sum", description: "RAM total usada por browsers" },
      { code: "(Get-Process -Name notepad -ErrorAction SilentlyContinue) -ne $null", description: "Verifica se o Notepad está rodando" },
    ],
    whenNotToUse: [
      "Para encerrar processos — use Stop-Process após identificar o processo",
      "Para gerenciar serviços — use Get-Service",
    ],
    relatedCommands: ["stop-process", "get-service", "where-object"],
    flags: [
      { flag: "-Name <string[]>",        description: "Nome(s) do processo (suporta wildcards)" },
      { flag: "-Id <int[]>",             description: "PID(s) do processo" },
      { flag: "-ComputerName <string[]>",description: "Processo em computador remoto" },
      { flag: "-IncludeUserName",        description: "Inclui o usuário que iniciou o processo (requer elevação)" },
      { flag: "-FileVersionInfo",        description: "Inclui informações de versão do executável" },
      { flag: "-Module",                 description: "Inclui módulos (DLLs) carregados pelo processo" },
    ],
    curiosities: [
      "Get-Process retorna objetos System.Diagnostics.Process — você tem acesso direto a métodos como .Kill(), .WaitForExit(), .Refresh() sem precisar de outros cmdlets.",
      "WorkingSet (RAM física) e VirtualMemorySize são propriedades diferentes. Um processo pode ter grande VirtualMemorySize mas baixo WorkingSet se usar muita memória mapeada.",
    ],
  },
  {
    id: "stop-process",
    name: "Stop-Process",
    description: "Encerra processos em execução pelo nome ou PID.",
    syntax: "Stop-Process [[-Name] <string[]>] [-Id <int[]>] [-Force]",
    category: "system",
    level: "intermediário",
    uses: [
      "Encerrar aplicações travadas",
      "Matar processos por nome ou PID",
      "Encerrar múltiplos processos de uma vez",
    ],
    variations: [
      { command: "Stop-Process -Name notepad", description: "Encerra pelo nome" },
      { command: "Stop-Process -Id 4512", description: "Encerra pelo PID" },
      { command: "Stop-Process -Name chrome -Force", description: "Força encerramento sem confirmação" },
      { command: "Get-Process chrome | Stop-Process", description: "Encerra via pipeline" },
      { command: "kill -Name notepad", description: "Alias kill disponível" },
    ],
    examples: [
      { code: "Get-Process -Name chrome,msedge | Stop-Process -Force", description: "Fecha todos os browsers à força" },
      { code: "Get-Process | Where-Object { $_.Responding -eq $false } | Stop-Process", description: "Encerra todos os processos travados" },
      { code: "Stop-Process -Name notepad -WhatIf", description: "Simula o encerramento sem executar" },
    ],
    whenNotToUse: [
      "Para encerrar serviços do Windows — use Stop-Service",
      "Sem usar -WhatIf primeiro quando há múltiplos processos com nome parecido",
    ],
    relatedCommands: ["get-process", "get-service", "stop-service"],
    flags: [
      { flag: "-Name <string[]>", description: "Nome(s) do processo" },
      { flag: "-Id <int[]>",      description: "PID(s) do processo" },
      { flag: "-Force",           description: "Encerra sem confirmação, mesmo processos protegidos", danger: true },
      { flag: "-WhatIf",          description: "Simula sem executar" },
      { flag: "-PassThru",        description: "Retorna o objeto do processo encerrado" },
    ],
    curiosities: [
      "Stop-Process sem -Force envia um sinal de encerramento gracioso (como fechar a janela). Com -Force, é equivalente a 'Finalizar Tarefa' no Gerenciador de Tarefas — o processo não tem chance de salvar dados.",
    ],
  },
  {
    id: "get-service",
    name: "Get-Service",
    description: "Lista serviços do Windows e seu status atual.",
    syntax: "Get-Service [[-Name] <string[]>] [-ComputerName <string[]>]",
    category: "system",
    level: "intermediário",
    uses: [
      "Verificar status de serviços",
      "Listar serviços parados ou em execução",
      "Monitorar serviços específicos",
    ],
    variations: [
      { command: "Get-Service", description: "Lista todos os serviços" },
      { command: "Get-Service -Name wuauserv", description: "Serviço específico pelo nome" },
      { command: "Get-Service | Where-Object Status -eq 'Stopped'", description: "Serviços parados" },
      { command: "Get-Service | Where-Object { $_.StartType -eq 'Automatic' -and $_.Status -eq 'Stopped' }", description: "Serviços automáticos parados (possível problema)" },
      { command: "gsv", description: "Alias gsv disponível" },
    ],
    examples: [
      { code: "Get-Service -Name *sql* | Select-Object Name, Status, StartType", description: "Todos os serviços relacionados ao SQL" },
      { code: "Get-Service | Group-Object Status | Select-Object Name, Count", description: "Contagem por status" },
      { code: "Get-Service Spooler | Select-Object Name, Status, CanStop, CanPauseAndContinue", description: "Detalhes do serviço de impressão" },
    ],
    whenNotToUse: [
      "Para gerenciar processos — use Get-Process",
      "Para serviços em containers ou Linux — use comandos específicos do ambiente",
    ],
    relatedCommands: ["stop-process", "get-process"],
    flags: [
      { flag: "-Name <string[]>",         description: "Nome(s) do serviço (suporta wildcards)" },
      { flag: "-DisplayName <string[]>",  description: "Nome de exibição do serviço" },
      { flag: "-ComputerName <string[]>", description: "Consulta serviços em computador remoto" },
      { flag: "-DependentServices",       description: "Inclui serviços que dependem deste" },
      { flag: "-RequiredServices",        description: "Inclui serviços dos quais este depende" },
    ],
    curiosities: [
      "Get-Service mostra serviços no estado 'Stopped' que ainda estão registrados no sistema. Um serviço parado não significa desinstalado — ele existe mas não está consumindo recursos.",
    ],
  },
  {
    id: "get-command",
    name: "Get-Command",
    description: "Lista todos os comandos disponíveis no PowerShell: cmdlets, funções, aliases e executáveis.",
    syntax: "Get-Command [[-Name] <string[]>] [-CommandType <CommandTypes>] [-Module <string[]>]",
    category: "system",
    level: "básico",
    uses: [
      "Descobrir cmdlets disponíveis",
      "Verificar se um comando existe",
      "Encontrar comandos por padrão de nome",
      "Descobrir comandos de um módulo específico",
    ],
    variations: [
      { command: "Get-Command", description: "Lista todos os comandos" },
      { command: "Get-Command -Name Get-*", description: "Comandos que começam com Get-" },
      { command: "Get-Command -Module ActiveDirectory", description: "Comandos de um módulo" },
      { command: "Get-Command -CommandType Function", description: "Apenas funções" },
      { command: "gcm *process*", description: "Alias gcm com wildcard" },
    ],
    examples: [
      { code: "Get-Command -Name *csv*", description: "Encontra todos os cmdlets relacionados a CSV" },
      { code: "Get-Command | Where-Object { $_.Source -eq 'Microsoft.PowerShell.Management' }", description: "Comandos de um módulo específico" },
      { code: "(Get-Command Get-ChildItem).Parameters.Keys", description: "Lista todos os parâmetros de um cmdlet" },
    ],
    whenNotToUse: [
      "Para ver a sintaxe completa de um comando — use Get-Help",
    ],
    relatedCommands: ["get-help", "get-module"],
    flags: [
      { flag: "-Name <string[]>",         description: "Nome do comando (suporta wildcards)" },
      { flag: "-CommandType <string>",    description: "Tipo: Alias, Function, Cmdlet, ExternalScript, Application" },
      { flag: "-Module <string[]>",       description: "Filtra por módulo de origem" },
      { flag: "-Verb <string[]>",         description: "Filtra pelo verbo (Get, Set, New, Remove...)" },
      { flag: "-Noun <string[]>",         description: "Filtra pelo substantivo (Process, Item, Service...)" },
      { flag: "-Syntax",                  description: "Exibe apenas a sintaxe dos comandos encontrados" },
      { flag: "-TotalCount <int>",        description: "Limita o número de resultados" },
    ],
    curiosities: [
      "PowerShell usa uma convenção rígida de Verbo-Substantivo para cmdlets. Get-Command -Verb lista todos os verbos aprovados — usar verbos fora da lista gera um aviso ao importar módulos.",
    ],
  },
  {
    id: "get-help",
    name: "Get-Help",
    description: "Exibe documentação de cmdlets, funções e conceitos do PowerShell.",
    syntax: "Get-Help [[-Name] <string>] [-Full] [-Examples] [-Online] [-Parameter <string>]",
    category: "system",
    level: "básico",
    uses: [
      "Ver a documentação de qualquer cmdlet",
      "Aprender a usar parâmetros específicos",
      "Ver exemplos práticos de uso",
      "Entender conceitos do PowerShell",
    ],
    variations: [
      { command: "Get-Help Get-ChildItem", description: "Ajuda básica do cmdlet" },
      { command: "Get-Help Get-ChildItem -Full", description: "Documentação completa com todos os parâmetros" },
      { command: "Get-Help Get-ChildItem -Examples", description: "Apenas os exemplos" },
      { command: "Get-Help Get-ChildItem -Online", description: "Abre docs no browser" },
      { command: "Get-Help Get-ChildItem -Parameter Recurse", description: "Detalhes de um parâmetro específico" },
      { command: "help Get-ChildItem", description: "Alias que pagina o output automaticamente" },
      { command: "man Get-ChildItem", description: "Alias man disponível" },
    ],
    examples: [
      { code: "Get-Help about_*", description: "Lista todos os artigos conceituais (about_)" },
      { code: "Get-Help *-Object", description: "Encontra cmdlets relacionados a Object" },
      { code: "Update-Help -Force", description: "Atualiza arquivos de ajuda locais (requer internet)" },
    ],
    whenNotToUse: [],
    relatedCommands: ["get-command", "get-module"],
    flags: [
      { flag: "-Name <string>",      description: "Nome do cmdlet ou tópico de ajuda" },
      { flag: "-Full",               description: "Exibe documentação completa incluindo detalhes técnicos" },
      { flag: "-Examples",           description: "Exibe apenas a seção de exemplos" },
      { flag: "-Online",             description: "Abre a documentação online no browser" },
      { flag: "-Parameter <string>", description: "Detalhes de um parâmetro específico" },
      { flag: "-ShowWindow",         description: "Abre ajuda em janela gráfica separada" },
    ],
    curiosities: [
      "O PowerShell inclui artigos 'about_' que explicam conceitos fundamentais da linguagem — about_Pipelines, about_Variables, about_Functions. São o equivalente ao manual do bash: 'Get-Help about_Pipelines'.",
      "Update-Help baixa arquivos de ajuda atualizados da internet. Sem isso, Get-Help pode mostrar documentação desatualizada ou incompleta dependendo da versão do PowerShell.",
    ],
  },

  /* ─── REDE ───────────────────────────────────────────────────────── */
  {
    id: "invoke-webrequest",
    name: "Invoke-WebRequest",
    description: "Faz requisições HTTP/HTTPS e retorna o conteúdo da resposta com headers, status e links.",
    syntax: "Invoke-WebRequest [-Uri] <Uri> [-Method <string>] [-Body <Object>] [-Headers <IDictionary>]",
    category: "network",
    level: "avançado",
    uses: [
      "Baixar arquivos da internet",
      "Testar APIs REST",
      "Fazer scraping de páginas HTML",
      "Automatizar interações com sites",
    ],
    variations: [
      { command: "Invoke-WebRequest https://example.com", description: "GET básico" },
      { command: "Invoke-WebRequest https://example.com -OutFile pagina.html", description: "Salva resposta em arquivo" },
      { command: "Invoke-WebRequest -Uri https://api.com/data -Method POST -Body $json -ContentType 'application/json'", description: "POST com JSON" },
      { command: "iwr https://example.com", description: "Alias iwr disponível" },
      { command: "wget https://example.com/arquivo.zip -OutFile arquivo.zip", description: "Alias wget disponível" },
      { command: "curl https://example.com", description: "Alias curl disponível" },
    ],
    examples: [
      { code: "Invoke-WebRequest -Uri 'https://api.github.com/users/octocat' -Headers @{Accept='application/json'} | Select-Object -Expand Content | ConvertFrom-Json", description: "Consumir API REST e parsear JSON" },
      { code: "Invoke-WebRequest 'https://exemplo.com/arquivo.zip' -OutFile C:\\Downloads\\arquivo.zip", description: "Download de arquivo" },
      { code: "$r = Invoke-WebRequest https://example.com\n$r.StatusCode\n$r.Links.href", description: "Inspecionar status e links da página" },
    ],
    whenNotToUse: [
      "Para APIs que retornam JSON puro — use Invoke-RestMethod (já parseia automaticamente)",
      "Para downloads grandes com barra de progresso — use Start-BitsTransfer",
    ],
    relatedCommands: ["test-connection"],
    flags: [
      { flag: "-Uri <Uri>",              description: "URL de destino" },
      { flag: "-Method <string>",        description: "Verbo HTTP: GET, POST, PUT, DELETE, PATCH..." },
      { flag: "-Body <Object>",          description: "Corpo da requisição" },
      { flag: "-Headers <IDictionary>",  description: "Headers customizados como hashtable" },
      { flag: "-ContentType <string>",   description: "Content-Type da requisição" },
      { flag: "-OutFile <string>",       description: "Salva a resposta em arquivo" },
      { flag: "-Credential <PSCredential>", description: "Credenciais para autenticação" },
      { flag: "-UseBasicParsing",        description: "Evita usar o Internet Explorer para parsear HTML (mais compatível)" },
      { flag: "-SessionVariable <string>",description: "Cria/reutiliza sessão com cookies" },
      { flag: "-TimeoutSec <int>",       description: "Timeout em segundos" },
    ],
    curiosities: [
      "Invoke-WebRequest em versões antigas do PowerShell (5.x) usava o motor do Internet Explorer para parsear HTML — por isso -UseBasicParsing era necessário em servers sem IE. No PS 7+, isso foi corrigido.",
      "A diferença entre Invoke-WebRequest e Invoke-RestMethod: o primeiro retorna o objeto completo da resposta (headers, cookies, HTML); o segundo faz parse automático de JSON/XML.",
    ],
  },
  {
    id: "test-connection",
    name: "Test-Connection",
    description: "Testa conectividade de rede enviando pacotes ICMP (ping) para um host.",
    syntax: "Test-Connection [-TargetName] <string[]> [-Count <int>] [-Quiet]",
    category: "network",
    level: "básico",
    uses: [
      "Verificar se um host está acessível",
      "Medir latência de rede",
      "Testar conectividade antes de operações remotas",
      "Monitorar disponibilidade de servidores",
    ],
    variations: [
      { command: "Test-Connection google.com", description: "Ping padrão (4 pacotes)" },
      { command: "Test-Connection google.com -Count 1 -Quiet", description: "Retorna True/False (ideal para scripts)" },
      { command: "Test-Connection google.com -Count 10", description: "10 pings para medir latência" },
      { command: "ping google.com", description: "Alias ping disponível" },
    ],
    examples: [
      { code: "'google.com','8.8.8.8','192.168.1.1' | ForEach-Object { [PSCustomObject]@{ Host=$_; Online=(Test-Connection $_ -Count 1 -Quiet) } }", description: "Testa múltiplos hosts" },
      { code: "if (Test-Connection 192.168.1.100 -Count 1 -Quiet) { Write-Host 'Servidor online' } else { Write-Host 'Servidor offline' }", description: "Verificação condicional" },
      { code: "Test-Connection google.com -Count 5 | Measure-Object -Property Latency -Average -Maximum", description: "Estatísticas de latência" },
    ],
    whenNotToUse: [
      "Para testar portas TCP específicas — use Test-NetConnection -Port",
      "Quando ICMP está bloqueado no firewall — hosts podem estar online mas não responder ao ping",
    ],
    relatedCommands: ["invoke-webrequest"],
    flags: [
      { flag: "-TargetName <string[]>", description: "Host(s) de destino (IP ou hostname)" },
      { flag: "-Count <int>",           description: "Número de pacotes a enviar (padrão: 4)" },
      { flag: "-Quiet",                 description: "Retorna apenas True/False em vez do objeto completo" },
      { flag: "-BufferSize <int>",      description: "Tamanho do buffer de ping em bytes" },
      { flag: "-TimeoutSeconds <int>",  description: "Timeout por pacote" },
      { flag: "-IPv4",                  description: "Força uso de IPv4" },
      { flag: "-IPv6",                  description: "Força uso de IPv6" },
    ],
    curiosities: [
      "Test-Connection -Quiet é ideal para uso em scripts — retorna $true ou $false sem nenhum output de texto, permitindo usar diretamente em condicionais if/else.",
      "Em redes corporativas, ICMP frequentemente é bloqueado por firewalls. Use Test-NetConnection -Port 443 para testar conectividade real com um serviço específico.",
    ],
  },

  /* ─── PIPELINE (adicionais) ──────────────────────────────────────── */
  {
    id: "sort-object",
    name: "Sort-Object",
    description: "Ordena objetos por uma ou mais propriedades, em ordem crescente ou decrescente.",
    syntax: "Sort-Object [[-Property] <Object[]>] [-Descending] [-Unique]",
    category: "pipeline",
    level: "intermediário",
    uses: [
      "Ordenar arquivos por tamanho, data ou nome",
      "Ordenar processos por uso de CPU ou memória",
      "Obter os maiores/menores valores de uma coleção",
    ],
    variations: [
      { command: "Get-ChildItem | Sort-Object Length", description: "Ordena arquivos do menor ao maior" },
      { command: "Get-ChildItem | Sort-Object Length -Descending", description: "Do maior ao menor" },
      { command: "Get-Process | Sort-Object CPU -Descending | Select-Object -First 10", description: "Top 10 processos por CPU" },
      { command: "sort Name", description: "Alias sort disponível" },
    ],
    examples: [
      { code: "Get-ChildItem -Recurse | Sort-Object Length -Descending | Select-Object -First 5 FullName, Length", description: "5 arquivos maiores do diretório" },
      { code: "Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 10 Name, @{N='MB';E={[math]::Round($_.WorkingSet/1MB,1)}}", description: "Top 10 processos por memória (em MB)" },
      { code: "Import-Csv dados.csv | Sort-Object -Property Departamento, Nome | Export-Csv ordenado.csv -NoTypeInformation", description: "Ordena CSV por múltiplas colunas" },
    ],
    whenNotToUse: [
      "Quando você só precisa do maior/menor valor — use Measure-Object -Maximum/-Minimum que é mais eficiente",
    ],
    relatedCommands: ["select-object", "where-object", "group-object", "measure-object"],
    flags: [
      { flag: "-Property <Object[]>",    description: "Propriedade(s) para ordenar. Pode ser múltiplas: -Property Nome, Idade" },
      { flag: "-Descending",             description: "Ordem decrescente (padrão é crescente)" },
      { flag: "-Unique",                 description: "Remove duplicatas após ordenar" },
      { flag: "-CaseSensitive",          description: "Diferencia maiúsculas de minúsculas na ordenação" },
      { flag: "-Culture <string>",       description: "Define o idioma/localização para regras de ordenação" },
    ],
    curiosities: [
      "Sort-Object aceita propriedades calculadas com hashtable: Sort-Object @{Expression={$_.Length}; Ascending=$false} — útil quando precisa de lógica customizada na ordenação.",
      "Para ordenar múltiplas propriedades com direções diferentes (uma crescente, outra decrescente), use hashtables: Sort-Object @{E='Dept';A=$true}, @{E='Salario';D=$true}.",
    ],
    syntaxBreakdown: [
      { part: "Sort-Object", label: "Cmdlet", description: "'Sort' = ordenar. 'Object' = objeto. Recebe os objetos do pipeline e os devolve em ordem." },
      { part: "[[-Property] <Object[]>]", label: "Parâmetro -Property", description: "Qual propriedade usar como critério de ordenação. Ex: Length para tamanho, Name para nome. Se omitido, ordena o objeto inteiro.", optional: true },
      { part: "[-Descending]", label: "Flag -Descending", description: "Inverte a ordem: do maior para o menor, do Z para o A. Sem essa flag, é crescente (do menor para o maior, de A para Z).", optional: true },
      { part: "[-Unique]", label: "Flag -Unique", description: "Após ordenar, remove objetos com valores duplicados na propriedade ordenada.", optional: true },
    ],
  },
  {
    id: "group-object",
    name: "Group-Object",
    description: "Agrupa objetos por uma propriedade e retorna a contagem de cada grupo.",
    syntax: "Group-Object [[-Property] <Object[]>] [-NoElement]",
    category: "pipeline",
    level: "intermediário",
    uses: [
      "Contar quantos arquivos há por extensão",
      "Agrupar processos por nome ou status",
      "Gerar relatórios de contagem a partir de dados",
    ],
    variations: [
      { command: "Get-ChildItem | Group-Object Extension", description: "Conta arquivos por extensão" },
      { command: "Get-Process | Group-Object Name | Sort-Object Count -Descending", description: "Processos mais duplicados" },
      { command: "Get-EventLog System -Newest 100 | Group-Object EntryType", description: "Eventos por tipo" },
      { command: "group Extension", description: "Alias group disponível" },
    ],
    examples: [
      { code: "Get-ChildItem -Recurse | Group-Object Extension | Sort-Object Count -Descending | Select-Object -First 10", description: "10 extensões mais comuns" },
      { code: "Get-Service | Group-Object Status | Select-Object Name, Count", description: "Serviços por status (Running/Stopped)" },
      { code: "Import-Csv vendas.csv | Group-Object Regiao | Select-Object Name, Count, @{N='Total';E={($_.Group | Measure-Object Valor -Sum).Sum}}", description: "Agrupa vendas por região com total" },
    ],
    whenNotToUse: [
      "Quando precisa só da contagem total — use Measure-Object -Count",
      "Quando quer somar valores — combine com Measure-Object dentro do grupo",
    ],
    relatedCommands: ["sort-object", "measure-object", "select-object"],
    flags: [
      { flag: "-Property <Object[]>",   description: "Propriedade para agrupar" },
      { flag: "-NoElement",             description: "Não inclui os objetos no grupo, só a contagem (mais rápido)" },
      { flag: "-CaseSensitive",         description: "Diferencia maiúsculas/minúsculas no agrupamento" },
      { flag: "-AsHashTable",           description: "Retorna um hashtable em vez de objetos GroupInfo" },
    ],
    curiosities: [
      "Group-Object retorna objetos com propriedades Name (valor do grupo), Count (quantidade) e Group (array com os objetos originais). Você pode acessar cada grupo para fazer cálculos adicionais.",
    ],
  },
  {
    id: "measure-object",
    name: "Measure-Object",
    description: "Calcula estatísticas numéricas (soma, média, mínimo, máximo, contagem) de propriedades de objetos.",
    syntax: "Measure-Object [[-Property] <string[]>] [-Sum] [-Average] [-Minimum] [-Maximum] [-Count]",
    category: "pipeline",
    level: "intermediário",
    uses: [
      "Somar tamanhos de arquivos",
      "Calcular média de uso de CPU ou memória",
      "Contar objetos no pipeline",
      "Encontrar valor máximo ou mínimo",
    ],
    variations: [
      { command: "Get-ChildItem | Measure-Object Length -Sum", description: "Tamanho total dos arquivos" },
      { command: "Get-Process | Measure-Object CPU -Average", description: "Média de CPU" },
      { command: "Get-Content arquivo.txt | Measure-Object -Line -Word -Character", description: "Conta linhas, palavras e caracteres" },
      { command: "measure", description: "Alias measure disponível" },
    ],
    examples: [
      { code: "Get-ChildItem -Recurse | Measure-Object -Property Length -Sum | Select-Object @{N='TotalGB';E={[math]::Round($_.Sum/1GB,2)}}", description: "Tamanho total da pasta em GB" },
      { code: "Get-Process | Measure-Object WorkingSet -Sum -Average -Maximum | Select-Object @{N='TotalMB';E={[math]::Round($_.Sum/1MB)}}", description: "Memória total e média de processos" },
      { code: "1..100 | Measure-Object -Sum -Average -Minimum -Maximum", description: "Estatísticas completas de 1 a 100" },
    ],
    whenNotToUse: [
      "Para agrupamento antes de medir — combine com Group-Object",
    ],
    relatedCommands: ["group-object", "select-object", "sort-object"],
    flags: [
      { flag: "-Property <string[]>", description: "Propriedade numérica a calcular" },
      { flag: "-Sum",                 description: "Calcula a soma" },
      { flag: "-Average",             description: "Calcula a média" },
      { flag: "-Minimum",             description: "Encontra o menor valor" },
      { flag: "-Maximum",             description: "Encontra o maior valor" },
      { flag: "-Line",                description: "Conta linhas (para strings/texto)" },
      { flag: "-Word",                description: "Conta palavras (para strings/texto)" },
      { flag: "-Character",           description: "Conta caracteres (para strings/texto)" },
    ],
    curiosities: [
      "Measure-Object -Line -Word -Character é o equivalente ao comando 'wc' do Linux — conta linhas, palavras e caracteres de um arquivo ou texto.",
    ],
  },

  /* ─── SISTEMA (adicionais) ───────────────────────────────────────── */
  {
    id: "get-eventlog",
    name: "Get-EventLog",
    description: "Lê eventos do Log de Eventos do Windows (Application, System, Security, etc.).",
    syntax: "Get-EventLog [-LogName] <string> [-Newest <int>] [-EntryType <string[]>] [-Source <string>]",
    category: "system",
    level: "avançado",
    uses: [
      "Diagnosticar erros do sistema",
      "Verificar eventos de segurança (logins, falhas)",
      "Monitorar logs de aplicações",
      "Investigar crashes e problemas de inicialização",
    ],
    variations: [
      { command: "Get-EventLog System -Newest 50", description: "Últimos 50 eventos do log System" },
      { command: "Get-EventLog Application -EntryType Error -Newest 20", description: "Últimos 20 erros de aplicação" },
      { command: "Get-EventLog Security -Newest 100 | Where-Object { $_.EventID -eq 4625 }", description: "Tentativas de login falhas (EventID 4625)" },
      { command: "Get-WinEvent -LogName System -MaxEvents 50", description: "Versão moderna com Get-WinEvent" },
    ],
    examples: [
      { code: "Get-EventLog System -EntryType Error, Warning -Newest 100 | Select-Object TimeGenerated, EntryType, Source, Message | Format-Table -AutoSize", description: "Erros e avisos recentes do sistema" },
      { code: "Get-EventLog Application -Source '*SQL*' -Newest 50", description: "Eventos de aplicações SQL" },
      { code: "Get-EventLog System -After (Get-Date).AddHours(-1) | Group-Object EntryType | Select-Object Name, Count", description: "Eventos da última hora agrupados por tipo" },
    ],
    whenNotToUse: [
      "Para logs modernos e de aplicações de terceiros — use Get-WinEvent que é mais poderoso e suporta logs de qualquer provedor",
      "Get-EventLog só funciona no Windows e está deprecado no PS7+",
    ],
    relatedCommands: ["get-winevent", "get-process", "get-service"],
    flags: [
      { flag: "-LogName <string>",     description: "Nome do log: Application, System, Security, Setup, ou qualquer log personalizado" },
      { flag: "-Newest <int>",         description: "Número de eventos mais recentes a retornar" },
      { flag: "-EntryType <string[]>", description: "Tipo: Error, Warning, Information, SuccessAudit, FailureAudit" },
      { flag: "-Source <string>",      description: "Filtra por fonte do evento (suporta wildcards)" },
      { flag: "-EventID <int[]>",      description: "Filtra por ID específico do evento" },
      { flag: "-After <DateTime>",     description: "Eventos após uma data/hora" },
      { flag: "-Before <DateTime>",    description: "Eventos antes de uma data/hora" },
      { flag: "-Message <string>",     description: "Filtra por texto na mensagem (suporta wildcards)" },
      { flag: "-ComputerName <string>",description: "Lê logs de um computador remoto" },
    ],
    curiosities: [
      "EventID 4625 = login falho, 4624 = login bem-sucedido, 41 = sistema reiniciou inesperadamente (Kernel-Power). Esses IDs são úteis para diagnóstico rápido.",
      "Get-WinEvent é o substituto moderno de Get-EventLog e funciona com todos os logs do Windows, incluindo os logs de aplicações de terceiros e logs de rastreamento ETW.",
    ],
  },
  {
    id: "set-executionpolicy",
    name: "Set-ExecutionPolicy",
    description: "Define a política de execução de scripts PowerShell no sistema ou para o usuário atual.",
    syntax: "Set-ExecutionPolicy [-ExecutionPolicy] <ExecutionPolicy> [-Scope <ExecutionPolicyScope>]",
    category: "system",
    level: "avançado",
    uses: [
      "Permitir execução de scripts locais",
      "Configurar ambiente para automação",
      "Restringir execução de scripts em servidores de produção",
    ],
    variations: [
      { command: "Set-ExecutionPolicy RemoteSigned -Scope CurrentUser", description: "Permite scripts locais para o usuário atual (sem admin)" },
      { command: "Set-ExecutionPolicy Restricted", description: "Bloqueia todos os scripts (padrão Windows)" },
      { command: "Set-ExecutionPolicy Bypass -Scope Process", description: "Libera tudo só para a sessão atual (temporário)" },
      { command: "Get-ExecutionPolicy -List", description: "Vê a política em todos os escopos" },
    ],
    examples: [
      { code: "Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force", description: "Configura para desenvolvimento sem prompt de confirmação" },
      { code: "powershell -ExecutionPolicy Bypass -File script.ps1", description: "Executa script com bypass temporário sem alterar configuração" },
      { code: "Get-ExecutionPolicy -List | Format-Table", description: "Mostra políticas de todos os escopos em tabela" },
    ],
    whenNotToUse: [
      "Nunca use Unrestricted ou Bypass como configuração permanente em produção",
      "Prefira -Scope Process para scripts pontuais — não altera configuração do sistema",
    ],
    relatedCommands: ["get-executionpolicy"],
    flags: [
      { flag: "-ExecutionPolicy <string>", description: "Política: Restricted, AllSigned, RemoteSigned, Unrestricted, Bypass, Undefined" },
      { flag: "-Scope <string>",           description: "Escopo: MachinePolicy, UserPolicy, Process, CurrentUser, LocalMachine" },
      { flag: "-Force",                    description: "Não pede confirmação" },
      { flag: "-WhatIf",                   description: "Simula a mudança sem aplicar" },
    ],
    curiosities: [
      "ExecutionPolicy não é uma medida de segurança contra ataques — é uma proteção contra execução acidental. Um atacante pode facilmente contorná-la com -ExecutionPolicy Bypass. Seu propósito é evitar que scripts sejam executados por engano.",
      "RemoteSigned é o melhor balanço para desenvolvimento: scripts locais rodam sem assinatura, mas scripts baixados da internet precisam ser assinados digitalmente por um publisher confiável.",
    ],
    syntaxBreakdown: [
      { part: "Set-ExecutionPolicy", label: "Cmdlet", description: "'Set' = definir/configurar. 'ExecutionPolicy' = política de execução. Configura as regras de segurança que controlam quais scripts podem rodar." },
      { part: "[-ExecutionPolicy] <ExecutionPolicy>", label: "Política", description: "Qual nível de permissão aplicar. Restricted = nenhum script. AllSigned = todos precisam de assinatura. RemoteSigned = scripts locais livres, baixados precisam de assinatura. Bypass = tudo permitido." },
      { part: "[-Scope <ExecutionPolicyScope>]", label: "Parâmetro -Scope", description: "Para quem a política se aplica. Process = só essa sessão (temporário, some ao fechar). CurrentUser = só seu usuário (não precisa de admin). LocalMachine = todo o computador (precisa de admin).", optional: true },
    ],
  },
  {
    id: "invoke-expression",
    name: "Invoke-Expression",
    description: "Executa uma string como comando PowerShell. Útil para executar código construído dinamicamente.",
    syntax: "Invoke-Expression [-Command] <string>",
    category: "system",
    level: "avançado",
    uses: [
      "Executar comandos construídos dinamicamente",
      "Avaliar strings como código PowerShell",
    ],
    variations: [
      { command: "Invoke-Expression 'Get-Process'", description: "Executa string como comando" },
      { command: "iex 'Get-Process'", description: "Alias iex — muito usado em scripts de instalação" },
      { command: "iex (irm 'https://...')", description: "Padrão de instalação: baixa e executa script remoto" },
    ],
    examples: [
      { code: '$cmd = "Get-Process | Select-Object -First 5"\nInvoke-Expression $cmd', description: "Executa comando armazenado em variável" },
      { code: '$property = "Name"\nGet-Process | Select-Object $property', description: "Seleção dinâmica de propriedade (sem Invoke-Expression)" },
    ],
    whenNotToUse: [
      "Nunca use com input não sanitizado do usuário — risco crítico de injeção de código",
      "Na maioria dos casos, há alternativas mais seguras (variáveis, ScriptBlocks, parâmetros)",
    ],
    relatedCommands: ["invoke-command", "start-process"],
    flags: [
      { flag: "-Command <string>", description: "A string a ser executada como código PowerShell", danger: true },
    ],
    curiosities: [
      "O padrão 'iex (irm url)' é usado por instaladores como Chocolatey e Oh My Posh — baixa e executa um script remoto em uma linha. Muito conveniente, mas nunca execute sem verificar a URL e o conteúdo do script.",
    ],
  },

  /* ─── ARQUIVOS (adicionais) ──────────────────────────────────────── */
  {
    id: "compress-archive",
    name: "Compress-Archive",
    description: "Cria arquivos ZIP comprimindo arquivos e pastas.",
    syntax: "Compress-Archive [-Path] <string[]> [-DestinationPath] <string> [-Update]",
    category: "files",
    level: "intermediário",
    uses: [
      "Criar backups de arquivos e pastas",
      "Preparar distribuição de scripts e projetos",
      "Compactar logs para economizar espaço",
    ],
    variations: [
      { command: "Compress-Archive -Path C:\\pasta -DestinationPath backup.zip", description: "Comprime pasta inteira" },
      { command: "Compress-Archive -Path *.log -DestinationPath logs.zip", description: "Comprime todos os .log" },
      { command: "Compress-Archive -Path arquivo.txt -DestinationPath arquivo.zip -Update", description: "Adiciona ao ZIP existente" },
      { command: "Expand-Archive -Path arquivo.zip -DestinationPath C:\\destino", description: "Extrai ZIP (cmdlet inverso)" },
    ],
    examples: [
      { code: "Compress-Archive -Path C:\\Projetos\\* -DestinationPath \"backup_$(Get-Date -Format 'yyyyMMdd').zip\"", description: "Backup com data no nome" },
      { code: "Get-ChildItem *.log | Compress-Archive -DestinationPath logs_antigos.zip\nGet-ChildItem *.log | Remove-Item", description: "Arquiva e deleta logs" },
    ],
    whenNotToUse: [
      "Para arquivos muito grandes — considere ferramentas de compressão dedicadas como 7-Zip que oferecem melhor compressão e mais formatos",
      "Para extrair formatos que não sejam ZIP — use Expand-Archive com suporte limitado ou ferramentas externas",
    ],
    relatedCommands: ["expand-archive", "copy-item", "remove-item"],
    flags: [
      { flag: "-Path <string[]>",         description: "Arquivos/pastas a compactar (suporta wildcards)" },
      { flag: "-DestinationPath <string>", description: "Caminho do arquivo ZIP de saída" },
      { flag: "-CompressionLevel <string>",description: "Nível de compressão: Optimal, Fastest, NoCompression" },
      { flag: "-Update",                  description: "Adiciona ao ZIP existente em vez de sobrescrever" },
      { flag: "-Force",                   description: "Sobrescreve ZIP existente sem confirmação" },
    ],
    curiosities: [
      "Compress-Archive foi introduzido no PowerShell 5.0. Em versões anteriores, era necessário usar .NET diretamente com [System.IO.Compression.ZipFile].",
    ],
  },

  /* ─── CONTEÚDO (adicionais) ──────────────────────────────────────── */
  {
    id: "convertto-json",
    name: "ConvertTo-Json / ConvertFrom-Json",
    description: "Converte objetos PowerShell para JSON e vice-versa. Essencial para trabalhar com APIs e arquivos de configuração.",
    syntax: "ConvertTo-Json [-InputObject] <Object> [-Depth <int>]\nConvertFrom-Json [-InputObject] <string>",
    category: "content",
    level: "intermediário",
    uses: [
      "Serializar objetos para salvar em arquivo ou enviar para API",
      "Parsear respostas JSON de APIs REST",
      "Ler arquivos de configuração .json",
      "Transformar dados entre formatos",
    ],
    variations: [
      { command: "Get-Process | Select-Object Name, CPU | ConvertTo-Json", description: "Converte objetos para JSON" },
      { command: "Get-Content config.json | ConvertFrom-Json", description: "Lê e parseia arquivo JSON" },
      { command: "Invoke-RestMethod https://api.exemplo.com/dados", description: "Invoke-RestMethod já faz ConvertFrom-Json automaticamente" },
    ],
    examples: [
      { code: '$config = Get-Content appsettings.json -Raw | ConvertFrom-Json\n$config.ConnectionStrings.Default', description: "Lê valor aninhado de JSON" },
      { code: '$obj = [PSCustomObject]@{ nome="João"; idade=30; ativo=$true }\n$obj | ConvertTo-Json | Set-Content usuario.json', description: "Cria e salva JSON" },
      { code: '$json = Invoke-RestMethod "https://jsonplaceholder.typicode.com/users/1"\nWrite-Host "$($json.name) — $($json.email)"', description: "Consome API REST" },
    ],
    whenNotToUse: [
      "Para XML — use ConvertTo-Xml e ConvertFrom-Xml ou Select-Xml",
      "Para CSV — use Export-Csv e Import-Csv",
    ],
    relatedCommands: ["get-content", "invoke-webrequest", "set-content"],
    flags: [
      { flag: "-Depth <int>",          description: "Profundidade de serialização de objetos aninhados (padrão: 2)" },
      { flag: "-Compress",             description: "Remove espaços e indentação do JSON (saída minificada)" },
      { flag: "-AsHashtable",          description: "ConvertFrom-Json: retorna hashtable em vez de PSCustomObject (PS7.3+)" },
      { flag: "-EnumsAsStrings",       description: "Serializa enums como strings em vez de números" },
    ],
    curiosities: [
      "O padrão de profundidade -Depth 2 do ConvertTo-Json frequentemente surpreende iniciantes — objetos com mais de 2 níveis de aninhamento aparecem como a representação textual do tipo .NET. Aumente com -Depth 10 para objetos complexos.",
      "Invoke-RestMethod faz ConvertFrom-Json automaticamente — use-o em vez de Invoke-WebRequest + ConvertFrom-Json para consumir APIs JSON.",
    ],
    syntaxBreakdown: [
      { part: "ConvertTo-Json", label: "Cmdlet (para JSON)", description: "'Convert' = converter. 'To' = para. 'Json' = formato JSON. Pega um objeto do PowerShell (qualquer coisa) e transforma no texto JSON equivalente." },
      { part: "ConvertFrom-Json", label: "Cmdlet (de JSON)", description: "'From' = de/a partir de. Faz o inverso: pega um texto em formato JSON e cria um objeto PowerShell que você pode manipular com ponto (obj.propriedade)." },
      { part: "[-Depth <int>]", label: "Parâmetro -Depth", description: "Quantos níveis de aninhamento converter. Se seu objeto tem { a: { b: { c: valor } } }, são 3 níveis. O padrão é 2, o que frequentemente corta dados. Use -Depth 10 para objetos complexos.", optional: true },
    ],
  },

  /* ─── STRINGS ────────────────────────────────────────────────────── */
  {
    id: "string-split",
    name: "-split / .Split()",
    description: "Divide uma string em um array usando um delimitador ou expressão regular.",
    syntax: '"string" -split "delimitador"\n"string".Split("char")',
    category: "strings",
    level: "básico",
    uses: [
      "Separar valores de uma linha CSV manual",
      "Dividir o PATH em entradas individuais",
      "Parsear saída de comandos externos",
    ],
    variations: [
      { command: '"a,b,c" -split ","', description: "Divide por vírgula → array @('a','b','c')" },
      { command: '$env:PATH -split ";"', description: "Divide o PATH em entradas individuais" },
      { command: '"linha1`nlinha2" -split "`n"', description: "Divide por newline" },
      { command: '"a::b::c" -split "::" -MaxSubstrings 2', description: "Limita a 2 partes" },
    ],
    examples: [
      { code: '$env:PATH -split ";" | Where-Object { $_ -like "*Python*" }', description: "Encontra entradas do Python no PATH" },
      { code: '(Get-Content hosts.txt) | ForEach-Object { ($_ -split "\\s+")[0] }', description: "Extrai o primeiro campo de cada linha" },
      { code: '"2024-12-25" -split "-" | ForEach-Object { $_.PadLeft(2,"0") }', description: "Divide data e formata partes" },
    ],
    whenNotToUse: [
      "Para CSVs reais — use Import-Csv que lida com aspas e escapamentos corretamente",
      "Para parsear estruturas complexas — use expressões regulares com -match ou [regex]",
    ],
    relatedCommands: ["string-join", "string-replace", "select-string"],
    flags: [
      { flag: "-split <string>",         description: "Operador: divide a string pelo delimitador/regex" },
      { flag: "-MaxSubstrings <int>",    description: "Limita o número de partes resultantes" },
      { flag: "-SimpleMatch",            description: "Trata o delimitador como texto literal, não regex" },
    ],
    curiosities: [
      "-split usa regex por padrão — -split '.' divide em cada caractere porque '.' é qualquer caractere em regex. Use -split '\\.': ou -SimpleMatch para ponto literal.",
    ],
  },
  {
    id: "string-join",
    name: "-join / [string]::Join()",
    description: "Une um array de strings em uma única string com um delimitador entre os elementos.",
    syntax: 'array -join "delimitador"\n[string]::Join("delimitador", array)',
    category: "strings",
    level: "básico",
    uses: [
      "Construir linhas CSV a partir de arrays",
      "Unir caminhos ou URLs",
      "Montar comandos ou queries dinamicamente",
    ],
    variations: [
      { command: '@("a","b","c") -join ","', description: "Junta com vírgula → 'a,b,c'" },
      { command: '@("C:\\","Users","João") -join "\\"', description: "Monta caminho de arquivo" },
      { command: '(Get-ChildItem *.ps1).Name -join ", "', description: "Lista nomes de scripts separados por vírgula" },
      { command: '-join $array', description: "Une sem delimitador (concatenação)" },
    ],
    examples: [
      { code: '$csv = @("Nome","Idade","Cidade")\n$csv -join ";"', description: "Cria cabeçalho CSV" },
      { code: 'Get-Process | Select-Object -First 5 -ExpandProperty Name | Sort-Object | -join ", "', description: "Lista de nomes em uma linha" },
      { code: '$partes = "api","v2","users"\n"https://host/" + ($partes -join "/")', description: "Monta URL de API" },
    ],
    whenNotToUse: [
      "Para construir CSV real — use Export-Csv que escapa vírgulas e aspas dentro dos valores",
    ],
    relatedCommands: ["string-split", "string-replace"],
    curiosities: [
      "-join sem delimitador concatena diretamente: @('a','b','c') -join '' retorna 'abc'. Útil para montar strings de caracteres aleatórios ou hashes.",
    ],
  },
  {
    id: "string-replace",
    name: "-replace / .Replace()",
    description: "Substitui texto em uma string por outro valor. -replace usa regex; .Replace() trata texto literal.",
    syntax: '"string" -replace "padrão","substituto"\n"string".Replace("antigo","novo")',
    category: "strings",
    level: "básico",
    uses: [
      "Limpar dados de texto",
      "Renomear partes de strings",
      "Sanitizar inputs antes de usar em comandos",
    ],
    variations: [
      { command: '"Hello World" -replace "World","PowerShell"', description: "Substitui palavra" },
      { command: '"abc123" -replace "\\d+",""', description: "Remove todos os números (regex)" },
      { command: '"C:\\old\\path" -replace "old","new"', description: "Substitui parte de caminho" },
      { command: '(Get-Content f.txt) -replace "TODO","DONE" | Set-Content f.txt', description: "Substitui em arquivo" },
    ],
    examples: [
      { code: 'Get-ChildItem *.txt | ForEach-Object {\n  (Get-Content $_.FullName) -replace "v1\\.0","v2.0" | Set-Content $_.FullName\n}', description: "Atualiza versão em múltiplos arquivos" },
      { code: '"  texto com espaços  ".Trim() -replace "\\s+"," "', description: "Normaliza espaços internos" },
      { code: '$email -replace "^.*@",""', description: "Extrai domínio de um email" },
    ],
    whenNotToUse: [
      "-replace é case-insensitive por padrão; use -creplace para diferenciar maiúsculas",
      "Para substituições complexas em arquivos binários — use ferramentas especializadas",
    ],
    relatedCommands: ["select-string", "string-split", "set-content"],
    flags: [
      { flag: "-replace",  description: "Case-insensitive; usa regex" },
      { flag: "-creplace", description: "Case-sensitive com regex" },
      { flag: "-ireplace", description: "Explicitamente case-insensitive (padrão)" },
    ],
    curiosities: [
      "No -replace, grupos de captura regex podem ser referenciados com $1, $2: '2024-12-25' -replace '(\\d{4})-(\\d{2})-(\\d{2})','$3/$2/$1' retorna '25/12/2024'.",
    ],
  },
  {
    id: "string-format",
    name: "String Format / Trim / PadLeft",
    description: "Métodos .NET de manipulação de strings: formatação, remoção de espaços, preenchimento e verificação de conteúdo.",
    syntax: '"string".Trim()\n"string".PadLeft(n,"char")\n"format {0}" -f valor',
    category: "strings",
    level: "intermediário",
    uses: [
      "Formatar números com zeros à esquerda",
      "Remover espaços desnecessários de inputs",
      "Montar strings com formatação controlada",
    ],
    variations: [
      { command: '"  texto  ".Trim()', description: "Remove espaços no início e fim" },
      { command: '"42".PadLeft(5,"0")', description: "Resultado: '00042'" },
      { command: '"{0:N2}" -f 1234567.89', description: "Formata número: '1,234,567.89'" },
      { command: '"texto".StartsWith("tex")', description: "Retorna $true" },
      { command: '"texto".ToUpper()', description: "TEXTO" },
    ],
    examples: [
      { code: '1..5 | ForEach-Object { "arquivo_$($_.ToString().PadLeft(3,"0")).txt" }', description: "Gera arquivo_001.txt ... arquivo_005.txt" },
      { code: '"  input do usuário  ".Trim().ToLower() -replace "\\s+","-"', description: "Sanitiza input para slug de URL" },
      { code: '"{0,-20} {1,10:N2}" -f "Total de vendas:", 98765.43', description: "Alinha texto e número em tabela" },
    ],
    whenNotToUse: [
      "Para formatação de datas — use Get-Date -Format diretamente",
    ],
    relatedCommands: ["string-replace", "string-split"],
    curiosities: [
      "O operador -f (format) usa sintaxe .NET: {0:D3} formata inteiro com 3 dígitos; {0:C2} formata como moeda; {0:yyyy-MM-dd} formata DateTime. Muito mais poderoso que string interpolation para output formatado.",
    ],
  },

  /* ─── MÓDULOS ────────────────────────────────────────────────────── */
  {
    id: "get-module",
    name: "Get-Module / Import-Module",
    description: "Lista módulos disponíveis ou importados e carrega módulos na sessão atual.",
    syntax: "Get-Module [-ListAvailable] [-Name <string[]>]\nImport-Module [-Name] <string[]> [-Force]",
    category: "modules",
    level: "intermediário",
    uses: [
      "Verificar quais módulos estão carregados",
      "Importar módulo para usar seus cmdlets",
      "Recarregar módulo durante desenvolvimento",
      "Listar todos os módulos instalados",
    ],
    variations: [
      { command: "Get-Module", description: "Módulos carregados na sessão atual" },
      { command: "Get-Module -ListAvailable", description: "Todos os módulos instalados" },
      { command: "Get-Module -ListAvailable -Name *SQL*", description: "Módulos de SQL disponíveis" },
      { command: "Import-Module ActiveDirectory", description: "Importa módulo do AD" },
      { command: "Import-Module .\\MeuModulo.psm1 -Force", description: "Recarrega módulo local" },
    ],
    examples: [
      { code: "Get-Module -ListAvailable | Select-Object Name, Version | Sort-Object Name", description: "Lista todos os módulos com versão" },
      { code: "Import-Module PSReadLine -Force\nGet-Command -Module PSReadLine", description: "Importa módulo e lista seus cmdlets" },
      { code: 'if (-not (Get-Module -ListAvailable -Name Pester)) {\n  Install-Module Pester -Force\n}\nImport-Module Pester', description: "Instala e importa módulo se necessário" },
    ],
    whenNotToUse: [
      "PS 3+ importa módulos automaticamente quando um cmdlet é chamado — Import-Module manual é necessário apenas para módulos não auto-detectados ou para forçar reload",
    ],
    relatedCommands: ["install-module", "find-module", "get-command"],
    flags: [
      { flag: "-ListAvailable",    description: "Lista módulos instalados, não só os carregados" },
      { flag: "-Name <string[]>",  description: "Filtra por nome de módulo (suporta wildcards)" },
      { flag: "-Force",            description: "Reimporta mesmo que já esteja carregado" },
      { flag: "-PassThru",         description: "Retorna o objeto do módulo importado" },
      { flag: "-Verbose",          description: "Exibe detalhes durante a importação" },
    ],
    curiosities: [
      "Módulos em PowerShell 7+ podem ser importados de caminhos UNC e URLs de repositórios privados. O módulo PSResourceGet (substituto do PowerShellGet) suporta repositórios NuGet privados.",
    ],
  },
  {
    id: "install-module",
    name: "Install-Module / Find-Module",
    description: "Instala módulos do PowerShell Gallery ou repositórios configurados.",
    syntax: "Install-Module [-Name] <string[]> [-Scope <string>] [-Force]\nFind-Module [-Name] <string[]>",
    category: "modules",
    level: "intermediário",
    uses: [
      "Instalar módulos da PowerShell Gallery",
      "Buscar módulos disponíveis por funcionalidade",
      "Atualizar módulos existentes",
    ],
    variations: [
      { command: "Install-Module Pester -Scope CurrentUser", description: "Instala sem precisar de admin" },
      { command: "Install-Module Az -AllowClobber -Force", description: "Instala módulo Azure" },
      { command: "Find-Module *AWS*", description: "Busca módulos relacionados à AWS" },
      { command: "Update-Module Pester", description: "Atualiza módulo instalado" },
      { command: "Uninstall-Module Pester", description: "Remove módulo instalado" },
    ],
    examples: [
      { code: "Find-Module -Tag 'Security' | Select-Object -First 5 Name, Description", description: "Descobre módulos de segurança" },
      { code: "Install-Module PSReadLine, posh-git, oh-my-posh -Scope CurrentUser -Force", description: "Instala ferramentas de produtividade" },
      { code: "Get-Module -ListAvailable | Where-Object { $_.Version -lt '2.0' } | Select-Object Name, Version", description: "Módulos com versão antiga" },
    ],
    whenNotToUse: [
      "Em ambientes sem internet — use Save-Module para baixar offline e copiar manualmente",
      "Para módulos privados — configure um repositório interno com Register-PSRepository",
    ],
    relatedCommands: ["get-module", "import-module"],
    flags: [
      { flag: "-Name <string[]>",      description: "Nome do módulo" },
      { flag: "-Scope <string>",       description: "CurrentUser (sem admin) ou AllUsers (requer admin)" },
      { flag: "-Force",                description: "Instala mesmo que já exista uma versão" },
      { flag: "-AllowClobber",         description: "Permite sobrescrever comandos existentes com mesmo nome" },
      { flag: "-RequiredVersion <string>", description: "Instala versão específica" },
      { flag: "-MinimumVersion <string>",  description: "Versão mínima aceitável" },
    ],
    curiosities: [
      "A PowerShell Gallery (powershellgallery.com) tem mais de 10.000 módulos. Use Find-Module -Tag 'DevOps' ou Find-Module -Tag 'Azure' para descobrir módulos por categoria.",
    ],
  },

  /* ─── AMBIENTE ───────────────────────────────────────────────────── */
  {
    id: "env-variables",
    name: "$env: / [Environment]",
    description: "Acessa, define e persiste variáveis de ambiente do sistema e do usuário.",
    syntax: '$env:NOME\n$env:NOME = "valor"\n[Environment]::SetEnvironmentVariable("NOME","valor","User")',
    category: "environment",
    level: "básico",
    uses: [
      "Ler variáveis de ambiente existentes",
      "Definir variáveis para a sessão atual",
      "Persistir variáveis permanentemente para o usuário ou sistema",
    ],
    variations: [
      { command: '$env:PATH', description: "Lê a variável PATH" },
      { command: '$env:USERNAME', description: "Nome do usuário logado" },
      { command: '$env:MINHA_VAR = "valor"', description: "Define variável (só na sessão atual)" },
      { command: '[Environment]::GetEnvironmentVariables("User")', description: "Lista todas as variáveis do usuário" },
    ],
    examples: [
      { code: '[Environment]::SetEnvironmentVariable("MINHA_API_KEY", "abc123", "User")\n# Para persistir; requer nova sessão para efeito', description: "Define variável de ambiente permanente" },
      { code: 'Get-ChildItem env: | Sort-Object Name | Format-Table Name, Value -AutoSize', description: "Lista todas as variáveis de ambiente" },
      { code: '$env:PATH += ";C:\\MinhaFerramenta\\bin"\n# Adiciona ao PATH da sessão atual', description: "Adiciona diretório ao PATH temporariamente" },
    ],
    whenNotToUse: [
      "$env: altera variáveis apenas na sessão atual. Para persistir, use [Environment]::SetEnvironmentVariable com scope 'User' ou 'Machine'",
    ],
    relatedCommands: ["get-item", "set-item"],
    flags: [],
    curiosities: [
      "Get-ChildItem env: lista variáveis como se fosse um diretório — o PowerShell trata o ambiente como um 'drive' chamado env:. Você pode até usar cd env: e navegar nele.",
      "$env:APPDATA aponta para a pasta de dados de aplicações do usuário (%APPDATA%) — muito útil para encontrar perfis de configuração independente do usuário logado.",
    ],
  },

  /* ─── AGENDAMENTO ────────────────────────────────────────────────── */
  {
    id: "register-scheduledtask",
    name: "Register-ScheduledTask",
    description: "Cria tarefas agendadas no Task Scheduler do Windows via PowerShell.",
    syntax: "Register-ScheduledTask -TaskName <string> -Action <CimInstance> -Trigger <CimInstance>",
    category: "scheduling",
    level: "avançado",
    uses: [
      "Agendar scripts para rodar automaticamente",
      "Criar backups periódicos",
      "Automatizar tarefas de manutenção",
      "Executar scripts no login do usuário",
    ],
    variations: [
      { command: "Get-ScheduledTask", description: "Lista todas as tarefas agendadas" },
      { command: "Get-ScheduledTask -TaskName 'MeuScript' | Start-ScheduledTask", description: "Executa tarefa manualmente" },
      { command: "Unregister-ScheduledTask -TaskName 'MeuScript' -Confirm:$false", description: "Remove tarefa agendada" },
      { command: "Get-ScheduledTask | Where-Object State -eq 'Ready' | Measure-Object", description: "Conta tarefas prontas" },
    ],
    examples: [
      { code: '$action  = New-ScheduledTaskAction -Execute "pwsh.exe" -Argument "-File C:\\scripts\\backup.ps1"\n$trigger = New-ScheduledTaskTrigger -Daily -At "02:00AM"\nRegister-ScheduledTask -TaskName "BackupDiario" -Action $action -Trigger $trigger -RunLevel Highest', description: "Backup diário às 2h com privilégios de admin" },
      { code: '$trigger = New-ScheduledTaskTrigger -AtLogOn\n$action  = New-ScheduledTaskAction -Execute "pwsh.exe" -Argument "-File C:\\scripts\\startup.ps1"\nRegister-ScheduledTask "InicioSessao" -Action $action -Trigger $trigger', description: "Executa script a cada login" },
      { code: 'Get-ScheduledTask | Where-Object { $_.LastRunTime -lt (Get-Date).AddDays(-30) } | Select-Object TaskName, LastRunTime', description: "Tarefas que não rodaram em 30 dias" },
    ],
    whenNotToUse: [
      "Para tarefas simples e pontuais — use Start-Job ou Invoke-Command diretamente",
      "Para workflows complexos com dependências — avalie ferramentas como Jenkins ou Azure DevOps",
    ],
    relatedCommands: ["get-scheduledtask", "start-scheduledtask"],
    flags: [
      { flag: "-TaskName <string>",   description: "Nome único da tarefa" },
      { flag: "-Action <CimInstance>",description: "Criado com New-ScheduledTaskAction: define o executável e argumentos" },
      { flag: "-Trigger <CimInstance>",description: "Criado com New-ScheduledTaskTrigger: define quando disparar" },
      { flag: "-RunLevel <string>",   description: "Limited (padrão) ou Highest (admin)" },
      { flag: "-Force",               description: "Sobrescreve tarefa existente com mesmo nome" },
    ],
    curiosities: [
      "Register-ScheduledTask é a forma programática de criar tarefas sem abrir o Task Scheduler GUI. Em servidores sem interface gráfica (Server Core), é a única opção.",
    ],
  },

  /* ─── SEGURANÇA ──────────────────────────────────────────────────── */
  {
    id: "get-acl",
    name: "Get-Acl / Set-Acl",
    description: "Lê e modifica as permissões NTFS (ACL — Access Control List) de arquivos, pastas e outros objetos.",
    syntax: "Get-Acl [-Path] <string[]>\nSet-Acl [-Path] <string[]> [-AclObject] <ObjectSecurity>",
    category: "security",
    level: "avançado",
    uses: [
      "Auditar permissões de arquivos e pastas",
      "Copiar permissões de um objeto para outro",
      "Adicionar ou remover entradas de controle de acesso",
      "Verificar quem tem acesso a um recurso",
    ],
    variations: [
      { command: "Get-Acl C:\\pasta | Format-List", description: "Exibe ACL completa de uma pasta" },
      { command: "(Get-Acl C:\\pasta).Access", description: "Lista entradas de acesso individuais" },
      { command: "Get-Acl C:\\origem | Set-Acl C:\\destino", description: "Copia ACL de um caminho para outro" },
    ],
    examples: [
      { code: "(Get-Acl C:\\dados).Access | Select-Object IdentityReference, FileSystemRights, AccessControlType | Format-Table -AutoSize", description: "Relatório de permissões de uma pasta" },
      { code: '$acl = Get-Acl "C:\\pasta"\n$regra = New-Object System.Security.AccessControl.FileSystemAccessRule("DOMAIN\\usuario","FullControl","Allow")\n$acl.SetAccessRule($regra)\nSet-Acl "C:\\pasta" $acl', description: "Concede controle total para um usuário" },
      { code: 'Get-ChildItem -Recurse C:\\projeto | ForEach-Object {\n  $acl = Get-Acl $_.FullName\n  if ($acl.Owner -ne "BUILTIN\\Administrators") { $_.FullName }\n}', description: "Encontra arquivos com owner não-admin" },
    ],
    whenNotToUse: [
      "Para permissões de compartilhamento de rede (share permissions) — use Get-SmbShare e Set-SmbShare",
      "Em sistemas Linux/Mac — use chmod/chown; Get-Acl não se aplica",
    ],
    relatedCommands: ["get-item", "icacls"],
    flags: [
      { flag: "-Path <string[]>",        description: "Caminho do recurso" },
      { flag: "-AclObject <ObjectSecurity>", description: "Objeto ACL a aplicar (obtido de Get-Acl)" },
      { flag: "-Exclude <string[]>",     description: "Exclui itens por padrão" },
    ],
    curiosities: [
      "Get-Acl também funciona com chaves de registro: Get-Acl 'HKLM:\\Software\\Microsoft' — você pode auditar e modificar permissões do Registro da mesma forma que arquivos.",
    ],
  },
  {
    id: "convertto-securestring",
    name: "ConvertTo-SecureString / Get-Credential",
    description: "Cria strings seguras (SecureString) e credenciais PSCredential para uso em cmdlets sem expor senhas em texto.",
    syntax: 'ConvertTo-SecureString "senha" -AsPlainText -Force\nGet-Credential',
    category: "security",
    level: "intermediário",
    uses: [
      "Armazenar senhas de forma segura em scripts",
      "Passar credenciais para cmdlets remotos",
      "Solicitar credenciais ao usuário sem expor em logs",
    ],
    variations: [
      { command: "Get-Credential", description: "Abre prompt gráfico de usuário/senha" },
      { command: 'Get-Credential -UserName "DOMAIN\\user" -Message "Senha do AD:"', description: "Prompt com usuário pré-preenchido" },
      { command: '$senha = ConvertTo-SecureString "P@ss" -AsPlainText -Force\n$cred = New-Object PSCredential("user",$senha)', description: "Cria PSCredential programaticamente" },
      { command: '$cred.GetNetworkCredential().Password', description: "Extrai senha (usar com cuidado)" },
    ],
    examples: [
      { code: '$cred = Get-Credential\nInvoke-Command -ComputerName servidor01 -Credential $cred -ScriptBlock { hostname }', description: "Executa comando remoto com credenciais" },
      { code: '# Salvar credencial criptografada em arquivo (só funciona no mesmo usuário/máquina)\n$cred.Password | ConvertFrom-SecureString | Set-Content cred.txt\n# Recuperar:\n$senhaStr = Get-Content cred.txt | ConvertTo-SecureString\n$cred = New-Object PSCredential("user", $senhaStr)', description: "Persiste credencial localmente (criptografada por DPAPI)" },
      { code: 'Connect-MsolService -Credential (Get-Credential)', description: "Autentica no Office 365 interativamente" },
    ],
    whenNotToUse: [
      "-AsPlainText -Force em scripts de produção expõe a senha no código-fonte — prefira ler de variáveis de ambiente ou vaults (Azure Key Vault, HashiCorp Vault)",
      "ConvertFrom-SecureString usa DPAPI — o arquivo criptografado só funciona no mesmo usuário e máquina onde foi criado",
    ],
    relatedCommands: ["invoke-command", "enter-pssession"],
    flags: [
      { flag: "-AsPlainText", description: "Converte texto puro para SecureString (use com -Force)" },
      { flag: "-Force",       description: "Confirma que entende o risco de usar texto puro" },
    ],
    curiosities: [
      "SecureString no PowerShell não é 100% seguro — em memória, o valor pode ser recuperado por ferramentas de dump. O objetivo é evitar que a senha apareça em logs, histórico e outputs acidentalmente.",
    ],
  },

  /* ─── REGISTRO ───────────────────────────────────────────────────── */
  {
    id: "registry-access",
    name: "Get-Item / Set-ItemProperty (Registro)",
    description: "Lê e modifica chaves e valores do Registro do Windows usando os drives HKLM: e HKCU:.",
    syntax: "Get-Item 'HKLM:\\Software\\caminho'\nSet-ItemProperty -Path 'HKCU:\\...' -Name 'valor' -Value 'dado'",
    category: "registry",
    level: "avançado",
    uses: [
      "Ler configurações de aplicações no Registro",
      "Criar ou modificar entradas de configuração",
      "Verificar programas instalados via Uninstall keys",
      "Automatizar configurações pós-instalação",
    ],
    variations: [
      { command: "Get-ChildItem HKLM:\\Software", description: "Lista subchaves de Software" },
      { command: "Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion", description: "Lê valores de uma chave" },
      { command: "New-ItemProperty -Path 'HKCU:\\Software\\MeuApp' -Name 'Versao' -Value '1.0' -PropertyType String", description: "Cria novo valor no registro" },
      { command: "Remove-ItemProperty -Path 'HKCU:\\Software\\MeuApp' -Name 'ConfigAntiga'", description: "Remove valor do registro" },
    ],
    examples: [
      { code: 'Get-ChildItem "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall" |\n  Get-ItemProperty |\n  Where-Object { $_.DisplayName -like "*Chrome*" } |\n  Select-Object DisplayName, DisplayVersion', description: "Verifica versão do Chrome pelo Registro" },
      { code: 'Set-ItemProperty -Path "HKCU:\\Software\\MyApp" -Name "Theme" -Value "dark"\nGet-ItemPropertyValue -Path "HKCU:\\Software\\MyApp" -Name "Theme"', description: "Salva e lê preferência no Registro" },
      { code: '$uninstallPath = "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall"\nGet-ChildItem $uninstallPath | Get-ItemProperty |\n  Where-Object { $_.DisplayName } |\n  Select-Object DisplayName, DisplayVersion, Publisher |\n  Sort-Object DisplayName | Export-Csv apps.csv -NoTypeInformation', description: "Exporta lista de programas instalados" },
    ],
    whenNotToUse: [
      "Para configurações de aplicações modernas (UWP) — use Get-AppxPackage e APIs WinRT",
      "Modificar HKLM: requer privilégios de administrador",
    ],
    relatedCommands: ["get-item", "get-acl"],
    flags: [
      { flag: "-Path <string>",          description: "Caminho no registro: HKLM:, HKCU:, HKCR:, HKCC:, HKU:" },
      { flag: "-Name <string>",          description: "Nome do valor do registro" },
      { flag: "-Value <Object>",         description: "Dado a armazenar" },
      { flag: "-PropertyType <string>",  description: "Tipo: String, DWord, QWord, Binary, ExpandString, MultiString" },
      { flag: "-Force",                  description: "Cria subchaves intermediárias se necessário" },
    ],
    curiosities: [
      "O PowerShell expõe o Registro como um sistema de arquivos com drives HKLM: e HKCU:. Você pode usar cd HKLM:\\Software, Get-ChildItem e até Tab-completion para navegar no Registro como se fosse uma pasta.",
    ],
  },

  /* ─── REMOTING ───────────────────────────────────────────────────── */
  {
    id: "invoke-command",
    name: "Invoke-Command",
    description: "Executa comandos em uma ou mais máquinas remotas simultaneamente.",
    syntax: "Invoke-Command -ComputerName <string[]> -ScriptBlock <ScriptBlock> [-Credential <PSCredential>]",
    category: "remoting",
    level: "avançado",
    uses: [
      "Executar scripts em múltiplos servidores",
      "Coletar informações de máquinas remotas",
      "Automatizar configurações em frota de servidores",
      "Executar tarefas de manutenção remotamente",
    ],
    variations: [
      { command: "Invoke-Command -ComputerName servidor01 -ScriptBlock { Get-Process }", description: "Executa em servidor remoto" },
      { command: "Invoke-Command -ComputerName s1,s2,s3 -ScriptBlock { hostname }", description: "Executa em múltiplos servidores" },
      { command: "Invoke-Command -ComputerName s1 -FilePath C:\\scripts\\configurar.ps1", description: "Executa arquivo de script remoto" },
      { command: "icm servidor01 { Get-Service }", description: "Alias icm disponível" },
    ],
    examples: [
      { code: '$servidores = "web01","web02","web03"\nInvoke-Command -ComputerName $servidores -ScriptBlock {\n  [PSCustomObject]@{\n    Servidor = $env:COMPUTERNAME\n    CPU_Livre = (Get-Counter "\\Processor(_Total)\\% Idle Time").CounterSamples.CookedValue\n    RAM_Livre_GB = [math]::Round((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1MB,1)\n  }\n}', description: "Coleta métricas de múltiplos servidores" },
      { code: 'Invoke-Command -ComputerName servidor01 -ScriptBlock {\n  param($pasta)\n  Get-ChildItem $pasta -Recurse | Measure-Object Length -Sum\n} -ArgumentList "C:\\dados"', description: "Passa argumentos para o ScriptBlock remoto" },
      { code: 'Invoke-Command -ComputerName db01 -ScriptBlock { Restart-Service -Name "MSSQLSERVER" -Force }\n-Credential (Get-Credential "DOMAIN\\DBAAdmin")', description: "Reinicia serviço remoto com credenciais específicas" },
    ],
    whenNotToUse: [
      "Para sessão interativa — use Enter-PSSession",
      "Requer WinRM habilitado na máquina remota (Enable-PSRemoting)",
      "Em redes sem domínio, precisa configurar TrustedHosts",
    ],
    relatedCommands: ["enter-pssession", "convertto-securestring"],
    flags: [
      { flag: "-ComputerName <string[]>", description: "Máquina(s) remota(s)" },
      { flag: "-ScriptBlock <ScriptBlock>",description: "Bloco de código a executar remotamente" },
      { flag: "-FilePath <string>",       description: "Script .ps1 local a executar na máquina remota" },
      { flag: "-Credential <PSCredential>",description: "Credenciais para autenticação" },
      { flag: "-ArgumentList <Object[]>", description: "Argumentos passados para o ScriptBlock via param()" },
      { flag: "-Session <PSSession[]>",   description: "Reutiliza sessão existente (mais eficiente para múltiplos comandos)" },
      { flag: "-AsJob",                   description: "Executa em background como job" },
    ],
    curiosities: [
      "Invoke-Command executa em múltiplos computadores em paralelo por padrão (ThrottleLimit 32). Para 10 servidores, o tempo total é aproximadamente o tempo de 1 servidor — não 10x.",
    ],
  },
  {
    id: "enter-pssession",
    name: "Enter-PSSession / New-PSSession",
    description: "Abre uma sessão interativa com uma máquina remota ou cria sessões reutilizáveis.",
    syntax: "Enter-PSSession [-ComputerName] <string> [-Credential <PSCredential>]\nNew-PSSession -ComputerName <string[]>",
    category: "remoting",
    level: "avançado",
    uses: [
      "Administrar servidor remoto interativamente",
      "Debugar problemas em máquinas remotas",
      "Criar sessões persistentes para múltiplos comandos",
      "Explorar configuração de servidores sem RDP",
    ],
    variations: [
      { command: "Enter-PSSession servidor01", description: "Sessão interativa no servidor" },
      { command: "Enter-PSSession servidor01 -Credential (Get-Credential)", description: "Com prompt de credenciais" },
      { command: "$s = New-PSSession -ComputerName web01,web02", description: "Cria sessões persistentes" },
      { command: "Invoke-Command -Session $s -ScriptBlock { ... }", description: "Reusa sessão existente" },
      { command: "Exit-PSSession", description: "Encerra sessão interativa" },
      { command: "Remove-PSSession $s", description: "Fecha sessões criadas com New-PSSession" },
    ],
    examples: [
      { code: '# Sessão interativa — o prompt muda para [servidor01]:\nEnter-PSSession servidor01\n# Agora você está no servidor remoto\nGet-Service | Where-Object Status -eq "Stopped"\nExit-PSSession', description: "Administração interativa remota" },
      { code: '$sessoes = New-PSSession -ComputerName web01,web02,web03\nInvoke-Command -Session $sessoes -ScriptBlock { iisreset /noforce }\nRemove-PSSession $sessoes', description: "Reinicia IIS em múltiplos servidores via sessão reutilizada" },
      { code: '# PS7+ suporta SSH como transporte (sem WinRM)\nEnter-PSSession servidor-linux -HostName usuario@192.168.1.50 -SSHTransport', description: "Sessão remota via SSH (PS7+, funciona em Linux/Mac)" },
    ],
    whenNotToUse: [
      "Para execução em lote em muitas máquinas — use Invoke-Command que é mais eficiente",
      "Enter-PSSession é bloqueante — para automação use Invoke-Command -AsJob",
    ],
    relatedCommands: ["invoke-command", "test-wsman"],
    flags: [
      { flag: "-ComputerName <string>",   description: "Máquina remota (DNS ou IP)" },
      { flag: "-Credential <PSCredential>",description: "Credenciais de autenticação" },
      { flag: "-Port <int>",              description: "Porta WinRM (padrão: 5985 HTTP, 5986 HTTPS)" },
      { flag: "-UseSSL",                  description: "Usa HTTPS (porta 5986) em vez de HTTP" },
      { flag: "-HostName <string>",       description: "Para transporte SSH (PS7+)" },
      { flag: "-SSHTransport",            description: "Usa SSH em vez de WinRM (PS7+)" },
    ],
    curiosities: [
      "PowerShell 7 introduziu suporte a SSH como transporte alternativo ao WinRM — isso permite gerenciar Linux, Mac e Windows usando o mesmo Invoke-Command e Enter-PSSession sem configurar WinRM.",
    ],
  },
];

export function getShellCommandsByCategory(category: string): ShellCommand[] {
  return shellCommands.filter((c) => c.category === category);
}

export function getShellCommandById(id: string): ShellCommand | undefined {
  return shellCommands.find((c) => c.id === id);
}
