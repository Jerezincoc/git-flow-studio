export interface WinScenarioAnatomyPart {
  part: string;
  explanation: string;
}

export interface WinScenario {
  id: string;
  title: string;
  goal: string;
  commands: string[];
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  anatomy: WinScenarioAnatomyPart[];
}

export const winScenarioDifficultyLabels: Record<string, string> = {
  easy: "Facil",
  medium: "Medio",
  hard: "Dificil",
};

export const winScenarios: WinScenario[] = [
  {
    id: "reset-dns-ip",
    title: "Limpar cache DNS e renovar IP",
    goal: "Resolver falhas comuns de DNS e DHCP sem reiniciar o computador.",
    commands: [
      "ipconfig /flushdns",
      "ipconfig /release",
      "ipconfig /renew",
      "ipconfig /all",
    ],
    tags: ["rede", "dns", "dhcp", "ipconfig"],
    difficulty: "easy",
    anatomy: [
      { part: "/flushdns", explanation: "limpa nomes resolvidos em cache local" },
      { part: "/release", explanation: "libera o endereco DHCP atual" },
      { part: "/renew", explanation: "pede um novo endereco ao servidor DHCP" },
      { part: "/all", explanation: "confirma DNS, gateway, MAC e lease ativo" },
    ],
  },
  {
    id: "high-cpu-processes",
    title: "Listar processos com alta CPU",
    goal: "Encontrar processos suspeitos ou pesados e decidir se precisam ser encerrados.",
    commands: [
      "tasklist /v",
      "wmic path Win32_PerfFormattedData_PerfProc_Process get Name,IDProcess,PercentProcessorTime",
      "taskkill /pid <PID> /f",
    ],
    tags: ["processos", "cpu", "tasklist", "taskkill"],
    difficulty: "medium",
    anatomy: [
      { part: "tasklist /v", explanation: "mostra processos com detalhes extras" },
      { part: "Win32_PerfFormattedData", explanation: "consulta contadores de performance formatados" },
      { part: "PercentProcessorTime", explanation: "campo de uso de CPU do processo" },
      { part: "taskkill /pid", explanation: "encerra o processo identificado pelo PID" },
    ],
  },
  {
    id: "scheduled-task-cmd",
    title: "Criar tarefa agendada via CMD",
    goal: "Agendar uma rotina simples sem abrir a interface grafica do Agendador.",
    commands: [
      "schtasks /create /tn \"BackupDiario\" /tr \"cmd /c C:\\scripts\\backup.bat\" /sc daily /st 22:00",
      "schtasks /query /tn \"BackupDiario\" /v /fo list",
      "schtasks /run /tn \"BackupDiario\"",
    ],
    tags: ["agenda", "scripts", "schtasks"],
    difficulty: "medium",
    anatomy: [
      { part: "/create", explanation: "cria uma nova tarefa" },
      { part: "/tn", explanation: "define o nome da tarefa" },
      { part: "/tr", explanation: "define o comando executado" },
      { part: "/sc daily", explanation: "agenda execucao diaria" },
      { part: "/st 22:00", explanation: "define o horario da execucao" },
    ],
  },
  {
    id: "backup-robocopy",
    title: "Backup com robocopy",
    goal: "Copiar uma arvore de arquivos com log, poucas tentativas e preservacao de subpastas.",
    commands: [
      "mkdir D:\\Backups\\Projeto",
      "robocopy C:\\Projeto D:\\Backups\\Projeto /e /r:2 /w:5 /log:D:\\Backups\\backup.log",
      "type D:\\Backups\\backup.log | more",
    ],
    tags: ["backup", "robocopy", "disco"],
    difficulty: "easy",
    anatomy: [
      { part: "/e", explanation: "inclui subpastas vazias" },
      { part: "/r:2", explanation: "tenta novamente apenas duas vezes em caso de erro" },
      { part: "/w:5", explanation: "espera cinco segundos entre tentativas" },
      { part: "/log", explanation: "salva relatorio da copia" },
    ],
  },
  {
    id: "repair-disk-system",
    title: "Verificar e reparar disco",
    goal: "Combinar reparo de volume e arquivos protegidos do Windows.",
    commands: [
      "chkdsk C: /f",
      "sfc /scannow",
      "dism /online /cleanup-image /restorehealth",
      "sfc /scannow",
    ],
    tags: ["reparo", "chkdsk", "sfc", "dism"],
    difficulty: "hard",
    anatomy: [
      { part: "chkdsk /f", explanation: "corrige erros logicos no volume" },
      { part: "sfc /scannow", explanation: "verifica arquivos protegidos do sistema" },
      { part: "dism /restorehealth", explanation: "repara o armazenamento de componentes" },
      { part: "sfc novamente", explanation: "confirma reparo depois do DISM" },
    ],
  },
  {
    id: "manage-services",
    title: "Gerenciar servicos do Windows",
    goal: "Consultar, parar e iniciar servicos usando ferramentas nativas.",
    commands: [
      "sc query Spooler",
      "net stop Spooler",
      "net start Spooler",
      "sc query Spooler",
    ],
    tags: ["servicos", "sc", "net"],
    difficulty: "medium",
    anatomy: [
      { part: "sc query", explanation: "consulta estado detalhado do servico" },
      { part: "net stop", explanation: "solicita parada graciosa" },
      { part: "net start", explanation: "inicia o servico novamente" },
      { part: "Spooler", explanation: "nome do servico de impressao" },
    ],
  },
  {
    id: "recursive-findstr",
    title: "Busca recursiva de texto",
    goal: "Encontrar ocorrencias de texto dentro de muitos arquivos de configuracao.",
    commands: [
      "cd /d C:\\Projetos\\app",
      "findstr /s /i /n /c:\"connectionString\" *.config",
      "findstr /s /i /n \"TODO FIXME\" *.txt",
    ],
    tags: ["busca", "findstr", "arquivos"],
    difficulty: "easy",
    anatomy: [
      { part: "/s", explanation: "busca nas subpastas" },
      { part: "/i", explanation: "ignora maiusculas/minusculas" },
      { part: "/n", explanation: "mostra numero da linha" },
      { part: "/c:", explanation: "trata texto com espaco como padrao unico" },
    ],
  },
  {
    id: "environment-vars",
    title: "Configurar variaveis de ambiente",
    goal: "Definir variaveis temporarias e permanentes sem perder a sessao atual.",
    commands: [
      "set APP_ENV=dev",
      "echo %APP_ENV%",
      "setx APP_ENV dev",
      "reg query HKCU\\Environment /v APP_ENV",
    ],
    tags: ["ambiente", "set", "setx", "registro"],
    difficulty: "medium",
    anatomy: [
      { part: "set", explanation: "define variavel apenas na sessao atual" },
      { part: "setx", explanation: "persiste para novas sessoes" },
      { part: "%APP_ENV%", explanation: "expande a variavel no CMD" },
      { part: "HKCU\\Environment", explanation: "local onde variaveis do usuario ficam persistidas" },
    ],
  },
  {
    id: "map-network-drive",
    title: "Mapear drive de rede",
    goal: "Conectar um compartilhamento SMB como unidade do Windows.",
    commands: [
      "net use Z: \\\\fileserver\\dados /persistent:yes",
      "dir Z:\\",
      "net use",
      "net use Z: /delete",
    ],
    tags: ["rede", "smb", "net use"],
    difficulty: "easy",
    anatomy: [
      { part: "Z:", explanation: "letra atribuida ao compartilhamento" },
      { part: "\\\\fileserver\\dados", explanation: "caminho UNC do compartilhamento" },
      { part: "/persistent:yes", explanation: "mantem o mapeamento apos logon" },
      { part: "/delete", explanation: "remove o mapeamento quando nao for mais necessario" },
    ],
  },
  {
    id: "export-installed-programs",
    title: "Exportar lista de programas instalados",
    goal: "Gerar uma lista auditavel de softwares registrados no Windows.",
    commands: [
      "reg query HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall /s /v DisplayName > programas.txt",
      "reg query HKLM\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall /s /v DisplayName >> programas.txt",
      "type programas.txt | findstr /i \"DisplayName\"",
    ],
    tags: ["inventario", "registro", "software"],
    difficulty: "medium",
    anatomy: [
      { part: "HKLM\\Software", explanation: "area de programas 64 bits" },
      { part: "WOW6432Node", explanation: "area de programas 32 bits em Windows 64 bits" },
      { part: "> programas.txt", explanation: "cria o arquivo de saida" },
      { part: ">> programas.txt", explanation: "acrescenta ao arquivo existente" },
    ],
  },
];
