import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, LayoutList, FileCode2 } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { commands, categoryLabels } from "@/data/commands";
import { problems } from "@/data/problems";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const pages = [
  { id: "cheatsheet", label: "Cheat Sheet", description: "Todos os comandos em uma página, filtrável por categoria", path: "/cheatsheet", Icon: LayoutList },
  { id: "conventions", label: "Convenções de Commit", description: "Guia de Conventional Commits: tipos, exemplos, ferramentas", path: "/conventions", Icon: FileCode2 },
];

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [history] = useLocalStorage<string[]>("git-doc-history", []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    setQuery("");
    navigate(path);
  };

  const recentCommands = history
    .slice(0, 5)
    .map((id) => commands.find((c) => c.id === id))
    .filter(Boolean) as typeof commands;

  const matchesQuery = (cmd: (typeof commands)[0]) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      cmd.name.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.variations.some((v) => v.command.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)) ||
      (cmd.flags ?? []).some((f) => f.flag.toLowerCase().includes(q) || f.description.toLowerCase().includes(q))
    );
  };

  const filteredCommands = commands.filter(matchesQuery);
  const filteredProblems = problems.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return p.title.toLowerCase().includes(q);
  });

  const filteredPages = pages.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return p.label.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border/50 bg-secondary/50 text-muted-foreground text-sm hover:bg-secondary transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Buscar...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setQuery(""); }}>
        <CommandInput
          placeholder="Buscar comandos, flags, problemas..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

          {/* Recentes — só aparece quando não há query */}
          {!query && recentCommands.length > 0 && (
            <>
              <CommandGroup heading="Vistos recentemente">
                {recentCommands.map((cmd) => (
                  <CommandItem key={cmd.id} value={`recent-${cmd.id}`} onSelect={() => go(`/commands/${cmd.id}`)}>
                    <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
                    <span className="font-mono text-primary">{cmd.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{categoryLabels[cmd.category]}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Comandos */}
          {filteredCommands.length > 0 && (
            <CommandGroup heading="Comandos">
              {filteredCommands.map((cmd) => (
                <CommandItem key={cmd.id} value={`cmd-${cmd.id}-${cmd.name}-${cmd.description}`} onSelect={() => go(`/commands/${cmd.id}`)}>
                  <span className="font-mono text-primary">{cmd.name}</span>
                  <span className="ml-2 text-muted-foreground text-sm truncate">{cmd.description}</span>
                  <span className="ml-auto text-xs text-muted-foreground shrink-0 pl-2">{categoryLabels[cmd.category]}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Páginas */}
          {filteredPages.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Páginas">
                {filteredPages.map((p) => {
                  const Icon = p.Icon;
                  return (
                    <CommandItem key={p.id} value={`page-${p.id}-${p.label}`} onSelect={() => go(p.path)}>
                      <Icon className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
                      <span className="font-medium">{p.label}</span>
                      <span className="ml-2 text-muted-foreground text-sm truncate">{p.description}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}

          {/* Problemas */}
          {filteredProblems.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Problemas">
                {filteredProblems.map((p) => (
                  <CommandItem key={p.id} value={`prob-${p.id}-${p.title}`} onSelect={() => go(`/problems/${p.id}`)}>
                    <span className="mr-2">{p.emoji}</span>
                    <span>{p.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
