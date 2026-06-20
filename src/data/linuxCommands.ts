export interface LinuxFlag {
  flag: string;
  description: string;
  example?: string;
  danger?: boolean;
}

export interface LinuxVariation {
  command: string;
  description: string;
}

export interface LinuxExample {
  code: string;
  description: string;
}

export interface SyntaxPart {
  part: string;
  label: string;
  description: string;
  optional?: boolean;
}

export interface LinuxCommand {
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
  level: "básico" | "intermediário" | "avançado";
  uses: string[];
  variations: LinuxVariation[];
  examples: LinuxExample[];
  whenNotToUse: string[];
  relatedCommands: string[];
  deepDive?: string;
  flags?: LinuxFlag[];
  curiosities?: string[];
  syntaxBreakdown?: SyntaxPart[];
}

export const linuxLevelLabels: Record<string, string> = {
  básico: "Básico",
  intermediário: "Intermediário",
  avançado: "Avançado",
};

export const linuxCategoryLabels: Record<string, string> = {
  navigation: "Navegação",
  files: "Arquivos",
  content: "Conteúdo",
  pipeline: "Pipeline",
  system: "Sistema",
  network: "Rede",
};

export const linuxCommands: LinuxCommand[] = [
  {
    id: "ls",
    name: "ls",
    description: "Lista arquivos e diretórios.",
    syntax: "ls [opções] [caminho]",
    category: "navigation",
    level: "básico",
    uses: ["Ver conteúdo de uma pasta", "Inspecionar permissões e tamanhos", "Listar arquivos ocultos"],
    variations: [
      { command: "ls", description: "Lista o diretório atual" },
      { command: "ls -la", description: "Lista tudo com detalhes" },
      { command: "ls -lh /var/log", description: "Mostra tamanhos legíveis em /var/log" },
    ],
    examples: [{ code: "ls -lah", description: "Lista arquivos ocultos com tamanhos legíveis" }],
    whenNotToUse: ["Para buscar por nome em árvore grande, use find"],
    relatedCommands: ["cd", "pwd", "find"],
    flags: [
      { flag: "-l", description: "Formato longo com permissões, dono, grupo, tamanho e data" },
      { flag: "-a", description: "Inclui arquivos ocultos" },
      { flag: "-h", description: "Mostra tamanhos em KB/MB/GB quando usado com -l" },
      { flag: "-R", description: "Lista recursivamente" },
    ],
  },
  {
    id: "cd",
    name: "cd",
    description: "Muda o diretório atual do shell.",
    syntax: "cd [diretório]",
    category: "navigation",
    level: "básico",
    uses: ["Navegar entre pastas", "Voltar para home", "Subir um nível na árvore"],
    variations: [
      { command: "cd /etc", description: "Vai para /etc" },
      { command: "cd ..", description: "Sobe um diretório" },
      { command: "cd -", description: "Volta ao diretório anterior" },
    ],
    examples: [{ code: "cd ~/projetos", description: "Entra na pasta projetos dentro da home" }],
    whenNotToUse: ["Em scripts longos, prefira caminhos absolutos quando a posição atual não é garantida"],
    relatedCommands: ["pwd", "ls", "mkdir"],
    flags: [],
  },
  {
    id: "pwd",
    name: "pwd",
    description: "Mostra o caminho absoluto do diretório atual.",
    syntax: "pwd",
    category: "navigation",
    level: "básico",
    uses: ["Confirmar onde você está", "Depurar scripts", "Copiar caminho atual"],
    variations: [
      { command: "pwd", description: "Mostra o diretório atual" },
      { command: "pwd -P", description: "Resolve links simbólicos" },
    ],
    examples: [{ code: "echo \"Rodando em $(pwd)\"", description: "Usa o caminho atual em uma mensagem" }],
    whenNotToUse: ["Quando você precisa listar conteúdo, use ls"],
    relatedCommands: ["cd", "ls"],
    flags: [{ flag: "-P", description: "Mostra o caminho físico, resolvendo symlinks" }],
  },
  {
    id: "mkdir",
    name: "mkdir",
    description: "Cria diretórios.",
    syntax: "mkdir [opções] <diretório>",
    category: "navigation",
    level: "básico",
    uses: ["Criar pasta de projeto", "Criar hierarquia de diretórios", "Preparar diretório de backup"],
    variations: [
      { command: "mkdir logs", description: "Cria uma pasta" },
      { command: "mkdir -p app/logs/2026", description: "Cria toda a hierarquia se necessário" },
    ],
    examples: [{ code: "mkdir -p backup/diario", description: "Cria diretórios intermediários" }],
    whenNotToUse: ["Para criar arquivos vazios, use touch"],
    relatedCommands: ["cd", "rm", "cp"],
    flags: [
      { flag: "-p", description: "Cria pais intermediários e não falha se já existir" },
      { flag: "-m <modo>", description: "Define permissões iniciais" },
    ],
  },
  {
    id: "rm",
    name: "rm",
    description: "Remove arquivos e diretórios.",
    syntax: "rm [opções] <arquivo>",
    category: "navigation",
    level: "intermediário",
    uses: ["Remover arquivos", "Excluir diretórios recursivamente", "Limpar saídas geradas"],
    variations: [
      { command: "rm arquivo.log", description: "Remove um arquivo" },
      { command: "rm -r pasta", description: "Remove diretório e conteúdo" },
      { command: "rm -i *.tmp", description: "Pede confirmação para cada arquivo" },
    ],
    examples: [{ code: "rm -ri build/", description: "Remove diretório perguntando antes de cada ação" }],
    whenNotToUse: ["Sem revisar o caminho; rm não envia para lixeira", "Evite rm -rf com variáveis não validadas"],
    relatedCommands: ["find", "mv", "cp"],
    flags: [
      { flag: "-r / -R", description: "Remove recursivamente diretórios" },
      { flag: "-f", description: "Força remoção sem perguntar", danger: true },
      { flag: "-i", description: "Pergunta antes de remover" },
    ],
  },
  {
    id: "cp",
    name: "cp",
    description: "Copia arquivos e diretórios.",
    syntax: "cp [opções] <origem> <destino>",
    category: "navigation",
    level: "básico",
    uses: ["Copiar arquivo", "Duplicar diretório", "Preservar atributos em backup simples"],
    variations: [
      { command: "cp app.conf app.conf.bak", description: "Cria cópia de segurança" },
      { command: "cp -r src backup/src", description: "Copia diretório recursivamente" },
    ],
    examples: [{ code: "cp -av /etc/nginx ./nginx-backup", description: "Copia preservando atributos e mostrando progresso" }],
    whenNotToUse: ["Para sincronização incremental, prefira rsync"],
    relatedCommands: ["mv", "mkdir", "tar"],
    flags: [
      { flag: "-r", description: "Copia diretórios recursivamente" },
      { flag: "-a", description: "Modo arquivo: preserva permissões, donos e links" },
      { flag: "-v", description: "Mostra arquivos copiados" },
    ],
  },
  {
    id: "mv",
    name: "mv",
    description: "Move ou renomeia arquivos e diretórios.",
    syntax: "mv [opções] <origem> <destino>",
    category: "navigation",
    level: "básico",
    uses: ["Renomear arquivo", "Mover diretório", "Organizar arquivos"],
    variations: [
      { command: "mv antigo.txt novo.txt", description: "Renomeia arquivo" },
      { command: "mv *.log logs/", description: "Move logs para uma pasta" },
    ],
    examples: [{ code: "mv -i config.yml config.yml.old", description: "Renomeia pedindo confirmação se sobrescrever" }],
    whenNotToUse: ["Para copiar mantendo origem, use cp"],
    relatedCommands: ["cp", "rm", "ls"],
    flags: [
      { flag: "-i", description: "Pergunta antes de sobrescrever" },
      { flag: "-n", description: "Não sobrescreve destino existente" },
      { flag: "-v", description: "Mostra o que foi movido" },
    ],
  },
  {
    id: "cat",
    name: "cat",
    description: "Exibe ou concatena conteúdo de arquivos.",
    syntax: "cat [opções] <arquivo>",
    category: "files",
    level: "básico",
    uses: ["Ver arquivo pequeno", "Concatenar arquivos", "Enviar conteúdo para pipeline"],
    variations: [
      { command: "cat README.md", description: "Mostra arquivo" },
      { command: "cat parte1 parte2 > tudo.txt", description: "Concatena arquivos" },
    ],
    examples: [{ code: "cat /etc/os-release", description: "Mostra informações da distribuição" }],
    whenNotToUse: ["Para arquivos grandes, use less ou tail"],
    relatedCommands: ["grep", "tail", "less"],
    flags: [
      { flag: "-n", description: "Numera todas as linhas" },
      { flag: "-b", description: "Numera apenas linhas não vazias" },
    ],
  },
  {
    id: "grep",
    name: "grep",
    description: "Busca texto usando padrões ou expressões regulares.",
    syntax: "grep [opções] <padrão> [arquivo]",
    category: "files",
    level: "básico",
    uses: ["Buscar linhas em arquivos", "Filtrar saídas de comandos", "Busca recursiva em projeto"],
    variations: [
      { command: "grep 'erro' app.log", description: "Busca texto em arquivo" },
      { command: "grep -R 'TODO' src", description: "Busca recursiva em src" },
    ],
    examples: [{ code: "ps aux | grep nginx", description: "Filtra processos contendo nginx" }],
    whenNotToUse: ["Para busca por nome de arquivo, use find"],
    relatedCommands: ["find", "cat", "tail"],
    flags: [
      { flag: "-r / -R", description: "Busca recursivamente" },
      { flag: "-i", description: "Ignora maiúsculas/minúsculas" },
      { flag: "-n", description: "Mostra número da linha" },
      { flag: "-v", description: "Inverte a busca, mostrando linhas que não combinam" },
    ],
  },
  {
    id: "find",
    name: "find",
    description: "Encontra arquivos e diretórios por nome, tipo, tamanho, data e outras condições.",
    syntax: "find <caminho> [expressão]",
    category: "files",
    level: "intermediário",
    uses: ["Buscar arquivos por nome", "Encontrar arquivos grandes", "Executar ação em resultados"],
    variations: [
      { command: "find . -name '*.log'", description: "Busca logs no diretório atual" },
      { command: "find /var -type f -size +100M", description: "Arquivos maiores que 100 MB" },
    ],
    examples: [{ code: "find . -type f -name '*.tmp' -delete", description: "Remove arquivos temporários" }],
    whenNotToUse: ["Para buscar conteúdo dentro de arquivos, use grep -r"],
    relatedCommands: ["grep", "rm", "du"],
    flags: [
      { flag: "-name <padrão>", description: "Filtra por nome" },
      { flag: "-type f|d", description: "Filtra arquivos ou diretórios" },
      { flag: "-size +100M", description: "Filtra por tamanho" },
      { flag: "-delete", description: "Remove resultados encontrados", danger: true },
    ],
  },
  {
    id: "chmod",
    name: "chmod",
    description: "Altera permissões de arquivos e diretórios.",
    syntax: "chmod [opções] <modo> <arquivo>",
    category: "files",
    level: "intermediário",
    uses: ["Dar permissão de execução", "Ajustar acesso de leitura/escrita", "Corrigir permissões em lote"],
    variations: [
      { command: "chmod +x script.sh", description: "Permite executar script" },
      { command: "chmod 644 arquivo.txt", description: "Define permissões numéricas" },
    ],
    examples: [{ code: "chmod -R u+rwX,g+rX,o-rwx projeto/", description: "Ajusta permissões recursivamente" }],
    whenNotToUse: ["Para mudar dono/grupo, use chown"],
    relatedCommands: ["chown", "ls", "find"],
    flags: [
      { flag: "-R", description: "Aplica recursivamente" },
      { flag: "-v", description: "Mostra alterações realizadas" },
      { flag: "--reference <arquivo>", description: "Copia permissões de outro arquivo" },
    ],
  },
  {
    id: "chown",
    name: "chown",
    description: "Altera dono e grupo de arquivos e diretórios.",
    syntax: "chown [opções] <usuário>[:grupo] <arquivo>",
    category: "files",
    level: "intermediário",
    uses: ["Corrigir dono após sudo", "Ajustar arquivos de serviço", "Transferir diretórios para outro usuário"],
    variations: [
      { command: "sudo chown app:app /var/www/app", description: "Muda dono e grupo" },
      { command: "sudo chown -R $USER:$USER projeto", description: "Recupera posse de diretório" },
    ],
    examples: [{ code: "sudo chown -R www-data:www-data /var/www/site", description: "Define dono para servidor web" }],
    whenNotToUse: ["Sem entender impacto em serviços; permissões erradas quebram processos"],
    relatedCommands: ["chmod", "ls", "id"],
    flags: [
      { flag: "-R", description: "Aplica recursivamente" },
      { flag: "-v", description: "Mostra alterações" },
      { flag: "--from <dono>", description: "Só altera se o dono atual combinar" },
    ],
  },
  {
    id: "ps",
    name: "ps",
    description: "Lista processos em execução.",
    syntax: "ps [opções]",
    category: "system",
    level: "básico",
    uses: ["Inspecionar processos", "Encontrar PID", "Filtrar processo com grep"],
    variations: [
      { command: "ps aux", description: "Lista processos de todos os usuários" },
      { command: "ps -ef", description: "Formato completo estilo System V" },
    ],
    examples: [{ code: "ps aux | grep node", description: "Procura processos Node.js" }],
    whenNotToUse: ["Para monitoramento dinâmico, use top"],
    relatedCommands: ["top", "kill", "grep"],
    flags: [
      { flag: "aux", description: "Mostra todos os processos com usuário, CPU e memória" },
      { flag: "-ef", description: "Mostra todos os processos em formato completo" },
      { flag: "-p <pid>", description: "Mostra um processo específico" },
    ],
  },
  {
    id: "top",
    name: "top",
    description: "Monitora processos e uso de recursos em tempo real.",
    syntax: "top [opções]",
    category: "system",
    level: "básico",
    uses: ["Ver CPU e memória", "Identificar processo pesado", "Acompanhar carga do sistema"],
    variations: [
      { command: "top", description: "Abre monitor interativo" },
      { command: "top -p 1234", description: "Monitora um PID" },
    ],
    examples: [{ code: "top -o %CPU", description: "Ordena por uso de CPU em alguns sistemas" }],
    whenNotToUse: ["Para saída estática em script, use ps"],
    relatedCommands: ["ps", "kill", "free"],
    flags: [
      { flag: "-p <pid>", description: "Filtra por PID" },
      { flag: "-u <usuário>", description: "Mostra processos de um usuário" },
      { flag: "-b", description: "Modo batch para scripts" },
    ],
  },
  {
    id: "kill",
    name: "kill",
    description: "Envia sinais para processos, geralmente para encerrá-los.",
    syntax: "kill [sinal] <pid>",
    category: "system",
    level: "intermediário",
    uses: ["Encerrar processo travado", "Recarregar processo com sinal", "Automatizar controle de processos"],
    variations: [
      { command: "kill 1234", description: "Envia SIGTERM" },
      { command: "kill -9 1234", description: "Força encerramento" },
    ],
    examples: [{ code: "kill -15 $(cat app.pid)", description: "Encerra processo pelo PID salvo" }],
    whenNotToUse: ["Evite -9 antes de tentar encerramento normal"],
    relatedCommands: ["ps", "top", "pkill"],
    flags: [
      { flag: "-15 / SIGTERM", description: "Pede encerramento gracioso" },
      { flag: "-9 / SIGKILL", description: "Força encerramento imediato", danger: true },
      { flag: "-HUP", description: "Frequentemente usado para recarregar configuração" },
    ],
  },
  {
    id: "df",
    name: "df",
    description: "Mostra uso de espaço por filesystem montado.",
    syntax: "df [opções] [caminho]",
    category: "system",
    level: "básico",
    uses: ["Ver disco livre", "Identificar partição cheia", "Checar ponto de montagem"],
    variations: [
      { command: "df -h", description: "Uso de disco legível" },
      { command: "df -h /var", description: "Filesystem que contém /var" },
    ],
    examples: [{ code: "df -hT", description: "Mostra tipo e uso dos filesystems" }],
    whenNotToUse: ["Para tamanho de pastas, use du"],
    relatedCommands: ["du", "lsblk", "mount"],
    flags: [
      { flag: "-h", description: "Tamanhos legíveis" },
      { flag: "-T", description: "Mostra tipo do filesystem" },
      { flag: "-i", description: "Mostra uso de inodes" },
    ],
  },
  {
    id: "du",
    name: "du",
    description: "Calcula uso de disco de arquivos e diretórios.",
    syntax: "du [opções] [caminho]",
    category: "system",
    level: "básico",
    uses: ["Medir tamanho de pasta", "Encontrar diretórios grandes", "Auditar uso de disco"],
    variations: [
      { command: "du -sh .", description: "Total do diretório atual" },
      { command: "du -h --max-depth=1", description: "Tamanho das subpastas imediatas" },
    ],
    examples: [{ code: "du -ah . | sort -h | tail -20", description: "Mostra maiores entradas" }],
    whenNotToUse: ["Para espaço livre da partição, use df"],
    relatedCommands: ["df", "find", "sort"],
    flags: [
      { flag: "-s", description: "Mostra apenas total" },
      { flag: "-h", description: "Tamanhos legíveis" },
      { flag: "--max-depth=<n>", description: "Limita profundidade" },
    ],
  },
  {
    id: "uname",
    name: "uname",
    description: "Exibe informações do kernel e arquitetura.",
    syntax: "uname [opções]",
    category: "system",
    level: "básico",
    uses: ["Identificar kernel", "Ver arquitetura", "Diagnosticar ambiente"],
    variations: [
      { command: "uname -a", description: "Mostra todas as informações" },
      { command: "uname -m", description: "Mostra arquitetura" },
    ],
    examples: [{ code: "uname -srmo", description: "Kernel, release, arquitetura e sistema" }],
    whenNotToUse: ["Para detalhes da distro, veja /etc/os-release"],
    relatedCommands: ["cat", "hostnamectl"],
    flags: [
      { flag: "-a", description: "Todas as informações" },
      { flag: "-r", description: "Release do kernel" },
      { flag: "-m", description: "Arquitetura da máquina" },
    ],
  },
  {
    id: "ping",
    name: "ping",
    description: "Testa conectividade ICMP com um host.",
    syntax: "ping [opções] <host>",
    category: "network",
    level: "básico",
    uses: ["Testar rede", "Medir latência", "Ver perda de pacotes"],
    variations: [
      { command: "ping google.com", description: "Pinga até interromper" },
      { command: "ping -c 4 8.8.8.8", description: "Envia 4 pacotes" },
    ],
    examples: [{ code: "ping -c 3 github.com", description: "Teste rápido de conectividade" }],
    whenNotToUse: ["Quando ICMP é bloqueado; use curl para testar HTTP"],
    relatedCommands: ["curl", "ssh", "traceroute"],
    flags: [
      { flag: "-c <n>", description: "Quantidade de pacotes" },
      { flag: "-i <segundos>", description: "Intervalo entre pacotes" },
      { flag: "-W <segundos>", description: "Timeout de resposta" },
    ],
  },
  {
    id: "curl",
    name: "curl",
    description: "Faz requisições HTTP e transfere dados por URL.",
    syntax: "curl [opções] <url>",
    category: "network",
    level: "intermediário",
    uses: ["Testar API", "Baixar arquivo", "Inspecionar headers HTTP"],
    variations: [
      { command: "curl https://example.com", description: "Faz GET" },
      { command: "curl -I https://example.com", description: "Mostra headers" },
    ],
    examples: [{ code: "curl -s https://api.github.com/repos/user/repo", description: "Consulta API em modo silencioso" }],
    whenNotToUse: ["Para downloads simples com retomada automática, wget pode ser mais direto"],
    relatedCommands: ["wget", "ping", "ssh"],
    flags: [
      { flag: "-I", description: "Mostra apenas headers" },
      { flag: "-L", description: "Segue redirects" },
      { flag: "-o <arquivo>", description: "Salva resposta em arquivo" },
      { flag: "-X <método>", description: "Define método HTTP" },
    ],
  },
  {
    id: "wget",
    name: "wget",
    description: "Baixa arquivos via HTTP, HTTPS ou FTP.",
    syntax: "wget [opções] <url>",
    category: "network",
    level: "básico",
    uses: ["Baixar arquivo", "Retomar download", "Espelhar conteúdo simples"],
    variations: [
      { command: "wget https://example.com/app.tar.gz", description: "Baixa arquivo" },
      { command: "wget -c https://example.com/app.iso", description: "Retoma download" },
    ],
    examples: [{ code: "wget -O release.zip https://example.com/release.zip", description: "Baixa salvando com outro nome" }],
    whenNotToUse: ["Para APIs REST com headers e métodos customizados, curl é mais flexível"],
    relatedCommands: ["curl", "tar", "ssh"],
    flags: [
      { flag: "-O <arquivo>", description: "Define nome de saída" },
      { flag: "-c", description: "Continua download interrompido" },
      { flag: "-q", description: "Modo silencioso" },
    ],
  },
  {
    id: "ssh",
    name: "ssh",
    description: "Abre sessão segura em um host remoto.",
    syntax: "ssh [opções] usuário@host",
    category: "network",
    level: "intermediário",
    uses: ["Acessar servidor", "Executar comando remoto", "Criar túnel seguro"],
    variations: [
      { command: "ssh user@server", description: "Conecta ao servidor" },
      { command: "ssh -p 2222 user@server", description: "Usa porta customizada" },
    ],
    examples: [{ code: "ssh user@server 'uptime && df -h'", description: "Executa diagnóstico remoto" }],
    whenNotToUse: ["Sem validar host e credenciais; cuidado com acesso de produção"],
    relatedCommands: ["scp", "ping", "curl"],
    flags: [
      { flag: "-p <porta>", description: "Porta SSH" },
      { flag: "-i <chave>", description: "Arquivo de chave privada" },
      { flag: "-L", description: "Cria túnel local" },
    ],
  },
  {
    id: "tar",
    name: "tar",
    description: "Empacota e extrai arquivos .tar, com ou sem compressão.",
    syntax: "tar [opções] <arquivo.tar> [caminhos]",
    category: "files",
    level: "intermediário",
    uses: ["Criar backup", "Extrair pacote", "Compactar diretório"],
    variations: [
      { command: "tar -czf backup.tar.gz pasta/", description: "Cria .tar.gz" },
      { command: "tar -xzf backup.tar.gz", description: "Extrai .tar.gz" },
    ],
    examples: [{ code: "tar -czf logs-$(date +%F).tar.gz /var/log", description: "Backup comprimido com data" }],
    whenNotToUse: ["Para sincronização incremental entre máquinas, use rsync"],
    relatedCommands: ["cp", "du", "gzip"],
    flags: [
      { flag: "-c", description: "Cria arquivo tar" },
      { flag: "-x", description: "Extrai arquivo tar" },
      { flag: "-z", description: "Usa gzip" },
      { flag: "-f <arquivo>", description: "Define arquivo tar" },
    ],
  },
  {
    id: "systemctl",
    name: "systemctl",
    description: "Gerencia serviços do systemd.",
    syntax: "systemctl <ação> <serviço>",
    category: "system",
    level: "intermediário",
    uses: ["Ver status de serviço", "Iniciar e parar serviços", "Habilitar inicialização automática"],
    variations: [
      { command: "systemctl status nginx", description: "Mostra status" },
      { command: "sudo systemctl restart nginx", description: "Reinicia serviço" },
    ],
    examples: [{ code: "sudo systemctl enable --now nginx", description: "Habilita e inicia nginx" }],
    whenNotToUse: ["Em distros sem systemd, use o gerenciador de init disponível"],
    relatedCommands: ["journalctl", "ps", "top"],
    flags: [
      { flag: "status", description: "Mostra estado do serviço" },
      { flag: "restart", description: "Reinicia serviço" },
      { flag: "enable --now", description: "Habilita no boot e inicia agora" },
    ],
  },
  {
    id: "tail",
    name: "tail",
    description: "Mostra as últimas linhas de um arquivo e pode acompanhar novas linhas.",
    syntax: "tail [opções] <arquivo>",
    category: "files",
    level: "básico",
    uses: ["Ver final de logs", "Monitorar log em tempo real", "Inspecionar arquivo crescente"],
    variations: [
      { command: "tail app.log", description: "Mostra últimas 10 linhas" },
      { command: "tail -f app.log", description: "Acompanha novas linhas" },
    ],
    examples: [{ code: "tail -n 100 -f /var/log/syslog", description: "Mostra 100 linhas e segue o log" }],
    whenNotToUse: ["Para buscar histórico inteiro por termo, use grep"],
    relatedCommands: ["cat", "grep", "journalctl"],
    flags: [
      { flag: "-n <n>", description: "Quantidade de linhas" },
      { flag: "-f", description: "Segue o arquivo em tempo real" },
      { flag: "-F", description: "Segue mesmo se o arquivo for rotacionado" },
    ],
  },
];
