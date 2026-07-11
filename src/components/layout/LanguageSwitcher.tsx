"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'my' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button 
      onClick={toggleLanguage}
      style={{ 
        background: 'transparent', 
        border: 'none', 
        color: 'inherit', 
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 500
      }}
    >
      {locale === 'en' ? 'မြန်မာစာ' : 'English'}
    </button>
  );
}
