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
    | "network";
  uses: string[];
  variations: ShellVariation[];
  examples: ShellExample[];
  whenNotToUse: string[];
  relatedCommands: string[];
  deepDive?: string;
  flags?: ShellFlag[];
  curiosities?: string[];
}

export const shellCategoryLabels: Record<string, string> = {
  navigation: "Navegação",
  files:      "Arquivos",
  content:    "Conteúdo",
  pipeline:   "Pipeline",
  system:     "Sistema",
  network:    "Rede",
};

export const shellCommands: ShellCommand[] = [
  /* ─── NAVEGAÇÃO ──────────────────────────────────────────────────── */
  {
    id: "get-childitem",
    name: "Get-ChildItem",
    description: "Lista arquivos e pastas de um diretório. Equivalente ao ls no Linux e dir no CMD.",
    syntax: "Get-ChildItem [[-Path] <string>] [-Filter <string>] [-Recurse] [-Hidden] [-Force]",
    category: "navigation",
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
  },
  {
    id: "set-location",
    name: "Set-Location",
    description: "Muda o diretório de trabalho atual. Equivalente ao cd em todos os shells.",
    syntax: "Set-Location [[-Path] <string>]",
    category: "navigation",
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
  },
  {
    id: "get-item",
    name: "Get-Item",
    description: "Obtém o objeto que representa um arquivo, pasta, chave de registro ou outro item de um provedor.",
    syntax: "Get-Item [-Path] <string[]>",
    category: "navigation",
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
  },
  {
    id: "set-content",
    name: "Set-Content",
    description: "Escreve ou sobrescreve o conteúdo de um arquivo.",
    syntax: "Set-Content [-Path] <string[]> [-Value] <Object[]>",
    category: "content",
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
  },
  {
    id: "where-object",
    name: "Where-Object",
    description: "Filtra objetos no pipeline com base em uma condição. Equivalente ao filter/grep para objetos.",
    syntax: "Where-Object [-FilterScript] <ScriptBlock>",
    category: "pipeline",
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
  },
  {
    id: "foreach-object",
    name: "ForEach-Object",
    description: "Executa um bloco de código para cada objeto no pipeline.",
    syntax: "ForEach-Object [-Process] <ScriptBlock>",
    category: "pipeline",
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
  },
  {
    id: "sort-object",
    name: "Sort-Object",
    description: "Ordena objetos por uma ou mais propriedades.",
    syntax: "Sort-Object [[-Property] <Object[]>] [-Descending] [-Unique]",
    category: "pipeline",
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
];

export function getShellCommandsByCategory(category: string): ShellCommand[] {
  return shellCommands.filter((c) => c.category === category);
}

export function getShellCommandById(id: string): ShellCommand | undefined {
  return shellCommands.find((c) => c.id === id);
}
