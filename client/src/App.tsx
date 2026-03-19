import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import HubPage from "@/pages/hub";
import LernenPage from "@/pages/lernen";
import WikiPage from "@/pages/wiki";
import TopicPage from "@/pages/topic";
import QuizPage from "@/pages/quiz";
import StatsPage from "@/pages/stats";
import FormulasPage from "@/pages/formulas";
import GlossaryPage from "@/pages/glossary";
import ExamPage from "@/pages/exam";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <WouterRouter hook={useHashLocation}>
      <Switch>
        {/* IO Hub – new main page */}
        <Route path="/" component={HubPage} />

        {/* Modules */}
        <Route path="/wiki" component={WikiPage} />
        <Route path="/lernen" component={LernenPage} />
        <Route path="/exam" component={ExamPage} />
        <Route path="/formulas" component={FormulasPage} />
        <Route path="/glossary" component={GlossaryPage} />

        {/* Quiz & topic sub-pages */}
        <Route path="/topic/:id" component={TopicPage} />
        <Route path="/quiz/:id" component={QuizPage} />
        <Route path="/quiz" component={QuizPage} />
        <Route path="/stats" component={StatsPage} />

        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
