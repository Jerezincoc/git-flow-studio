import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";
import { ChevronDown, ChevronUp, Folder, Wifi, Monitor, Zap, Shield } from "lucide-react";
import { SEO } from "@/components/SEO";

interface PlaybookCommand {
  code: string;
  description: string;
}

interface Playbook {
  id: string;
  title: string;
  objective: string;
  whenToUse: string;
  commands: PlaybookCommand[];
}

interface MissionCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  playbooks: Playbook[];
}

const missions: MissionCategory[] = [
  {
    id: "files",
    label: "Arquivos",
    icon: Folder,
    color: "text-yellow-400",
    playbooks: [
      {
        id: "find-and-act",
        title: "Encontrar e agir em arquivos por critério",
        objective: "Localizar arquivos por extensão, tamanho ou data e executar uma ação (copiar, deletar, compactar).",
        whenToUse: "Limpeza periódica de logs, backups seletivos, auditoria de arquivos antigos.",
        commands: [
          { code: "Get-ChildItem -Path C:\\dados -Recurse -Filter *.log\n  | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) }", description: "Localiza logs mais antigos que 30 dias" },
          { code: "... | Compress-Archive -DestinationPath C:\\backups\\logs_antigos.zip -Update", description: "Compacta os arquivos encontrados" },
          { code: "... | Remove-Item -Force", description: "Ou apaga diretamente (use -WhatIf primeiro para revisar)" },
        ],
      },
      {
        id: "bulk-process",
        title: "Processar conteúdo de múltiplos arquivos",
        objective: "Ler, transformar e salvar conteúdo em lote — substituição de texto, conversão de encoding, extração de dados.",
        whenToUse: "Migração de configs, substituição de URLs, normalização de CSVs de diferentes fontes.",
        commands: [
          { code: "Get-ChildItem -Recurse -Filter *.config | ForEach-Object {\n  $c = Get-Content $_.FullName -Raw -Encoding UTF8\n  $c -replace 'http://antigo\\.host','https://novo.host'\n  | Set-Content $_.FullName -Encoding UTF8\n}", description: "Substitui URL em todos os .config recursivamente" },
          { code: "Import-Csv dados.csv\n  | Where-Object { $_.Status -eq 'ativo' }\n  | Select-Object Nome, Email\n  | Export-Csv filtrado.csv -NoTypeInformation", description: "Filtra e re-exporta CSV" },
        ],
      },
      {
        id: "sync-backup",
        title: "Backup com timestamp e limpeza automática",
        objective: "Criar backup compactado com data no nome e manter apenas os N mais recentes automaticamente.",
        whenToUse: "Scripts de backup periódico de projetos, configs ou bases de dados exportadas.",
        commands: [
          { code: "$ts   = Get-Date -Format 'yyyyMMdd_HHmmss'\n$dest = \"C:\\backups\\projeto_$ts.zip\"\nCompress-Archive -Path C:\\projeto -DestinationPath $dest -CompressionLevel Optimal", description: "Cria backup com timestamp" },
          { code: "if (Test-Path $dest) {\n  Write-Host \"Backup OK: $([math]::Round((Get-Item $dest).Length/1MB,1)) MB\"\n}", description: "Verifica se o arquivo foi criado com sucesso" },
          { code: "Get-ChildItem C:\\backups -Filter *.zip\n  | Sort-Object LastWriteTime -Descending\n  | Select-Object -Skip 7\n  | Remove-Item -Force", description: "Mantém apenas os 7 backups mais recentes" },
        ],
      },
    ],
  },
  {
    id: "network",
    label: "Rede",
    icon: Wifi,
    color: "text-blue-400",
    playbooks: [
      {
        id: "api-chain",
        title: "Cadeia de chamadas a APIs REST",
        objective: "Autenticar em uma API, buscar dados paginados e processar a resposta JSON encadeando cmdlets.",
        whenToUse: "Integração com APIs de terceiros, exportação de dados de SaaS, automação de workflows via API.",
        commands: [
          { code: "$headers = @{ Authorization = \"Bearer $token\"; Accept = 'application/json' }\n$response = Invoke-RestMethod -Uri 'https://api.exemplo.com/v1/users' -Headers $headers", description: "Requisição autenticada com Bearer token" },
          { code: "$response.data\n  | Where-Object { $_.role -eq 'admin' }\n  | Select-Object id, name, email\n  | Export-Csv admins.csv -NoTypeInformation", description: "Filtra e exporta dados da resposta" },
          { code: "do {\n  $page = Invoke-RestMethod -Uri \"$baseUrl?page=$p\" -Headers $headers\n  $todos += $page.items\n  $p++\n} while ($page.hasMore)", description: "Paginação automática até buscar todos os registros" },
        ],
      },
      {
        id: "host-monitoring",
        title: "Monitorar disponibilidade de hosts",
        objective: "Testar conectividade de uma lista de hosts em paralelo e gerar relatório de disponibilidade.",
        whenToUse: "Monitoramento básico, verificação pré-deploy, healthcheck de serviços internos.",
        commands: [
          { code: "$hosts = Get-Content hosts.txt\n$resultado = $hosts | ForEach-Object -Parallel {\n  [PSCustomObject]@{\n    Host   = $_\n    Online = (Test-Connection $_ -Count 1 -Quiet)\n    HTTP   = try { (Invoke-WebRequest \"http://$_\" -TimeoutSec 3).StatusCode } catch { 'ERR' }\n  }\n} -ThrottleLimit 10 | Sort-Object Host", description: "Testa ICMP e HTTP em paralelo para cada host" },
          { code: "$offline = $resultado | Where-Object { -not $_.Online }\nif ($offline) { $offline | Format-Table; Write-Warning \"$($offline.Count) hosts offline!\" }", description: "Exibe alerta se houver hosts offline" },
        ],
      },
      {
        id: "download-automation",
        title: "Baixar e combinar arquivos da internet",
        objective: "Baixar arquivos de múltiplas URLs e consolidar o conteúdo em uma análise unificada.",
        whenToUse: "Download de relatórios, atualizações de dados externos, consumo de feeds.",
        commands: [
          { code: "$urls = @(\n  'https://data.gov/report1.csv',\n  'https://data.gov/report2.csv'\n)\n$urls | ForEach-Object {\n  $nome = Split-Path $_ -Leaf\n  Invoke-WebRequest $_ -OutFile \".\\downloads\\$nome\"\n  Write-Host \"Baixado: $nome\"\n}", description: "Baixa lista de arquivos preservando nomes originais" },
          { code: "$todos = Get-ChildItem .\\downloads -Filter *.csv\n  | ForEach-Object { Import-Csv $_.FullName }\n$todos | Measure-Object  # Conta total de registros", description: "Carrega e combina todos os CSVs baixados" },
        ],
      },
    ],
  },
  {
    id: "system",
    label: "Sistema",
    icon: Monitor,
    color: "text-green-400",
    playbooks: [
      {
        id: "process-memory",
        title: "Diagnosticar processos problemáticos",
        objective: "Identificar processos consumindo recursos excessivos e encerrar com segurança.",
        whenToUse: "Sistema lento, servidor com RAM alta, processo travado, investigação de performance.",
        commands: [
          { code: "Get-Process\n  | Sort-Object WorkingSet -Descending\n  | Select-Object -First 10 Name, Id,\n      @{N='RAM_MB'; E={[math]::Round($_.WorkingSet/1MB)}},\n      @{N='CPU_s';  E={[math]::Round($_.CPU,1)}}", description: "Top 10 processos por RAM com CPU acumulado" },
          { code: "Get-Process | Where-Object { -not $_.Responding }\n  | Select-Object Name, Id, StartTime", description: "Processos que pararam de responder (travados)" },
          { code: "$proc | Stop-Process -WhatIf  # Simule antes!\n$proc | Stop-Process -Force   # Execute com certeza", description: "Encerra: sempre use -WhatIf antes de -Force" },
        ],
      },
      {
        id: "event-log-analysis",
        title: "Analisar logs de eventos do sistema",
        objective: "Filtrar eventos críticos do Windows Event Log por período, tipo e fonte.",
        whenToUse: "Investigação de crashes, falhas de serviço, tentativas de login, problemas de inicialização.",
        commands: [
          { code: "$desde = (Get-Date).AddHours(-24)\nGet-WinEvent -FilterHashtable @{\n  LogName   = 'System'\n  Level     = 1,2\n  StartTime = $desde\n} | Select-Object TimeCreated, Id, Message -First 50", description: "Erros e criticals das últimas 24 horas (Level 1=Critical, 2=Error)" },
          { code: "Get-WinEvent -FilterHashtable @{ LogName='Security'; Id=4625 } -MaxEvents 20\n  | Select-Object TimeCreated,\n      @{N='User'; E={$_.Properties[5].Value}},\n      @{N='IP';   E={$_.Properties[19].Value}}", description: "Tentativas de login com falha — EventID 4625" },
        ],
      },
      {
        id: "service-management",
        title: "Verificar e recuperar serviços críticos",
        objective: "Detectar serviços automáticos parados e reiniciá-los automaticamente.",
        whenToUse: "Monitoramento de servidores, recuperação automática de falhas, validação pós-deploy.",
        commands: [
          { code: "$criticos = 'W3SVC','MSSQLSERVER','WinRM'\n$criticos | ForEach-Object {\n  $s = Get-Service $_ -ErrorAction SilentlyContinue\n  [PSCustomObject]@{ Servico=$_; Status=$s?.Status ?? 'NãoEncontrado' }\n} | Format-Table", description: "Verifica status de serviços críticos" },
          { code: "Get-Service | Where-Object {\n  $_.StartType -eq 'Automatic' -and $_.Status -eq 'Stopped'\n} | ForEach-Object {\n  Write-Warning \"$($_.Name) deveria estar rodando — reiniciando...\"\n  Start-Service $_.Name\n}", description: "Detecta e reinicia serviços automáticos parados" },
        ],
      },
    ],
  },
  {
    id: "automation",
    label: "Automação",
    icon: Zap,
    color: "text-purple-400",
    playbooks: [
      {
        id: "script-scaffold",
        title: "Estrutura de script profissional",
        objective: "Script robusto com parâmetros tipados, logging, tratamento de erro e suporte a -WhatIf.",
        whenToUse: "Scripts de produção, automações críticas, scripts compartilhados com equipe.",
        commands: [
          { code: "#Requires -Version 7.0\n[CmdletBinding(SupportsShouldProcess)]\nparam(\n  [Parameter(Mandatory)]\n  [string]$Caminho,\n\n  [ValidateSet('copiar','mover','deletar')]\n  [string]$Acao = 'copiar'\n)", description: "#Requires garante versão mínima; SupportsShouldProcess habilita -WhatIf e -Confirm automaticamente" },
          { code: "$ErrorActionPreference = 'Stop'\ntry {\n  if ($PSCmdlet.ShouldProcess($Caminho, $Acao)) {\n    # lógica principal aqui\n  }\n} catch {\n  Write-Error \"Falha em '$Caminho': $($_.Exception.Message)\"\n  exit 1\n}", description: "Stop faz erros interromperem o script; ShouldProcess respeita -WhatIf" },
          { code: "function Write-Log {\n  param([string]$Msg, [string]$Level = 'INFO')\n  $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'\n  \"[$ts][$Level] $Msg\" | Tee-Object -FilePath script.log -Append\n}", description: "Log com timestamp que escreve no console E em arquivo simultaneamente" },
        ],
      },
      {
        id: "parallel-processing",
        title: "Processamento paralelo com ForEach-Object -Parallel",
        objective: "Processar coleções grandes dividindo em múltiplas threads para reduzir o tempo total.",
        whenToUse: "Downloads em lote, consultas a servidores, operações I/O-bound. Requer PowerShell 7+.",
        commands: [
          { code: "$arquivos | ForEach-Object -Parallel {\n  # Cada item processado em thread separada\n  $dest = $_.FullName -replace '\\.jpg','.webp'\n  [PSCustomObject]@{ Original=$_.Name; Convertido=[IO.Path]::GetFileName($dest) }\n} -ThrottleLimit 8 | Export-Csv resultado.csv -NoTypeInformation", description: "Processa 8 arquivos simultaneamente; ThrottleLimit controla o máximo de threads" },
          { code: "# Acessando variáveis externas dentro do bloco paralelo:\n$config = @{ timeout = 30 }\n$itens | ForEach-Object -Parallel {\n  $cfg = $using:config  # $using: é obrigatório para variáveis externas\n  Start-Sleep $cfg.timeout\n}", description: "$using: é a forma de passar variáveis do escopo externo para o bloco -Parallel" },
        ],
      },
      {
        id: "pipeline-etl",
        title: "Pipeline ETL: extrair, transformar e carregar",
        objective: "Ler dados de múltiplas fontes, normalizar formato e consolidar em saída estruturada.",
        whenToUse: "Consolidação de relatórios, integração entre sistemas, preparação de dados para análise.",
        commands: [
          { code: "# Extração: múltiplas fontes\n$todos = @(Import-Csv vendas_sp.csv) + @(Import-Csv vendas_rj.csv)", description: "Combina arrays de múltiplos CSVs" },
          { code: "# Transformação: normaliza tipos e limpa dados\n$normalizado = $todos | ForEach-Object {\n  [PSCustomObject]@{\n    Data  = [DateTime]::ParseExact($_.Data,'dd/MM/yyyy',$null)\n    Valor = [decimal]($_.Valor -replace '[R$\\s\\.]','' -replace ',','.')\n    UF    = $_.UF.Trim().ToUpper()\n  }\n} | Where-Object { $_.Valor -gt 0 }", description: "Converte tipos, remove lixo e filtra inválidos" },
          { code: "# Carga: múltiplos formatos de saída\n$normalizado | Export-Csv saida.csv -NoTypeInformation -Encoding UTF8\n$normalizado | ConvertTo-Json -Depth 3 | Set-Content saida.json\n$normalizado | Group-Object UF | Select-Object Name,Count | Sort-Object Count -Desc", description: "Exporta para CSV, JSON e exibe resumo por UF" },
        ],
      },
    ],
  },
  {
    id: "security",
    label: "Segurança",
    icon: Shield,
    color: "text-red-400",
    playbooks: [
      {
        id: "permission-audit",
        title: "Auditar permissões de pastas sensíveis",
        objective: "Verificar quem tem acesso a pastas críticas e detectar permissões excessivas.",
        whenToUse: "Auditoria de segurança, compliance, verificação pós-mudança de permissões.",
        commands: [
          { code: "$pastas = 'C:\\dados\\financeiro','C:\\dados\\rh'\n$relatorio = $pastas | ForEach-Object {\n  $p = $_\n  (Get-Acl $p).Access | ForEach-Object {\n    [PSCustomObject]@{\n      Pasta      = Split-Path $p -Leaf\n      Identidade = $_.IdentityReference\n      Direitos   = $_.FileSystemRights\n      Tipo       = $_.AccessControlType\n    }\n  }\n}\n$relatorio | Export-Csv acls.csv -NoTypeInformation", description: "Extrai ACL completa de múltiplas pastas e exporta para auditoria" },
          { code: "$relatorio | Where-Object {\n  $_.Identidade -notlike 'BUILTIN*' -and\n  $_.Identidade -notlike 'NT AUTHORITY*' -and\n  $_.Direitos -like '*FullControl*'\n}", description: "Filtra usuários não-sistema com controle total (possível risco)" },
        ],
      },
      {
        id: "failed-logins",
        title: "Detectar tentativas de acesso suspeitas",
        objective: "Monitorar logs de segurança para identificar padrões de ataque como brute force.",
        whenToUse: "Resposta a incidentes, monitoramento periódico de segurança, hardening de servidores.",
        commands: [
          { code: "Get-WinEvent -FilterHashtable @{ LogName='Security'; Id=4625 } -MaxEvents 1000\n  | Group-Object { $_.Properties[5].Value }  # Agrupa por usuário\n  | Sort-Object Count -Descending\n  | Select-Object -First 10 Name, Count", description: "Top 10 usuários com mais falhas de login (EventID 4625)" },
          { code: "Get-WinEvent -FilterHashtable @{ LogName='Security'; Id=4625 } -MaxEvents 1000\n  | Group-Object { $_.Properties[19].Value }  # IP de origem\n  | Where-Object { $_.Count -gt 10 }\n  | Select-Object Name, Count", description: "IPs com mais de 10 tentativas (possível brute force)" },
          { code: "# Bloqueia IP suspeito via firewall (requer admin):\nnetsh advfirewall firewall add rule name=\"Block_Suspicious\" dir=in action=block remoteip=1.2.3.4", description: "Bloqueia IP malicioso no Windows Firewall" },
        ],
      },
      {
        id: "secure-cleanup",
        title: "Detectar e remover dados sensíveis expostos",
        objective: "Encontrar credenciais ou dados pessoais expostos em código fonte e removê-los de forma segura.",
        whenToUse: "Offboarding, fim de projetos, revisão de segurança antes de tornar repositório público.",
        commands: [
          { code: "# Encontra credenciais expostas em código\nSelect-String -Path C:\\dev\\* -Pattern 'password\\s*=|api_key|secret|token' -Recurse\n  | Select-Object Filename, LineNumber, Line | Format-Table", description: "Localiza padrões de credenciais em arquivos de código" },
          { code: "# Sobrescreve antes de deletar (mais seguro)\n$arquivo = 'C:\\dados\\confidencial.xlsx'\n[byte[]]$zeros = [byte[]]::new((Get-Item $arquivo).Length)\n[IO.File]::WriteAllBytes($arquivo, $zeros)\nRemove-Item $arquivo -Force", description: "Destruição segura: sobrescreve com zeros antes de apagar" },
        ],
      },
    ],
  },
];

