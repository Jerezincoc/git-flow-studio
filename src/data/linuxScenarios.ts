export interface LinuxScenarioAnatomyPart {
  part: string;
  explanation: string;
}

export interface LinuxScenario {
  id: string;
  title: string;
  goal: string;
  commands: string[];
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  anatomy: LinuxScenarioAnatomyPart[];
}

export const linuxScenarioDifficultyLabels: Record<string, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
};

export const linuxScenarios: LinuxScenario[] = [
  {
    id: "find-large-files",
    title: "Encontrar arquivos pesados",
    goal: "Listar os maiores arquivos abaixo de um diretório para liberar espaço com segurança.",
    commands: [
      "find /var/log -type f -size +100M -printf '%s %p\\n'",
      "  | sort -nr",
      "  | head -20",
    ],
    tags: ["disco", "find", "sort", "arquivos"],
    difficulty: "easy",
    anatomy: [
      { part: "find /var/log", explanation: "inicia a busca dentro de /var/log" },
      { part: "-type f", explanation: "retorna apenas arquivos" },
      { part: "-size +100M", explanation: "filtra arquivos maiores que 100 MB" },
      { part: "sort -nr", explanation: "ordena numericamente do maior para o menor" },
      { part: "head -20", explanation: "mostra os 20 primeiros resultados" },
    ],
  },
  {
    id: "bulk-permissions",
    title: "Corrigir permissões em lote",
    goal: "Ajustar permissões de diretórios e arquivos sem abrir acesso excessivo.",
    commands: [
      "find ./site -type d -exec chmod 755 {} \\;",
      "find ./site -type f -exec chmod 644 {} \\;",
      "find ./site -type f -name '*.sh' -exec chmod 755 {} \\;",
    ],
    tags: ["permissões", "chmod", "find"],
    difficulty: "medium",
    anatomy: [
      { part: "-type d", explanation: "seleciona apenas diretórios" },
      { part: "chmod 755", explanation: "permite entrar/listar diretórios sem liberar escrita pública" },
      { part: "-type f", explanation: "seleciona apenas arquivos" },
      { part: "chmod 644", explanation: "arquivos ficam legíveis, mas escrita restrita ao dono" },
      { part: "-exec ... {} \\;", explanation: "executa o comando para cada resultado encontrado" },
    ],
  },
  {
    id: "monitor-processes",
    title: "Monitorar processos",
    goal: "Encontrar processos consumindo CPU ou memória e decidir se precisam ser encerrados.",
    commands: [
      "ps aux --sort=-%cpu | head -10",
      "ps aux --sort=-%mem | head -10",
      "top",
    ],
    tags: ["processos", "ps", "top", "cpu"],
    difficulty: "easy",
    anatomy: [
      { part: "ps aux", explanation: "lista processos de todos os usuários" },
      { part: "--sort=-%cpu", explanation: "ordena por CPU decrescente" },
      { part: "head -10", explanation: "mantém os 10 primeiros" },
      { part: "top", explanation: "abre monitor interativo em tempo real" },
    ],
  },
  {
    id: "network-connectivity",
    title: "Diagnosticar conectividade de rede",
    goal: "Testar DNS, latência e disponibilidade HTTP de um serviço.",
    commands: [
      "ping -c 4 example.com",
      "curl -I -L https://example.com",
      "ssh -v user@example.com",
    ],
    tags: ["rede", "ping", "curl", "ssh"],
    difficulty: "medium",
    anatomy: [
      { part: "ping -c 4", explanation: "envia quatro pacotes ICMP e mostra perda/latência" },
      { part: "curl -I", explanation: "busca apenas headers HTTP" },
      { part: "-L", explanation: "segue redirecionamentos" },
      { part: "ssh -v", explanation: "mostra detalhes da conexão SSH para depuração" },
    ],
  },
  {
    id: "backup-with-tar",
    title: "Criar backup com tar",
    goal: "Compactar uma pasta com timestamp para backup portátil.",
    commands: [
      "mkdir -p ~/backups",
      "tar -czf ~/backups/projeto-$(date +%Y%m%d-%H%M).tar.gz ./projeto",
      "ls -lh ~/backups",
    ],
    tags: ["backup", "tar", "date"],
    difficulty: "easy",
    anatomy: [
      { part: "mkdir -p", explanation: "cria a pasta de destino se ela ainda não existir" },
      { part: "tar -czf", explanation: "cria um tar comprimido com gzip no arquivo indicado" },
      { part: "$(date ...)", explanation: "injeta data e hora no nome do arquivo" },
      { part: "ls -lh", explanation: "confirma o backup e mostra tamanho legível" },
    ],
  },
  {
    id: "recursive-grep",
    title: "Busca recursiva de texto",
    goal: "Encontrar ocorrências de um termo dentro de vários arquivos de código.",
    commands: [
      "grep -RIn --exclude-dir=node_modules 'TODO\\|FIXME' ./src",
      "grep -RIn 'DATABASE_URL' .",
    ],
    tags: ["busca", "grep", "texto"],
    difficulty: "easy",
    anatomy: [
      { part: "grep -R", explanation: "busca recursivamente" },
      { part: "-I", explanation: "ignora arquivos binários" },
      { part: "-n", explanation: "mostra número da linha" },
      { part: "--exclude-dir", explanation: "remove diretórios irrelevantes da busca" },
    ],
  },
  {
    id: "manage-services",
    title: "Gerenciar serviços com systemctl",
    goal: "Verificar, reiniciar e habilitar um serviço systemd.",
    commands: [
      "systemctl status nginx",
      "sudo systemctl restart nginx",
      "sudo systemctl enable --now nginx",
      "journalctl -u nginx -n 50 --no-pager",
    ],
    tags: ["serviços", "systemctl", "journalctl"],
    difficulty: "medium",
    anatomy: [
      { part: "systemctl status", explanation: "mostra estado, PID e últimos logs do serviço" },
      { part: "restart", explanation: "para e inicia o serviço novamente" },
      { part: "enable --now", explanation: "habilita no boot e inicia imediatamente" },
      { part: "journalctl -u", explanation: "filtra logs de uma unidade systemd" },
    ],
  },
  {
    id: "tail-live-log",
    title: "Acompanhar log em tempo real",
    goal: "Ver novas linhas de log conforme a aplicação escreve eventos.",
    commands: [
      "tail -n 100 -f /var/log/syslog",
      "tail -F ./logs/app.log | grep --line-buffered 'ERROR\\|WARN'",
    ],
    tags: ["logs", "tail", "grep"],
    difficulty: "easy",
    anatomy: [
      { part: "tail -n 100", explanation: "começa mostrando as últimas 100 linhas" },
      { part: "-f", explanation: "segue novas linhas no arquivo" },
      { part: "-F", explanation: "continua seguindo mesmo após rotação do log" },
      { part: "grep --line-buffered", explanation: "filtra em tempo real sem atrasar a saída" },
    ],
  },
];
