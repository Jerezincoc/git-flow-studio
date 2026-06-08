export interface ShellProblemStep {
  title: string;
  code?: string;
  description: string;
}

export interface ShellProblem {
  id: string;
  title: string;
  symptom: string;
  cause: string;
  category: "permissions" | "execution" | "pipeline" | "modules" | "encoding" | "paths" | "errors";
  difficulty: "easy" | "medium" | "hard";
  steps: ShellProblemStep[];
  prevention?: string;
  relatedCommands: string[];
}

export const shellProblemCategoryLabels: Record<string, string> = {
  permissions: "Permissões",
  execution:   "Execução",
  pipeline:    "Pipeline",
  modules:     "Módulos",
  encoding:    "Encoding",
  paths:       "Caminhos",
  errors:      "Erros",
};

export const shellProblems: ShellProblem[] = [
  {
    id: "execution-policy-blocked",
    title: "Script bloqueado pela ExecutionPolicy",
    symptom: "Ao tentar executar um .ps1, aparece: \"execution of scripts is disabled on this system\" ou \"não pode ser carregado porque a execução de scripts está desabilitada\".",
    cause: "A política de execução padrão do Windows bloqueia scripts não assinados para proteger contra execução acidental de código malicioso.",
    category: "execution",
    difficulty: "easy",
    steps: [
      {
        title: "Verifique a política atual",
        code: "Get-ExecutionPolicy -List",
        description: "Mostra a política em cada escopo (MachinePolicy, UserPolicy, Process, CurrentUser, LocalMachine). O escopo mais restritivo prevalece.",
      },
      {
        title: "Libere para o usuário atual",
        code: "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser",
        description: "RemoteSigned: scripts locais executam livremente; scripts baixados da internet precisam de assinatura digital. Escopo CurrentUser não requer admin.",
      },
      {
        title: "Confirme a mudança",
        code: 'Get-ExecutionPolicy -Scope CurrentUser\n# Deve retornar: RemoteSigned',
        description: "Execute novamente o seu script .ps1.",
      },
    ],
    prevention: "Para CI/CD ou ambientes controlados, prefira -Scope Process (temporário, válido só para a sessão atual) em vez de alterar o escopo CurrentUser permanentemente.",
    relatedCommands: ["Get-ExecutionPolicy", "Set-ExecutionPolicy"],
  },
  {
    id: "access-denied-file",
    title: "Acesso negado ao arquivo ou diretório",
    symptom: "\"Access to the path '...' is denied\" ou \"UnauthorizedAccessException\" ao tentar ler, escrever ou deletar um arquivo.",
    cause: "O processo do PowerShell não tem as permissões NTFS necessárias, ou o arquivo está em uso por outro processo.",
    category: "permissions",
    difficulty: "medium",
    steps: [
      {
        title: "Verifique quem está usando o arquivo",
        code: 'Get-Process | Where-Object { $_.Modules.FileName -like "*nome-do-arquivo*" }',
        description: "Identifica processos que têm o arquivo aberto. Se vazio, o problema é de permissão NTFS.",
      },
      {
        title: "Verifique as permissões do arquivo",
        code: 'Get-Acl "C:\\caminho\\arquivo.txt" | Format-List',
        description: "Lista o owner e as ACLs (Access Control Entries) do arquivo.",
      },
      {
        title: "Execute o PowerShell como Administrador",
        code: 'Start-Process pwsh -Verb RunAs',
        description: "Para arquivos de sistema ou em pastas protegidas, pode ser necessário privilégios de admin.",
      },
      {
        title: "Tome posse do arquivo (último recurso)",
        code: 'takeown /F "C:\\caminho\\arquivo.txt"\nicacls "C:\\caminho\\arquivo.txt" /grant "$env:USERNAME:F"',
        description: "Transfere a propriedade do arquivo para o usuário atual e concede controle total.",
      },
    ],
    prevention: "Evite editar arquivos em System32 ou Program Files diretamente. Prefira copiar para um diretório do usuário, editar, e substituir com permissões de admin.",
    relatedCommands: ["Get-Acl", "Set-Acl"],
  },
  {
    id: "command-not-recognized",
    title: "Comando não reconhecido (CommandNotFoundException)",
    symptom: "\"The term 'nome-comando' is not recognized as a name of a cmdlet, function, script file, or executable program.\"",
    cause: "O comando não está instalado, o módulo não foi importado, ou o executável não está no PATH.",
    category: "execution",
    difficulty: "easy",
    steps: [
      {
        title: "Verifique se o comando existe",
        code: 'Get-Command nome-comando -ErrorAction SilentlyContinue',
        description: "Se não retornar nada, o comando realmente não está disponível.",
      },
      {
        title: "Busque em todos os módulos disponíveis",
        code: 'Find-Command -Name "*nome*"',
        description: "Busca em módulos instalados e na PSGallery. Requer conexão com internet.",
      },
      {
        title: "Verifique e corrija o PATH",
        code: '$env:PATH -split ";"',
        description: "Lista todos os diretórios no PATH. Se o executável está num diretório ausente, adicione-o.",
      },
      {
        title: "Adicione um diretório ao PATH (sessão atual)",
        code: '$env:PATH += ";C:\\novo\\caminho"',
        description: "Temporário. Para persistir, edite as variáveis de ambiente do sistema.",
      },
      {
        title: "Importe o módulo correto",
        code: 'Import-Module NomeDoModulo',
        description: "Se o comando pertence a um módulo específico que não carrega automaticamente.",
      },
    ],
    relatedCommands: ["Get-Command", "Import-Module", "Find-Module"],
  },
  {
    id: "pipeline-object-unexpected",
    title: "Pipeline retorna objetos em vez de texto",
    symptom: "Ao usar o resultado de um cmdlet em uma string ou ao comparar valores, o PowerShell mostra o tipo do objeto (ex: `System.Object[]`) em vez do valor esperado.",
    cause: "PowerShell passa objetos pelo pipeline, não texto. Comparações e interpolações precisam acessar a propriedade correta do objeto.",
    category: "pipeline",
    difficulty: "medium",
    steps: [
      {
        title: "Inspecione o objeto com Get-Member",
        code: 'Get-Process | Get-Member',
        description: "Mostra todas as propriedades e métodos do objeto retornado. Use para descobrir o nome correto da propriedade.",
      },
      {
        title: "Acesse a propriedade correta",
        code: '# Errado: imprime o objeto inteiro\n$resultado = Get-Date\nWrite-Host "Data: $resultado"\n\n# Certo: acessa a propriedade\nWrite-Host "Data: $($resultado.ToShortDateString())"',
        description: "Dentro de strings com aspas duplas, use $() para expandir expressões e acessar propriedades.",
      },
      {
        title: "Converta para string quando necessário",
        code: '$version = $PSVersionTable.PSVersion.ToString()\nWrite-Host "Versão: $version"',
        description: "Use .ToString() para converter objetos em representação de texto.",
      },
      {
        title: "Use Select-Object -ExpandProperty para extrair um valor",
        code: '$nome = Get-Process | Select-Object -First 1 | Select-Object -ExpandProperty Name\n# Ou mais simples:\n$nome = (Get-Process | Select-Object -First 1).Name',
        description: "ExpandProperty retorna o valor da propriedade, não um objeto PSCustomObject com a propriedade.",
      },
    ],
    relatedCommands: ["Get-Member", "Select-Object", "ForEach-Object"],
  },
  {
    id: "module-not-installed",
    title: "Módulo não encontrado (ModuleNotFoundError)",
    symptom: "\"The specified module was not loaded because no valid module file was found\" ou Import-Module falha.",
    cause: "O módulo não está instalado no sistema ou não está nos caminhos procurados pelo PowerShell ($env:PSModulePath).",
    category: "modules",
    difficulty: "easy",
    steps: [
      {
        title: "Verifique se o módulo está instalado",
        code: 'Get-Module -ListAvailable -Name NomeDoModulo',
        description: "Lista módulos disponíveis sem importá-los. Se vazio, precisa instalar.",
      },
      {
        title: "Instale o módulo pela PSGallery",
        code: 'Install-Module -Name NomeDoModulo -Scope CurrentUser',
        description: "Instala sem precisar de admin (CurrentUser). Para todos os usuários, remova -Scope e execute como admin.",
      },
      {
        title: "Verifique os caminhos de módulo",
        code: '$env:PSModulePath -split ";"',
        description: "Se o módulo foi instalado manualmente, verifique se está num desses diretórios.",
      },
      {
        title: "Force a reimportação",
        code: 'Import-Module NomeDoModulo -Force',
        description: "-Force recarrega o módulo mesmo que já esteja importado. Útil durante desenvolvimento.",
      },
    ],
    prevention: "Adicione os módulos necessários no seu $PROFILE para que sejam importados automaticamente em cada sessão.",
    relatedCommands: ["Get-Module", "Import-Module", "Install-Module", "Find-Module"],
  },
  {
    id: "encoding-utf8-bom",
    title: "Caracteres especiais aparecem corrompidos (encoding)",
    symptom: "Acentos, cedilha ou outros caracteres aparecem como `?` ou sequências estranhas ao ler arquivos ou exibir no terminal.",
    cause: "Incompatibilidade de encoding entre o arquivo, o terminal e o PowerShell. PS 5.1 usa UTF-16 LE por padrão; PS 7+ usa UTF-8.",
    category: "encoding",
    difficulty: "medium",
    steps: [
      {
        title: "Verifique o encoding atual do terminal",
        code: '[Console]::OutputEncoding\n[Console]::InputEncoding',
        description: "Mostra o encoding atual do console. Idealmente deve ser UTF-8 (Codepage 65001).",
      },
      {
        title: "Force UTF-8 na sessão",
        code: '[Console]::OutputEncoding = [System.Text.Encoding]::UTF8\n$OutputEncoding = [System.Text.Encoding]::UTF8',
        description: "Define o encoding de saída para UTF-8 na sessão atual.",
      },
      {
        title: "Especifique encoding ao ler/escrever arquivos",
        code: '# Ler\nGet-Content "arquivo.txt" -Encoding UTF8\n\n# Escrever sem BOM\n$content | Out-File "saida.txt" -Encoding UTF8NoBOM',
        description: "Sempre especifique o encoding explicitamente para operações de arquivo quando o conteúdo tem caracteres especiais.",
      },
      {
        title: "Adicione ao perfil para persistir",
        code: '# Adicione no $PROFILE:\n[Console]::OutputEncoding = [System.Text.Encoding]::UTF8',
        description: "Garante que UTF-8 seja usado em todas as sessões.",
      },
    ],
    prevention: "No PS7+, o padrão é UTF-8. Migrar do PS5.1 para PS7+ geralmente resolve problemas de encoding sem configuração adicional.",
    relatedCommands: ["Get-Content", "Set-Content", "Out-File"],
  },
  {
    id: "path-spaces",
    title: "Caminho com espaços causa erro",
    symptom: "Comandos falham com erros como \"Cannot find path\" quando o caminho contém espaços, mesmo que o arquivo exista.",
    cause: "Caminhos com espaços sem aspas são interpretados como múltiplos argumentos pelo parser do PowerShell.",
    category: "paths",
    difficulty: "easy",
    steps: [
      {
        title: "Envolva o caminho em aspas",
        code: '# Errado\nGet-Item C:\\Meus Documentos\\arquivo.txt\n\n# Certo\nGet-Item "C:\\Meus Documentos\\arquivo.txt"',
        description: "Aspas duplas ou simples fazem o PowerShell tratar o caminho como um único argumento.",
      },
      {
        title: "Use variáveis para caminhos complexos",
        code: '$caminho = Join-Path $env:USERPROFILE "Documents\\meu arquivo.txt"\nGet-Item $caminho',
        description: "Join-Path constrói caminhos de forma segura, lidando automaticamente com separadores.",
      },
      {
        title: "Use o operador de chamada para executáveis",
        code: '& "C:\\Program Files\\App\\app.exe" --arg1 --arg2',
        description: "O operador & (call operator) permite executar caminhos com espaços como comandos.",
      },
    ],
    relatedCommands: ["Join-Path", "Split-Path", "Resolve-Path", "Get-Item"],
  },
  {
    id: "variable-scope-function",
    title: "Variável modificada dentro de função não persiste",
    symptom: "Uma variável modificada dentro de uma função não tem o valor atualizado fora dela, mesmo sem usar $local:.",
    cause: "PowerShell usa escopo de função por padrão: variáveis criadas ou modificadas dentro de uma função são locais a ela, não afetando o escopo pai.",
    category: "errors",
    difficulty: "medium",
    steps: [
      {
        title: "Entenda os escopos",
        code: '$x = 10\nfunction Teste { $x = 99 }\nTeste\nWrite-Host $x  # Ainda é 10',
        description: "A função cria uma cópia local de $x. O $x do escopo pai não é alterado.",
      },
      {
        title: "Use o escopo $script: ou $global:",
        code: '$x = 10\nfunction Teste { $script:x = 99 }\nTeste\nWrite-Host $x  # Agora é 99',
        description: "$script: acessa variáveis do escopo do script. $global: acessa o escopo global de toda a sessão.",
      },
      {
        title: "Retorne o valor (abordagem preferida)",
        code: 'function Calcular { param($n); return $n * 2 }\n$resultado = Calcular 5\nWrite-Host $resultado  # 10',
        description: "A abordagem mais limpa e testável: a função retorna o valor e o chamador o captura.",
      },
    ],
    prevention: "Prefira funções puras que retornam valores em vez de modificar variáveis externas. Facilita testes e evita efeitos colaterais inesperados.",
    relatedCommands: ["Get-Variable", "Set-Variable"],
  },
  {
    id: "foreach-slow-pipeline",
    title: "Loop foreach no pipeline é lento para grandes coleções",
    symptom: "Processar milhares de objetos com `ForEach-Object` no pipeline é muito lento comparado ao esperado.",
    cause: "ForEach-Object processa um objeto por vez pelo pipeline, com overhead de chamada de cmdlet. Para coleções em memória, o foreach statement é muito mais rápido.",
    category: "pipeline",
    difficulty: "medium",
    steps: [
      {
        title: "Compare os dois tipos de foreach",
        code: '# Pipeline (lento para grandes coleções)\n1..100000 | ForEach-Object { $_ * 2 }\n\n# Statement (rápido)\nforeach ($i in 1..100000) { $i * 2 }',
        description: "O foreach statement pode ser 10-20x mais rápido que ForEach-Object para coleções já em memória.",
      },
      {
        title: "Use ForEach-Object -Parallel (PS7+)",
        code: '1..1000 | ForEach-Object -Parallel {\n  Start-Sleep -Milliseconds 100\n  $_\n} -ThrottleLimit 10',
        description: "Para operações I/O-bound (rede, disco), -Parallel processa múltiplos itens simultaneamente. Não ajuda para CPU-bound.",
      },
      {
        title: "Colete resultados antes de processar",
        code: '$items = Get-ChildItem -Recurse  # Coleta tudo primeiro\nforeach ($item in $items) {\n  # Processa em memória\n}',
        description: "Se possível, colete todos os dados primeiro e processe em memória com foreach.",
      },
    ],
    relatedCommands: ["ForEach-Object", "Measure-Command", "Where-Object"],
  },
  {
    id: "error-silently-continue",
    title: "Erros sendo ignorados silenciosamente",
    symptom: "Um comando falha mas não mostra nenhuma mensagem de erro e o script continua executando, produzindo resultados inesperados.",
    cause: "$ErrorActionPreference está definido como 'SilentlyContinue' (padrão em alguns contextos) ou foi explicitamente definido assim.",
    category: "errors",
    difficulty: "medium",
    steps: [
      {
        title: "Verifique o ErrorActionPreference atual",
        code: '$ErrorActionPreference',
        description: "Se for 'SilentlyContinue', erros não terminantes serão ignorados silenciosamente.",
      },
      {
        title: "Mude para 'Stop' para debugging",
        code: '$ErrorActionPreference = "Stop"',
        description: "Com 'Stop', qualquer erro não terminante se torna um erro terminante e interrompe a execução.",
      },
      {
        title: "Use -ErrorAction por comando",
        code: '# Ignora erro esperado\nGet-Item "pode-nao-existir.txt" -ErrorAction SilentlyContinue\n\n# Força erro para ser tratado\nGet-Item "deve-existir.txt" -ErrorAction Stop',
        description: "Controle granular por cmdlet é mais seguro do que mudar o padrão global.",
      },
      {
        title: "Verifique $? após comandos críticos",
        code: 'Copy-Item origem.txt destino.txt -ErrorAction SilentlyContinue\nif (-not $?) {\n  Write-Error "Falha ao copiar arquivo"\n  exit 1\n}',
        description: "$? é $true se o último comando teve sucesso, $false se falhou.",
      },
    ],
    prevention: "Em scripts de produção, prefira $ErrorActionPreference = 'Stop' no início do script e use try/catch para erros esperados e recuperáveis.",
    relatedCommands: ["Get-Error", "Write-Error", "Throw"],
  },
];

export function getShellProblemById(id: string): ShellProblem | undefined {
  return shellProblems.find((p) => p.id === id);
}