function PlaybookCard({ playbook }: { playbook: Playbook }) {
  const [open, setOpen] = useState(false);
  const allCode = playbook.commands.map((c) => c.code).join("\n\n");

  return (
    <div className="glass-card overflow-hidden">
      <button
        className="w-full text-left p-4 hover:bg-primary/5 transition-colors flex items-start justify-between gap-3"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm mb-0.5">{playbook.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{playbook.objective}</p>
        </div>
        <span className="shrink-0 text-muted-foreground mt-0.5">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.2, height: { duration: 0.3, ease: "easeInOut" } }}
          className="overflow-hidden border-t border-border/50"
        >
        <div className="px-4 pb-4 pt-3 space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
            <p className="text-xs text-primary">
              <span className="font-semibold">Quando usar:</span> {playbook.whenToUse}
            </p>
          </div>

          <div className="space-y-3">
            {playbook.commands.map((cmd, i) => (
              <div key={i}>
                <p className="text-xs text-muted-foreground mb-1.5">{cmd.description}</p>
                <div className="relative">
                  <pre className="bg-black/40 rounded-lg p-3 text-xs font-mono text-green-300 overflow-x-auto whitespace-pre leading-relaxed">
                    {cmd.code}
                  </pre>
                  <div className="absolute top-2 right-2">
                    <CopyButton text={cmd.code} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Copiar tudo</span>
              <CopyButton text={allCode} />
            </div>
          </div>
        </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShellGuide() {
  const [activeCategory, setActiveCategory] = useState(missions[0].id);
  const category = missions.find((m) => m.id === activeCategory)!;

  return (
    <div data-theme="shell" className="container px-4 py-12 max-w-3xl">
      <SEO
        title="Guia PowerShell — Playbooks"
        description="Playbooks de PowerShell por missão: arquivos, rede, sistema, automação e segurança — pipelines prontos para copiar e adaptar."
        path="/shell/guide"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Playbooks de Sobrevivência</h1>
        <p className="text-muted-foreground">
          Pipelines encadeados por missão — escolha a categoria e copie o que precisar.
        </p>
      </motion.div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {missions.map((m) => {
          const Icon = m.icon;
          const isActive = m.id === activeCategory;
          return (
            <button
              key={m.id}
              onClick={() => setActiveCategory(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? "" : m.color}`} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Playbooks */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="space-y-3"
        >
          {category.playbooks.map((pb) => (
            <PlaybookCard key={pb.id} playbook={pb} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
