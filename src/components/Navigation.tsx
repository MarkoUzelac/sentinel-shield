import { useState } from "react";
import { Shield, Menu, X, ChevronDown, Wrench, BookOpen, CreditCard, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navItems = [
  {
    label: "Alati",
    icon: Wrench,
    items: [
      { label: "Kategorije alata", href: "#tools" },
      { label: "Usporedba", href: "#comparison" },
      { label: "Speed Test", href: "#speedtest" },
    ],
  },
  {
    label: "Usluge",
    icon: CreditCard,
    items: [
      { label: "Profesionalna detekcija", href: "#services" },
      { label: "Planovi pretplate", href: "#pricing" },
      { label: "Procjena rizika", href: "#assessment" },
    ],
  },
  {
    label: "Resursi",
    icon: BookOpen,
    items: [
      { label: "Zakoni po jurisdikcijama", href: "#laws" },
      { label: "Izvori praćenja", href: "#surveillance" },
      { label: "FAQ", href: "#faq" },
      { label: "O nama", href: "#about" },
    ],
  },
];

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 md:gap-3 group">
            <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:shadow-glow-primary transition-all duration-300">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <div>
              <span className="font-mono font-bold text-sm md:text-base text-foreground">SecHub</span>
              <span className="text-[10px] md:text-xs text-primary ml-1 md:ml-2 font-mono">Pro</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48 bg-popover border-border z-50">
                  {item.items.map((subItem, idx) => (
                    <DropdownMenuItem key={idx} asChild>
                      <a
                        href={subItem.href}
                        className="w-full cursor-pointer"
                      >
                        {subItem.label}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}

            <a href="#contact" className="ml-2">
              <Button variant="cyber" size="sm" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Kontakt
              </Button>
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 md:gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Glavni izbornik"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-in">
            <div className="space-y-4">
              {navItems.map((item) => (
                <div key={item.label} className="space-y-2">
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <item.icon className="w-3 h-3" />
                    {item.label}
                  </p>
                  <div className="pl-5 space-y-1">
                    {item.items.map((subItem, idx) => (
                      <a
                        key={idx}
                        href={subItem.href}
                        className="block py-2 text-sm text-foreground hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              <a href="#contact" className="block pt-2">
                <Button variant="cyber" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Kontaktirajte nas
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
