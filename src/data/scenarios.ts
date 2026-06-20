export interface Scenario {
  id: string;
  title: string;
  goal: string;
  commands: string[];
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
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
  },
];
