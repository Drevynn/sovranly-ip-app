'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

const translations: Record<Language, Record<string, string>> = {
  en: {
    zeroTrustTag: 'Zero Trust Architecture • Immutable On-Chain IP',
    heroMainTitleSub: 'Creative Sovereignty & IP Management',
    heroDescription: 'Empowering creators, musicians, and developers to secure intellectual property assets, configure automated commercial licensing compacts, and export verified ownership certificates directly to Google Workspace.',
    deployIpBtn: 'Deploy IP Engine',
    exploreMarketplaceBtn: 'Explore IP Marketplace',
  },
  es: {
    zeroTrustTag: 'Arquitectura Zero Trust • PI Inmutable en Cadena',
    heroMainTitleSub: 'Soberanía Creativa y Gestión de PI',
    heroDescription: 'Empoderando a creadores, músicos y desarrolladores para proteger activos de propiedad intelectual, configurar contratos de licencias comerciales automatizados y exportar certificados verificados directamente a Google Workspace.',
    deployIpBtn: 'Desplegar Motor de PI',
    exploreMarketplaceBtn: 'Explorar Mercado de PI',
  },
  fr: {
    zeroTrustTag: 'Architecture Zero Trust • PI Immuable sur Chaîne',
    heroMainTitleSub: 'Souveraineté Créative et Gestion de PI',
    heroDescription: 'Permettre aux créateurs, musiciens et développeurs de sécuriser leurs actifs de propriété intellectuelle, de configurer des contrats de licence commerciale automatisés et d\'exporter des certificats vérifiés directement vers Google Workspace.',
    deployIpBtn: 'Déployer le Moteur PI',
    exploreMarketplaceBtn: 'Explorer le Marché PI',
  },
  de: {
    zeroTrustTag: 'Zero Trust Architektur • Unveränderliche On-Chain IP',
    heroMainTitleSub: 'Kreative Souveränität & IP-Verwaltung',
    heroDescription: 'Ermöglicht Schöpfern, Musikern und Entwicklern, geistige Eigentumsrechte zu sichern, automatisierte kommerzielle Lizenzverträge zu konfigurieren und verifizierte Eigentumszertifikate direkt nach Google Workspace zu exportieren.',
    deployIpBtn: 'IP-Engine starten',
    exploreMarketplaceBtn: 'IP-Marktplatz erkunden',
  },
  ja: {
    zeroTrustTag: 'ゼロトラスト・アーキテクチャ • 不変のオンチェーンIP',
    heroMainTitleSub: 'クリエイティブ・ソブリンティ＆IP管理',
    heroDescription: 'クリエイター、ミュージシャン、開発者が知的財産を保護し、自動化された商用ライセンス契約を設定し、検証済み所有権証明書をGoogle Workspaceへ直接エクスポートできるように支援します。',
    deployIpBtn: 'IPエンジンを起動',
    exploreMarketplaceBtn: 'IPマーケットプレイスを探索',
  },
  zh: {
    zeroTrustTag: '零信任架构 • 链上不可篡改IP',
    heroMainTitleSub: '创意主权与知识产权管理',
    heroDescription: '助力创作者、音乐人与开发者保护知识产权资产，配置自动化商业许可协议，并将验证过的所有权证书直接导出至 Google Workspace。',
    deployIpBtn: '部署 IP 引擎',
    exploreMarketplaceBtn: '探索 IP 市场',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => translations.en[key] || key,
    };
  }
  return context;
}
