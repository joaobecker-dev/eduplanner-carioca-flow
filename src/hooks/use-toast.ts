
import { Toast, toast as shadcnToast } from "@/components/ui/toast"

export const toast = shadcnToast;

export function useToast() {
  return {
    toast,
    dismiss: shadcnToast.dismiss,
    toasts: [] as Toast[],
  }
}
