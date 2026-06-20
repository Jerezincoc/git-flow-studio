import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import { ShellLayout } from "@/components/ShellLayout";
import { LinuxLayout } from "@/components/LinuxLayout";
import { WinLayout } from "@/components/WinLayout";
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
import ShellGuide from "./pages/shell/ShellGuide";
import ShellProblems from "./pages/shell/ShellProblems";
import ShellProblemDetail from "./pages/shell/ShellProblemDetail";
import ShellScenarios from "./pages/shell/ShellScenarios";
import ShellConventions from "./pages/shell/ShellConventions";
import LinuxHome from "./pages/linux/LinuxHome";
import LinuxCommands from "./pages/linux/LinuxCommands";
import LinuxCommandDetail from "./pages/linux/LinuxCommandDetail";
import LinuxScenarios from "./pages/linux/LinuxScenarios";
import LinuxCheatSheet from "./pages/linux/LinuxCheatSheet";
import LinuxProblems from "./pages/linux/LinuxProblems";
import LinuxProblemDetail from "./pages/linux/LinuxProblemDetail";
import WinHome from "./pages/win/WinHome";
import WinCommands from "./pages/win/WinCommands";
import WinCommandDetail from "./pages/win/WinCommandDetail";
import WinScenarios from "./pages/win/WinScenarios";
import WinCheatSheet from "./pages/win/WinCheatSheet";
import WinProblems from "./pages/win/WinProblems";
import WinProblemDetail from "./pages/win/WinProblemDetail";
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
            <Route path="/shell/guide" element={<ShellGuide />} />
            <Route path="/shell/problems" element={<ShellProblems />} />
            <Route path="/shell/problems/:id" element={<ShellProblemDetail />} />
            <Route path="/shell/scenarios" element={<ShellScenarios />} />
            <Route path="/shell/conventions" element={<ShellConventions />} />
          </Route>

          {/* LinuxDoc */}
          <Route element={<LinuxLayout />}>
            <Route path="/linux" element={<LinuxHome />} />
            <Route path="/linux/commands" element={<LinuxCommands />} />
            <Route path="/linux/commands/:id" element={<LinuxCommandDetail />} />
            <Route path="/linux/scenarios" element={<LinuxScenarios />} />
            <Route path="/linux/cheatsheet" element={<LinuxCheatSheet />} />
            <Route path="/linux/problems" element={<LinuxProblems />} />
            <Route path="/linux/problems/:id" element={<LinuxProblemDetail />} />
          </Route>

          {/* WinDoc */}
          <Route element={<WinLayout />}>
            <Route path="/win" element={<WinHome />} />
            <Route path="/win/commands" element={<WinCommands />} />
            <Route path="/win/commands/:id" element={<WinCommandDetail />} />
            <Route path="/win/scenarios" element={<WinScenarios />} />
            <Route path="/win/cheatsheet" element={<WinCheatSheet />} />
            <Route path="/win/problems" element={<WinProblems />} />
            <Route path="/win/problems/:id" element={<WinProblemDetail />} />
            <Route path="/win/conventions" element={<WinConventions />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
