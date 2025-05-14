
import { DetailSection as UiDetailSection } from "@/components/ui/detail-section";
import { cn } from "@/lib/utils";

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Make className optional
}

export default function DetailSection({ title, children, className = "" }: DetailSectionProps) {
  return (
    <UiDetailSection title={title} className={className}>
      {children}
    </UiDetailSection>
  );
}
