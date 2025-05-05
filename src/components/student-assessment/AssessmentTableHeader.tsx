
import React from 'react';
import { TableHeader, TableHead, TableRow } from '@/components/ui/table';

const AssessmentTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Aluno</TableHead>
        <TableHead>Matrícula</TableHead>
        <TableHead>Nota</TableHead>
        <TableHead>Feedback</TableHead>
        <TableHead>Data de Envio</TableHead>
        <TableHead>Data de Correção</TableHead>
        <TableHead className="w-[100px]">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AssessmentTableHeader;
