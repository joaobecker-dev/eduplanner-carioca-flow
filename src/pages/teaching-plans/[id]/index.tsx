
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teachingPlanService } from '@/lib/services';
import { TeachingPlan } from '@/types';
import DetailSection from '@/components/DetailSection';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

const TeachingPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teachingPlan, setTeachingPlan] = useState<TeachingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachingPlan = async () => {
      if (id) {
        try {
          const data = await teachingPlanService.getById(id as string);
          setTeachingPlan(data);
        } catch (err) {
          setError('Failed to load teaching plan');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTeachingPlan();
  }, [id]);

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (!teachingPlan) {
      return <ErrorMessage message="Teaching plan not found." />;
    }

    return (
      <div className="space-y-6">
        <DetailSection title="Título">
          <p>{teachingPlan.title}</p>
        </DetailSection>
        <DetailSection title="Descrição">
          <p>{teachingPlan.description}</p>
        </DetailSection>
        <DetailSection title="Objetivos">
          <ul className="list-disc pl-5">
            {teachingPlan.objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </DetailSection>
        <DetailSection title="Referências BNCC">
          {teachingPlan.bnccReferences && teachingPlan.bnccReferences.length > 0 && (
            <ul className="list-disc pl-5">
              {teachingPlan.bnccReferences.map((ref, index) => (
                <li key={index}>{ref}</li>
              ))}
            </ul>
          )}
        </DetailSection>
        <DetailSection title="Conteúdos">
          <ul className="list-disc pl-5">
            {teachingPlan.contents.map((content, index) => (
              <li key={index}>{content}</li>
            ))}
          </ul>
        </DetailSection>
        <DetailSection title="Metodologia">
          <p>{teachingPlan.methodology}</p>
        </DetailSection>
        <DetailSection title="Avaliação">
          <p>{teachingPlan.evaluation}</p>
        </DetailSection>
        <DetailSection title="Recursos">
          <ul className="list-disc pl-5">
            {teachingPlan.resources.map((resource, index) => (
              <li key={index}>{resource}</li>
            ))}
          </ul>
        </DetailSection>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Detalhes do Plano de Ensino</h1>
      {renderContent()}
    </div>
  );
};

export default TeachingPlanDetail;
