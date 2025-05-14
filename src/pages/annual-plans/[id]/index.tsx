import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { annualPlanService } from '@/lib/services';
import DetailSection from '@/components/DetailSection';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

const AnnualPlanDetail = () => {
  const { id } = useParams();
  const [annualPlan, setAnnualPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnualPlan = async () => {
      try {
        const data = await annualPlanService.getById(id);
        setAnnualPlan(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnualPlan();
  }, [id]);

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message="Failed to load annual plan." />;
    }

    return (
      <div className="space-y-6">
        <DetailSection title="Título">
          <p>{annualPlan.title}</p>
        </DetailSection>
        <DetailSection title="Descrição">
          <p>{annualPlan.description}</p>
        </DetailSection>
        <DetailSection title="Objetivos">
          <ul className="list-disc pl-5">
            {annualPlan.objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </DetailSection>
        {annualPlan.referenceMaterials && annualPlan.referenceMaterials.length > 0 && (
          <DetailSection title="Materiais de referência">
            <ul className="list-disc pl-5">
              {annualPlan.referenceMaterials.map((material, index) => (
                <li key={index}>{material}</li>
              ))}
            </ul>
          </DetailSection>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Detalhes do Plano Anual</h1>
      {renderContent()}
    </div>
  );
};

export default AnnualPlanDetail;
