import React, { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { ScrollToTop } from '@/components/shared/ScrollToTop';

// Pages
const Home = lazy(() => import('@/pages/Home').then((mod) => ({ default: mod.Home })));
const ToolsIndex = lazy(() => import('@/pages/ToolsIndex').then((mod) => ({ default: mod.ToolsIndex })));
const ToolDetail = lazy(() => import('@/pages/ToolDetail').then((mod) => ({ default: mod.ToolDetail })));
const MergePdfPage = lazy(() => import('@/pages/merge-pdf'));
const SplitPdfPage = lazy(() => import('@/pages/split-pdf'));
const CompressPdfPage = lazy(() => import('@/pages/compress-pdf'));
const EditPdfPage = lazy(() => import('@/pages/edit-pdf'));
const ConvertPdfPage = lazy(() => import('@/pages/convert-pdf'));
const PdfOcrPage = lazy(() => import('@/pages/pdf-ocr'));
const OrganizePdfPage = lazy(() => import('@/pages/organize-pdf'));
const SearchFreePdfsPage = lazy(() => import('@/pages/search-free-pdfs'));
const RemoveBackgroundPage = lazy(() => import('@/pages/remove-background'));
const AddBackgroundPage = lazy(() => import('@/pages/add-background'));
const LatexToTextPage = lazy(() => import('@/pages/latex-to-text'));
const BlogIndex = lazy(() => import('@/pages/BlogIndex').then((mod) => ({ default: mod.BlogIndex })));
const BlogDetail = lazy(() => import('@/pages/BlogDetail').then((mod) => ({ default: mod.BlogDetail })));
const About = lazy(() => import('@/pages/About').then((mod) => ({ default: mod.About })));
const Privacy = lazy(() => import('@/pages/Privacy').then((mod) => ({ default: mod.Privacy })));
const Terms = lazy(() => import('@/pages/Terms').then((mod) => ({ default: mod.Terms })));
const Contact = lazy(() => import('@/pages/Contact').then((mod) => ({ default: mod.Contact })));
const AiJobs = lazy(() => import('@/pages/AiJobs').then((mod) => ({ default: mod.AiJobs })));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin').then((mod) => ({ default: mod.AdminLogin })));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then((mod) => ({ default: mod.AdminDashboard })));
const NotFound = lazy(() => import('@/pages/not-found'));
const DownloadPdfPage = lazy(() => import('@/pages/download-pdf'));
const CompareIlovepdfVsSmallpdfVsPdfkiraPage = lazy(() => import('@/pages/compare-ilovepdf-vs-smallpdf-vs-pdfkira'));
const DirtyPdfPage = lazy(() => import('@/pages/dirty-pdf'));

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
        {/* Explicit tool routes placed before the dynamic catch-all */}
        <Route path="/tools/merge-pdf" component={MergePdfPage} />
        <Route path="/tools/split-pdf" component={SplitPdfPage} />
        <Route path="/tools/compress-pdf" component={CompressPdfPage} />
        <Route path="/tools/transform-pdf" component={DirtyPdfPage} />
        <Route path="/tools/transformpdf" component={DirtyPdfPage} />
        <Route path="/transformpdf" component={DirtyPdfPage} />
        <Route path="/tools/edit-pdf" component={EditPdfPage} />
        <Route path="/tools/convert-pdf" component={ConvertPdfPage} />
        <Route path="/tools/pdf-ocr" component={PdfOcrPage} />
        <Route path="/tools/organize-pdf" component={OrganizePdfPage} />
        <Route path="/tools/download-pdf" component={DownloadPdfPage} />
        <Route path="/tools/search-free-pdfs" component={SearchFreePdfsPage} />
        <Route path="/tools/remove-background" component={RemoveBackgroundPage} />
        <Route path="/tools/add-background" component={AddBackgroundPage} />
        <Route path="/tools/latex-to-text" component={LatexToTextPage} />
        <Route path="/tools/:slug" component={ToolDetail} />
        {/* Root-level legacy aliases for backward compatibility */}
        <Route path="/merge-pdf" component={MergePdfPage} />
        <Route path="/split-pdf" component={SplitPdfPage} />
        <Route path="/compress-pdf" component={CompressPdfPage} />
        <Route path="/edit-pdf" component={EditPdfPage} />
        <Route path="/convert-pdf" component={ConvertPdfPage} />
        <Route path="/pdf-ocr" component={PdfOcrPage} />
        <Route path="/organize-pdf" component={OrganizePdfPage} />
        <Route path="/download-pdf" component={DownloadPdfPage} />
        <Route path="/latex-to-text" component={LatexToTextPage} />
        <Route path="/blog" component={BlogIndex} />
        <Route path="/blog/:slug" component={BlogDetail} />
        <Route path="/about" component={About} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/contact" component={Contact} />
        <Route path="/compare/ilovepdf-vs-smallpdf-vs-pdfkira" component={CompareIlovepdfVsSmallpdfVsPdfkiraPage} />
        <Route path="/ai-jobs" component={AiJobs} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="*" component={NotFound} />
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
          <Suspense fallback={<div className="min-h-[50vh]" />}> 
            <Router />
          </Suspense>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;// deploy test बुधवार 09 सितम्बर 2026 11:15:05 अपराह्न +0545
