
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import StudentPerformanceTable from "@/components/StudentPerformanceTable";

const StudentPerformancePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <h1 className="text-3xl font-bold">Desempenho dos Alunos</h1>
          <p className="text-gray-500">
            Visualize o desempenho acadêmico dos alunos em todas as avaliações
          </p>
        </div>
      </div>
      
      <Card className="p-6">
        <StudentPerformanceTable />
      </Card>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <h3 className="text-lg font-medium text-blue-800 mb-2">
          Sobre os dados de desempenho
        </h3>
        <p className="text-blue-700">
          Esta página mostra uma visão consolidada do desempenho acadêmico dos alunos com base nas avaliações registradas no sistema.
          A média de notas é calculada considerando todas as avaliações às quais o aluno foi atribuído. 
          Use o filtro por disciplina para visualizar o desempenho específico em cada área de conhecimento.
        </p>
      </div>
    </div>
  );
};

export default StudentPerformancePage;
