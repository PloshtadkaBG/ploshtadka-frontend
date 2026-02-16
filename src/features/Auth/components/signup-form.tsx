import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LocalizedLink as Link } from "@/components/ui/localized-link";
import { FieldErrors } from "@/components/ui/field-errors";
import { useForm } from "@tanstack/react-form";
import { signupSchema, type SignupValues } from "../schemas/signup.schema";
import { useIntlayer } from "react-intlayer";
import { useRegisterUser } from "../api/hooks";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const registerMutation = useRegisterUser();
  const navigate = useLocalizedNavigate();
  const content = useIntlayer("signup");

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as SignupValues,
    validators: {
      onChange: signupSchema,
    },
    onSubmit: async ({ value }) => {
      registerMutation.mutate(
        {
          username: value.email,
          password: value.password,
          full_name: value.name,
          email: value.email,
        },
        {
          onSuccess: () => {
            navigate("/auth/login");
          },
        },
      );
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
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{content.title}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {content.description}
          </p>
        </div>

        {/* --- Full Name Field --- */}
        <form.Field
          name="name"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                {content.fields.name.label}
              </FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={content.fields.name.placeholder.value}
              />
              <FieldErrors field={field} />
            </Field>
          )}
        />

        {/* --- Email Field --- */}
        <form.Field
          name="email"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                {content.fields.email.label}
              </FieldLabel>
              <Input
                id={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={content.fields.email.placeholder.value}
              />
              <FieldErrors field={field} />
            </Field>
          )}
        />

        {/* --- Password Field --- */}
        <form.Field
          name="password"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                {content.fields.password.label}
              </FieldLabel>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>
                {content.fields.password.hint}
              </FieldDescription>
              <FieldErrors field={field} />
            </Field>
          )}
        />

        {/* --- Confirm Password --- */}
        <form.Field
          name="confirmPassword"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                {content.fields.confirmPassword.label}
              </FieldLabel>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldErrors field={field} />
            </Field>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, registerMutation.isPending]}
          children={([canSubmit, isSubmitting]) => (
            <Field>
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? content.button.submitting : content.button.idle}
              </Button>
            </Field>
          )}
        />

        <Field>
          <span className="text-center text-xs underline-offset-4 -mt-5 text-gray-700">
            {content.legal.text}
            <Link
              to="/terms-and-conditions"
              className="underline hover:text-primary"
            >
              {content.legal.link}
            </Link>
          </span>
        </Field>

        <FieldSeparator>{content.separator}</FieldSeparator>

        <Field>
          <FieldDescription className="px-6 text-center">
            {content.loginPrompt.text}
            <Link
              to="/auth/login"
              className="font-medium text-primary underline underline-offset-4 cursor-pointer"
            >
              {content.loginPrompt.link}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
