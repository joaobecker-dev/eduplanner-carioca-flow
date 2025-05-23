import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
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

// Import new Edit pages
import AnnualPlanEdit from "./pages/annual-plans/[id]/edit";
import TeachingPlanEdit from "./pages/teaching-plans/[id]/edit";
import LessonPlanEdit from "./pages/lesson-plans/[id]/edit";
import AssessmentEdit from "./pages/assessments/[id]/edit";

// Import the new AssignAssessmentPage
import AssignAssessmentPage from "./pages/avaliacoes/AssignAssessmentPage";
import StudentAssessmentGradingPage from "./pages/avaliacoes/StudentAssessmentGradingPage";

// Import the new StudentPerformancePage
import StudentPerformancePage from "./pages/students/StudentPerformancePage";

// Import the Material Detail page
import MaterialDetail from "./pages/Materials/[id]";

const queryClient = new QueryClient();

// Wrapper component to provide the ID param for assessment grading
const AssessmentGradingWrapper = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  return assessmentId ? <StudentAssessmentGradingPage assessmentId={assessmentId} /> : null;
};

// Wrapper component to provide the ID param for material detail
const MaterialDetailWrapper = () => {
  const { id } = useParams<{ id: string }>();
  return id ? <MaterialDetail id={id} /> : null;
};

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
            <Route path="/avaliacoes/atribuir" element={<AssignAssessmentPage />} />
            <Route path="/avaliacoes/correcao/:assessmentId" element={<AssessmentGradingWrapper />} />
            <Route path="/materiais" element={<Materials />} />
            <Route path="/materiais/:id" element={<MaterialDetailWrapper />} />
            <Route path="/calendario" element={<Calendar />} />
            <Route path="/desempenho" element={<StudentPerformancePage />} />

            {/* Annual Plan routes */}
            <Route path="/annual-plans/:id" element={<AnnualPlanDetail />} />
            <Route path="/annual-plans/:id/edit" element={<AnnualPlanEdit />} />

            {/* Teaching Plan routes */}
            <Route path="/teaching-plans/:id" element={<TeachingPlanDetail />} />
            <Route path="/teaching-plans/:id/edit" element={<TeachingPlanEdit />} />

            {/* Lesson Plan routes */}
            <Route path="/lesson-plans/:id" element={<LessonPlanDetail />} />
            <Route path="/lesson-plans/:id/edit" element={<LessonPlanEdit />} />

            {/* Assessment routes */}
            <Route path="/assessments/:id" element={<AssessmentDetail />} />
            <Route path="/assessments/:id/edit" element={<AssessmentEdit />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
