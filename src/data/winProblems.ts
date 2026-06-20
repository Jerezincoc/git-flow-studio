export interface WinProblemStep {
  title: string;
  code?: string;
  description: string;
}

export interface WinProblem {
  id: string;
  title: string;
  symptom: string;
  cause: string;
  category:
    | "permissions"
    | "processes"
    | "services"
    | "environment"
    | "filesystem"
    | "network"
    | "updates"
    | "registry"
    | "hardware"
    | "security";
  difficulty: "easy" | "medium" | "hard";
  steps: WinProblemStep[];
  prevention?: string;
  relatedCommands: string[];
}

export const winProblemCategoryLabels: Record<string, string> = {
  permissions: "Permissoes",
  processes: "Processos",
  services: "Servicos",
  environment: "Ambiente",
  filesystem: "Arquivos e Disco",
  network: "Rede",
  updates: "Atualizacoes",
  registry: "Registro",
  hardware: "Hardware",
  security: "Seguranca",
};

const adminTip = "Abra o Prompt de Comando como Administrador quando o comando alterar servicos, rede, disco, firewall ou Registro.";

export const winProblems: WinProblem[] = [
  {
    id: "access-denied-script",
    title: "Acesso negado ao executar script",
    symptom: "Um .bat ou comando falha com Access is denied, mesmo quando o arquivo existe.",
    cause: "O usuario nao tem permissao NTFS, o arquivo veio bloqueado, ou a acao exige elevacao administrativa.",
    category: "permissions",
    difficulty: "easy",
    steps: [
      { title: "Confirme permissoes", code: "icacls C:\\scripts\\setup.bat", description: "Veja se seu usuario ou grupo tem leitura e execucao." },
      { title: "Teste em prompt elevado", description: adminTip },
      { title: "Conceda acesso se for apropriado", code: "icacls C:\\scripts /grant %USERNAME%:RX /t", description: "Concede leitura e execucao ao usuario atual na pasta de scripts." },
    ],
    prevention: "Guarde scripts operacionais em pastas com ACL documentada e evite executar de downloads sem revisar origem.",
    relatedCommands: ["icacls", "attrib", "cmd-c"],
  },
  {
    id: "port-in-use",
    title: "Porta em uso",
    symptom: "Uma aplicacao nao inicia porque a porta ja esta ocupada.",
    cause: "Outro processo esta escutando na porta, muitas vezes uma instancia antiga do proprio app.",
    category: "processes",
    difficulty: "easy",
    steps: [
      { title: "Ache o PID dono da porta", code: "netstat -ano | find \":8080\"", description: "Troque 8080 pela porta em conflito e anote o PID." },
      { title: "Identifique o processo", code: "tasklist /fi \"PID eq <PID>\"", description: "Confirme o nome antes de encerrar." },
      { title: "Encerre se for seguro", code: "taskkill /pid <PID> /f", description: "Use /f apenas se o processo nao fechar normalmente." },
    ],
    prevention: "Configure shutdown gracioso no app e portas diferentes para ambientes paralelos.",
    relatedCommands: ["netstat", "tasklist", "taskkill"],
  },
  {
    id: "service-not-starting",
    title: "Servico nao iniciando",
    symptom: "sc start ou net start retorna erro e o servico fica STOPPED.",
    cause: "Dependencia ausente, conta sem permissao, binario inexistente ou configuracao invalida.",
    category: "services",
    difficulty: "medium",
    steps: [
      { title: "Veja o estado", code: "sc query NomeDoServico", description: "Confirme codigo de erro e estado atual." },
      { title: "Consulte eventos", code: "wevtutil qe System /c:20 /rd:true /f:text | findstr /i \"service error\"", description: "Procure eventos recentes ligados ao servico." },
      { title: "Reinicie depois de corrigir causa", code: "sc start NomeDoServico", description: "Teste novamente apos ajustar conta, caminho ou dependencia." },
    ],
    prevention: "Documente dependencias e monitore eventos de Service Control Manager.",
    relatedCommands: ["sc", "net", "tasklist"],
  },
  {
    id: "env-var-not-persisting",
    title: "Variavel de ambiente nao persistindo",
    symptom: "set NOME=valor funciona no terminal atual, mas some ao abrir nova janela.",
    cause: "set altera apenas a sessao atual; persistencia exige setx ou Registro.",
    category: "environment",
    difficulty: "easy",
    steps: [
      { title: "Defina para a sessao atual", code: "set APP_ENV=dev", description: "Isso resolve apenas o terminal aberto." },
      { title: "Persista para novas sessoes", code: "setx APP_ENV dev", description: "setx grava no perfil do usuario." },
      { title: "Confirme no Registro", code: "reg query HKCU\\Environment /v APP_ENV", description: "Mostra o valor persistido para o usuario." },
    ],
    prevention: "Use set para scripts temporarios e setx para configuracao persistente.",
    relatedCommands: ["set", "setx", "reg-query"],
  },
  {
    id: "file-in-use-delete",
    title: "Arquivo em uso nao pode ser deletado",
    symptom: "del falha dizendo que o arquivo esta sendo usado por outro processo.",
    cause: "Um programa mantem handle aberto no arquivo ou a pasta esta em uso.",
    category: "filesystem",
    difficulty: "medium",
    steps: [
      { title: "Identifique processos suspeitos", code: "tasklist /v | findstr /i \"app\"", description: "Procure o aplicativo que pode ter aberto o arquivo." },
      { title: "Feche ou encerre o processo", code: "taskkill /im app.exe", description: "Tente sem /f primeiro para evitar perda de dados." },
      { title: "Remova o arquivo", code: "del /f C:\\temp\\arquivo.lock", description: "Use /f somente apos liberar o handle." },
    ],
    prevention: "Feche apps antes de limpar pastas e evite apagar arquivos de bancos ou logs ativos.",
    relatedCommands: ["tasklist", "taskkill", "del"],
  },
  {
    id: "dns-not-resolving",
    title: "DNS nao resolvendo",
    symptom: "Sites nao abrem por nome, mas IPs respondem.",
    cause: "Cache DNS ruim, servidor DNS indisponivel ou configuracao de rede incorreta.",
    category: "network",
    difficulty: "easy",
    steps: [
      { title: "Compare IP e nome", code: "ping 8.8.8.8\nping example.com", description: "Se IP responde e nome falha, foque em DNS." },
      { title: "Limpe o cache", code: "ipconfig /flushdns", description: "Remove resolucoes antigas." },
      { title: "Teste servidor DNS", code: "nslookup example.com 8.8.8.8", description: "Compara com DNS publico." },
    ],
    prevention: "Documente DNS corporativo e evite misturar VPNs sem revisar adaptadores.",
    relatedCommands: ["ipconfig", "nslookup", "ping"],
  },
  {
    id: "windows-update-stuck",
    title: "Windows Update travado",
    symptom: "Atualizacoes ficam paradas em download, instalacao ou verificacao.",
    cause: "Cache do Windows Update corrompido ou servicos relacionados travados.",
    category: "updates",
    difficulty: "medium",
    steps: [
      { title: "Pare servicos", code: "net stop wuauserv\nnet stop bits", description: "Interrompe Update e transferencia em segundo plano." },
      { title: "Renomeie cache", code: "ren C:\\Windows\\SoftwareDistribution SoftwareDistribution.old", description: "Forca recriacao do cache." },
      { title: "Inicie servicos", code: "net start bits\nnet start wuauserv", description: "Retoma componentes do update." },
    ],
    prevention: "Mantenha espaco livre e evite desligar durante instalacoes.",
    relatedCommands: ["net", "ren", "sfc"],
  },
  {
    id: "corrupt-driver-sfc",
    title: "Driver corrompido ou arquivos do sistema",
    symptom: "Falhas de driver, telas azuis ou recursos do Windows quebrados.",
    cause: "Arquivos protegidos ou componentes do Windows foram corrompidos.",
    category: "hardware",
    difficulty: "medium",
    steps: [
      { title: "Rode SFC", code: "sfc /scannow", description: "Repara arquivos protegidos quando possivel." },
      { title: "Repare a imagem", code: "dism /online /cleanup-image /restorehealth", description: "Corrige o armazenamento usado pelo SFC." },
      { title: "Rode SFC novamente", code: "sfc /scannow", description: "Confirma reparo apos DISM." },
    ],
    prevention: "Atualize drivers por canais confiaveis e crie ponto de restauracao antes de mudancas grandes.",
    relatedCommands: ["sfc", "dism", "systeminfo"],
  },
  {
    id: "corrupt-user-profile",
    title: "Perfil de usuario corrompido",
    symptom: "Login cria perfil temporario ou configuracoes do usuario somem.",
    cause: "Perfil local danificado ou chave ProfileList inconsistente.",
    category: "registry",
    difficulty: "hard",
    steps: [
      { title: "Confirme perfil temporario", code: "echo %USERPROFILE%", description: "Veja se o caminho aponta para TEMP ou perfil inesperado." },
      { title: "Liste perfis no Registro", code: "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList\"", description: "Procure SIDs duplicados ou .bak." },
      { title: "Crie usuario novo se necessario", code: "net user NovoUsuario SenhaForte /add", description: "Em casos graves, migre dados para perfil limpo." },
    ],
    prevention: "Evite desligamentos forcados durante logon/logoff e mantenha backups do perfil.",
    relatedCommands: ["reg-query", "net", "xcopy"],
  },
  {
    id: "disk-full-culprit",
    title: "Disco cheio - encontrar culpado",
    symptom: "C: fica sem espaco e apps passam a falhar.",
    cause: "Logs, downloads, caches, backups ou dumps cresceram sem controle.",
    category: "filesystem",
    difficulty: "medium",
    steps: [
      { title: "Liste pastas grandes", code: "for /d %d in (C:\\*) do @echo %d", description: "Base para revisar diretorios de topo." },
      { title: "Procure arquivos grandes", code: "dir C:\\ /s /a:-d /o:-s | more", description: "Ordena por tamanho em cada pasta listada." },
      { title: "Mova backup com robocopy", code: "robocopy C:\\Dados D:\\Backup\\Dados /e /move", description: "Move dados para outro volume quando apropriado." },
    ],
    prevention: "Monitore espaco livre e defina rotacao de logs/backups.",
    relatedCommands: ["dir", "robocopy", "del"],
  },
  {
    id: "firewall-blocking-port",
    title: "Firewall bloqueando porta",
    symptom: "Servico escuta localmente, mas conexoes externas falham.",
    cause: "Regra de firewall ausente ou bloqueio de perfil publico/privado.",
    category: "security",
    difficulty: "medium",
    steps: [
      { title: "Confirme porta local", code: "netstat -ano | find \":443\"", description: "Verifique se ha processo escutando." },
      { title: "Adicione regra", code: "netsh advfirewall firewall add rule name=\"App 443\" dir=in action=allow protocol=TCP localport=443", description: "Libera entrada TCP na porta." },
      { title: "Teste de outra maquina", description: "Valide fora do host para confirmar rede e firewall." },
    ],
    prevention: "Documente portas de cada servico e aplique regras por perfil correto.",
    relatedCommands: ["netstat", "ipconfig", "ping"],
  },
  {
    id: "scheduled-task-not-running",
    title: "Tarefa agendada nao executando",
    symptom: "A tarefa existe, mas nao roda no horario esperado ou falha sem output.",
    cause: "Credenciais, caminho relativo, permissao ou condicao do Agendador bloqueia execucao.",
    category: "services",
    difficulty: "medium",
    steps: [
      { title: "Consulte a tarefa", code: "schtasks /query /tn \"MinhaTarefa\" /v /fo list", description: "Veja ultimo resultado, usuario e agendamento." },
      { title: "Execute manualmente", code: "schtasks /run /tn \"MinhaTarefa\"", description: "Diferencia problema de agenda e problema do comando." },
      { title: "Use caminhos absolutos", code: "cmd /c C:\\scripts\\rotina.bat", description: "Evite depender do diretorio atual." },
    ],
    prevention: "Registre logs nos scripts chamados pelo Agendador.",
    relatedCommands: ["cmd-c", "call", "echo"],
  },
  {
    id: "expired-ssl-certificate",
    title: "Certificado SSL expirado",
    symptom: "Navegadores ou clientes recusam conexao HTTPS por certificado vencido.",
    cause: "Certificado do servidor passou da validade ou cadeia intermediaria esta incorreta.",
    category: "security",
    difficulty: "medium",
    steps: [
      { title: "Confirme data do sistema", code: "date /t\ntime /t", description: "Relogio local errado pode parecer certificado vencido." },
      { title: "Teste DNS e porta", code: "nslookup site.exemplo\nping site.exemplo", description: "Garanta que voce esta acessando o host correto." },
      { title: "Renove no servidor", description: "Use o processo do IIS, proxy ou provedor de certificados usado pela aplicacao." },
    ],
    prevention: "Monitore vencimento com alerta pelo menos 30 dias antes.",
    relatedCommands: ["nslookup", "ping", "netstat"],
  },
  {
    id: "printer-offline",
    title: "Impressora offline",
    symptom: "A impressora aparece offline ou jobs ficam presos na fila.",
    cause: "Spooler travado, driver instavel, porta incorreta ou impressora desconectada.",
    category: "hardware",
    difficulty: "easy",
    steps: [
      { title: "Reinicie spooler", code: "net stop Spooler\nnet start Spooler", description: "Limpa estado comum de fila travada." },
      { title: "Verifique servico", code: "sc query Spooler", description: "Confirme que esta RUNNING." },
      { title: "Teste rede", code: "ping <ip-da-impressora>", description: "Confirme conectividade com impressora de rede." },
    ],
    prevention: "Mantenha driver atualizado e IP da impressora reservado no DHCP.",
    relatedCommands: ["net", "sc", "ping"],
  },
  {
    id: "rdp-not-connecting",
    title: "RDP nao conectando",
    symptom: "Remote Desktop falha por timeout, credencial ou conexao recusada.",
    cause: "Servico parado, firewall, porta 3389 bloqueada ou usuario sem permissao.",
    category: "network",
    difficulty: "medium",
    steps: [
      { title: "Teste conectividade", code: "ping servidor", description: "Confirme que o host responde na rede." },
      { title: "Veja porta RDP", code: "netstat -ano | find \":3389\"", description: "No servidor, confirme porta em escuta." },
      { title: "Confirme servico", code: "sc query TermService", description: "TermService precisa estar ativo." },
    ],
    prevention: "Documente regras de firewall e grupos autorizados a usar RDP.",
    relatedCommands: ["ping", "netstat", "sc"],
  },
  {
    id: "wsl-not-starting",
    title: "WSL nao iniciando",
    symptom: "wsl abre com erro ou distribuicao nao inicia.",
    cause: "Virtualizacao desativada, recurso WSL quebrado ou distribuicao em estado inconsistente.",
    category: "services",
    difficulty: "medium",
    steps: [
      { title: "Verifique versao do Windows", code: "systeminfo | findstr /i \"OS Version Hyper-V\"", description: "Confirme suporte e virtualizacao." },
      { title: "Repare arquivos do sistema", code: "sfc /scannow\ndism /online /cleanup-image /restorehealth", description: "Corrige componentes que afetam recursos opcionais." },
      { title: "Reinicie servicos relacionados", description: "Reinicie o Windows apos ativar recursos de virtualizacao/WSL." },
    ],
    prevention: "Mantenha Windows atualizado e virtualizacao habilitada no firmware.",
    relatedCommands: ["systeminfo", "sfc", "dism"],
  },
  {
    id: "registry-permission-denied",
    title: "Permissao negada no Registro",
    symptom: "reg add ou reg delete falha com Access is denied.",
    cause: "Chave protegida exige administrador, ownership diferente ou politica corporativa.",
    category: "registry",
    difficulty: "hard",
    steps: [
      { title: "Teste leitura", code: "reg query HKLM\\Software\\MinhaChave", description: "Confirme caminho e permissao basica." },
      { title: "Abra prompt elevado", description: adminTip },
      { title: "Evite forcar sem backup", code: "reg export HKLM\\Software\\MinhaChave backup.reg", description: "Exporte antes de qualquer alteracao." },
    ],
    prevention: "Gerencie Registro critico por GPO ou script versionado com rollback.",
    relatedCommands: ["reg-query", "reg-add", "reg-delete"],
  },
  {
    id: "program-not-uninstalling",
    title: "Programa nao desinstalando",
    symptom: "Desinstalador falha ou programa continua aparecendo instalado.",
    cause: "Uninstaller quebrado, MSI inconsistente ou entrada de Registro obsoleta.",
    category: "registry",
    difficulty: "medium",
    steps: [
      { title: "Liste entradas instaladas", code: "reg query HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall /s /v DisplayName", description: "Procure o programa e sua chave." },
      { title: "Procure tambem 32 bits", code: "reg query HKLM\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall /s /v DisplayName", description: "Muitos apps 32 bits ficam aqui." },
      { title: "Use desinstalador oficial", description: "Execute UninstallString da chave quando identificado e confiavel." },
    ],
    prevention: "Prefira instaladores oficiais e evite apagar pastas de programa manualmente antes de desinstalar.",
    relatedCommands: ["reg-query", "cmd-c", "dir"],
  },
];

export function getWinProblemById(id: string): WinProblem | undefined {
  return winProblems.find((problem) => problem.id === id);
}
