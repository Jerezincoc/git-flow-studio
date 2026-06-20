import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";
import { SEO } from "@/components/SEO";
import { BookMarked } from "lucide-react";

interface ConventionSection {
  id: string;
  title: string;
  description: string;
  rules: ConventionRule[];
}

interface ConventionRule {
  label: string;
  good?: string;
  bad?: string;
  explanation: string;
}

const sections: ConventionSection[] = [
  {
    id: "naming",
    title: "Convenção Verbo-Substantivo",
    description: "Todo cmdlet PowerShell usa o padrão Verbo-Substantivo. Funções que você escreve devem seguir a mesma convenção para consistência e descoberta via Get-Command.",
    rules: [
      {
        label: "Use verbos aprovados",
        good: "function Get-UserReport { ... }\nfunction New-BackupFile { ... }\nfunction Remove-TempFiles { ... }",
        bad: "function UserReport { ... }  # sem verbo\nfunction FetchData { ... }   # verbo não aprovado\nfunction DoBackup { ... }    # 'Do' não é verbo aprovado",
        explanation: "Get-Verb lista todos os ~100 verbos aprovados pelo PowerShell. Verbos fora da lista geram aviso ao importar módulos. Use: Get, Set, New, Remove, Add, Get, Start, Stop, Invoke, Test, Show, Hide, Enable, Disable, Import, Export, Convert.",
      },
      {
        label: "Prefixe substantivos em módulos",
        good: "# Módulo 'MeuModulo':\nfunction Get-MeuModuloUser { ... }\nfunction New-MeuModuloConfig { ... }",
        bad: "# Sem prefixo: conflita com outros módulos\nfunction Get-User { ... }  # pode conflitar com ActiveDirectory",
        explanation: "Adicionar prefixo ao substantivo evita colisão com cmdlets de outros módulos. Convenção: NomeModulo como prefixo do substantivo.",
      },
      {
        label: "Use PascalCase para funções e variáveis públicas",
        good: "$UserName = 'João'\n$MaxRetries = 3\nfunction Get-ProcessReport { }",
        bad: "$username = 'João'  # inconsistente com PS style\n$max_retries = 3    # underscore não é convenção PS",
        explanation: "PowerShell é case-insensitive, mas PascalCase é o padrão para parâmetros e variáveis que serão expostos. Variáveis internas podem usar camelCase.",
      },
    ],
  },
  {
    id: "params",
    title: "Parâmetros e Validação",
    description: "Declare parâmetros com tipos, atributos de validação e suporte a pipeline. O PowerShell faz a validação automaticamente — você não precisa verificar manualmente.",
    rules: [
      {
        label: "Declare tipos nos parâmetros",
        good: "param(\n  [string]$Nome,\n  [int]$Quantidade = 10,\n  [switch]$Force\n)",
        bad: "param(\n  $Nome,       # sem tipo: aceita qualquer coisa\n  $Quantidade  # sem padrão: obrigatório implicitamente\n)",
        explanation: "[string], [int], [bool], [switch] declaram o tipo esperado. O PowerShell converte e valida automaticamente — uma string '42' vira int 42 quando o parâmetro é [int].",
      },
      {
        label: "Use [Parameter()] para controle avançado",
        good: "param(\n  [Parameter(Mandatory, ValueFromPipeline)]\n  [string]$Arquivo,\n\n  [Parameter(HelpMessage='Número de tentativas')]\n  [ValidateRange(1,10)]\n  [int]$Tentativas = 3\n)",
        explanation: "Mandatory: PowerShell pede o valor automaticamente se omitido. ValueFromPipeline: aceita input do pipeline. ValidateRange/ValidateSet: valida sem código manual.",
      },
      {
        label: "Use [ValidateSet] para enums",
        good: "[ValidateSet('dev','staging','prod')]\n[string]$Ambiente = 'dev'",
        bad: "param([string]$Ambiente)\nif ($Ambiente -notin 'dev','staging','prod') {\n  throw 'Ambiente inválido'  # código desnecessário\n}",
        explanation: "[ValidateSet] faz a validação antes de a função rodar e ainda habilita Tab-completion automático — o usuário pode pressionar Tab para ver as opções válidas.",
      },
    ],
  },
  {
    id: "error-handling",
    title: "Tratamento de Erros",
    description: "PowerShell tem dois tipos de erros: terminantes (param a execução) e não-terminantes (apenas exibem aviso). Entender a diferença é essencial para scripts robustos.",
    rules: [
      {
        label: "Use -ErrorAction Stop para tornar erros tratáveis",
        good: "try {\n  Get-Item 'arquivo-que-deve-existir.txt' -ErrorAction Stop\n  Copy-Item $origem $destino -ErrorAction Stop\n} catch {\n  Write-Error \"Operação falhou: $($_.Exception.Message)\"\n  exit 1\n}",
        bad: "# Sem -ErrorAction Stop, erros de cmdlet não entram no catch:\ntry {\n  Get-Item 'nao-existe.txt'  # erro não-terminante\n} catch {\n  # Este bloco NUNCA executa para o erro acima!\n}",
        explanation: "Por padrão, muitos cmdlets emitem erros não-terminantes que não ativam try/catch. Use -ErrorAction Stop no cmdlet ou $ErrorActionPreference = 'Stop' no início do script para forçar.",
      },
      {
        label: "Diferencie $_ e $Error[0]",
        good: "try {\n  Get-Item 'nao-existe.txt' -ErrorAction Stop\n} catch {\n  # $_ dentro do catch = o erro atual\n  Write-Host $_.Exception.Message\n  Write-Host $_.ScriptStackTrace\n}\n# Fora do catch, último erro:\nWrite-Host $Error[0].Exception.Message",
        explanation: "$_ dentro de um bloco catch é o ErrorRecord atual. $Error é um array global com histórico de erros — $Error[0] é o mais recente. $Error.Clear() limpa o histórico.",
      },
      {
        label: "Use Write-Error vs throw",
        good: "# Erro não-terminante (script continua):\nWrite-Error \"Arquivo '$path' não encontrado\"\n\n# Erro terminante (script para aqui):\nthrow \"Configuração inválida: campo 'Host' obrigatório\"",
        explanation: "Write-Error adiciona ao stream de erro mas continua a execução. throw sempre interrompe. Para funções em módulos, prefira throw com mensagens descritivas — permite que o chamador decida o que fazer.",
      },
    ],
  },
  {
    id: "output",
    title: "Output e Write-*",
    description: "PowerShell tem múltiplos streams de output: sucesso, erro, warning, verbose, debug e information. Usar o stream correto torna seus scripts mais fáceis de integrar e debugar.",
    rules: [
      {
        label: "Write-Host vs Write-Output vs return",
        good: "# Para dados que serão usados no pipeline:\nfunction Get-Relatorio {\n  return [PSCustomObject]@{ Nome='João'; Score=95 }\n}\n\n# Para mensagens ao usuário:\nWrite-Host 'Processando...'\nWrite-Verbose 'Detalhes internos' -Verbose",
        bad: "function Get-Relatorio {\n  Write-Host 'Nome: João'  # não entra no pipeline!\n  Write-Host 'Score: 95'   # não pode ser filtrado ou exportado\n}",
        explanation: "Write-Host escreve direto no console — não pode ser capturado com $resultado = Minha-Funcao ou redirecionado para arquivo. Use return ou deixe o objeto soltar naturalmente para output do pipeline.",
      },
      {
        label: "Use Write-Verbose para debug opcional",
        good: "[CmdletBinding()]\nparam([string]$Arquivo)\n\nWrite-Verbose \"Processando: $Arquivo\"\n# Usuário vê apenas com -Verbose:\n# Meu-Script -Arquivo 'x.txt' -Verbose",
        explanation: "Write-Verbose só exibe se -Verbose for passado ou $VerbosePreference = 'Continue'. Perfeito para logging de debug sem poluir o output normal.",
      },
      {
        label: "Não use Write-Output desnecessariamente",
        good: "function Get-Dobro {\n  param([int]$n)\n  $n * 2  # simplesmente 'soltar' o valor é suficiente\n}",
        bad: "function Get-Dobro {\n  param([int]$n)\n  Write-Output ($n * 2)  # Write-Output é redundante aqui\n}",
        explanation: "Em PowerShell, qualquer valor não capturado em uma variável automaticamente vai para o pipeline de saída. Write-Output é raramente necessário — use apenas quando precisar forçar output de um valor específico dentro de um bloco complexo.",
      },
    ],
  },
  {
    id: "help",
    title: "Comment-Based Help",
    description: "Documente funções com comentários especiais que o PowerShell reconhece automaticamente. Get-Help Sua-Funcao funcionará como para cmdlets nativos.",
    rules: [
      {
        label: "Estrutura básica do comment-based help",
        good: "function Get-Relatorio {\n  <#\n  .SYNOPSIS\n    Gera relatório de vendas filtrado.\n\n  .DESCRIPTION\n    Lê os CSVs de vendas, aplica filtros e retorna\n    objetos com totais por região.\n\n  .PARAMETER Regiao\n    Filtra por estado (ex: 'SP', 'RJ'). Padrão: todas.\n\n  .EXAMPLE\n    Get-Relatorio -Regiao SP | Export-Csv sp.csv\n\n  .NOTES\n    Requer arquivos vendas_*.csv na pasta atual.\n  #>\n  param([string]$Regiao = '*')\n  # ...\n}",
        explanation: ".SYNOPSIS: uma linha descrevendo o que faz. .DESCRIPTION: explicação detalhada. .PARAMETER: descreve cada parâmetro (um bloco por parâmetro). .EXAMPLE: exemplo real de uso. O Get-Help sua-funcao exibirá tudo isso formatado.",
      },
    ],
  },
];

