
import { DetailSection as UiDetailSection } from "@/components/ui/detail-section";

export default function DetailSection({ title, children, className }) {
  return (
    <UiDetailSection title={title} className={className}>
      {children}
    </UiDetailSection>
  );
}
