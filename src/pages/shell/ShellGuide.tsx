import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CopyButton } from "@/components/CopyButton";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuideStep {
  title: string;
  content: string;
  tip?: string;
  commands?: { code: string; description: string }[];
}

const guideSteps: GuideStep[] = [
  {
    title: "O que é PowerShell?",
    content: "PowerShell é um shell moderno da Microsoft que vai muito além do CMD. Em vez de trabalhar com texto puro como o bash, o PowerShell trabalha com objetos .NET — isso significa que você pode acessar propriedades, filtrar e transformar dados de forma muito mais poderosa.",
    tip: "PowerShell está disponível no Windows (5.1 nativo) e cross-platform como PowerShell 7+ (open source). Prefira o PS7 para novos projetos.",
    commands: [
      { code: "$PSVersionTable.PSVersion", description: "Verifique a versão instalada" },
      { code: "Get-Host", description: "Informações do host do PowerShell" },
    ],
  },
  {
    title: "Instalando o PowerShell 7+",
    content: "O Windows já vem com PowerShell 5.1, mas o PowerShell 7+ é mais rápido, suporta mais recursos (como ForEach-Object -Parallel) e é cross-platform. Instale via winget ou baixe no GitHub da Microsoft.",
    commands: [
      { code: "winget install Microsoft.PowerShell", description: "Instala PS7 via winget (Windows 10+)" },
      { code: "pwsh --version", description: "Confirma que o PS7 foi instalado" },
      { code: "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser", description: "Permite executar scripts locais" },
    ],
  },
  {
    title: "Navegando no sistema",
    content: "Os cmdlets de navegação seguem o padrão Verbo-Substantivo. Get-ChildItem lista diretórios, Set-Location muda de pasta. Mas você também pode usar os aliases familiares: ls, cd, dir — eles funcionam no PowerShell.",
    tip: "No PowerShell, ls e cd são aliases para Get-ChildItem e Set-Location — mas eles retornam objetos .NET, não texto. Isso é mais poderoso que os comandos Unix equivalentes.",
    commands: [
      { code: "Get-ChildItem", description: "Lista o diretório atual (alias: ls, dir)" },
      { code: "Set-Location C:\\Users\\$env:USERNAME\\Documents", description: "Navega para Documentos (alias: cd)" },
      { code: "Get-ChildItem -Recurse -Filter *.ps1", description: "Busca scripts recursivamente" },
    ],
  },
  {
    title: "Entendendo o Pipeline",
    content: "O pipeline do PowerShell ( | ) é diferente do bash — ele passa objetos, não texto. Isso significa que você pode encadear cmdlets e acessar propriedades diretamente, sem parsing de string.",
    tip: "No bash: ls | grep .txt (filtra texto). No PowerShell: Get-ChildItem | Where-Object { $_.Extension -eq '.txt' } (filtra objetos). A diferença é enorme para automação.",
    commands: [
      { code: "Get-Process | Where-Object { $_.CPU -gt 10 } | Select-Object Name, CPU", description: "Filtra e seleciona propriedades" },
      { code: "Get-ChildItem | Sort-Object Length -Descending | Select-Object -First 5", description: "Top 5 arquivos maiores" },
      { code: "Get-Service | Where-Object Status -eq 'Stopped' | Measure-Object", description: "Conta serviços parados" },
    ],
  },
  {
    title: "Variáveis e tipos",
    content: "Variáveis no PowerShell começam com $. O shell é tipado dinamicamente mas você pode declarar tipos. Strings usam aspas simples (literal) ou duplas (com interpolação).",
    tip: "Use aspas simples quando não precisa de interpolação — é mais rápido e evita surpresas. Use aspas duplas quando precisar de $variavel ou `n (newline) na string.",
    commands: [
      { code: '$nome = "DevDocs"\n$versao = 7\nWrite-Host "Bem-vindo ao $nome $versao"', description: "Variáveis com interpolação" },
      { code: '$arquivos = Get-ChildItem *.txt\n$arquivos.Count', description: "Variável recebe objetos, .Count conta" },
      { code: '[int]$numero = "42"\n$numero.GetType().Name', description: "Tipagem explícita e inspecionar tipo" },
    ],
  },
  {
    title: "Condicionais e loops",
    content: "PowerShell tem if/else, switch, foreach, while e do-while. O foreach no pipeline usa ForEach-Object com $_, mas o foreach ($x in $col) é mais rápido para coleções em memória.",
    commands: [
      { code: 'if ($env:OS -eq "Windows_NT") {\n  Write-Host "Windows"\n} else {\n  Write-Host "Outro OS"\n}', description: "Condicional básico" },
      { code: "foreach ($proc in Get-Process) {\n  if ($proc.CPU -gt 50) {\n    Write-Host $proc.Name\n  }\n}", description: "Loop com condição" },
      { code: "1..10 | ForEach-Object { $_ * $_ }", description: "Pipeline: quadrado de 1 a 10" },
    ],
  },
  {
    title: "Funções e scripts",
    content: "Funções no PowerShell usam function e parâmetros com [Parameter()]. Scripts são arquivos .ps1 que você executa com .\\script.ps1. Organize funções em módulos .psm1 para reutilizar.",
    tip: "Use param() com tipos e [Parameter(Mandatory)] para validação automática. PowerShell gera a mensagem de erro e pede o valor ao usuário automaticamente se omitido.",
    commands: [
      { code: 'function Get-Saudacao {\n  param([string]$Nome = "Mundo")\n  Write-Output "Olá, $Nome!"\n}\nGet-Saudacao -Nome "DevDocs"', description: "Função com parâmetro opcional" },
      { code: ".\\meu-script.ps1", description: "Executa um script .ps1" },
      { code: "Get-Help .\\meu-script.ps1", description: "Exibe help do script (se tiver comment-based help)" },
    ],
  },
  {
    title: "Tratamento de erros",
    content: "Use Try/Catch para capturar erros. $ErrorActionPreference controla o comportamento padrão. -ErrorAction SilentlyContinue suprime erros de um cmdlet específico.",
    tip: "$? indica se o último comando teve sucesso ($true) ou erro ($false). Use $Error[0] para ver o último erro capturado.",
    commands: [
      { code: 'try {\n  Get-Item "arquivo-inexistente.txt" -ErrorAction Stop\n} catch {\n  Write-Host "Erro: $($_.Exception.Message)"\n}', description: "Try/Catch básico" },
      { code: 'Get-Process "naoexiste" -ErrorAction SilentlyContinue\nif (-not $?) { Write-Host "Processo não encontrado" }', description: "Verifica sucesso com $?" },
    ],
  },
  {
    title: "Perfil e personalização",
    content: "O perfil do PowerShell é um script executado ao abrir o shell — ideal para aliases, funções e configurações pessoais. Edite com o caminho em $PROFILE.",
    tip: "Instale o Oh My Posh para um prompt bonito e informativo. Instale o módulo PSReadLine para autocomplete avançado e histórico persistente.",
    commands: [
      { code: "Test-Path $PROFILE", description: "Verifica se o perfil existe" },
      { code: "New-Item -Path $PROFILE -Type File -Force", description: "Cria o perfil se não existir" },
      { code: "notepad $PROFILE", description: "Abre o perfil para edição" },
      { code: "Install-Module PSReadLine -Force\nInstall-Module oh-my-posh -Scope CurrentUser", description: "Instala módulos de produtividade" },
    ],
  },
];

