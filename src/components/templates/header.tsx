import { useState } from "react";
import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { LocalizedLink } from "@/components/ui/localized-link";
import { GalleryVerticalEnd, Menu, X } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { UserNav } from "../ui/user-nav";

const Header: FC = () => {
  const [open, setOpen] = useState(false);

  const content = useIntlayer("header");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-sm">
      <div className="mx-auto flex max-w-10/12 items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* left: brand */}
        <div className="flex justify-center gap-2 md:justify-start">
          <LocalizedLink to="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            {content.brand}
          </LocalizedLink>
        </div>

        {/* center: nav for md+ */}
        <nav
          aria-label={content.aria.nav as string}
          className="hidden md:flex md:items-center md:gap-6"
        >
          {content.navLinks.map((link) => (
            <LocalizedLink
              key={link.href.value}
              to={link.href.value}
              className="rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
            >
              {link.label}
            </LocalizedLink>
          ))}
        </nav>

        {/* right: actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex md:items-center md:gap-3">
            <LocaleSwitcher />
            <UserNav />
          </div>

          {/* mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={content.aria.toggle}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="md:hidden"
          >
            <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
              <div className="rounded-2xl bg-background/90 p-4 shadow-lg">
                <div className="flex flex-col gap-3">
                  {content.navLinks.map((link) => (
                    <LocalizedLink
                      key={link.href.value}
                      to={link.href.value}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/40"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </LocalizedLink>
                  ))}

                  <div className="flex items-center justify-between pt-2">
                    <LocaleSwitcher />
                    <UserNav />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
