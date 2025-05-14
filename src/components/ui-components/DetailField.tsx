
import React from "react";
import { DetailField as UiDetailField } from "@/components/ui/detail-field";

const DetailField = ({ label, value }) => {
  return (
    <UiDetailField label={label} value={value} />
  );
};

export default DetailField;