export default function ShellGuide() {
  const [currentStep, setCurrentStep] = useLocalStorage<number>("shell-doc-guide-step", 0);
  const [completed, setCompleted] = useLocalStorage<number[]>("shell-doc-guide-progress", []);

  const step = guideSteps[currentStep];
  const isDone = completed.includes(currentStep);
  const progress = Math.round((completed.length / guideSteps.length) * 100);
  const isLast = currentStep === guideSteps.length - 1;

  const toggleDone = () =>
    setCompleted((prev) =>
      prev.includes(currentStep)
        ? prev.filter((i) => i !== currentStep)
        : [...prev, currentStep]
    );

  const goNext = () => {
    if (!isDone) setCompleted((prev) => [...prev, currentStep]);
    if (!isLast) setCurrentStep(currentStep + 1);
  };

  const goPrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div data-theme="shell" className="relative">
      {/* Progress bar sticky */}
      <div className="sticky top-14 z-40 bg-background/90 backdrop-blur border-b border-border/50 px-4 py-2">
        <div className="container max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="text-xs font-semibold text-primary shrink-0">
            {completed.length}/{guideSteps.length} concluídos
          </span>
        </div>
      </div>

      <div className="container px-4 py-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Guia PowerShell</h1>
          <p className="text-muted-foreground">Do zero ao script funcional, um passo por vez.</p>
        </motion.div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5 mb-8 flex-wrap">
          {guideSteps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              title={guideSteps[i].title}
              className={`transition-all rounded-full ${
                i === currentStep
                  ? "w-6 h-2.5 bg-primary"
                  : completed.includes(i)
                  ? "w-2.5 h-2.5 bg-accent"
                  : "w-2.5 h-2.5 bg-secondary hover:bg-secondary/60"
              }`}
            />
          ))}
        </div>

        {/* Step card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className={`glass-card p-6 mb-6 ${isDone ? "border-accent/40" : ""}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-muted-foreground">
                Passo {currentStep + 1} de {guideSteps.length}
              </span>
              {isDone && (
                <span className="flex items-center gap-1 text-xs text-accent font-medium">
                  <Check className="h-3.5 w-3.5" /> Concluído
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold mb-3">{step.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.content}</p>

            {step.tip && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 mb-4">
                <p className="text-xs text-primary leading-relaxed">
                  <span className="font-semibold">Dica:</span> {step.tip}
                </p>
              </div>
            )}

            {step.commands && (
              <div className="space-y-3">
                {step.commands.map((cmd, ci) => (
                  <div key={ci}>
                    <p className="text-xs text-muted-foreground mb-1">{cmd.description}</p>
                    <div className="flex items-start gap-2">
                      <pre className="code-block flex-1 whitespace-pre-wrap overflow-x-auto text-xs">{cmd.code}</pre>
                      <CopyButton text={cmd.code} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline" size="sm"
            onClick={goPrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </Button>

          <button
            onClick={toggleDone}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            {isDone ? "Desmarcar como concluído" : "Marcar como concluído"}
          </button>

          {isLast ? (
            <Button size="sm" onClick={toggleDone} className={isDone ? "" : "btn-glow"} disabled={isDone}>
              {isDone ? "Guia completo ✓" : "Concluir"}
            </Button>
          ) : (
            <Button size="sm" onClick={goNext} className="flex items-center gap-1 btn-glow">
              {isDone ? "Próximo" : "Concluir e avançar"} <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Completion */}
        <AnimatePresence>
          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card p-6 mt-8 text-center border-primary/40 glow-md"
            >
              <span className="text-4xl mb-3 block">🚀</span>
              <h3 className="text-xl font-bold mb-2">Guia completo!</h3>
              <p className="text-muted-foreground text-sm">
                Agora explore os cmdlets e o cheat sheet para aprofundar.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
