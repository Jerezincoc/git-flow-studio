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
];

export function getProblemById(id: string): GitProblem | undefined {
  return problems.find((p) => p.id === id);
}
