import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { commands } from "@/data/commands";
import { problems } from "@/data/problems";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
    navigate(path);
  };

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

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar comandos, problemas..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Comandos">
            {commands.map((cmd) => (
              <CommandItem key={cmd.id} onSelect={() => go(`/commands/${cmd.id}`)}>
                <span className="font-mono text-primary">{cmd.name}</span>
                <span className="ml-2 text-muted-foreground text-sm">{cmd.description}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Problemas">
            {problems.map((p) => (
              <CommandItem key={p.id} onSelect={() => go(`/problems/${p.id}`)}>
                <span className="mr-2">{p.emoji}</span>
                <span>{p.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
