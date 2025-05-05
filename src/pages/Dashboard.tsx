
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  FileText, 
  BarChart2, 
  Users,
  CheckSquare
} from 'lucide-react';
import DashboardCard from '@/components/ui-components/DashboardCard';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard 
          title="Planejamento" 
          description="Planos de ensino e aulas" 
          icon={BookOpen}
          linkPath="/planejamento"
        />
        
        <DashboardCard 
          title="Avaliações" 
          description="Gerenciar avaliações" 
          icon={FileText}
          linkPath="/avaliacoes"
        />
        
        <DashboardCard 
          title="Calendário" 
          description="Visualizar eventos" 
          icon={CalendarIcon}
          linkPath="/calendario"
        />
        
        <DashboardCard 
          title="Materiais" 
          description="Gerenciar recursos didáticos" 
          icon={BookOpen}
          linkPath="/materiais"
        />
        
        <DashboardCard 
          title="Desempenho dos Alunos" 
          description="Visualizar progresso acadêmico" 
          icon={BarChart2}
          linkPath="/desempenho"
        />
        
        <DashboardCard 
          title="Atribuir Avaliação" 
          description="Atribuir avaliações a alunos" 
          icon={CheckSquare}
          linkPath="/avaliacoes/atribuir"
        />
      </div>
    </div>
  );
};

export default Dashboard;
