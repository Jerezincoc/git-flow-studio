import { Link, useLocation, Outlet } from "react-router-dom";
import { Terminal, LayoutList, AlertTriangle, BookOpen, Menu, ChevronLeft } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { label: "Guia", path: "/shell/guide", icon: BookOpen },
  { label: "Cmdlets", path: "/shell/commands", icon: Terminal },
  { label: "Cheat Sheet", path: "/shell/cheatsheet", icon: LayoutList },
  { label: "Problemas", path: "/shell/problems", icon: AlertTriangle },
];

export function ShellLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

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
    <div data-theme="shell" className="min-h-screen flex flex-col">
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
              <Link to="/shell" className="flex items-center gap-2 font-bold text-lg">
                <Terminal className="h-5 w-5 text-primary" />
                <span className="gradient-text">ShellDoc</span>
              </Link>
            </div>
            <nav className="hidden lg:flex items-center gap-1">
              <NavLinks />
            </nav>
          </div>
          <div className="flex items-center gap-2">
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
          ShellDoc — Referência visual de PowerShell e comandos Windows
        </div>
      </footer>
    </div>
  );
}