function RuleCard({ rule }: { rule: ConventionRule }) {
  return (
    <div className="glass-card p-4 space-y-3">
      <p className="text-sm font-semibold">{rule.label}</p>
      {(rule.good || rule.bad) && (
        <div className="grid gap-2 sm:grid-cols-2">
          {rule.good && (
            <div>
              <p className="text-xs text-green-400 font-medium mb-1.5">✓ Preferido</p>
              <div className="relative">
                <pre className="bg-black/40 rounded-lg p-3 text-xs font-mono text-green-300 overflow-x-auto whitespace-pre leading-relaxed">
                  {rule.good}
                </pre>
                <div className="absolute top-2 right-2">
                  <CopyButton text={rule.good} />
                </div>
              </div>
            </div>
          )}
          {rule.bad && (
            <div>
              <p className="text-xs text-red-400 font-medium mb-1.5">✗ Evitar</p>
              <pre className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs font-mono text-red-900 overflow-x-auto whitespace-pre leading-relaxed dark:bg-red-950/40 dark:border-red-800/30 dark:text-red-300/90">
                {rule.bad}
              </pre>
            </div>
          )}
        </div>
      )}
      <p className="text-xs text-muted-foreground leading-relaxed">{rule.explanation}</p>
    </div>
  );
}

export default function ShellConventions() {
  return (
    <div data-theme="shell" className="container px-4 py-12 max-w-3xl">
      <SEO
        title="Convenções PowerShell"
        description="Boas práticas e convenções de PowerShell: Verb-Noun, parâmetros, tratamento de erros, output e documentação."
        path="/shell/conventions"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <BookMarked className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold">Convenções PowerShell</h1>
        </div>
        <p className="text-muted-foreground">
          Boas práticas para escrever scripts legíveis, robustos e compatíveis com o ecossistema PowerShell.
        </p>
      </motion.div>

      <div className="space-y-10">
        {sections.map((section, si) => (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.05 }}
          >
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-1">{section.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.description}</p>
            </div>
            <div className="space-y-3">
              {section.rules.map((rule, ri) => (
                <RuleCard key={ri} rule={rule} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
