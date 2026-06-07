import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, AlertTriangle, Lightbulb } from "lucide-react";
import { getCommandById, categoryLabels } from "@/data/commands";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useEffect } from "react";

export default function CommandDetail() {
  const { id } = useParams<{ id: string }>();
  const cmd = getCommandById(id || "");
  const [favorites, setFavorites] = useLocalStorage<string[]>("git-doc-favorites", []);
  const [history, setHistory] = useLocalStorage<string[]>("git-doc-history", []);

  useEffect(() => {
    if (id) {
      setHistory((prev) => {
        const filtered = prev.filter((h) => h !== id);
        return [id, ...filtered].slice(0, 20);
      });
    }
  }, [id]);

  if (!cmd) {
    return (
      <div className="container px-4 py-20 text-center">
        <p className="text-muted-foreground">Comando não encontrado.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/commands">Voltar</Link>
        </Button>
      </div>
    );
  }

  const isFav = favorites.includes(cmd.id);

  return (
    <div className="container px-4 py-10 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/commands" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar aos comandos
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold font-mono text-primary">{cmd.name}</h1>
          <button onClick={() => setFavorites((p) => isFav ? p.filter((f) => f !== cmd.id) : [...p, cmd.id])}>
            <Star className={`h-5 w-5 ${isFav ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"} transition-colors`} />
          </button>
        </div>
        <p className="text-muted-foreground mb-1">{cmd.description}</p>
        <span className="text-xs bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground">{categoryLabels[cmd.category]}</span>

        {/* Syntax */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Sintaxe</h2>
          <div className="flex items-center gap-2">
            <code className="code-block flex-1">{cmd.syntax}</code>
            <CopyButton text={cmd.syntax} />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="geral">
            <TabsList className="w-full flex flex-wrap h-auto gap-1 justify-start">
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="variacoes">Variações</TabsTrigger>
              {cmd.flags && cmd.flags.length > 0 && (
                <TabsTrigger value="flags">Flags</TabsTrigger>
              )}
              <TabsTrigger value="exemplos">Exemplos</TabsTrigger>
              {cmd.curiosities && cmd.curiosities.length > 0 && (
                <TabsTrigger value="curiosidades">Curiosidades</TabsTrigger>
              )}
            </TabsList>

            {/* Geral */}
            <TabsContent value="geral" className="mt-6 space-y-8">
              <Section title="Usos">
                <ul className="space-y-1">
                  {cmd.uses.map((u, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span> {u}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Quando NÃO usar">
                <ul className="space-y-1">
                  {cmd.whenNotToUse.map((w, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive mt-1">✕</span> {w}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Comandos Relacionados">
                <div className="flex flex-wrap gap-2">
                  {cmd.relatedCommands.map((r) => (
                    <Link key={r} to={`/commands/${r}`} className="font-mono text-sm bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-lg text-primary transition-colors">
                      git {r}
                    </Link>
                  ))}
                </div>
              </Section>

              {cmd.deepDive && (
                <Section title="Saiba Mais">
                  <p className="text-sm text-muted-foreground leading-relaxed">{cmd.deepDive}</p>
                </Section>
              )}
            </TabsContent>

            {/* Variações */}
            <TabsContent value="variacoes" className="mt-6">
              <div className="space-y-2">
                {cmd.variations.map((v, i) => (
                  <div key={i} className="glass-card p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono text-sm text-primary flex-1">{v.command}</code>
                      <CopyButton text={v.command} />
                    </div>
                    <p className="text-xs text-muted-foreground">{v.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Flags */}
            {cmd.flags && cmd.flags.length > 0 && (
              <TabsContent value="flags" className="mt-6">
                <div className="space-y-2">
                  {cmd.flags.map((f, i) => (
                    <div key={i} className={`glass-card p-3 ${f.danger ? "border border-destructive/30" : ""}`}>
                      <div className="flex items-start gap-2">
                        <code className="font-mono text-sm text-primary shrink-0">{f.flag}</code>
                        {f.danger && (
                          <span title="Use com cuidado">
                            <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
                          </span>
                        )}
                        <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                      </div>
                      {f.example && (
                        <div className="mt-2 flex items-center gap-2">
                          <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded flex-1">{f.example}</code>
                          <CopyButton text={f.example} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-destructive" />
                  Flags marcadas com ícone de alerta devem ser usadas com cautela.
                </p>
              </TabsContent>
            )}

            {/* Exemplos */}
            <TabsContent value="exemplos" className="mt-6">
              <div className="space-y-4">
                {cmd.examples.map((ex, i) => (
                  <div key={i}>
                    <p className="text-sm text-muted-foreground mb-1">{ex.description}</p>
                    <div className="flex items-start gap-2">
                      <pre className="code-block flex-1 whitespace-pre-wrap overflow-x-auto">{ex.code}</pre>
                      <CopyButton text={ex.code} />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Curiosidades */}
            {cmd.curiosities && cmd.curiosities.length > 0 && (
              <TabsContent value="curiosidades" className="mt-6">
                <div className="space-y-3">
                  {cmd.curiosities.map((c, i) => (
                    <div key={i} className="glass-card p-4 flex gap-3">
                      <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{c}</p>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}
