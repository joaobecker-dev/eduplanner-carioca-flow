
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SectionHeader from '@/components/ui-components/SectionHeader';
import { services } from '@/lib/services';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from '@/components/ui/skeleton';

const PlanningPage: React.FC = () => {
  const { data: annualPlans, isLoading: isLoadingAnnualPlans } = useQuery(
    ['annualPlans'],
    () => services.annualPlan.getAll()
  );

  const { data: teachingPlans, isLoading: isLoadingTeachingPlans } = useQuery(
    ['teachingPlans'],
    () => services.teachingPlan.getAll()
  );

  const { data: lessonPlans, isLoading: isLoadingLessonPlans } = useQuery(
    ['lessonPlans'],
    () => services.lessonPlan.getAll()
  );

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <SectionHeader
        title="Planejamento"
        description="Visualize e organize seus planos anuais, planos de ensino e planos de aula."
      />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="annual-plans">
          <AccordionTrigger>Planos Anuais</AccordionTrigger>
          <AccordionContent>
            <div className="mb-4 flex justify-end">
              <Button asChild>
                <Link to="/annual-plans/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Novo Plano Anual
                </Link>
              </Button>
            </div>
            {isLoadingAnnualPlans ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : annualPlans && annualPlans.length > 0 ? (
              <Table>
                <TableCaption>Lista de planos anuais.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Título</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {annualPlans.map((annualPlan) => (
                    <TableRow key={annualPlan.id}>
                      <TableCell className="font-medium">{annualPlan.title}</TableCell>
                      <TableCell>{annualPlan.description}</TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">
                          Criado em {formatDate(annualPlan.created_at)}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/annual-plans/${annualPlan.id}/edit`}>
                            Editar
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/annual-plans/${annualPlan.id}`}>
                            Visualizar
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Card>
                <CardContent className="p-4">
                  Nenhum plano anual encontrado.
                </CardContent>
              </Card>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="teaching-plans">
          <AccordionTrigger>Planos de Ensino</AccordionTrigger>
          <AccordionContent>
            <div className="mb-4 flex justify-end">
              <Button asChild>
                <Link to="/planejamento/novo?type=teaching">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Novo Plano de Ensino
                </Link>
              </Button>
            </div>
            {isLoadingTeachingPlans ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : teachingPlans && teachingPlans.length > 0 ? (
              <Table>
                <TableCaption>Lista de planos de ensino.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Título</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachingPlans.map((teachingPlan) => (
                    <TableRow key={teachingPlan.id}>
                      <TableCell className="font-medium">{teachingPlan.title}</TableCell>
                      <TableCell>{teachingPlan.description}</TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">
                          Criado em {formatDate(teachingPlan.created_at)}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/planejamento?teaching=${teachingPlan.id}`}>
                            Visualizar
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Card>
                <CardContent className="p-4">
                  Nenhum plano de ensino encontrado.
                </CardContent>
              </Card>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="lesson-plans">
          <AccordionTrigger>Planos de Aula</AccordionTrigger>
          <AccordionContent>
            <div className="mb-4 flex justify-end">
              <Button asChild>
                <Link to="/planejamento/novo?type=lesson">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Novo Plano de Aula
                </Link>
              </Button>
            </div>
            {isLoadingLessonPlans ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : lessonPlans && lessonPlans.length > 0 ? (
              <Table>
                <TableCaption>Lista de planos de aula.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Título</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lessonPlans.map((lessonPlan) => (
                    <TableRow key={lessonPlan.id}>
                      <TableCell className="font-medium">{lessonPlan.title}</TableCell>
                      <TableCell>{formatDate(lessonPlan.date)}</TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">
                          Criado em {formatDate(lessonPlan.created_at)}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/planejamento?lesson=${lessonPlan.id}`}>
                            Visualizar
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Card>
                <CardContent className="p-4">
                  Nenhum plano de aula encontrado.
                </CardContent>
              </Card>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PlanningPage;
