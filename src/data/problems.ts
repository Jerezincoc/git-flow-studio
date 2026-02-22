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
];

export function getProblemById(id: string): GitProblem | undefined {
  return problems.find((p) => p.id === id);
}
