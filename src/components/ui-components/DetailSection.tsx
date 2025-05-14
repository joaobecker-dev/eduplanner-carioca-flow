
import React from "react";
import { DetailSection as UiDetailSection } from "@/components/ui/detail-section";

const DetailSection = ({ title, children, className }) => {
  return (
    <UiDetailSection title={title} className={className}>
      {children}
    </UiDetailSection>
  );
};

export default DetailSection;
