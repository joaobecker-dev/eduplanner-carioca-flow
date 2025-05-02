
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Planning from "./pages/Planning";
import Assessments from "./pages/Assessments";
import Materials from "./pages/Materials";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";
import AnnualPlanDetail from "./pages/annual-plans/[id]";
import TeachingPlanDetail from "./pages/teaching-plans/[id]";
import LessonPlanDetail from "./pages/lesson-plans/[id]";
import AssessmentDetail from "./pages/assessments/[id]";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planejamento" element={<Planning />} />
            <Route path="/avaliacoes" element={<Assessments />} />
            <Route path="/materiais" element={<Materials />} />
            <Route path="/calendario" element={<Calendar />} />
            
            {/* Annual Plan routes */}
            <Route path="/annual-plans/:id" element={<AnnualPlanDetail />} />
            
            {/* Teaching Plan routes */}
            <Route path="/teaching-plans/:id" element={<TeachingPlanDetail />} />
            
            {/* Lesson Plan routes */}
            <Route path="/lesson-plans/:id" element={<LessonPlanDetail />} />
            
            {/* Assessment routes */}
            <Route path="/assessments/:id" element={<AssessmentDetail />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
