import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, BookOpen, Lightbulb, Star } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLinuxCommandById, linuxCategoryLabels, linuxLevelLabels } from "@/data/linuxCommands";
import { useLocalStorage } from "@/hooks/useLocalStorage";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function LinuxCommandDetail() {
  const { id } = useParams<{ id: string }>();
  const cmd = getLinuxCommandById(id ?? "");
  const [favorites, setFavorites] = useLocalStorage<string[]>("linux-doc-favorites", []);
  const [history, setHistory] = useLocalStorage<string[]>("linux-doc-history", []);

  useEffect(() => {
    if (id) {
      setHistory((prev) => [id, ...prev.filter((h) => h !== id)].slice(0, 20));
    }
  }, [id, setHistory]);

  if (!cmd) {
    return (
      <div data-theme="linux" className="container px-4 py-20 text-center">
        <p className="text-muted-foreground">Comando nao encontrado.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/linux/commands">Voltar</Link>
        </Button>
      </div>
    );
  }

  const isFav = favorites.includes(cmd.id);

  return (
    <div data-theme="linux" className="container px-4 py-10 max-w-3xl">
      <SEO
        title={`${cmd.name} - LinuxDoc`}
        description={`${cmd.description} Veja sintaxe, flags, variacoes e exemplos praticos de ${cmd.name}.`}
        path={`/linux/commands/${cmd.id}`}
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to="/linux/commands"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar aos comandos
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold font-mono text-primary">{cmd.name}</h1>
          <button
            onClick={() => setFavorites((prev) => isFav ? prev.filter((f) => f !== cmd.id) : [...prev, cmd.id])}
            aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Star className={`h-5 w-5 transition-colors ${isFav ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"}`} />
          </button>
        </div>
        <p className="text-muted-foreground mb-2">{cmd.description}</p>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground">
            {linuxCategoryLabels[cmd.category]}
          </span>
          <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-md text-primary">
            {linuxLevelLabels[cmd.level]}
          </span>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Sintaxe</h2>
          <div className="flex items-center gap-2">
            <code className="code-block flex-1 text-sm">{cmd.syntax}</code>
            <CopyButton text={cmd.syntax} />
          </div>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="geral">
            <div className="overflow-x-auto -mx-1 px-1 pb-1">
              <TabsList className="flex h-auto gap-1 justify-start w-max min-w-full">
                <TabsTrigger value="geral">Geral</TabsTrigger>
                <TabsTrigger value="variacoes">Variacoes</TabsTrigger>
                {cmd.flags && cmd.flags.length > 0 && (
                  <TabsTrigger value="flags">Flags</TabsTrigger>
                )}
                <TabsTrigger value="exemplos">Exemplos</TabsTrigger>
                {cmd.syntaxBreakdown && cmd.syntaxBreakdown.length > 0 && (
                  <TabsTrigger value="anatomia">Anatomia</TabsTrigger>
                )}
                {cmd.curiosities && cmd.curiosities.length > 0 && (
                  <TabsTrigger value="curiosidades">Curiosidades</TabsTrigger>
                )}
              </TabsList>
            </div>

            <TabsContent value="geral" className="mt-6 space-y-8">
              <Section title="Usos comuns">
                <ul className="space-y-1">
                  {cmd.uses.map((use, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">-</span> {use}
                    </li>
                  ))}
                </ul>
              </Section>

              {cmd.whenNotToUse.length > 0 && (
                <Section title="Quando nao usar">
                  <ul className="space-y-1">
                    {cmd.whenNotToUse.map((warning, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-destructive mt-1">x</span> {warning}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              <Section title="Comandos relacionados">
                <div className="flex flex-wrap gap-2">
                  {cmd.relatedCommands.map((related) => (
                    <Link
                      key={related}
                      to={`/linux/commands/${related}`}
                      className="font-mono text-sm bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-lg text-primary transition-colors"
                    >
                      {related}
                    </Link>
                  ))}
                </div>
              </Section>

              {cmd.deepDive && (
                <Section title="Saiba mais">
                  <p className="text-sm text-muted-foreground leading-relaxed">{cmd.deepDive}</p>
                </Section>
              )}
            </TabsContent>

            <TabsContent value="variacoes" className="mt-6">
              <div className="space-y-2">
                {cmd.variations.map((variation, i) => (
                  <div key={i} className="glass-card p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono text-sm text-primary flex-1">{variation.command}</code>
                      <CopyButton text={variation.command} />
                    </div>
                    <p className="text-xs text-muted-foreground">{variation.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {cmd.flags && cmd.flags.length > 0 && (
              <TabsContent value="flags" className="mt-6">
                <div className="space-y-2">
                  {cmd.flags.map((flag, i) => (
                    <div key={i} className={`glass-card p-3 ${flag.danger ? "border border-destructive/30" : ""}`}>
                      <div className="flex items-start gap-2">
                        <code className="font-mono text-sm text-primary shrink-0">{flag.flag}</code>
                        {flag.danger && (
                          <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
                        )}
                        <p className="text-xs text-muted-foreground leading-relaxed">{flag.description}</p>
                      </div>
                      {flag.example && (
                        <div className="mt-2 flex items-center gap-2">
                          <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded flex-1">{flag.example}</code>
                          <CopyButton text={flag.example} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            <TabsContent value="exemplos" className="mt-6">
              <div className="space-y-4">
                {cmd.examples.map((example, i) => (
                  <div key={i}>
                    <p className="text-sm text-muted-foreground mb-1">{example.description}</p>
                    <div className="flex items-start gap-2">
                      <pre className="code-block flex-1 text-sm whitespace-pre-wrap overflow-x-auto">{example.code}</pre>
                      <CopyButton text={example.code} />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {cmd.syntaxBreakdown && cmd.syntaxBreakdown.length > 0 && (
              <TabsContent value="anatomia" className="mt-6">
                <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  Cada parte da sintaxe explicada de forma direta.
                </p>
                <div className="space-y-3">
                  {cmd.syntaxBreakdown.map((item, i) => (
                    <div key={i} className={`glass-card p-4 ${item.optional ? "border-border/30" : "border-primary/20"}`}>
                      <div className="flex items-start gap-3 flex-wrap mb-2">
                        <code className="font-mono text-sm text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">
                          {item.part}
                        </code>
                        <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                          {item.label}
                        </span>
                        {item.optional && (
                          <span className="text-[10px] text-muted-foreground/60 bg-secondary/60 px-1.5 py-0.5 rounded">
                            opcional
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            {cmd.curiosities && cmd.curiosities.length > 0 && (
              <TabsContent value="curiosidades" className="mt-6">
                <div className="space-y-3">
                  {cmd.curiosities.map((curiosity, i) => (
                    <div key={i} className="glass-card p-4 flex gap-3">
                      <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{curiosity}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
