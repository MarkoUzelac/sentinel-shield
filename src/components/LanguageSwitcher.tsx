import { useEffect, useState } from "react";
import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// 24 službena EU jezika + engleski fallback
const languages = [
  { code: "hr", name: "Hrvatski", flag: "🇭🇷", native: true },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "cs", name: "Čeština", flag: "🇨🇿" },
  { code: "sk", name: "Slovenčina", flag: "🇸🇰" },
  { code: "sl", name: "Slovenščina", flag: "🇸🇮" },
  { code: "hu", name: "Magyar", flag: "🇭🇺" },
  { code: "ro", name: "Română", flag: "🇷🇴" },
  { code: "bg", name: "Български", flag: "🇧🇬" },
  { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
  { code: "da", name: "Dansk", flag: "🇩🇰" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "fi", name: "Suomi", flag: "🇫🇮" },
  { code: "et", name: "Eesti", flag: "🇪🇪" },
  { code: "lv", name: "Latviešu", flag: "🇱🇻" },
  { code: "lt", name: "Lietuvių", flag: "🇱🇹" },
  { code: "mt", name: "Malti", flag: "🇲🇹" },
  { code: "ga", name: "Gaeilge", flag: "🇮🇪" },
];

const STORAGE_KEY = "sechub-lang";

export const LanguageSwitcher = () => {
  const [current, setCurrent] = useState("hr");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCurrent(stored);
      if (stored !== "hr") applyTranslation(stored);
    }
  }, []);

  const applyTranslation = (lang: string) => {
    // Real client-side translation via Google Translate widget
    document.documentElement.lang = lang;
    if (lang === "hr") {
      // Reset — reload to clear any translation
      const url = new URL(window.location.href);
      url.searchParams.delete("lang");
      window.location.replace(url.toString());
      return;
    }
    // Use Google Translate gateway
    const target = `https://translate.google.com/translate?sl=hr&tl=${lang}&u=${encodeURIComponent(window.location.origin + window.location.pathname)}`;
    window.open(target, "_self");
  };

  const handleSelect = (code: string) => {
    setCurrent(code);
    localStorage.setItem(STORAGE_KEY, code);
    applyTranslation(code);
  };

  const currentLang = languages.find((l) => l.code === current) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 px-2" aria-label="Promjena jezika">
          <Languages className="w-4 h-4" />
          <span className="text-base leading-none">{currentLang.flag}</span>
          <span className="hidden sm:inline text-xs font-mono uppercase">{currentLang.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-[70vh] overflow-y-auto bg-popover z-50">
        <DropdownMenuLabel className="text-xs">Odaberi jezik (24 EU)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className="cursor-pointer flex items-center gap-2"
          >
            <span className="text-base">{lang.flag}</span>
            <span className="flex-1 text-sm">{lang.name}</span>
            {current === lang.code && <Check className="w-3 h-3 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
