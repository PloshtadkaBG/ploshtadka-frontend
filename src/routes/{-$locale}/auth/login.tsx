import FormWrapper from "@/features/Auth/components/form-wrapper";
import { LoginForm } from "@/features/Auth/components/login-form";
import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";

export const Route = createFileRoute("/{-$locale}/auth/login")({
  component: RouteComponent,
  head: ({ params }) => {
    const { locale } = params;
    const metaContent = getIntlayer("login", locale).meta;

    return {
      meta: [
        { title: metaContent.title },
        { content: metaContent.description, name: "description" },
      ],
    };
  },
});

function RouteComponent() {
  return <FormWrapper form={<LoginForm />} />;
}
