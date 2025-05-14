
import React from "react";
import { DetailSection as UiDetailSection } from "@/components/ui/detail-section";
import { cn } from "@/lib/utils";

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Make className optional
}

const DetailSection = ({ title, children, className = "" }: DetailSectionProps) => {
  return (
    <UiDetailSection title={title} className={className}>
      {children}
    </UiDetailSection>
  );
};

export default DetailSection;
