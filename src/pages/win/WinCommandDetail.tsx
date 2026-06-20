import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, BookOpen, Lightbulb, Star } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getWinCommandById, winCategoryLabels, winLevelLabels } from "@/data/winCommands";
import { useLocalStorage } from "@/hooks/useLocalStorage";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function WinCommandDetail() {
  const { id } = useParams<{ id: string }>();
  const command = getWinCommandById(id ?? "");
  const [favorites, setFavorites] = useLocalStorage<string[]>("win-doc-favorites", []);
  const [, setHistory] = useLocalStorage<string[]>("win-doc-history", []);

  useEffect(() => {
    if (id) setHistory((prev) => [id, ...prev.filter((item) => item !== id)].slice(0, 20));
  }, [id, setHistory]);

  if (!command) {
    return (
      <div data-theme="win" className="container px-4 py-20 text-center">
        <p className="text-muted-foreground">Comando nao encontrado.</p>
        <Button asChild variant="outline" className="mt-4"><Link to="/win/commands">Voltar</Link></Button>
      </div>
    );
  }

  const isFav = favorites.includes(command.id);

  return (
    <div data-theme="win" className="container px-4 py-10 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/win/commands" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar aos comandos
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold font-mono text-primary">{command.name}</h1>
          <button onClick={() => setFavorites((prev) => isFav ? prev.filter((favorite) => favorite !== command.id) : [...prev, command.id])} aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
            <Star className={`h-5 w-5 transition-colors ${isFav ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"}`} />
          </button>
        </div>
        <p className="text-muted-foreground mb-2">{command.description}</p>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground">{winCategoryLabels[command.category]}</span>
          <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-md text-primary">{winLevelLabels[command.level]}</span>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Sintaxe</h2>
          <div className="flex items-center gap-2">
            <code className="code-block flex-1 text-sm">{command.syntax}</code>
            <CopyButton text={command.syntax} />
          </div>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="geral">
            <div className="overflow-x-auto -mx-1 px-1 pb-1">
              <TabsList className="flex h-auto gap-1 justify-start w-max min-w-full">
                <TabsTrigger value="geral">Geral</TabsTrigger>
                <TabsTrigger value="variacoes">Variacoes</TabsTrigger>
                {command.flags && command.flags.length > 0 && <TabsTrigger value="flags">Flags</TabsTrigger>}
                <TabsTrigger value="exemplos">Exemplos</TabsTrigger>
                {command.syntaxBreakdown && command.syntaxBreakdown.length > 0 && <TabsTrigger value="anatomia">Anatomia</TabsTrigger>}
                {command.curiosities && command.curiosities.length > 0 && <TabsTrigger value="curiosidades">Curiosidades</TabsTrigger>}
              </TabsList>
            </div>

            <TabsContent value="geral" className="mt-6 space-y-8">
              <Section title="Usos comuns">
                <ul className="space-y-1">
                  {command.uses.map((use, index) => <li key={index} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-primary mt-1">-</span> {use}</li>)}
                </ul>
              </Section>
              <Section title="Quando NAO usar">
                <ul className="space-y-1">
                  {command.whenNotToUse.map((warning, index) => <li key={index} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-destructive mt-1">x</span> {warning}</li>)}
                </ul>
              </Section>
              <Section title="Comandos relacionados">
                <div className="flex flex-wrap gap-2">
                  {command.relatedCommands.map((related) => <Link key={related} to={`/win/commands/${related}`} className="font-mono text-sm bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-lg text-primary transition-colors">{related}</Link>)}
                </div>
              </Section>
              {command.deepDive && <Section title="Saiba mais"><p className="text-sm text-muted-foreground leading-relaxed">{command.deepDive}</p></Section>}
            </TabsContent>

            <TabsContent value="variacoes" className="mt-6">
              <div className="space-y-2">
                {command.variations.map((variation, index) => (
                  <div key={index} className="glass-card p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono text-sm text-primary flex-1">{variation.command}</code>
                      <CopyButton text={variation.command} />
                    </div>
                    <p className="text-xs text-muted-foreground">{variation.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {command.flags && command.flags.length > 0 && (
              <TabsContent value="flags" className="mt-6">
                <div className="space-y-2">
                  {command.flags.map((flag, index) => (
                    <div key={index} className={`glass-card p-3 ${flag.danger ? "border border-destructive/30" : ""}`}>
                      <div className="flex items-start gap-2">
                        <code className="font-mono text-sm text-primary shrink-0">{flag.flag}</code>
                        {flag.danger && <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />}
                        <p className="text-xs text-muted-foreground leading-relaxed">{flag.description}</p>
                      </div>
                      {flag.example && <div className="mt-2 flex items-center gap-2"><code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded flex-1">{flag.example}</code><CopyButton text={flag.example} /></div>}
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            <TabsContent value="exemplos" className="mt-6">
              <div className="space-y-4">
                {command.examples.map((example, index) => (
                  <div key={index}>
                    <p className="text-sm text-muted-foreground mb-1">{example.description}</p>
                    <div className="flex items-start gap-2">
                      <pre className="code-block flex-1 text-sm whitespace-pre-wrap overflow-x-auto">{example.code}</pre>
                      <CopyButton text={example.code} />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {command.syntaxBreakdown && command.syntaxBreakdown.length > 0 && (
              <TabsContent value="anatomia" className="mt-6">
                <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Cada parte da sintaxe explicada em portugues.</p>
                <div className="space-y-3">
                  {command.syntaxBreakdown.map((item, index) => (
                    <div key={index} className={`glass-card p-4 ${item.optional ? "border-border/30" : "border-primary/20"}`}>
                      <div className="flex items-start gap-3 flex-wrap mb-2">
                        <code className="font-mono text-sm text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">{item.part}</code>
                        <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded">{item.label}</span>
                        {item.optional && <span className="text-[10px] text-muted-foreground/60 bg-secondary/60 px-1.5 py-0.5 rounded">opcional</span>}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            {command.curiosities && command.curiosities.length > 0 && (
              <TabsContent value="curiosidades" className="mt-6">
                <div className="space-y-3">
                  {command.curiosities.map((curiosity, index) => <div key={index} className="glass-card p-4 flex gap-3"><Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" /><p className="text-sm text-muted-foreground leading-relaxed">{curiosity}</p></div>)}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
