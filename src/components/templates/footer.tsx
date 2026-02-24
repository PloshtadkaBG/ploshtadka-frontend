import type { FC } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { LocalizedLink } from "@/components/ui/localized-link";

const Footer: FC = () => {
  const content = useIntlayer("footer");

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="mx-auto max-w-10/12 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <LocalizedLink
              to="/"
              className="flex items-center gap-2 font-medium w-fit"
            >
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              {content.brand}
            </LocalizedLink>
            <p className="text-sm text-muted-foreground max-w-xs">
              {content.tagline}
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
            <LocalizedLink
              to="/about-us"
              className="hover:text-foreground transition"
            >
              {content.links.about}
            </LocalizedLink>
            <LocalizedLink
              to="/features"
              className="hover:text-foreground transition"
            >
              {content.links.features}
            </LocalizedLink>
            <LocalizedLink
              to="/pricing"
              className="hover:text-foreground transition"
            >
              {content.links.pricing}
            </LocalizedLink>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-1 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>{content.copyright}</span>
          <span className="text-muted-foreground/40">{content.builtWith}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
