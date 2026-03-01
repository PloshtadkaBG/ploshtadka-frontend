import FormWrapper from "@/features/Auth/components/form-wrapper";
import { LoginForm } from "@/features/Auth/components/login-form";
import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";

export const Route = createFileRoute("/{-$locale}/auth/login")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
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
  const { locale } = Route.useParams();
  const content = getIntlayer("login", locale);

  return (
    <FormWrapper
      form={<LoginForm />}
      tagline={content.panel.tagline as string}
      subtitle={content.panel.subtitle as string}
    />
  );
}
