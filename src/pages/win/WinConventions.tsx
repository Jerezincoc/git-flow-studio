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
    id: "variables",
    title: "Variáveis: %VAR% vs !VAR!",
    description: "No CMD, variáveis são acessadas com %VAR%. Mas dentro de loops FOR e blocos IF, o valor é expandido antes de o bloco executar — o valor antigo fica 'congelado'. A expansão atrasada (!VAR!) resolve isso.",
    rules: [
      {
        label: "Use !VAR! dentro de loops quando a variável muda na iteração",
        good: "@echo off\nsetlocal enabledelayedexpansion\nset TOTAL=0\nfor %%f in (*.txt) do (\n  set /a TOTAL+=1\n  echo Arquivo %%f, total ate agora: !TOTAL!\n)",
        bad: "@echo off\nset TOTAL=0\nfor %%f in (*.txt) do (\n  set /a TOTAL+=1\n  echo Arquivo %%f, total ate agora: %TOTAL%  ^<-- sempre mostra 0!\n)",
        explanation: "Com %TOTAL%, o CMD expande a variável UMA vez antes de entrar no bloco — então sempre mostra o valor inicial. Com setlocal enabledelayedexpansion e !TOTAL!, o valor é lido em tempo de execução a cada iteração.",
      },
      {
        label: "Ative a expansão atrasada no topo do script quando precisar",
        good: "@echo off\nsetlocal enabledelayedexpansion\n\n:: A partir daqui, !VAR! funciona dentro de blocos",
        bad: "@echo off\n:: Sem enabledelayedexpansion, !VAR! nao funciona\n:: e %VAR% dentro de loops nao atualiza",
        explanation: "setlocal enabledelayedexpansion habilita o uso de !VAR! e também isola as variáveis do script para não poluir o ambiente do CMD pai. Boa prática: coloque sempre no início do script junto com @echo off.",
      },
      {
        label: "% é para fora de blocos, ! é para dentro de blocos",
        good: "set NOME=João\necho %NOME%           :: funciona fora de blocos\n\nfor %%i in (1 2 3) do (\n  set NUM=%%i\n  echo !NUM!             :: funciona dentro de bloco\n)",
        explanation: "Regra prática: se o echo ou comando está dentro de parênteses ( ), use !VAR!. Fora de parênteses, %VAR% funciona normalmente.",
      },
    ],
  },
  {
    id: "errorlevel",
    title: "ERRORLEVEL — Verificando Sucesso ou Falha",
    description: "Após qualquer comando, o CMD define ERRORLEVEL com o código de saída: 0 = sucesso, qualquer outro valor = erro. Verificar ERRORLEVEL é essencial para scripts robustos.",
    rules: [
      {
        label: "Verifique ERRORLEVEL após operações críticas",
        good: "npm install\nif %errorlevel% neq 0 (\n  echo ERRO: npm install falhou com codigo %errorlevel%\n  exit /b 1\n)\n\nnpm run build\nif %errorlevel% neq 0 (\n  echo ERRO: build falhou\n  exit /b 1\n)\necho Build concluido com sucesso.",
        bad: "npm install\nnpm run build\necho Build concluido.  ^<-- exibe isso mesmo se npm install falhou!",
        explanation: "Sem verificar ERRORLEVEL, o script continua mesmo após falha — e pode exibir 'sucesso' enquanto algo quebrou silenciosamente. Em CI/CD, isso mascararia erros reais.",
      },
      {
        label: "Use NEQ 0 em vez de EQU 1 — nem sempre o erro é código 1",
        good: "chkdsk C:\nif %errorlevel% neq 0 echo chkdsk encontrou problemas",
        bad: "chkdsk C:\nif %errorlevel% equ 1 echo erro  ^<-- perde codigos 2, 3, 4...",
        explanation: "Diferentes programas usam códigos de erro diferentes. robocopy usa 0-7 para sucessos parciais. chkdsk usa 1 para 'encontrou erros' e 2 para 'correção necessária'. Verificar apenas código 1 perde casos importantes.",
      },
      {
        label: "Propague ERRORLEVEL ao sair do script",
        good: "call outro-script.bat\nif %errorlevel% neq 0 exit /b %errorlevel%\n\n:: Ou de forma mais simples:\ncall outro-script.bat || exit /b %errorlevel%",
        explanation: "Se seu script chama outros scripts, propague o código de erro com exit /b %errorlevel%. Sem isso, o script pai acha que tudo correu bem. O operador || executa o lado direito só se o comando da esquerda falhar.",
      },
    ],
  },
  {
    id: "comments",
    title: "REM vs :: — Comentários em Batch",
    description: "Dois jeitos de comentar em batch: REM (Remark) é o oficial; :: é um truque com label malformado. Cada um tem limitações específicas.",
    rules: [
      {
        label: "Use :: para comentários gerais, REM dentro de blocos",
        good: ":: Este script faz backup diario\n:: Autor: equipe de infra\n@echo off\nsetlocal enabledelayedexpansion\n\nfor %%f in (*.log) do (\n  REM :: dentro de bloco pode causar erro em alguns casos\n  REM Mova para backup\n  move \"%%f\" C:\\backup\\\n)",
        bad: "for %%i in (1 2 3) do (\n  :: Comentario com :: dentro de bloco pode causar erro\n  echo %%i\n)",
        explanation: ":: dentro de blocos FOR, IF ou parênteses pode causar erros em versões mais antigas do CMD. REM é mais seguro dentro de blocos. :: funciona perfeitamente fora de blocos e é mais rápido (o CMD não processa o texto).",
      },
      {
        label: "Não use REM para código comentado em produção — remova de verdade",
        good: ":: Versão atual: copia com robocopy\nrobocopy src dest /e /r:3 /w:5",
        bad: "REM xcopy src dest /e /y   <- codigo antigo comentado\nREM copy src dest           <- outra tentativa\nrobocopy src dest /e       <- codigo atual",
        explanation: "Código comentado em scripts batch cresce e ninguém sabe mais o que é ativo. Se precisar de histórico, use Git. Mantenha apenas o que executa.",
      },
    ],
  },
  {
    id: "echo",
    title: "@echo off — Controlando a Verbosidade",
    description: "Por padrão, o CMD exibe cada comando antes de executar. @echo off desliga isso, deixando o output limpo. O @ antes evita que o próprio 'echo off' apareça.",
    rules: [
      {
        label: "Sempre comece scripts com @echo off",
        good: "@echo off\nsetlocal enabledelayedexpansion\n\necho Iniciando backup...\nrobocopy C:\\dados D:\\backup /e /r:3\necho Backup concluido.",
        bad: "setlocal enabledelayedexpansion\n\necho Iniciando backup...\nrobocopy C:\\dados D:\\backup /e /r:3\necho Backup concluido.\n\n:: Sem @echo off, cada comando aparece duas vezes no terminal:\n:: C:\\>robocopy C:\\dados D:\\backup /e /r:3\n:: robocopy C:\\dados D:\\backup /e /r:3  <- redundante",
        explanation: "Sem @echo off, o CMD imprime o comando E o output — o terminal fica poluído. Com @echo off, você controla exatamente o que o usuário vê via seus próprios echos. O @ antes garante que a linha 'echo off' em si não seja exibida.",
      },
      {
        label: "Use echo. para linha em branco (não echo com espaço)",
        good: "echo Etapa 1: Copiando arquivos...\nrobocopy src dest /e\necho.\necho Etapa 2: Verificando...\nchkdsk C: /f",
        bad: "echo Etapa 1: Copiando arquivos...\nrobocopy src dest /e\necho   <- pode exibir 'ECHO esta ATIVADO' em vez de linha em branco\necho Etapa 2: Verificando...",
        explanation: "echo sem argumento exibe o estado atual ('ECHO está ATIVADO' ou 'ECHO está DESATIVADO'), não uma linha em branco. echo. (com ponto imediatamente após) é a forma correta de imprimir linha em branco.",
      },
    ],
  },
  {
    id: "cmdvspowershell",
    title: "CMD vs PowerShell — Quando Usar Cada Um",
    description: "CMD (cmd.exe) e PowerShell são dois terminais diferentes no Windows com filosofias opostas. Entender a diferença ajuda a escolher a ferramenta certa.",
    rules: [
      {
        label: "Use CMD para scripts simples e legados; PowerShell para automação moderna",
        good: ":: CMD: adequado para tarefas simples e rápidas\ncopy config.ini config.bak\nrobocopy src dest /e\n\n# PowerShell: melhor para lógica complexa e dados estruturados\n$processos = Get-Process | Where-Object { $_.CPU -gt 50 }\n$processos | Export-Csv relatorio.csv -NoTypeInformation",
        explanation: "CMD processa texto simples — bom para comandos rápidos e automações de arquivo. PowerShell trabalha com objetos .NET — ideal para consultas complexas, manipulação de dados, APIs e integração com serviços do Windows.",
      },
      {
        label: "Prefira PowerShell para qualquer coisa que envolva lógica de programação",
        good: "# PowerShell: legível, robusto, com tipos\n$servicos = Get-Service | Where-Object { $_.Status -eq 'Stopped' -and $_.StartType -eq 'Automatic' }\nforeach ($s in $servicos) {\n  Write-Host \"Serviço parado: $($s.Name)\"\n  Start-Service $s.Name\n}",
        bad: ":: CMD: mesmo resultado, mas muito mais frágil\nfor /f \"tokens=1,2\" %%a in ('sc query type= all state= stopped') do (\n  if \"%%a\"==\"SERVICE_NAME:\" (\n    sc start %%b 2^>nul\n  )\n)",
        explanation: "Strings, arrays, condições complexas e tratamento de erros são muito mais difíceis em batch. O CMD não tem conceito de objetos, tipos ou pipeline de dados — apenas texto. Quando a lógica crescer, migre para PowerShell.",
      },
      {
        label: "CMD e melhor para compatibilidade: funciona em qualquer Windows",
        good: ":: Um .bat com comandos básicos roda em qualquer Windows desde XP\n@echo off\nif exist C:\\dados xcopy C:\\dados D:\\backup /e /i /y",
        explanation: "Scripts batch rodam sem instalar nada — qualquer máquina Windows tem cmd.exe. PowerShell requer versão compatível (PS 2.0 no Win7, PS 5.1 no Win10). Para scripts distribuídos em ambientes heterogêneos, CMD pode ser mais seguro.",
      },
    ],
  },
  {
    id: "dangerous",
    title: "Comandos Perigosos — Nunca Execute Sem Confirmar",
    description: "Alguns comandos do CMD são destrutivos e irreversíveis. Não existe Ctrl+Z, não existe lixeira. Confirme sempre o caminho e o escopo antes de executar.",
    rules: [
      {
        label: "del /s /q e rd /s /q apagam tudo sem confirmação",
        good: ":: Sempre valide o caminho antes\necho Será apagado: %PASTA_ALVO%\npause\nrd /s /q \"%PASTA_ALVO%\"",
        bad: ":: PERIGO: apaga pasta errada se a variável estiver vazia ou errada\nrd /s /q %PASTA%\n\n:: Se %PASTA% estiver vazia, isso vira:\nrd /s /q  <- apaga o diretório atual!",
        explanation: "Se a variável de caminho estiver vazia, rd /s /q tenta apagar o diretório atual — o que pode apagar o projeto inteiro. Sempre use aspas ('rd /s /q \"%PASTA%\"') e adicione uma verificação: if defined PASTA (rd /s /q \"%PASTA%\") else echo PASTA nao definida.",
      },
      {
        label: "format apaga o volume inteiro — confirme a letra do drive",
        bad: ":: PERIGO: formatar o drive errado destrói todos os dados\nformat D: /fs:NTFS /q\n\n:: Se o pendrive for C: e você digitou D:, perdeu o pendrive.\n:: Se o pendrive virou C: por algum motivo, formatou o sistema.",
        explanation: "Antes de format, confirme a letra do drive com diskpart (list volume) ou Gerenciador de Disco (diskmgmt.msc). Nunca confie na letra que 'parece certa' sem verificar.",
      },
      {
        label: "robocopy /mir apaga o que não existe na origem",
        good: ":: Primeiro teste em modo dry-run\nrobocopy origem destino /mir /l /nfl /ndl\n:: Se o output parecer correto, rode sem /l\nrobocopy origem destino /mir",
        bad: ":: /mir sem conferir pode apagar arquivos no destino que não existem na origem\nrobocopy C:\\projeto D:\\backup /mir\n\n:: Se D:\\backup já tinha outros arquivos,\n:: eles são apagados para 'espelhar' C:\\projeto",
        explanation: "robocopy /l (list only) simula a execução sem alterar nada — use para conferir o que seria feito antes de executar de verdade. /mir é poderoso mas destrutivo: apaga no destino tudo que não existe na origem.",
      },
      {
        label: "reg delete sem backup pode quebrar aplicações",
        good: ":: Exporte antes de deletar\nreg export HKCU\\Software\\MinhaApp backup-minhaapp.reg\nreg delete HKCU\\Software\\MinhaApp /f",
        bad: ":: Sem backup: sem volta\nreg delete HKCU\\Software\\MinhaApp /f",
        explanation: "reg export cria um arquivo .reg que pode ser reimportado com duplo clique ou 'reg import backup.reg'. Sempre exporte antes de deletar — especialmente em chaves de aplicações e configurações de sistema.",
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

export default function WinConventions() {
  return (
    <div data-theme="win" className="container px-4 py-12 max-w-3xl">
      <SEO
        title="Convenções CMD e Batch"
        description="Boas práticas de CMD e scripts batch: %VAR% vs !VAR!, ERRORLEVEL, REM vs ::, @echo off e quando usar PowerShell."
        path="/win/conventions"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <BookMarked className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold">Convenções CMD e Batch</h1>
        </div>
        <p className="text-muted-foreground">
          Boas práticas para escrever scripts batch confiáveis, evitar armadilhas comuns e saber quando migrar para PowerShell.
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
