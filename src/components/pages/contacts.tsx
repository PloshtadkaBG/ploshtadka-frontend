import { useIntlayer } from "react-intlayer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Mail, Github, MapPin } from "lucide-react";

const CHANNEL_ICONS = [
  <Mail className="size-5" />,
  <Github className="size-5" />,
  <MapPin className="size-5" />,
];

export function Contacts() {
  const content = useIntlayer("contacts");

  const channels = [
    {
      ...content.channels.email,
      href: `mailto:${content.channels.email.value}`,
      icon: CHANNEL_ICONS[0],
    },
    {
      ...content.channels.github,
      href: `https://${content.channels.github.value}`,
      icon: CHANNEL_ICONS[1],
    },
    {
      label: content.channels.location.label,
      description: content.channels.location.description,
      icon: CHANNEL_ICONS[2],
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 pb-12 pt-10 lg:pb-16 lg:pt-14">
        <div className="pointer-events-none absolute -right-32 top-0 size-[500px] rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
            {content.title}
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {content.subtitle}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:px-8">
          {/* Contact channels */}
          <div className="space-y-8">
            {channels.map((channel, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {channel.icon}
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {channel.label}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {channel.description}
                  </p>
                  {"href" in channel && channel.href && (
                    <a
                      href={channel.href}
                      target={channel.href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm font-medium text-primary hover:underline"
                    >
                      {"value" in channel ? (channel.value as string) : ""}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="rounded-2xl border bg-card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              {content.form.title}
            </h2>

            <form
              className="mt-6 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const mailto = `mailto:contact@ploshtadka.bg?subject=${encodeURIComponent(String(formData.get("subject") ?? ""))}&body=${encodeURIComponent(`From: ${formData.get("name")} (${formData.get("email")})\n\n${formData.get("message")}`)}`;
                window.location.href = mailto;
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="contact-name"
                    className="text-sm font-medium text-foreground"
                  >
                    {content.form.name.label}
                  </label>
                  <Input
                    id="contact-name"
                    name="name"
                    placeholder={content.form.name.placeholder.value as string}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contact-email"
                    className="text-sm font-medium text-foreground"
                  >
                    {content.form.email.label}
                  </label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder={
                      content.form.email.placeholder.value as string
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact-subject"
                  className="text-sm font-medium text-foreground"
                >
                  {content.form.subject.label}
                </label>
                <Input
                  id="contact-subject"
                  name="subject"
                  placeholder={
                    content.form.subject.placeholder.value as string
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact-message"
                  className="text-sm font-medium text-foreground"
                >
                  {content.form.message.label}
                </label>
                <Textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder={
                    content.form.message.placeholder.value as string
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full shadow-sm">
                {content.form.submit}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
