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
import MergePdfPage from '@/pages/merge-pdf';
import SplitPdfPage from '@/pages/split-pdf';
import CompressPdfPage from '@/pages/compress-pdf';
import ConvertPdfPage from '@/pages/convert-pdf';
import PdfOcrPage from '@/pages/pdf-ocr';
import OrganizePdfPage from '@/pages/organize-pdf';
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
import Seo from '@/components/Seo';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Router() {
  const humanizePath = (path: string) => {
    if (!path || path === '/') return 'Home';
    const cleaned = path.replace(/:\w+/g, '').replace(/^\//, '').replace(/\/$/, '');
    const part = cleaned.split('/').pop() || cleaned;
    const words = part.replace(/-/g, ' ').split(' ').filter(Boolean).map(w => {
      if (w.toLowerCase() === 'pdf') return 'PDF';
      return w.charAt(0).toUpperCase() + w.slice(1);
    });
    return words.join(' ');
  };

  const generateDescription = (human: string) => {
    const action = human.split(' ')[0]?.toLowerCase() || 'manage';
    const verbsMap: Record<string, string> = {
      tools: 'use various PDF tools to',
      blog: 'read articles about',
      about: 'learn about',
      contact: 'contact',
      privacy: 'review privacy for',
      terms: 'review terms for',
      admin: 'manage',
    };
    const actionPhrase = verbsMap[action] ?? `${action}`;
    return `Free online tool to ${actionPhrase} PDFs. Fast, private, and secure. No sign-up required.`;
  };

  const withSeo = (Component: any, path: string) => {
    const human = humanizePath(path);
    const title = `${human} - Free Online PDF Tool | PDFKira`;
    const description = generateDescription(human);
    return (props: any) => (
      <>
        <Seo title={title} description={description} path={path} />
        <Component {...props} />
      </>
    );
  };
  return (
    <Layout>
      <Switch>
        <Route path="/" component={withSeo(Home, '/')} />
        <Route path="/tools" component={withSeo(ToolsIndex, '/tools')} />
        <Route path="/tools/:slug" component={withSeo(ToolDetail, '/tools/:slug')} />
        <Route path="/merge-pdf" component={withSeo(MergePdfPage, '/merge-pdf')} />
        <Route path="/split-pdf" component={withSeo(SplitPdfPage, '/split-pdf')} />
        <Route path="/compress-pdf" component={withSeo(CompressPdfPage, '/compress-pdf')} />
        <Route path="/convert-pdf" component={withSeo(ConvertPdfPage, '/convert-pdf')} />
        <Route path="/pdf-ocr" component={withSeo(PdfOcrPage, '/pdf-ocr')} />
        <Route path="/organize-pdf" component={withSeo(OrganizePdfPage, '/organize-pdf')} />
        <Route path="/blog" component={withSeo(BlogIndex, '/blog')} />
        <Route path="/blog/:slug" component={withSeo(BlogDetail, '/blog/:slug')} />
        <Route path="/about" component={withSeo(About, '/about')} />
        <Route path="/privacy" component={withSeo(Privacy, '/privacy')} />
        <Route path="/terms" component={withSeo(Terms, '/terms')} />
        <Route path="/contact" component={withSeo(Contact, '/contact')} />
        <Route path="/ai-jobs" component={withSeo(AiJobs, '/ai-jobs')} />
        <Route path="/admin/login" component={withSeo(AdminLogin, '/admin/login')} />
        <Route path="/admin/dashboard" component={withSeo(AdminDashboard, '/admin/dashboard')} />
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
