export interface ScenarioAnatomyPart {
  part: string;
  explanation: string;
}

export interface Scenario {
  id: string;
  title: string;
  goal: string;
  commands: string[];
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  anatomy?: ScenarioAnatomyPart[];
}

export const scenarioDifficultyLabels: Record<string, string> = {
  easy:   "Fácil",
  medium: "Médio",
  hard:   "Difícil",
};

export const scenarios: Scenario[] = [
  {
    id: "find-large-files",
    title: "Encontrar os arquivos mais pesados do sistema",
    goal: "Listar os 10 maiores arquivos em um diretório (e subdiretórios) em ordem decrescente de tamanho.",
    commands: [
      "Get-ChildItem -Path C:\\Users -Recurse -File -ErrorAction SilentlyContinue",
      "  | Sort-Object Length -Descending",
      "  | Select-Object -First 10 FullName, @{N='MB';E={[math]::Round($_.Length/1MB,2)}}",
    ],
    tags: ["arquivos", "disco", "Get-ChildItem", "Sort-Object", "Select-Object"],
    difficulty: "easy",
    anatomy: [
      { part: "Get-ChildItem -Path C:\\Users", explanation: "lista todo o conteúdo dentro de C:\\Users" },
      { part: "-Recurse", explanation: "entra em todas as subpastas recursivamente" },
      { part: "-File", explanation: "retorna apenas arquivos, ignorando diretórios" },
      { part: "-ErrorAction SilentlyContinue", explanation: "ignora erros de acesso negado sem interromper" },
      { part: "Sort-Object Length -Descending", explanation: "ordena pelo tamanho em bytes, do maior para o menor" },
      { part: "Select-Object -First 10", explanation: "mantém apenas os 10 primeiros resultados" },
      { part: "FullName, @{N='MB';E={...}}", explanation: "seleciona o caminho completo e cria coluna 'MB' convertendo bytes para megabytes" },
    ],
  },
  {
    id: "bulk-rename",
    title: "Renomear arquivos em lote com padrão",
    goal: "Substituir parte do nome de todos os arquivos .txt em uma pasta — ex: trocar 'relatorio_' por 'report_' em todos os arquivos.",
    commands: [
      "Get-ChildItem -Path .\\pasta -Filter 'relatorio_*.txt'",
      "  | Rename-Item -NewName { $_.Name -replace 'relatorio_', 'report_' }",
    ],
    tags: ["arquivos", "rename", "Get-ChildItem", "Rename-Item"],
    difficulty: "easy",
    anatomy: [
      { part: "Get-ChildItem -Path .\\pasta", explanation: "lista o conteúdo da pasta 'pasta' no diretório atual" },
      { part: "-Filter 'relatorio_*.txt'", explanation: "filtra na fonte: só arquivos que começam com 'relatorio_' e terminam em '.txt'" },
      { part: "Rename-Item -NewName { ... }", explanation: "renomeia cada arquivo; o bloco { } recebe o objeto do arquivo atual" },
      { part: "$_.Name", explanation: "$_ é o arquivo atual no pipeline; .Name é só o nome com extensão" },
      { part: "-replace 'relatorio_', 'report_'", explanation: "substitui a primeira ocorrência de 'relatorio_' por 'report_' usando regex" },
    ],
  },
  {
    id: "monitor-log-realtime",
    title: "Monitorar um arquivo de log em tempo real",
    goal: "Exibir novas linhas de um log à medida que são escritas, filtrando apenas erros e avisos.",
    commands: [
      "Get-Content -Path C:\\app\\logs\\app.log -Wait -Tail 20",
      "  | Where-Object { $_ -match 'ERROR|WARNING' }",
    ],
    tags: ["log", "monitoramento", "Get-Content", "Where-Object"],
    difficulty: "easy",
    anatomy: [
      { part: "Get-Content -Path C:\\app\\logs\\app.log", explanation: "lê o conteúdo do arquivo de log linha por linha" },
      { part: "-Wait", explanation: "mantém o arquivo aberto e aguarda novas linhas — equivalente ao tail -f do Linux" },
      { part: "-Tail 20", explanation: "começa exibindo as últimas 20 linhas já existentes antes de monitorar" },
      { part: "Where-Object { $_ -match 'ERROR|WARNING' }", explanation: "filtra cada linha: só passa quem contiver 'ERROR' ou 'WARNING' (regex com |)" },
      { part: "$_ -match", explanation: "$_ é a linha atual; -match testa contra expressão regular, retornando $true ou $false" },
    ],
  },
  {
    id: "process-csv",
    title: "Processar e filtrar dados de um CSV",
    goal: "Ler um arquivo CSV, filtrar linhas por condição, calcular um campo derivado e exportar o resultado filtrado.",
    commands: [
      "Import-Csv vendas.csv",
      "  | Where-Object { [int]$_.Valor -gt 1000 }",
      "  | Select-Object Nome, Regiao, @{N='ValorComImposto';E={[int]$_.Valor * 1.15}}",
      "  | Export-Csv resultado.csv -NoTypeInformation -Encoding UTF8",
    ],
    tags: ["csv", "dados", "Import-Csv", "Export-Csv", "Where-Object"],
    difficulty: "medium",
    anatomy: [
      { part: "Import-Csv vendas.csv", explanation: "lê o CSV e transforma cada linha em um objeto com as colunas como propriedades" },
      { part: "Where-Object { [int]$_.Valor -gt 1000 }", explanation: "filtra linhas onde o campo 'Valor' seja maior que 1000; [int] converte string para número" },
      { part: "Select-Object Nome, Regiao", explanation: "mantém apenas as colunas Nome e Regiao de cada objeto" },
      { part: "@{N='ValorComImposto';E={[int]$_.Valor * 1.15}}", explanation: "propriedade calculada: cria coluna nova 'ValorComImposto' multiplicando Valor por 1,15" },
      { part: "Export-Csv resultado.csv", explanation: "grava os objetos do pipeline de volta em formato CSV" },
      { part: "-NoTypeInformation", explanation: "remove a linha '#TYPE ...' que o PowerShell adiciona por padrão no topo do CSV" },
    ],
  },
  {
    id: "kill-high-cpu",
    title: "Encerrar processos consumindo muita CPU",
    goal: "Identificar todos os processos usando mais de 30% de CPU e encerrá-los após confirmação.",
    commands: [
      "Get-Process | Where-Object { $_.CPU -gt 30 } | Select-Object Name, Id, CPU",
      "# Revise a lista acima antes de encerrar",
      "Get-Process | Where-Object { $_.CPU -gt 30 } | Stop-Process -WhatIf",
      "# Remova -WhatIf para executar de verdade",
    ],
    tags: ["processos", "cpu", "Get-Process", "Stop-Process", "Where-Object"],
    difficulty: "medium",
    anatomy: [
      { part: "Get-Process", explanation: "lista todos os processos em execução com suas propriedades (CPU, RAM, PID...)" },
      { part: "Where-Object { $_.CPU -gt 30 }", explanation: "filtra processos com tempo de CPU acumulado maior que 30 segundos" },
      { part: "Select-Object Name, Id, CPU", explanation: "projeta só as colunas relevantes para revisão: nome, PID e CPU" },
      { part: "Stop-Process", explanation: "encerra o processo; por padrão envia sinal de encerramento gracioso" },
      { part: "-WhatIf", explanation: "simula a operação sem executar — mostra o que seria feito; remova para encerrar de verdade" },
    ],
  },
  {
    id: "backup-with-timestamp",
    title: "Criar backup automático com timestamp",
    goal: "Compactar uma pasta inteira em um ZIP com data e hora no nome, salvando em uma pasta de backups.",
    commands: [
      '$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"',
      '$dest = "C:\\Backups\\projeto_$timestamp.zip"',
      "Compress-Archive -Path C:\\projeto -DestinationPath $dest -CompressionLevel Optimal",
      "Write-Host \"Backup salvo em: $dest\"",
    ],
    tags: ["backup", "zip", "Compress-Archive", "Get-Date"],
    difficulty: "easy",
    anatomy: [
      { part: "Get-Date -Format \"yyyyMMdd_HHmmss\"", explanation: "retorna a data/hora atual formatada como string — ex: 20240615_143022" },
      { part: "$timestamp / $dest", explanation: "variáveis que armazenam o timestamp e o caminho completo do ZIP" },
      { part: "\"C:\\Backups\\projeto_$timestamp.zip\"", explanation: "interpolação de string: o PowerShell substitui $timestamp pelo valor da variável" },
      { part: "Compress-Archive -Path C:\\projeto", explanation: "compacta todo o conteúdo da pasta C:\\projeto" },
      { part: "-DestinationPath $dest", explanation: "define onde salvar o ZIP, usando o caminho com timestamp gerado acima" },
      { part: "-CompressionLevel Optimal", explanation: "usa compressão máxima (mais lento, arquivo menor); alternativas: Fastest, NoCompression" },
    ],
  },
  {
    id: "search-text-in-files",
    title: "Buscar texto em múltiplos arquivos recursivamente",
    goal: "Encontrar todos os arquivos .ps1 e .txt que contêm uma palavra-chave, exibindo arquivo, número da linha e a linha completa.",
    commands: [
      "Select-String -Path C:\\scripts\\*.ps1, C:\\docs\\*.txt -Pattern 'TODO|FIXME' -Recurse",
      "  | Select-Object Filename, LineNumber, Line",
      "  | Format-Table -AutoSize",
    ],
    tags: ["busca", "texto", "Select-String", "Format-Table"],
    difficulty: "easy",
    anatomy: [
      { part: "Select-String -Path C:\\scripts\\*.ps1, C:\\docs\\*.txt", explanation: "busca em múltiplos padrões de caminho separados por vírgula" },
      { part: "-Pattern 'TODO|FIXME'", explanation: "expressão regular: encontra linhas com 'TODO' ou 'FIXME' (| = ou)" },
      { part: "-Recurse", explanation: "busca também nos subdiretórios de cada caminho especificado" },
      { part: "Select-Object Filename, LineNumber, Line", explanation: "extrai os campos úteis do objeto MatchInfo: nome do arquivo, número e conteúdo da linha" },
      { part: "Format-Table -AutoSize", explanation: "exibe como tabela ajustando a largura das colunas ao conteúdo" },
    ],
  },
  {
    id: "consume-rest-api",
    title: "Consumir uma API REST e processar resposta JSON",
    goal: "Fazer uma chamada GET a uma API, parsear o JSON retornado e extrair campos específicos em uma tabela.",
    commands: [
      '$response = Invoke-RestMethod -Uri "https://jsonplaceholder.typicode.com/users" -Method GET',
      '$response | Select-Object name, email, @{N="Cidade";E={$_.address.city}}',
      "  | Format-Table -AutoSize",
    ],
    tags: ["api", "json", "http", "Invoke-RestMethod", "Select-Object"],
    difficulty: "medium",
    anatomy: [
      { part: "Invoke-RestMethod", explanation: "faz a requisição HTTP e já converte o JSON da resposta em objeto PowerShell automaticamente" },
      { part: "-Uri \"https://...\"", explanation: "endereço da API; suporta GET, POST, PUT, DELETE via -Method" },
      { part: "-Method GET", explanation: "verbo HTTP; GET é padrão, mas é boa prática declarar explicitamente" },
      { part: "$response", explanation: "variável que armazena o array de objetos retornado pela API" },
      { part: "Select-Object name, email", explanation: "seleciona as propriedades de nível superior do objeto JSON" },
      { part: "@{N=\"Cidade\";E={$_.address.city}}", explanation: "propriedade calculada que acessa o campo aninhado address.city do JSON" },
    ],
  },
  {
    id: "disk-usage-report",
    title: "Gerar relatório de uso de disco por pasta",
    goal: "Calcular o tamanho total de cada subpasta de um diretório e ordenar da maior para a menor, em MB.",
    commands: [
      "Get-ChildItem -Path C:\\Users -Directory",
      "  | ForEach-Object {",
      "      $size = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum",
      "      [PSCustomObject]@{ Pasta=$_.Name; 'Tamanho(MB)'=[math]::Round($size/1MB,1) }",
      "  }",
      "  | Sort-Object 'Tamanho(MB)' -Descending",
      "  | Format-Table -AutoSize",
    ],
    tags: ["disco", "relatório", "Get-ChildItem", "Measure-Object", "ForEach-Object"],
    difficulty: "hard",
    anatomy: [
      { part: "Get-ChildItem -Path C:\\Users -Directory", explanation: "lista apenas subdiretórios imediatos de C:\\Users (sem recursão ainda)" },
      { part: "ForEach-Object { ... }", explanation: "executa o bloco para cada pasta, com $_ representando a pasta atual" },
      { part: "Get-ChildItem $_.FullName -Recurse -File", explanation: "dentro de cada pasta, lista todos os arquivos recursivamente" },
      { part: "Measure-Object Length -Sum", explanation: "soma os tamanhos (.Length em bytes) de todos os arquivos encontrados" },
      { part: ".Sum", explanation: "acessa a propriedade Sum do resultado do Measure-Object" },
      { part: "[PSCustomObject]@{ ... }", explanation: "cria um objeto novo com as propriedades que queremos exibir: Pasta e Tamanho" },
      { part: "[math]::Round($size/1MB,1)", explanation: "divide bytes por 1MB (constante do PowerShell) e arredonda para 1 decimal" },
    ],
  },
  {
    id: "parallel-ping",
    title: "Testar conectividade de múltiplos hosts em paralelo",
    goal: "Pingar uma lista de servidores simultaneamente e gerar um relatório de disponibilidade com latência.",
    commands: [
      '$hosts = @("google.com", "8.8.8.8", "192.168.1.1", "github.com")',
      '$hosts | ForEach-Object -Parallel {',
      "  $result = Test-Connection $_ -Count 2 -ErrorAction SilentlyContinue",
      "  [PSCustomObject]@{",
      "    Host    = $_",
      "    Online  = ($result -ne $null)",
      "    LatAvg  = if ($result) { [math]::Round(($result.Latency | Measure-Object -Average).Average,1) } else { 'N/A' }",
      "  }",
      "} -ThrottleLimit 4 | Sort-Object Host | Format-Table -AutoSize",
    ],
    tags: ["rede", "ping", "paralelo", "Test-Connection", "ForEach-Object"],
    difficulty: "hard",
    anatomy: [
      { part: '@hosts = @("google.com", ...)', explanation: "array de hosts para testar; @() é a sintaxe de array literal do PowerShell" },
      { part: "ForEach-Object -Parallel { ... }", explanation: "executa o bloco em threads paralelas (PowerShell 7+), processando múltiplos hosts ao mesmo tempo" },
      { part: "-ThrottleLimit 4", explanation: "limita a 4 threads simultâneas para não sobrecarregar a rede ou o sistema" },
      { part: "Test-Connection $_ -Count 2", explanation: "pinga o host atual ($_ no contexto paralelo) enviando 2 pacotes ICMP" },
      { part: "-ErrorAction SilentlyContinue", explanation: "hosts inacessíveis retornam $null em vez de lançar erro" },
      { part: "($result -ne $null)", explanation: "expressão booleana: $true se o ping retornou resultado, $false se o host não respondeu" },
      { part: "$result.Latency | Measure-Object -Average", explanation: "calcula a média de latência dos pacotes recebidos usando o pipeline" },
    ],
  },
];
