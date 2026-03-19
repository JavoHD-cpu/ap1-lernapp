import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import TopicPage from "@/pages/topic";
import QuizPage from "@/pages/quiz";
import StatsPage from "@/pages/stats";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <WouterRouter hook={useHashLocation}>
    <Switch>
      <Route path="/" component={Home} />
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
