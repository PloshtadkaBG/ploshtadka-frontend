import FormWrapper from "@/features/Auth/components/form-wrapper";
import { SignupForm } from "@/features/Auth/components/signup-form";
import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";

export const Route = createFileRoute("/{-$locale}/auth/signup")({
  component: RouteComponent,
  head: ({ params }) => {
    const { locale } = params;
    const metaContent = getIntlayer("signup", locale).meta;

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
  const content = getIntlayer("signup", locale);

  return (
    <FormWrapper
      form={<SignupForm />}
      tagline={content.panel.tagline as string}
      subtitle={content.panel.subtitle as string}
    />
  );
}
