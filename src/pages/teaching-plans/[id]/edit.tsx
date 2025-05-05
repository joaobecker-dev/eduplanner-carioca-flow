import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TeachingPlanFormValues, teachingPlanSchema } from '@/components/forms/TeachingPlanForm';
import TeachingPlanForm from '@/components/forms/TeachingPlanForm';
import { teachingPlanService } from '@/lib/services/teachingPlanService';
import { AnnualPlan, Subject, TeachingPlan } from '@/types';
import { annualPlanService } from '@/lib/services/annualPlanService';
import { subjectService } from '@/lib/services/subjectService';
import CrudModal from '@/components/ui-components/CrudModal';

interface EditTeachingPlanPageProps {
  // You can define props here if needed
}

const EditTeachingPlanPage: React.FC<EditTeachingPlanPageProps> = () => {
  const router = useRouter();
  const { id } = router.query;
  const teachingPlanId = Array.isArray(id) ? id[0] : id;

  const [teachingPlan, setTeachingPlan] = useState<TeachingPlan | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [annualPlans, setAnnualPlans] = useState<AnnualPlan[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const form = useForm<TeachingPlanFormValues>({
    resolver: zodResolver(teachingPlanSchema),
    defaultValues: {
      title: '',
      description: '',
      annualPlanId: '',
      subjectId: '',
      startDate: undefined,
      endDate: undefined,
      objectives: [],
      bnccReferences: [],
      contents: [],
      methodology: '',
      resources: [],
      evaluation: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (teachingPlanId) {
        setIsFetching(true);
        try {
          const plan = await teachingPlanService.getById(teachingPlanId);
          setTeachingPlan(plan);

          // Set default values for the form
          form.reset({
            title: plan.title,
            description: plan.description || '',
            annualPlanId: plan.annualPlanId,
            subjectId: plan.subjectId,
            startDate: plan.startDate ? new Date(plan.startDate) : undefined,
            endDate: plan.endDate ? new Date(plan.endDate) : undefined,
            objectives: plan.objectives || [],
            bnccReferences: plan.bnccReferences || [],
            contents: plan.contents || [],
            methodology: plan.methodology || '',
            resources: plan.resources || [],
            evaluation: plan.evaluation || '',
          });
        } catch (error) {
          console.error('Error fetching teaching plan:', error);
          toast.error('Erro ao buscar plano de ensino');
        } finally {
          setIsFetching(false);
        }
      }
    };

    fetchData();
  }, [teachingPlanId, form]);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [annualPlanData, subjectData] = await Promise.all([
          annualPlanService.getAll(),
          subjectService.getAll(),
        ]);
        setAnnualPlans(annualPlanData);
        setSubjects(subjectData);
      } catch (error) {
        console.error('Error fetching dependencies:', error);
        toast.error('Erro ao buscar dependências');
      }
    };

    fetchDependencies();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const processFormValues = (values: TeachingPlanFormValues): TeachingPlanFormValues => {
    return {
      ...values,
      // Convert string dates to Date objects if needed
      startDate: values.startDate ? new Date(values.startDate) : undefined,
      endDate: values.endDate ? new Date(values.endDate) : undefined
    };
  };

  const handleUpdateTeachingPlan = async (values: TeachingPlanFormValues) => {
    try {
      const processedValues = processFormValues(values);
      if (teachingPlanId) {
        await teachingPlanService.update(teachingPlanId, processedValues);
        toast.success('Plano de ensino atualizado com sucesso!');
        router.push('/planejamento');
      } else {
        toast.error('ID do plano de ensino não encontrado.');
      }
    } catch (error) {
      console.error('Error updating teaching plan:', error);
      toast.error('Erro ao atualizar plano de ensino');
    }
  };

  if (isFetching) {
    return <div>Carregando...</div>;
  }

  if (!teachingPlan) {
    return <div>Plano de ensino não encontrado.</div>;
  }

  return (
    <CrudModal
      title="Editar Plano de Ensino"
      description="Atualize os detalhes do plano de ensino"
      isOpen={true}
      onClose={() => router.push('/planejamento')}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(handleUpdateTeachingPlan)();
      }}
      isLoading={false}
    >
      <TeachingPlanForm
        form={form}
        annualPlans={annualPlans}
        subjects={subjects}
        onSubmit={handleUpdateTeachingPlan}
      />
    </CrudModal>
  );
};

export default EditTeachingPlanPage;
