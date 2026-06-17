export interface ProblemStep {
  title: string;
  command?: string;
  description: string;
}

export interface GitProblem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  steps: ProblemStep[];
  expectedResult: string;
}

export const problems: GitProblem[] = [
  {
    id: "wrong-branch-commit",
    title: "Commit na branch errada",
    description: "Você fez commit na branch errada e precisa mover para a branch correta.",
    emoji: "🔀",
    steps: [
      { title: "Anote o hash do commit", command: "git log --oneline -1", description: "Copie o hash do commit que quer mover." },
      { title: "Desfaça o commit (mantendo alterações)", command: "git reset --soft HEAD~1", description: "Isso remove o commit mas mantém as alterações no staging." },
      { title: "Guarde as alterações temporariamente", command: "git stash", description: "Salva as alterações em um stash temporário." },
      { title: "Mude para a branch correta", command: "git checkout branch-correta", description: "Troque para a branch onde o commit deveria estar." },
      { title: "Recupere as alterações", command: "git stash pop", description: "Traz de volta as alterações do stash." },
      { title: "Faça o commit na branch certa", command: 'git commit -m "sua mensagem"', description: "Agora o commit está na branch correta." },
    ],
    expectedResult: "O commit agora está na branch correta e foi removido da branch errada.",
  },
  {
    id: "merge-conflict",
    title: "Conflito de merge",
    description: "Ao fazer merge ou pull, apareceram conflitos que precisam ser resolvidos.",
    emoji: "⚔️",
    steps: [
      { title: "Identifique os arquivos com conflito", command: "git status", description: "Arquivos marcados como 'both modified' têm conflitos." },
      { title: "Abra os arquivos conflitantes", description: "Procure os marcadores <<<<<<< HEAD, =======, e >>>>>>> branch. O conteúdo entre <<<< e ==== é sua versão. Entre ==== e >>>> é a outra versão." },
      { title: "Resolva cada conflito", description: "Edite o arquivo mantendo o código correto. Remova todos os marcadores (<<<<, ====, >>>>)." },
      { title: "Adicione os arquivos resolvidos", command: "git add .", description: "Marca os conflitos como resolvidos." },
      { title: "Finalize o merge", command: 'git commit -m "resolve conflitos"', description: "Completa o merge com os conflitos resolvidos." },
    ],
    expectedResult: "O merge é completado com sucesso e todos os conflitos estão resolvidos.",
  },
  {
    id: "undo-last-commit",
    title: "Desfazer último commit",
    description: "Você quer desfazer o último commit, seja mantendo ou descartando as alterações.",
    emoji: "⏪",
    steps: [
      { title: "Opção 1: Manter alterações no staging", command: "git reset --soft HEAD~1", description: "Desfaz o commit mas mantém tudo pronto para um novo commit." },
      { title: "Opção 2: Manter alterações fora do staging", command: "git reset HEAD~1", description: "Desfaz o commit e o staging, mas mantém os arquivos modificados." },
      { title: "Opção 3: Descartar tudo (CUIDADO!)", command: "git reset --hard HEAD~1", description: "Remove completamente o commit e todas as alterações. IRREVERSÍVEL!" },
      { title: "Se já fez push", command: "git revert HEAD", description: "Cria um novo commit que desfaz o anterior. Seguro para branches compartilhadas." },
    ],
    expectedResult: "O último commit é desfeito conforme a opção escolhida.",
  },
  {
    id: "large-file-pushed",
    title: "Arquivo grande enviado",
    description: "Você commitou um arquivo muito grande e o push está falhando ou o repositório ficou pesado.",
    emoji: "📦",
    steps: [
      { title: "Adicione ao .gitignore", command: "echo 'arquivo-grande.zip' >> .gitignore", description: "Previne que o arquivo seja rastreado novamente." },
      { title: "Remova do rastreamento", command: "git rm --cached arquivo-grande.zip", description: "Remove do Git sem deletar o arquivo local." },
      { title: "Reescreva o histórico (se necessário)", command: "git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch arquivo-grande.zip' HEAD", description: "Remove o arquivo de TODOS os commits anteriores." },
      { title: "Force push", command: "git push --force", description: "Envia o histórico reescrito. Avise sua equipe antes!" },
    ],
    expectedResult: "O arquivo grande é removido do histórico e o repositório volta ao tamanho normal.",
  },
  {
    id: "push-rejected",
    title: "Push rejeitado",
    description: "O git push falhou com erro 'rejected' porque o remoto tem commits que você não tem localmente.",
    emoji: "🚫",
    steps: [
      { title: "Baixe as alterações remotas", command: "git pull --rebase origin main", description: "Baixa os commits remotos e reaplica os seus por cima." },
      { title: "Resolva conflitos (se houver)", command: "git status", description: "Se aparecerem conflitos, resolva-os como em um merge normal." },
      { title: "Continue o rebase após resolver", command: "git rebase --continue", description: "Depois de resolver cada conflito, continue o rebase." },
      { title: "Faça o push", command: "git push origin main", description: "Agora o push deve funcionar normalmente." },
    ],
    expectedResult: "Seus commits são enviados com sucesso, incluindo os commits que estavam no remoto.",
  },
  {
    id: "broken-repo",
    title: "Repositório corrompido",
    description: "O repositório está com erros estranhos e nada parece funcionar.",
    emoji: "💥",
    steps: [
      { title: "Verifique a integridade", command: "git fsck --full", description: "Verifica objetos corrompidos no repositório." },
      { title: "Tente limpar e otimizar", command: "git gc --prune=now", description: "Remove objetos não utilizados e otimiza o repositório." },
      { title: "Se nada funcionar: backup e re-clone", command: "cp -r meu-projeto meu-projeto-backup\ngit clone <url> meu-projeto-novo", description: "Faça backup dos arquivos e clone novamente." },
      { title: "Copie alterações não commitadas", description: "Copie os arquivos modificados do backup para o clone novo e faça commit." },
    ],
    expectedResult: "O repositório volta a funcionar normalmente, com todo o histórico preservado.",
  },
  {
    id: "deleted-branch",
    title: "Deletei uma branch sem dar merge",
    description: "Você deletou uma branch acidentalmente e perdeu commits que não foram mergeados.",
    emoji: "🗑️",
    steps: [
      { title: "Veja o histórico de ações recentes", command: "git reflog", description: "O reflog guarda tudo que aconteceu, incluindo commits de branches deletadas. Procure o hash do último commit da branch perdida." },
      { title: "Anote o hash do commit", description: "Copie o hash (ex: a1b2c3d) que aparece antes da mensagem do commit que você quer recuperar." },
      { title: "Recrie a branch a partir do hash", command: "git checkout -b nome-da-branch a1b2c3d", description: "Isso recria a branch exatamente onde ela estava." },
      { title: "Confirme que está tudo certo", command: "git log --oneline", description: "Verifique se os commits que você queria estão presentes." },
    ],
    expectedResult: "A branch deletada é recuperada com todos os commits que estavam nela.",
  },
  {
    id: "amend-last-commit",
    title: "Esqueci de adicionar algo no último commit",
    description: "Você acabou de commitar mas esqueceu um arquivo ou quer corrigir a mensagem do commit.",
    emoji: "✏️",
    steps: [
      { title: "Faça as alterações necessárias", description: "Edite os arquivos que faltaram ou corrija o que precisar." },
      { title: "Adicione os arquivos ao stage", command: "git add arquivo-esquecido.txt", description: "Adicione apenas o que faltou. Pule este passo se só quer mudar a mensagem." },
      { title: "Emende o commit", command: 'git commit --amend -m "mensagem corrigida"', description: "Substitui o último commit por um novo com as alterações adicionadas." },
      { title: "Atenção: se já fez push", command: "git push --force-with-lease origin minha-branch", description: "Use --force-with-lease (mais seguro que --force). Avise a equipe se for branch compartilhada." },
    ],
    expectedResult: "O último commit é atualizado com os arquivos ou mensagem corretos.",
  },
  {
    id: "cherry-pick",
    title: "Quero pegar só um commit de outra branch",
    description: "Existe um commit específico em outra branch que você precisa trazer para a branch atual sem fazer merge completo.",
    emoji: "🍒",
    steps: [
      { title: "Encontre o hash do commit desejado", command: "git log --oneline nome-da-branch", description: "Liste os commits da branch de origem e copie o hash do que você quer." },
      { title: "Mude para a branch de destino", command: "git checkout minha-branch", description: "Vá para a branch onde o commit deve ser aplicado." },
      { title: "Aplique o commit", command: "git cherry-pick a1b2c3d", description: "Copia o commit para a branch atual criando um novo commit com as mesmas alterações." },
      { title: "Resolva conflitos se houver", command: "git cherry-pick --continue", description: "Se houver conflitos, resolva-os, adicione com git add e continue." },
    ],
    expectedResult: "O commit específico é aplicado na branch atual sem trazer o restante do histórico.",
  },
  {
    id: "restore-file",
    title: "Quero desfazer alterações em um arquivo",
    description: "Você modificou um arquivo e quer voltar ao estado do último commit, sem afetar outros arquivos.",
    emoji: "↩️",
    steps: [
      { title: "Verifique o estado do arquivo", command: "git status", description: "Confirme se o arquivo está modified (fora do stage) ou staged." },
      { title: "Se o arquivo não está no stage", command: "git restore arquivo.txt", description: "Descarta as alterações locais e volta ao conteúdo do último commit." },
      { title: "Se o arquivo já está no stage", command: "git restore --staged arquivo.txt", description: "Remove do stage mas mantém as alterações no arquivo." },
      { title: "Para voltar a um commit específico", command: "git checkout abc1234 -- arquivo.txt", description: "Restaura o arquivo exatamente como estava naquele commit." },
    ],
    expectedResult: "O arquivo volta ao estado desejado sem afetar o restante do projeto.",
  },
  {
    id: "diverged-history",
    title: "Histórico divergiu após rebase",
    description: "Depois de um rebase, seu histórico local divergiu do remoto e o push está sendo rejeitado.",
    emoji: "🔱",
    steps: [
      { title: "Entenda a situação", command: "git status", description: "Git vai mostrar que sua branch divergiu de origin/branch. Isso é esperado após um rebase." },
      { title: "Confirme que o rebase está correto", command: "git log --oneline", description: "Verifique se os commits locais estão como você quer antes de forçar o push." },
      { title: "Force push com segurança", command: "git push --force-with-lease origin minha-branch", description: "--force-with-lease falha se alguém enviou commits desde seu último pull, protegendo contra sobrescrever trabalho de outra pessoa." },
      { title: "Avise a equipe", description: "Se for branch compartilhada, informe os colegas para que façam git fetch e git rebase origin/minha-branch nas cópias deles." },
    ],
    expectedResult: "O histórico rebaseado é enviado ao remoto com segurança.",
  },
  {
    id: "exposed-secret",
    title: "Senha ou .env foi commitado por acidente",
    description: "Você commitou credenciais, tokens ou um arquivo .env com dados sensíveis e precisa remover do histórico.",
    emoji: "🔐",
    steps: [
      { title: "PRIMEIRO: invalide a credencial exposta", description: "Antes de qualquer coisa, revogue o token/senha no serviço (GitHub, AWS, etc). Considere qualquer segredo exposto como comprometido independente do que fizer no Git." },
      { title: "Adicione ao .gitignore imediatamente", command: "echo '.env' >> .gitignore", description: "Previne que o arquivo seja commitado de novo." },
      { title: "Remova do histórico completo", command: "git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty HEAD", description: "Reescreve todo o histórico removendo o arquivo. Alternativa moderna: use a ferramenta BFG Repo-Cleaner." },
      { title: "Force push em todas as branches", command: "git push --force --all origin", description: "Envia o histórico limpo. Avise toda a equipe para re-clonar o repositório." },
      { title: "Limpe referências antigas", command: "git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin\ngit reflog expire --expire=now --all\ngit gc --prune=now", description: "Remove todas as referências ao histórico antigo localmente." },
    ],
    expectedResult: "O segredo é removido do histórico do Git. Lembre-se: se foi enviado ao remoto, considere-o comprometido e gere novas credenciais.",
  },
  {
    id: "commit-directly-to-main",
    title: "Commitei direto na main por engano",
    description: "Você fez commits direto na main e precisava estar em uma branch de feature. Como mover esses commits para uma branch nova sem perder o trabalho.",
    emoji: "😬",
    steps: [
      { title: "Crie a branch nova a partir do estado atual da main", command: "git branch feature/minha-feature", description: "Cria a branch no mesmo ponto onde a main está agora — com seus commits incluídos." },
      { title: "Volte a main local para onde estava antes dos commits", command: "git reset --hard origin/main", description: "Reseta a main local para o estado do remoto, removendo os commits que você fez." },
      { title: "Mude para a branch nova", command: "git switch feature/minha-feature", description: "Agora seus commits estão apenas nessa branch." },
      { title: "Confirme que os commits estão lá", command: "git log --oneline", description: "Verifique se todos os commits aparecem na branch correta." },
      { title: "Envie a branch para o remoto", command: "git push -u origin feature/minha-feature", description: "Publica a branch com seus commits." },
    ],
    expectedResult: "Seus commits saem da main e ficam na branch correta. A main local volta ao estado limpo do remoto.",
  },
  {
    id: "split-commit",
    title: "Quero dividir um commit em dois",
    description: "Você fez um commit grande misturando mudanças diferentes e quer separar em commits menores e mais específicos.",
    emoji: "✂️",
    steps: [
      { title: "Desfaça o último commit mantendo as alterações", command: "git reset HEAD~1", description: "Remove o commit mas mantém todos os arquivos modificados no working directory. Use HEAD~2 para voltar 2 commits." },
      { title: "Verifique o que está disponível", command: "git status", description: "Todos os arquivos do commit desfeito estarão unstaged." },
      { title: "Adicione apenas o que vai no primeiro commit", command: "git add arquivo1.ts arquivo2.ts", description: "Selecione só o que faz sentido para o primeiro commit. Use 'git add -p' para dividir por hunks dentro de um mesmo arquivo." },
      { title: "Faça o primeiro commit", command: 'git commit -m "feat: primeiro assunto"', description: "Commit focado e específico." },
      { title: "Adicione o restante e faça o segundo commit", command: 'git add .\ngit commit -m "fix: segundo assunto"', description: "O que sobrou vai para o segundo commit." },
    ],
    expectedResult: "Um commit grande é dividido em dois (ou mais) commits menores, cada um com propósito claro.",
  },
  {
    id: "clean-old-branches",
    title: "Limpar branches antigas locais e remotas",
    description: "Ao longo do tempo, o repositório acumulou branches de features já mergeadas. Como fazer uma limpeza segura.",
    emoji: "🧹",
    steps: [
      { title: "Atualize as referências e remova branches remotas deletadas", command: "git fetch --prune", description: "Remove referências locais de branches que já foram deletadas no remoto." },
      { title: "Liste branches locais já mergeadas na main", command: "git branch --merged main", description: "Mostra branches que podem ser deletadas com segurança (já integradas na main)." },
      { title: "Delete as branches locais mergeadas", command: "git branch -d feature/branch-antiga feature/outra", description: "O -d é seguro: falha se a branch não foi mergeada." },
      { title: "Liste branches remotas antigas mergeadas", command: "git branch -r --merged main", description: "Mostra branches remotas já integradas." },
      { title: "Delete as branches no remoto", command: "git push origin --delete feature/branch-antiga", description: "Remove a branch do servidor remoto. Repita para cada branch." },
    ],
    expectedResult: "O repositório fica limpo, com apenas branches ativas e relevantes.",
  },
  {
    id: "sync-fork",
    title: "Sincronizar fork com o repositório original",
    description: "Seu fork no GitHub ficou desatualizado e precisa receber os commits mais recentes do repositório original.",
    emoji: "🔄",
    steps: [
      { title: "Adicione o remote do repositório original (só na primeira vez)", command: "git remote add upstream https://github.com/original/repo.git", description: "Aponta para o repo original. Confirme com 'git remote -v'." },
      { title: "Baixe os commits do original", command: "git fetch upstream", description: "Busca as mudanças sem integrar ainda." },
      { title: "Vá para a branch principal", command: "git switch main", description: "Certifique-se de estar na main local." },
      { title: "Integre os commits do original", command: "git rebase upstream/main", description: "Reaplica seus commits sobre a main atualizada. Alternativa: git merge upstream/main." },
      { title: "Atualize seu fork no GitHub", command: "git push origin main", description: "Envia a main sincronizada para seu fork." },
    ],
    expectedResult: "Seu fork fica atualizado com todos os commits do repositório original.",
  },
  {
    id: "undo-merge",
    title: "Desfazer um merge que foi para a main",
    description: "Um merge foi feito na main por engano ou trouxe bugs. Como desfazê-lo de forma segura.",
    emoji: "🔁",
    steps: [
      { title: "Identifique o commit do merge", command: "git log --oneline --merges -5", description: "Mostra os últimos merge commits. Copie o SHA do merge que quer desfazer." },
      { title: "Opção A (segura — para histórico público): revert do merge", command: "git revert -m 1 <sha-do-merge>", description: "O -m 1 define a main como 'mainline'. Cria um commit de reversão sem reescrever histórico. Recomendado quando outros já puxaram o merge." },
      { title: "Opção B (apenas se ninguém puxou ainda): reset", command: "git reset --hard <sha-antes-do-merge>", description: "Volta a main para antes do merge. Use git log para encontrar o SHA correto. DESTRUTIVO." },
      { title: "Se usou reset, force push com cuidado", command: "git push --force-with-lease origin main", description: "Avise toda a equipe — todos precisarão re-sincronizar com git fetch + git reset." },
    ],
    expectedResult: "O merge é desfeito. Para histórico público, prefira sempre o revert.",
  },
  {
    id: "recover-lost-stash",
    title: "Perdi alterações do stash",
    description: "Você fez git stash drop ou git stash clear por engano e perdeu suas alterações.",
    emoji: "🔍",
    steps: [
      { title: "Procure objetos 'perdidos' no repositório", command: "git fsck --unreachable | grep commit", description: "Lista commits que não estão referenciados por nenhuma branch ou tag — inclui stashes descartados." },
      { title: "Inspecione os hashes suspeitos", command: "git show <hash>", description: "Veja o conteúdo de cada hash para identificar qual era seu stash perdido." },
      { title: "Aplique as mudanças recuperadas", command: "git stash apply <hash>", description: "Aplica o stash recuperado diretamente. Alternativa: git cherry-pick <hash>." },
    ],
    expectedResult: "As alterações do stash são recuperadas. Isso só funciona enquanto o garbage collector do Git não rodou (por padrão, objetos ficam acessíveis por 30 dias).",
  },
  {
    id: "push-wrong-branch",
    title: "Fiz push na branch errada",
    description: "Você enviou commits para a branch errada no remoto e precisa desfazer o push sem perder o trabalho.",
    emoji: "📤",
    steps: [
      { title: "Identifique os commits enviados por engano", command: "git log --oneline origin/branch-errada", description: "Veja quais commits foram para a branch incorreta." },
      { title: "Copie o hash dos commits que quer mover", command: "git log --oneline -5", description: "Anote os hashes que precisam ir para a branch correta." },
      { title: "Mude para a branch correta", command: "git checkout branch-correta", description: "Vá para a branch de destino certa." },
      { title: "Aplique os commits via cherry-pick", command: "git cherry-pick <hash>", description: "Copia cada commit para a branch correta. Repita para cada hash se forem múltiplos." },
      { title: "Confirme que os commits chegaram", command: "git log --oneline", description: "Verifique se os commits aparecem na branch correta." },
      { title: "Reverta os commits na branch errada", command: "git revert <hash> --no-edit", description: "Cria um commit de reversão na branch errada sem reescrever o histórico público. Mais seguro que force push." },
      { title: "Envie a reversão ao remoto", command: "git push origin branch-errada", description: "Publica o revert na branch errada." },
      { title: "Publique a branch correta", command: "git push origin branch-correta", description: "Envia os commits para onde eles deveriam estar." },
    ],
    expectedResult: "Os commits são revertidos na branch errada e aplicados corretamente na branch de destino, sem reescrever histórico público.",
  },
  {
    id: "recover-reset-hard",
    title: "Perdi commits com git reset --hard",
    description: "Você executou git reset --hard e perdeu commits que ainda não haviam sido enviados ao remoto.",
    emoji: "💀",
    steps: [
      { title: "Abra o reflog imediatamente", command: "git reflog", description: "O reflog registra todos os movimentos do HEAD, incluindo commits apagados por resets. Procure a entrada com a mensagem do commit perdido." },
      { title: "Identifique o hash do commit perdido", description: "Anote o hash que aparece à esquerda da entrada no reflog. Ele tem formato como a1b2c3d@{2}." },
      { title: "Inspecione o commit para confirmar", command: "git show <hash>", description: "Verifique se é mesmo o commit que você perdeu antes de restaurar." },
      { title: "Restaure criando uma branch no commit perdido", command: "git checkout -b recuperacao/<nome> <hash>", description: "Cria uma nova branch apontando para o commit recuperado. Mais seguro do que resetar direto." },
      { title: "Ou restaure a branch atual para o commit perdido", command: "git reset --hard <hash>", description: "Move a branch atual de volta para o commit recuperado. Só use se tiver certeza do hash.", },
    ],
    expectedResult: "Os commits perdidos são recuperados. O reflog mantém objetos acessíveis por 90 dias por padrão antes do garbage collector removê-los.",
  },
  {
    id: "binary-merge-conflict",
    title: "Conflito de merge em arquivo binário",
    description: "Um merge gerou conflito em um arquivo binário (imagem, PDF, lock file) que não pode ser resolvido com edição de texto.",
    emoji: "🖼️",
    steps: [
      { title: "Verifique quais binários estão em conflito", command: "git status", description: "Arquivos binários aparecem como 'both modified' mas o Git não consegue mostrar diff de texto neles." },
      { title: "Opção A: manter sua versão (branch atual)", command: "git checkout --ours -- caminho/arquivo.png", description: "Descarta a versão que veio do merge e mantém a sua. Use para imagens ou binários onde sua versão é a correta." },
      { title: "Opção B: aceitar a versão de quem veio do merge", command: "git checkout --theirs -- caminho/arquivo.png", description: "Descarta sua versão e aceita a que veio da outra branch. Use quando a versão deles é a correta." },
      { title: "Para lock files (package-lock.json, yarn.lock): aceite a versão deles e regenere", command: "git checkout --theirs -- package-lock.json", description: "Lock files devem ser regenerados, não mergeados manualmente." },
      { title: "Regenere o lock file se necessário", command: "npm install", description: "Reinstale as dependências para gerar um lock file consistente após resolver o conflito." },
      { title: "Marque o conflito como resolvido", command: "git add caminho/arquivo.png", description: "Adiciona o arquivo resolvido ao stage." },
      { title: "Finalize o merge", command: "git commit --no-edit", description: "Conclui o merge com a mensagem gerada automaticamente." },
    ],
    expectedResult: "O conflito no arquivo binário é resolvido escolhendo explicitamente qual versão manter. Lock files são regenerados para garantir consistência.",
  },
];

export function getProblemById(id: string): GitProblem | undefined {
  return problems.find((p) => p.id === id);
}
