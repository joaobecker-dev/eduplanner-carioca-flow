import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui-components/SectionHeader";
import { useQuery } from "@tanstack/react-query";
import { services } from "@/lib/services";
import { CalendarEvent } from '@/types';
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { getEventTypeLabel } from '../Calendar/utils/eventUtils';
import { ScrollArea } from "@/components/ui/scroll-area"
import { DoughnutChart } from '@/components/ui-components/DoughnutChart';
import { BarChart } from '@/components/ui-components/BarChart';
import { SparklineChart } from '@/components/ui-components/SparklineChart';
import { generateRandomData } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Update any usage of services.calendarEvent to use the direct import
import { calendarEventService } from '@/lib/services';

const Dashboard: React.FC = () => {
  const { data: events = [] } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: calendarEventService.getAll,
  });

  const today = new Date();
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    return format(eventDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  });

  const chartData = {
    labels: ['Concluído', 'Em Andamento', 'Pendente'],
    datasets: [
      {
        label: 'Status das Tarefas',
        data: [30, 40, 30],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Novos Usuários',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const sparklineData = generateRandomData(10);

  const recentSales = [
    { id: 1, product: "Camiseta", date: "2024-07-10", status: "Entregue", amount: 75.00 },
    { id: 2, product: "Calça Jeans", date: "2024-07-09", status: "Pendente", amount: 120.00 },
    { id: 3, product: "Tênis", date: "2024-07-08", status: "Enviado", amount: 250.00 },
    { id: 4, product: "Boné", date: "2024-07-07", status: "Entregue", amount: 45.00 },
    { id: 5, product: "Moletom", date: "2024-07-06", status: "Cancelado", amount: 90.00 },
  ];

  return (
    <div className="container mx-auto py-10">
      <SectionHeader
        title="Painel de Controle"
        description="Visão geral e acompanhamento das atividades acadêmicas"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Eventos de Hoje</CardTitle>
            <CardDescription>Compromissos e atividades para {format(today, 'dd/MM/yyyy', { locale: ptBR })}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[150px] w-full">
              {todayEvents.length > 0 ? (
                <ul className="list-none pl-0">
                  {todayEvents.map(event => (
                    <li key={event.id} className="mb-2">
                      <Badge variant="secondary">{getEventTypeLabel(event.type)}</Badge>
                      <span className="ml-2">{event.title}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum evento para hoje.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
            <CardDescription>Visão geral das datas importantes</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <Calendar
              mode="single"
              selected={today}
              onSelect={() => { }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status das Tarefas</CardTitle>
            <CardDescription>Distribuição das tarefas por status</CardDescription>
          </CardHeader>
          <CardContent>
            <DoughnutChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Novos Usuários</CardTitle>
            <CardDescription>Crescimento mensal de novos usuários</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={barChartData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
            <CardDescription>Histórico das últimas vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.id}</TableCell>
                      <TableCell>{sale.product}</TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.status}</TableCell>
                      <TableCell className="text-right">{sale.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desempenho</CardTitle>
            <CardDescription>Análise do desempenho geral</CardDescription>
          </CardHeader>
          <CardContent>
            <SparklineChart data={sparklineData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
