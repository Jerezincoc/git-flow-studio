export interface LinuxProblemStep {
  title: string;
  code?: string;
  description: string;
}

export interface LinuxProblem {
  id: string;
  title: string;
  symptom: string;
  cause: string;
  category:
    | "permissions"
    | "processes"
    | "filesystem"
    | "network"
    | "services"
    | "environment"
    | "packages"
    | "logs";
  difficulty: "easy" | "medium" | "hard";
  steps: LinuxProblemStep[];
  prevention?: string;
  relatedCommands: string[];
}

export const linuxProblemCategoryLabels: Record<string, string> = {
  permissions: "Permissões",
  processes:   "Processos",
  filesystem:  "Sistema de Arquivos",
  network:     "Rede",
  services:    "Serviços",
  environment: "Ambiente",
  packages:    "Pacotes",
  logs:        "Logs",
};

export const linuxProblems: LinuxProblem[] = [
  {
    id: "permission-denied-script",
    title: "Permissão negada ao executar script",
    symptom: "Ao tentar rodar ./meu_script.sh, o terminal responde: \"Permission denied\" ou \"bash: ./meu_script.sh: Permission denied\".",
    cause: "O arquivo existe mas não tem a flag de execução ativada. Por padrão, arquivos criados ou copiados não são automaticamente executáveis — você precisa dar permissão explicitamente.",
    category: "permissions",
    difficulty: "easy",
    steps: [
      {
        title: "Confirme que o problema é permissão",
        code: "ls -l meu_script.sh",
        description: "Olhe as 10 primeiras letras da linha. Se estiver -rw-r--r-- (sem nenhum 'x'), o arquivo não tem permissão de execução.",
      },
      {
        title: "Dê permissão de execução",
        code: "chmod +x meu_script.sh",
        description: "O chmod +x adiciona a flag de execução para o dono do arquivo. Depois disso, o 'x' vai aparecer nas permissões.",
      },
      {
        title: "Execute o script",
        code: "./meu_script.sh",
        description: "O ./ antes do nome indica 'executar esse arquivo no diretório atual'. Sem ele, o shell tentaria encontrar o script no PATH do sistema.",
      },
    ],
    prevention: "Se você vai distribuir scripts, adicione chmod +x como parte do processo de setup. Em repositórios Git, você pode versionar permissões com: git update-index --chmod=+x meu_script.sh",
    relatedCommands: ["chmod", "ls", "chown"],
  },
  {
    id: "command-not-found-after-install",
    title: "Comando não encontrado após instalar",
    symptom: "Você instalou um programa (npm install -g, pip install, apt install) mas ao digitar o comando aparece: \"command not found\" ou \"bash: nome-do-comando: command not found\".",
    cause: "O binário foi instalado em um diretório que não está no PATH do seu shell. O PATH é a lista de pastas onde o sistema procura por comandos — se o binário não está em nenhuma delas, o shell não o encontra.",
    category: "environment",
    difficulty: "easy",
    steps: [
      {
        title: "Descubra onde o programa foi instalado",
        code: "which nome-do-comando 2>/dev/null || find / -name nome-do-comando -type f 2>/dev/null | head -5",
        description: "O 'which' procura no PATH atual. O 'find' busca em todo o sistema. Se encontrar, anote o caminho.",
      },
      {
        title: "Veja seu PATH atual",
        code: "echo $PATH",
        description: "O PATH é uma lista de diretórios separados por ':'. Verifique se o diretório onde o programa foi instalado está nessa lista.",
      },
      {
        title: "Adicione o diretório ao PATH (temporariamente)",
        code: 'export PATH="$PATH:/caminho/para/o/binario"',
        description: "Substitua /caminho/para/o/binario pelo diretório real. Isso funciona apenas na sessão atual.",
      },
      {
        title: "Torne permanente adicionando ao seu .bashrc ou .zshrc",
        code: 'echo \'export PATH="$PATH:/caminho/para/o/binario"\' >> ~/.bashrc\nsource ~/.bashrc',
        description: "Isso faz o ajuste do PATH ser carregado toda vez que você abrir um terminal.",
      },
    ],
    prevention: "Antes de instalar qualquer ferramenta, verifique na documentação onde os binários ficam e se o instalador atualiza o PATH automaticamente. Ferramentas como nvm, pyenv e rbenv gerenciam isso por você.",
    relatedCommands: ["which", "export", "source"],
  },
  {
    id: "port-already-in-use",
    title: "Porta já em uso (EADDRINUSE)",
    symptom: "Ao iniciar um servidor ou aplicação, aparece: \"Error: listen EADDRINUSE: address already in use :::3000\" ou \"bind: Address already in use\".",
    cause: "Outro processo está usando essa porta. Pode ser uma instância anterior da sua aplicação que não foi encerrada corretamente, ou outro serviço rodando na mesma porta.",
    category: "network",
    difficulty: "easy",
    steps: [
      {
        title: "Descubra qual processo está usando a porta",
        code: "lsof -i :3000\n# ou\nss -tlnp | grep :3000",
        description: "O lsof lista os processos que têm a porta aberta. Anote o PID (número da segunda coluna).",
      },
      {
        title: "Encerre o processo",
        code: "kill <PID>\n# Se não funcionar:\nkill -9 <PID>",
        description: "Substitua <PID> pelo número encontrado. O kill normal dá uma chance do programa se encerrar graciosamente; o -9 força o encerramento imediato.",
      },
      {
        title: "Confirme que a porta está livre",
        code: "lsof -i :3000",
        description: "Se não aparecer nada, a porta está disponível.",
      },
      {
        title: "(Alternativa) Mude a porta da sua aplicação",
        description: "Se você não pode encerrar o processo existente, configure sua aplicação para usar outra porta (ex: 3001, 8080) através da variável de ambiente ou arquivo de configuração.",
      },
    ],
    prevention: "Garanta que sua aplicação encerra corretamente os sockets ao fechar (graceful shutdown). Em Node.js, capture os sinais SIGTERM e SIGINT para fechar o servidor antes de sair.",
    relatedCommands: ["lsof", "ss", "kill", "ps"],
  },
  {
    id: "ssh-connection-refused",
    title: "SSH recusando conexão",
    symptom: "\"ssh: connect to host servidor port 22: Connection refused\" ou \"Connection timed out\" ao tentar conectar via SSH.",
    cause: "O serviço SSH não está rodando no servidor, a porta está errada, ou um firewall está bloqueando a conexão.",
    category: "network",
    difficulty: "medium",
    steps: [
      {
        title: "Teste se o servidor é acessível",
        code: "ping -c 3 servidor\n# ou\ncurl -m 5 http://servidor",
        description: "Se o ping não responder mas você sabe que o servidor existe, provavelmente é um firewall bloqueando ICMP. Tente o curl para ver se há alguma resposta HTTP.",
      },
      {
        title: "Verifique se a porta SSH está aberta",
        code: "nc -zv servidor 22\n# ou tente outra porta comum:\nnc -zv servidor 2222",
        description: "O nc (netcat) tenta se conectar à porta. 'succeeded' = porta aberta, 'refused' = nada escutando nela.",
      },
      {
        title: "No servidor: verifique se o sshd está rodando",
        code: "sudo systemctl status sshd\n# ou\nsudo service ssh status",
        description: "Faça isso com acesso direto ao servidor (console, VNC, painel de controle). Se o serviço estiver parado, inicie-o.",
      },
      {
        title: "Inicie o serviço SSH se estiver parado",
        code: "sudo systemctl start sshd\nsudo systemctl enable sshd",
        description: "O enable garante que o SSH inicie automaticamente quando o servidor reiniciar.",
      },
      {
        title: "Verifique o firewall",
        code: "sudo ufw status\n# ou\nsudo iptables -L -n | grep 22",
        description: "Se o firewall estiver bloqueando a porta 22, libere-a.",
      },
    ],
    prevention: "Sempre mantenha uma segunda forma de acesso ao servidor (console do provedor, KVM, etc.) caso o SSH fique inacessível. Configure o sshd para iniciar automaticamente com systemctl enable.",
    relatedCommands: ["ssh", "systemctl", "ufw", "ping"],
  },
  {
    id: "disk-full-find-culprit",
    title: "Disco cheio — encontrar o culpado",
    symptom: "\"No space left on device\" ao salvar arquivos, ou aplicações falhando com erros genéricos que na verdade são falta de espaço em disco.",
    cause: "Algum arquivo, diretório ou processo encheu o disco. Pode ser logs crescendo sem rotação, cache de container/docker, arquivos de dump, ou arquivos temporários acumulados.",
    category: "filesystem",
    difficulty: "medium",
    steps: [
      {
        title: "Confirme que o disco está cheio e em qual partição",
        code: "df -h",
        description: "Procure a partição com 100% (ou próximo) no campo 'Use%'. Anote o 'Mounted on' para saber qual partição é o problema.",
      },
      {
        title: "Encontre as pastas que mais ocupam espaço",
        code: "du -sh /* 2>/dev/null | sort -h | tail -20",
        description: "Lista os 20 maiores diretórios na raiz. Repita o comando entrando nos diretórios suspeitos para afunilar.",
      },
      {
        title: "Investigue subdiretórios suspeitos",
        code: "du -sh /var/* 2>/dev/null | sort -h | tail -10",
        description: "Se /var foi o maior, entre nele e continue investigando. Logs ficam em /var/log, containers Docker em /var/lib/docker.",
      },
      {
        title: "Procure arquivos grandes específicos",
        code: "find / -type f -size +500M 2>/dev/null | sort -k5 -rn",
        description: "Lista arquivos acima de 500MB. Ajuste o tamanho conforme necessário.",
      },
      {
        title: "Limpe logs antigos e caches comuns",
        code: "sudo journalctl --vacuum-size=200M\nsudo apt clean\ndocker system prune -a   # cuidado: remove imagens não usadas",
        description: "journalctl --vacuum-size limpa logs do systemd mantendo apenas os últimos 200MB. apt clean remove pacotes .deb baixados.",
      },
    ],
    prevention: "Configure rotação de logs com logrotate. Para sistemas com Docker, configure --log-max-size no daemon. Crie alertas quando o disco atingir 80% usando cron ou ferramentas de monitoramento.",
    relatedCommands: ["df", "du", "find", "journalctl"],
  },
  {
    id: "zombie-process",
    title: "Processo zumbi que não morre",
    symptom: "kill -9 <PID> não encerra o processo. O processo aparece no ps aux com estado 'Z' (zombie) e continua existindo mesmo após kill.",
    cause: "Processos zumbi já terminaram sua execução mas seu processo pai ainda não leu o status de saída. O sistema mantém a entrada na tabela de processos até que o pai chame wait(). Não é possível matar um zumbi — o verdadeiro problema é o processo pai.",
    category: "processes",
    difficulty: "hard",
    steps: [
      {
        title: "Confirme que é realmente um processo zumbi",
        code: "ps aux | awk '$8==\"Z\" {print $0}'",
        description: "A coluna STAT com 'Z' indica processo zumbi. Se for zumbi, kill -9 não vai funcionar — continue lendo.",
      },
      {
        title: "Encontre o processo pai (PPID)",
        code: "ps -o ppid= -p <PID_DO_ZUMBI>",
        description: "O pai é responsável por coletar o status de saída do filho. Substitua <PID_DO_ZUMBI> pelo PID do processo zumbi.",
      },
      {
        title: "Verifique o processo pai",
        code: "ps aux | grep <PPID>",
        description: "Se o pai for um processo da sua aplicação que está travado, encerre-o.",
      },
      {
        title: "Envie SIGCHLD ao pai para forçar limpeza",
        code: "kill -SIGCHLD <PPID>",
        description: "SIGCHLD é o sinal que avisa ao pai que um filho terminou. Às vezes o pai estava dormindo e isso o acorda para chamar wait().",
      },
      {
        title: "Se necessário, encerre o processo pai",
        code: "kill <PPID>\n# Se não funcionar:\nkill -9 <PPID>",
        description: "Quando o pai morre, o init (PID 1) adota os filhos zumbi e os limpa automaticamente.",
      },
    ],
    prevention: "Em código de aplicação, sempre capture o sinal SIGCHLD e chame wait() nos processos filhos. Evite fork() sem gerenciar o ciclo de vida dos filhos.",
    relatedCommands: ["ps", "kill", "top"],
  },
  {
    id: "env-var-not-persisting",
    title: "Variável de ambiente não persiste após reboot",
    symptom: "Você definiu uma variável de ambiente (export MINHA_VAR=valor) e ela funciona na sessão atual, mas desaparece ao abrir novo terminal ou reiniciar o sistema.",
    cause: "O comando export define a variável apenas para a sessão atual do shell. Quando o terminal fecha, tudo que foi definido com export é perdido — é como escrever na memória sem salvar em disco.",
    category: "environment",
    difficulty: "easy",
    steps: [
      {
        title: "Confirme o problema",
        code: "echo $MINHA_VAR",
        description: "Abra um novo terminal e veja se a variável ainda existe. Se estiver vazia ou 'not found', confirma o problema.",
      },
      {
        title: "Adicione a variável ao arquivo de inicialização do shell",
        code: 'echo \'export MINHA_VAR="meu_valor"\' >> ~/.bashrc\n# Para zsh:\necho \'export MINHA_VAR="meu_valor"\' >> ~/.zshrc',
        description: "O .bashrc é executado toda vez que um novo terminal bash é aberto. O .zshrc é o equivalente para zsh.",
      },
      {
        title: "Recarregue o arquivo de configuração",
        code: "source ~/.bashrc",
        description: "Isso aplica as mudanças na sessão atual sem precisar fechar e abrir o terminal.",
      },
      {
        title: "Confirme que funcionou",
        code: "echo $MINHA_VAR",
        description: "Abra um novo terminal e verifique que a variável está disponível.",
      },
    ],
    prevention: "Para variáveis que afetam todo o sistema (não só o seu usuário), adicione em /etc/environment. Para serviços systemd, use a diretiva Environment= no arquivo .service em vez de depender do .bashrc.",
    relatedCommands: ["export", "source", "which"],
  },
  {
    id: "git-ssl-certificate",
    title: "Git push bloqueado por certificado SSL",
    symptom: "\"SSL certificate problem: unable to get local issuer certificate\" ou \"SSL certificate problem: certificate has expired\" ao executar git push, git pull ou git clone.",
    cause: "O Git não consegue verificar o certificado SSL do servidor. Pode ser porque o certificado expirou, é autoassinado, ou sua máquina não tem os certificados CA (Certificate Authority) atualizados.",
    category: "network",
    difficulty: "medium",
    steps: [
      {
        title: "Identifique o erro exato",
        code: "GIT_CURL_VERBOSE=1 git push 2>&1 | grep -i ssl",
        description: "Mostra detalhes da comunicação SSL para entender o problema real.",
      },
      {
        title: "Atualize os certificados CA do sistema",
        code: "# Debian/Ubuntu:\nsudo apt update && sudo apt install -y ca-certificates\nsudo update-ca-certificates\n\n# RedHat/CentOS:\nsudo yum update ca-certificates",
        description: "Na maioria dos casos, certificados desatualizados no sistema operacional são a causa. Este comando atualiza.",
      },
      {
        title: "Se for certificado corporativo ou autoassinado, adicione-o ao Git",
        code: "git config --global http.sslCAInfo /caminho/para/certificado.crt",
        description: "Aponta o Git para usar um arquivo de certificado específico.",
      },
      {
        title: "(Solução temporária, não recomendada para produção) Desabilite a verificação",
        code: "git config --global http.sslVerify false",
        description: "Desabilita a verificação SSL. Útil para diagnóstico, mas deixa você vulnerável a ataques man-in-the-middle. Use apenas em redes confiáveis.",
      },
    ],
    prevention: "Mantenha o sistema operacional e os certificados CA atualizados. Para ambientes corporativos, distribua o certificado CA interno via playbook Ansible ou script de provisionamento.",
    relatedCommands: ["curl", "wget", "ssh"],
  },
  {
    id: "systemctl-service-not-starting",
    title: "Serviço não iniciando com systemctl",
    symptom: "sudo systemctl start meu-servico retorna 'Failed' ou o serviço aparece como 'inactive (dead)' logo após ser iniciado.",
    cause: "O serviço pode estar com erro de configuração, falta de dependências, problema de permissão, ou erro no código da aplicação que faz ele fechar logo após iniciar.",
    category: "services",
    difficulty: "medium",
    steps: [
      {
        title: "Veja o status detalhado do serviço",
        code: "sudo systemctl status meu-servico",
        description: "Mostra o estado atual, últimas linhas de log e o código de saída. Leia a linha 'Main PID' e 'Active' para entender o que aconteceu.",
      },
      {
        title: "Veja os logs completos do serviço",
        code: "sudo journalctl -u meu-servico -n 50 --no-pager",
        description: "O -u filtra por unidade (serviço), -n 50 mostra as últimas 50 linhas. Leia os erros para entender a causa raiz.",
      },
      {
        title: "Verifique o arquivo de configuração do serviço",
        code: "sudo systemctl cat meu-servico",
        description: "Mostra o arquivo .service completo. Verifique ExecStart (o comando que inicia o serviço), User (com qual usuário roda) e os caminhos dos arquivos.",
      },
      {
        title: "Teste o comando manualmente",
        code: "# Copie o ExecStart do arquivo .service e rode manualmente:\nsudo -u usuario-do-servico /caminho/para/o/binario --flags",
        description: "Se o comando falhar quando rodado manualmente, você verá o erro real diretamente no terminal, sem a camada do systemd.",
      },
      {
        title: "Recarregue configurações e reinicie",
        code: "sudo systemctl daemon-reload\nsudo systemctl restart meu-servico",
        description: "O daemon-reload é necessário após editar arquivos .service para o systemd reconhecer as mudanças.",
      },
    ],
    prevention: "Sempre use journalctl como primeiro diagnóstico. Configure Restart=on-failure no arquivo .service para serviços críticos. Adicione logs no início da sua aplicação para facilitar diagnóstico.",
    relatedCommands: ["systemctl", "journalctl", "ps"],
  },
  {
    id: "file-deleted-accidentally",
    title: "Arquivo deletado por engano sem backup",
    symptom: "Você executou rm arquivo.txt (ou rm -rf pasta/) e quer recuperar o conteúdo.",
    cause: "No Linux, rm remove permanentemente sem enviar para lixeira. Se o arquivo estava em uso por algum processo, há chance de recuperação via /proc. Caso contrário, a recuperação depende de ferramentas de baixo nível.",
    category: "filesystem",
    difficulty: "hard",
    steps: [
      {
        title: "Não escreva no disco imediatamente",
        description: "A regra mais importante: pare de usar o sistema de arquivos. Escrever novos dados pode sobrescrever os blocos onde o arquivo estava. Se for crítico, desmonte a partição.",
      },
      {
        title: "Verifique se algum processo ainda tem o arquivo aberto",
        code: "lsof | grep 'deleted'",
        description: "Enquanto um processo tem o arquivo aberto, o conteúdo ainda está acessível via /proc — mesmo que o arquivo já não apareça no ls.",
      },
      {
        title: "Recupere via /proc se o arquivo ainda está aberto",
        code: "# Encontre o PID e fd do processo com o arquivo:\nlsof | grep nome_do_arquivo\n# Copie o conteúdo:\ncp /proc/<PID>/fd/<FD> /tmp/arquivo_recuperado",
        description: "Substitua <PID> pelo ID do processo e <FD> pelo descritor de arquivo (fd). Isso funciona apenas se o processo ainda estiver rodando com o arquivo aberto.",
      },
      {
        title: "Para partição ext4: tente extundelete",
        code: "sudo apt install extundelete\nsudo extundelete /dev/sda1 --restore-file /caminho/relativo/arquivo.txt",
        description: "extundelete tenta recuperar arquivos em sistemas ext3/ext4. Funciona melhor quanto menos o disco foi usado após a deleção.",
      },
      {
        title: "Alternativa: TestDisk/PhotoRec",
        code: "sudo apt install testdisk\nsudo photorec /dev/sda1",
        description: "PhotoRec é uma ferramenta poderosa de recuperação de arquivos que vasculha o disco bruto em busca de assinaturas de arquivos conhecidos.",
      },
    ],
    prevention: "Use backups regulares (rsync, borgbackup, tar cron). Configure snapshots no sistema de arquivos (btrfs, ZFS, LVM). Para scripts destrutivos, use 'rm -i' que pede confirmação ou alias rm='rm -i' no .bashrc.",
    relatedCommands: ["lsof", "find", "cp"],
  },
  {
    id: "apt-broken-dependency",
    title: "Dependência quebrada no apt",
    symptom: "\"dpkg: error processing package...\" ou \"E: Unmet dependencies\" ou \"The following packages have unmet dependencies\" ao instalar ou atualizar pacotes com apt.",
    cause: "O banco de dados de pacotes ficou em estado inconsistente. Pode acontecer após interrupção durante instalação, conflito entre repositórios ou pacotes incompatíveis.",
    category: "packages",
    difficulty: "medium",
    steps: [
      {
        title: "Tente o comando de autocorreção do apt",
        code: "sudo apt --fix-broken install",
        description: "O apt tenta resolver dependências pendentes e corrigir a instalação. É o primeiro comando a tentar.",
      },
      {
        title: "Reconfigure pacotes com instalação interrompida",
        code: "sudo dpkg --configure -a",
        description: "Finaliza a configuração de pacotes que ficaram pela metade. Deve ser rodado antes ou após o apt --fix-broken.",
      },
      {
        title: "Atualize a lista de pacotes",
        code: "sudo apt update",
        description: "Garante que você tem as informações mais recentes dos repositórios antes de tentar instalar dependências.",
      },
      {
        title: "Se o problema persistir, identifique o pacote problemático",
        code: "sudo dpkg -l | grep -E '^(rc|iU|iHR)'",
        description: "Pacotes com status rc são removidos mas ainda têm arquivos de configuração; iU/iHR são instalações incompletas. Esses são os suspeitos.",
      },
      {
        title: "Remova o pacote problemático",
        code: "sudo apt remove --purge nome-do-pacote\nsudo apt autoremove",
        description: "O --purge remove também os arquivos de configuração. O autoremove limpa dependências órfãs.",
      },
    ],
    prevention: "Não interrompa (Ctrl+C) instalações de pacotes. Evite misturar PPAs com repositórios oficiais sem verificar compatibilidade. Faça 'sudo apt update' antes de instalar.",
    relatedCommands: ["find", "which", "ls"],
  },
  {
    id: "locale-wrong-characters",
    title: "Locale errado gerando caracteres estranhos",
    symptom: "Caracteres especiais (acentos, ç, emojis) aparecem como '?', caixinhas ou sequências de símbolos esquisitos. Ou erros como: \"bash: warning: setlocale: LC_ALL: cannot change locale\".",
    cause: "O locale define o idioma e a codificação de caracteres do sistema. Se estiver errado ou não gerado, programas não sabem como interpretar e exibir texto em UTF-8.",
    category: "environment",
    difficulty: "easy",
    steps: [
      {
        title: "Verifique o locale atual",
        code: "locale",
        description: "Mostra as configurações atuais de idioma. Valores 'C' ou 'POSIX' indicam locale básico sem suporte a caracteres especiais.",
      },
      {
        title: "Verifique quais locales estão gerados",
        code: "locale -a | grep -i utf",
        description: "Lista os locales disponíveis no sistema. Se pt_BR.UTF-8 ou en_US.UTF-8 não aparecerem, precisam ser gerados.",
      },
      {
        title: "Gere o locale necessário",
        code: "sudo locale-gen pt_BR.UTF-8\n# ou para inglês:\nsudo locale-gen en_US.UTF-8\nsudo update-locale LANG=pt_BR.UTF-8",
        description: "locale-gen cria os arquivos de locale. update-locale define o padrão do sistema.",
      },
      {
        title: "Defina o locale para a sessão atual",
        code: 'export LANG=pt_BR.UTF-8\nexport LC_ALL=pt_BR.UTF-8',
        description: "Para persistir, adicione essas linhas ao ~/.bashrc.",
      },
      {
        title: "Reinicie a sessão ou o serviço afetado",
        description: "Alguns programas precisam ser reiniciados para capturar as mudanças de locale.",
      },
    ],
    prevention: "Configure o locale correto durante a instalação do sistema. Em containers Docker, adicione ao Dockerfile: ENV LANG=en_US.UTF-8 e RUN locale-gen en_US.UTF-8.",
    relatedCommands: ["export", "source"],
  },
  {
    id: "cron-job-not-running",
    title: "Cron job não está executando",
    symptom: "Você configurou uma tarefa no crontab mas ela nunca roda no horário esperado, ou roda mas sem o efeito esperado.",
    cause: "Cron jobs rodam em um ambiente mínimo sem as variáveis de ambiente da sua sessão (como PATH, HOME, etc.). Erros silenciosos são comuns porque cron não exibe output no terminal.",
    category: "services",
    difficulty: "medium",
    steps: [
      {
        title: "Confirme que o cron está rodando",
        code: "sudo systemctl status cron\n# ou em sistemas mais antigos:\nservice cron status",
        description: "Se o serviço cron não estiver ativo, as tarefas nunca serão executadas.",
      },
      {
        title: "Verifique a sintaxe do crontab",
        code: "crontab -l",
        description: "Liste suas tarefas e verifique a sintaxe. O formato é: minuto hora dia-do-mês mês dia-da-semana comando. Use crontab.guru para validar.",
      },
      {
        title: "Capture o output da tarefa para um arquivo de log",
        code: "# Edite o crontab:\ncrontab -e\n# Adicione redirecionamento de output:\n*/5 * * * * /caminho/script.sh >> /tmp/cron.log 2>&1",
        description: "O >> /tmp/cron.log 2>&1 redireciona tanto stdout quanto stderr para um arquivo de log. Verifique esse arquivo para ver erros.",
      },
      {
        title: "Use caminhos absolutos no crontab",
        code: '# Errado:\n*/5 * * * * python3 script.py\n# Correto:\n*/5 * * * * /usr/bin/python3 /home/user/scripts/script.py',
        description: "Cron tem um PATH mínimo. Sempre use caminhos absolutos para comandos e scripts.",
      },
      {
        title: "Verifique os logs do sistema sobre execuções do cron",
        code: "grep CRON /var/log/syslog | tail -20\n# ou\nsudo journalctl -u cron -n 30",
        description: "Mostra quando o cron tentou executar as tarefas e possíveis erros.",
      },
    ],
    prevention: "Sempre teste o script manualmente antes de colocar no cron. Adicione log de output no crontab. Use ferramentas como crontab.guru para validar a expressão de horário.",
    relatedCommands: ["crontab", "journalctl", "systemctl"],
  },
  {
    id: "firewall-blocking-port",
    title: "Firewall bloqueando porta silenciosamente",
    symptom: "Um serviço está rodando (você confirma com ss ou lsof que está escutando na porta), mas a conexão de fora não funciona — sem mensagem de erro clara, apenas timeout.",
    cause: "O firewall do sistema (iptables/ufw/firewalld) está descartando os pacotes silenciosamente (DROP) ou rejeitando a conexão. 'Silenciosamente' é importante: o cliente fica esperando sem receber resposta.",
    category: "network",
    difficulty: "medium",
    steps: [
      {
        title: "Confirme que o serviço está escutando na porta certa",
        code: "ss -tlnp | grep :80\n# ou:\nlsof -i :80",
        description: "Se o serviço não aparecer aqui, o problema não é o firewall — o serviço não está rodando.",
      },
      {
        title: "Verifique o status do firewall",
        code: "# UFW (Ubuntu):\nsudo ufw status verbose\n# iptables:\nsudo iptables -L -n -v\n# firewalld (CentOS/Fedora):\nsudo firewall-cmd --list-all",
        description: "Veja se há regras bloqueando a porta em questão.",
      },
      {
        title: "Libere a porta no UFW",
        code: "sudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\nsudo ufw reload",
        description: "Substitua 80 e 443 pelas portas do seu serviço.",
      },
      {
        title: "Libere a porta no iptables",
        code: "sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT\nsudo iptables-save > /etc/iptables/rules.v4",
        description: "O iptables-save persiste as regras. Sem isso, as regras somem ao reiniciar.",
      },
      {
        title: "Teste de fora da máquina",
        code: "# De outra máquina ou usando online tools:\ncurl -v http://ip-do-servidor:porta\nnc -zv ip-do-servidor porta",
        description: "Testar de fora confirma se o problema é o firewall ou configuração de rede mais ampla.",
      },
    ],
    prevention: "Documente as regras de firewall do servidor. Use IaC (Terraform, Ansible) para gerenciar regras de firewall, evitando divergências entre servidores. Mantenha uma regra de allow para SSH antes de qualquer deny-all.",
    relatedCommands: ["ss", "lsof", "ping", "curl"],
  },
  {
    id: "swap-full-system-slow",
    title: "Swap cheio travando o sistema",
    symptom: "Sistema extremamente lento, processos demorando muito para responder, ou mensagem 'OOM killer activated' nos logs. free -h mostra swap com 100% de uso.",
    cause: "A memória RAM esgotou e o sistema começou a usar o swap (espaço em disco como RAM virtual). Disco é muito mais lento que RAM, por isso o sistema trava. O OOM killer começa a matar processos quando até o swap acaba.",
    category: "processes",
    difficulty: "hard",
    steps: [
      {
        title: "Veja o estado atual da memória",
        code: "free -h\nswapon --show",
        description: "free -h mostra RAM e swap em formato legível. Se o swap estiver cheio, siga os próximos passos.",
      },
      {
        title: "Identifique os processos que mais consomem memória",
        code: "ps aux --sort=-%mem | head -20",
        description: "Lista processos do que mais consome memória para o que menos consome. O culpado geralmente está no topo.",
      },
      {
        title: "Verifique o OOM killer nos logs para saber o que foi morto",
        code: "sudo dmesg | grep -i 'oom\\|out of memory\\|killed process'",
        description: "Mostra quais processos o sistema matou automaticamente por falta de memória.",
      },
      {
        title: "Encerre processos que você não precisa",
        code: "kill <PID_do_processo_pesado>",
        description: "Libere memória encerrando processos não essenciais. Após liberar RAM, o sistema começa a descarregar dados do swap para a memória.",
      },
      {
        title: "Force a limpeza do swap (apenas se houver RAM disponível)",
        code: "sudo swapoff -a && sudo swapon -a",
        description: "Desativa e reativa o swap, forçando o sistema a mover dados de volta para a RAM. Só faça isso se free -h mostrar RAM disponível suficiente — caso contrário pode travar mais.",
      },
    ],
    prevention: "Monitore uso de memória com alertas em 70-80%. Adicione swap adequado (mínimo igual à RAM para servidores, o dobro da RAM para desktops). Considere ajustar vm.swappiness para reduzir uso de swap (echo 10 > /proc/sys/vm/swappiness).",
    relatedCommands: ["top", "ps", "kill", "free"],
  },
  {
    id: "mount-point-not-found",
    title: "Mount point não encontrado",
    symptom: "\"mount: /mnt/dados: can't read superblock\" ou \"mount: /mnt/disco: special device /dev/sdb1 does not exist\" ao tentar montar um disco ou partição.",
    cause: "O dispositivo especificado não existe, o ponto de montagem não foi criado, ou o sistema de arquivos está corrompido.",
    category: "filesystem",
    difficulty: "medium",
    steps: [
      {
        title: "Identifique os dispositivos disponíveis",
        code: "lsblk\nsudo fdisk -l 2>/dev/null | grep ^/dev",
        description: "lsblk lista todos os discos e partições de forma visual. Use isso para confirmar o nome correto do dispositivo (sda, sdb, nvme0n1, etc.).",
      },
      {
        title: "Crie o ponto de montagem se não existir",
        code: "sudo mkdir -p /mnt/dados",
        description: "O ponto de montagem é só uma pasta vazia onde o disco será 'conectado' ao sistema de arquivos.",
      },
      {
        title: "Monte o dispositivo correto",
        code: "sudo mount /dev/sdb1 /mnt/dados",
        description: "Use o nome correto do dispositivo confirmado no passo 1.",
      },
      {
        title: "Se der erro de superblock, verifique o sistema de arquivos",
        code: "sudo fsck -y /dev/sdb1",
        description: "fsck verifica e tenta corrigir erros no sistema de arquivos. Nunca rode fsck em uma partição montada.",
      },
      {
        title: "Para montar automaticamente no boot, adicione ao /etc/fstab",
        code: "# Descubra o UUID do dispositivo:\nsudo blkid /dev/sdb1\n# Adicione ao /etc/fstab:\n# UUID=xxxx-xxxx /mnt/dados ext4 defaults 0 2",
        description: "Use UUID em vez de /dev/sdb1 no fstab pois o UUID é permanente, mas o nome do dispositivo pode mudar.",
      },
    ],
    prevention: "Sempre use UUID no /etc/fstab em vez de /dev/sdX. Após editar o fstab, teste com 'mount -a' antes de reiniciar para garantir que a configuração está correta.",
    relatedCommands: ["df", "find", "ls"],
  },
  {
    id: "ssh-key-permission-wrong",
    title: "Permissão de SSH key incorreta (must be 600)",
    symptom: "\"WARNING: UNPROTECTED PRIVATE KEY FILE!\" e \"Permissions 0644 for '/home/user/.ssh/id_rsa' are too open\" ao tentar usar SSH com chave privada. O SSH recusa a usar a chave.",
    cause: "Por segurança, o SSH se recusa a usar chaves privadas que estão acessíveis para outros usuários. Se as permissões permitirem leitura por grupo ou outros, o SSH considera a chave comprometida e se nega a usá-la.",
    category: "permissions",
    difficulty: "easy",
    steps: [
      {
        title: "Veja as permissões atuais",
        code: "ls -la ~/.ssh/",
        description: "A pasta .ssh deve ser 700 (drwx------) e os arquivos de chave privada devem ser 600 (-rw-------).",
      },
      {
        title: "Corrija as permissões da chave privada",
        code: "chmod 600 ~/.ssh/id_rsa\n# Para outras chaves:\nchmod 600 ~/.ssh/id_ed25519\nchmod 600 ~/.ssh/id_ecdsa",
        description: "600 significa que apenas o dono pode ler e escrever. Grupo e outros não têm nenhum acesso.",
      },
      {
        title: "Corrija as permissões da pasta .ssh",
        code: "chmod 700 ~/.ssh",
        description: "A pasta .ssh em si também precisa ser acessível apenas pelo dono.",
      },
      {
        title: "Corrija o authorized_keys se necessário",
        code: "chmod 600 ~/.ssh/authorized_keys",
        description: "O arquivo authorized_keys (chaves públicas permitidas) também deve ter permissão 600.",
      },
      {
        title: "Teste a conexão",
        code: "ssh -v usuario@servidor",
        description: "O -v (verbose) mostra detalhes da autenticação. Verifique se a chave está sendo aceita.",
      },
    ],
    prevention: "Ao criar chaves SSH com ssh-keygen, as permissões já são configuradas corretamente. O problema geralmente ocorre quando a chave é copiada de outro lugar (cp, rsync, editor de texto) que não preserva permissões.",
    relatedCommands: ["chmod", "ssh", "ls"],
  },
  {
    id: "log-filling-disk",
    title: "Log crescendo e enchendo o disco",
    symptom: "df -h mostra /var com alta ocupação e crescendo. Ao investigar, /var/log contém arquivos de log gigantescos (centenas de MB ou GB).",
    cause: "Aplicações em loop de erro, debug logging ativado em produção, rotação de logs mal configurada, ou uma aplicação com bug que gera output excessivo.",
    category: "logs",
    difficulty: "medium",
    steps: [
      {
        title: "Identifique o arquivo de log maior",
        code: "du -sh /var/log/* | sort -h | tail -20",
        description: "Mostra os 20 maiores itens em /var/log. O culpado geralmente é óbvio.",
      },
      {
        title: "Veja o que está sendo escrito no log",
        code: "tail -f /var/log/arquivo-suspeito.log | head -20",
        description: "Veja as últimas linhas em tempo real. Se linhas aparecerem muito rápido, a aplicação está em loop de erro.",
      },
      {
        title: "Limpe os logs do journald do systemd",
        code: "sudo journalctl --vacuum-size=200M\n# ou por tempo:\nsudo journalctl --vacuum-time=7d",
        description: "vacuum-size mantém apenas os últimos 200MB de logs. vacuum-time mantém apenas os últimos 7 dias.",
      },
      {
        title: "Truncate um arquivo de log específico (emergência)",
        code: "> /var/log/arquivo-enorme.log",
        description: "O > sem comando antes trunca o arquivo para zero bytes SEM fechar ele — o processo que está escrevendo continua funcionando.",
      },
      {
        title: "Configure o logrotate para rotação automática",
        code: "# Crie /etc/logrotate.d/minha-app:\n/var/log/minha-app/*.log {\n  daily\n  rotate 7\n  compress\n  missingok\n  notifempty\n  copytruncate\n}",
        description: "logrotate roda diariamente, rotaciona (renomeia) o log, mantém 7 versões comprimidas e cria novo arquivo vazio.",
      },
    ],
    prevention: "Configure logrotate para todos os seus serviços. Em aplicações, use níveis de log appropriados em produção (INFO/WARN, nunca DEBUG). Monitore uso de /var com alertas em 80%.",
    relatedCommands: ["df", "du", "tail", "journalctl", "find"],
  },
];

export function getLinuxProblemById(id: string): LinuxProblem | undefined {
  return linuxProblems.find((p) => p.id === id);
}
