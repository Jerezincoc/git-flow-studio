import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import { ShellLayout } from "@/components/ShellLayout";
import Hub from "./pages/Hub";
import Index from "./pages/Index";
import Commands from "./pages/Commands";
import CommandDetail from "./pages/CommandDetail";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Guide from "./pages/Guide";
import GitMap from "./pages/GitMap";
import CheatSheet from "./pages/CheatSheet";
import Conventions from "./pages/Conventions";
import ShellHome from "./pages/ShellHome";
import ShellCommands from "./pages/shell/ShellCommands";
import ShellCommandDetail from "./pages/shell/ShellCommandDetail";
import ShellCheatSheet from "./pages/shell/ShellCheatSheet";
import ShellComingSoon from "./pages/shell/ShellComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Hub */}
          <Route path="/" element={<Hub />} />

          {/* GitDoc — rotas existentes mantidas + /git como alias da home */}
          <Route element={<Layout />}>
            <Route path="/git" element={<Index />} />
            <Route path="/commands" element={<Commands />} />
            <Route path="/commands/:id" element={<CommandDetail />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/map" element={<GitMap />} />
            <Route path="/cheatsheet" element={<CheatSheet />} />
            <Route path="/conventions" element={<Conventions />} />
          </Route>

          {/* ShellDoc */}
          <Route element={<ShellLayout />}>
            <Route path="/shell" element={<ShellHome />} />
            <Route path="/shell/commands" element={<ShellCommands />} />
            <Route path="/shell/commands/:id" element={<ShellCommandDetail />} />
            <Route path="/shell/cheatsheet" element={<ShellCheatSheet />} />
            <Route path="/shell/guide" element={<ShellComingSoon />} />
            <Route path="/shell/problems" element={<ShellComingSoon />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
