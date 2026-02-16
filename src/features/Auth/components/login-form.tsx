import { loginSchema, type LoginValues } from "@Auth/schemas/login.schema";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { LocalizedLink as Link } from "@/components/ui/localized-link";
import { cn } from "@/lib/utils";
import { FieldErrors } from "@/components/ui/field-errors";
import { useIntlayer } from "react-intlayer";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";

export function LoginForm({ className }: { className?: string }) {
  const navigate = useLocalizedNavigate();
  const {
    title,
    description,
    email,
    password,
    loginButton,
    termsText,
    termsLink,
    orSeparator,
    signupButton,
  } = useIntlayer("login");

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginValues,
    onSubmit: async ({ value }) => {
      console.log("Submitting:", value);
    },
  });

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {description}
          </p>
        </div>

        {/* Email Field */}
        <form.Field
          name="email"
          validators={{ onBlur: loginSchema.shape.email }}
        >
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{email.label}</FieldLabel>
              <Input
                id={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
                aria-describedby={
                  field.state.meta.errors.length > 0 ? "email-error" : undefined
                }
              />
              <FieldErrors field={field} />
            </Field>
          )}
        </form.Field>

        {/* Password Field */}
        <form.Field
          name="password"
          validators={{ onBlur: loginSchema.shape.password }}
        >
          {(field) => (
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor={field.name}>{password.label}</FieldLabel>
                <Link className="ml-auto text-sm" to="/auth/login">
                  {password.forgotLink}
                </Link>
              </div>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
                aria-describedby={
                  field.state.meta.errors.length > 0 ? "pass-error" : undefined
                }
              />
              <FieldErrors field={field} />
            </Field>
          )}
        </form.Field>

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? loginButton.submitting : loginButton.idle}
            </Button>
          )}
        </form.Subscribe>

        <Field>
          <span className="text-center text-xs underline-offset-4 -mt-5 text-gray-700">
            {termsText}&nbsp;
            <Link
              to="/terms-and-conditions"
              className="underline hover:text-primary"
            >
              {termsLink}
            </Link>
          </span>
        </Field>

        <FieldSeparator>{orSeparator}</FieldSeparator>

        <Button
          variant="outline"
          type="button"
          onClick={() => navigate({ to: "/auth/signup" })}
        >
          {signupButton}
        </Button>
      </FieldGroup>
    </form>
  );
}
