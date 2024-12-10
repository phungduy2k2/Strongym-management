"use client";

import Link from "next/link";
import { useRouter } from "next/compat/router";
import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const locales = [
    { code: "en", label: t("language.english") },
    { code: "vi", label: t("language.vietnamese") },
  ];

  return(
    <div className="flex items-center space-x-2">
      {locales.map((locale) => (
        <Link href={router.asPath} locale={locale.code} key={locale.code}>
          <a
            className={`px-2 py-1 rounded ${
              router.locale === locale.code
                ? "bg-white text-primary"
                : "text-white hover:bg-white/10"
            }`}
          >
            {locale.label}
          </a>
        </Link>
      ))}
    </div>
  );
}
