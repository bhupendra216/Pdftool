import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { ScrollToTop } from '@/components/shared/ScrollToTop';

// Pages
import { Home } from '@/pages/Home';
import { ToolsIndex } from '@/pages/ToolsIndex';
import { ToolDetail } from '@/pages/ToolDetail';
import { BlogIndex } from '@/pages/BlogIndex';
import { BlogDetail } from '@/pages/BlogDetail';
import { About } from '@/pages/About';
import { Privacy } from '@/pages/Privacy';
import { Terms } from '@/pages/Terms';
import { Contact } from '@/pages/Contact';
import { AiJobs } from '@/pages/AiJobs';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tools" component={ToolsIndex} />
        <Route path="/tools/:slug" component={ToolDetail} />
        <Route path="/blog" component={BlogIndex} />
        <Route path="/blog/:slug" component={BlogDetail} />
        <Route path="/about" component={About} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/contact" component={Contact} />
        <Route path="/ai-jobs" component={AiJobs} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ScrollToTop />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
