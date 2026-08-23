import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useParams } from 'wouter';
import { useListTools } from '@workspace/api-client-react';
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
import SearchFreePdfsPage from '@/pages/search-free-pdfs';
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
// 👇 ADD THIS IMPORT:
import DownloadPdfPage from '@/pages/download-pdf';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ToolDetailAliasRoute() {
  const params = useParams<{ slug: string }>();
  const { data: catalogTools = [] } = useListTools();

  const resolvedSlug = useMemo(() => {
    const rawSlug = (params?.slug || '').trim().toLowerCase();
    if (!rawSlug) return rawSlug;

    const exact = catalogTools.find((tool) => tool.slug.toLowerCase() === rawSlug);
    if (exact) return exact.slug;

    const normalized = rawSlug.replace(/-pdf$/, '');
    const directAlias = catalogTools.find((tool) => tool.slug.toLowerCase() === `${normalized}-pdf`);
    if (directAlias) return directAlias.slug;

    const byName = catalogTools.find((tool) => {
      const nameSlug = tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return nameSlug === rawSlug || nameSlug === normalized;
    });

    if (byName) return byName.slug;

    return rawSlug;
  }, [catalogTools, params?.slug]);

  return <ToolDetail forcedSlug={resolvedSlug || undefined} />;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tools" component={ToolsIndex} />
        {/* Explicit tool routes placed before the dynamic catch-all */}
        <Route path="/tools/merge-pdf" component={MergePdfPage} />
        <Route path="/tools/split-pdf" component={SplitPdfPage} />
        <Route path="/tools/compress-pdf" component={CompressPdfPage} />
        <Route path="/tools/convert-pdf" component={ConvertPdfPage} />
        <Route path="/tools/pdf-ocr" component={PdfOcrPage} />
        <Route path="/tools/organize-pdf" component={OrganizePdfPage} />
        <Route path="/tools/download-pdf" component={DownloadPdfPage} />
        <Route path="/tools/search-free-pdfs" component={SearchFreePdfsPage} />
        <Route path="/tools/:slug" component={ToolDetail} />
        {/* Root-level legacy aliases for backward compatibility */}
        <Route path="/merge-pdf" component={MergePdfPage} />
        <Route path="/split-pdf" component={SplitPdfPage} />
        <Route path="/compress-pdf" component={CompressPdfPage} />
        <Route path="/convert-pdf" component={ConvertPdfPage} />
        <Route path="/pdf-ocr" component={PdfOcrPage} />
        <Route path="/organize-pdf" component={OrganizePdfPage} />
        <Route path="/download-pdf" component={DownloadPdfPage} />
        <Route path="/blog" component={BlogIndex} />
        <Route path="/blog/:slug" component={BlogDetail} />
        <Route path="/about" component={About} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/contact" component={Contact} />
        <Route path="/ai-jobs" component={AiJobs} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/:slug" component={ToolDetailAliasRoute} />
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