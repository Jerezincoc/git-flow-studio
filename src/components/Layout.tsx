import { Link, useLocation, Outlet } from "react-router-dom";
import { GitBranch, Terminal, AlertTriangle, BookOpen, Menu, LayoutList, FileCode2, ChevronLeft } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchDialog } from "./SearchDialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const GIT_LAST_PATH_KEY = "devdocs-git-last-path";

const navItems = [
  { label: "Guia", path: "/guide", icon: BookOpen },
  { label: "Comandos", path: "/commands", icon: Terminal },
  { label: "Cheat Sheet", path: "/cheatsheet", icon: LayoutList },
  { label: "Convenções", path: "/conventions", icon: FileCode2 },
  { label: "Mapa Git", path: "/map", icon: GitBranch },
  { label: "Problemas", path: "/problems", icon: AlertTriangle },
];

export { GIT_LAST_PATH_KEY };

export function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // persiste o último caminho visitado no GitDoc e marca o layer atual
  useEffect(() => {
    localStorage.setItem("devdocs-last-layer", "git");
    if (location.pathname !== "/git") {
      localStorage.setItem(GIT_LAST_PATH_KEY, location.pathname);
    }
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.path)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Voltar ao hub"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                DevDocs
              </Link>
              <span className="text-border/80 text-sm">/</span>
              <Link to="/git" className="flex items-center gap-2 font-bold text-lg">
                <GitBranch className="h-5 w-5 text-primary" />
                <span className="gradient-text">GitDoc</span>
              </Link>
            </div>
            <nav className="hidden lg:flex items-center gap-1">
              <NavLinks />
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <SearchDialog />
            <ThemeToggle />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 pt-10">
                <nav className="flex flex-col gap-1">
                  <NavLinks onClick={() => setMobileOpen(false)} />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/50 py-6">
        <div className="container px-4 text-center text-xs text-muted-foreground">
          Git Visual Doc — Interactive Edition • Feito para aprender Git de forma visual
        </div>
      </footer>
    </div>
  );
}
