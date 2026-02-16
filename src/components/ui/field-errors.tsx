import { cn } from "@/lib/utils";
import { type AnyFieldApi } from "@tanstack/react-form";

interface FieldErrorsProps extends React.ComponentProps<"div"> {
  field: AnyFieldApi;
}

export function FieldErrors({ field, className, ...props }: FieldErrorsProps) {
  const errors = field.state.meta.errors;

  if (errors.length === 0) return null;

  return (
    <div
      className={cn("text-destructive text-xs flex flex-col gap-1", className)}
      role="alert"
      {...props}
    >
      {errors.map((error, i) => (
        <p key={i}>
          {typeof error === "object" && error !== null && "message" in error
            ? (error as any).message
            : error?.toString()}
        </p>
      ))}
    </div>
  );
}
