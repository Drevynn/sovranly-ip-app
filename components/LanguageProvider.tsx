'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'es' | 'ja' | 'fr';

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

// Rich dictionary containing keys for navigation, headings, buttons, and state descriptions
export const translations = {
  en: {
    // Brand & General
    brandName: "SOVRANLY IP",
    brandSubtitle: "Sovereign IP Authority",
    zeroTrustTag: "Zero Trust Blockchain Sovereign IP Authority",
    trustNoone: "Trust Nothing. Authenticate Everything.",
    home: "Home",
    wiki: "Wiki / Help",
    faq: "FAQ",
    marketplace: "Marketplace",
    chatHelp: "AI Onboarding",
    launchConsole: "Launch Console",
    returnHome: "← Return Home",
    sessionContinuous: "SECURED GATEWAY • SESSION VALIDATION CONTINUOUS",
    copyright: "© 2026 Creative Sovereignty LLC. Sovereign Management and Zero Trust Blockchain Protection. All work protected on-chain.",

    // Sidebar & Navigation
    commandCenter: "Command Center",
    userProfile: "User Profile",
    ipAssetRegistry: "IP Asset Registry",
    analytics: "Analytics",
    licensingCompacts: "Licensing Compacts",
    royaltySandbox: "Royalty Sandbox",
    creatorInbox: "Creator Inbox",
    launchPlanner: "Launch Planner",
    techStackLedger: "Tech Stack Ledger",
    aboutInvestors: "About & Investors",
    aiLicensing: "AI Training Vault",
    terminateSession: "Terminate Session",
    walletIdentity: "Wallet Identity",
    disconnected: "Disconnected",
    establishingIdentity: "Establishing Identity Link...",

    // Hero Section
    heroMainTitle1: "Secure Intellectual",
    heroMainTitle2: "Property",
    heroMainTitleSub: "Powering the Creator Economy",
    heroDescription: "Sovranly IP brings robust, Zero Trust Architecture to intellectual property. Register, license, and seamlessly commercialize your assets with automated smart contracts and immutable proof of ownership.",
    deployIpBtn: "Deploy IP Asset",
    exploreMarketplaceBtn: "Explore Marketplace",

    // Features Section
    featureSubtitle: "We secure the creator economy through robust technological structures.",
    feat1Title: "Zero Trust Governance",
    feat1Desc: "Continuously validated, cryptographically secure permissions system protecting access and viewing rights for sensitive media and data.",
    feat2Title: "Automated Royalty Splits",
    feat2Desc: "Self-executing smart contract layers dispatch direct peer-to-peer micro-licensing fees and royalty fractions instantly on-chain.",
    feat3Title: "Immutable Digital Fingerprint",
    feat3Desc: "Permanent timestamp registry storing high-fidelity cryptographic hashes of media files, offering ironclad courtroom proof of authorship.",

    // Secondary Hubs
    aiHubTitle: "Smart AI Onboarding",
    aiHubDesc: "Have questions about registering your copyright, smart-licensing, or setting up your wallet? Our continuous AI companion is ready to guide you.",
    aiHubBtn: "Launch AI Chat Help",
    wikiHubTitle: "Wiki & FAQ Center",
    wikiHubDesc: "Dive deep into documentation, regulatory compliance checklists, and technical blueprints describing how Sovranly IP works.",
    wikiHubBtn: "Browse Sovranly Wiki",

    // Support Form
    contactSupportTitle: "Contact Developer Support",
    contactSupportDesc: "Ready to customize or have questions? Get in touch with our team directly.",
    formName: "Name",
    formNamePlaceholder: "e.g., Jane Doe",
    formEmail: "Email Address",
    formEmailPlaceholder: "create@sovranlyip.com",
    formDetails: "Inquiry Details",
    formDetailsPlaceholder: "Describe what you want to achieve or any questions you have about the architecture...",
    submitBtn: "Send Support Message",
    dispatchedTitle: "Message Dispatched Securely",
    dispatchedDesc: "We have received your request and will follow up with you shortly.",
    loadingProgress: "Establishing Crypto Console..."
  },
  es: {
    // Brand & General
    brandName: "SOVRANLY IP",
    brandSubtitle: "Autoridad del PI Soberana",
    zeroTrustTag: "Autoridad de Propiedad Intelectual Soberana en Blockchain Zero Trust",
    trustNoone: "Confía en nada. Autentica todo.",
    home: "Inicio",
    wiki: "Wiki / Ayuda",
    faq: "Preguntas Frecuentes",
    marketplace: "Mercado",
    chatHelp: "Inducción IA",
    launchConsole: "Lanzar Consola",
    returnHome: "← Volver al Inicio",
    sessionContinuous: "PASARELA SEGURA • VALIDACIÓN DE SESIÓN CONTINUA",
    copyright: "© 2026 Creative Sovereignty LLC. Gestión Soberana y Protección de Blockchain Zero Trust. Todo el trabajo protegido en cadena.",

    // Sidebar & Navigation
    commandCenter: "Centro de Comando",
    userProfile: "Perfil de Usuario",
    ipAssetRegistry: "Registro de Activos de PI",
    analytics: "Analítica",
    licensingCompacts: "Pactos de Licencias",
    royaltySandbox: "Laboratorio de Regalías",
    creatorInbox: "Buzón del Creador",
    launchPlanner: "Planificador de Lanzamiento",
    techStackLedger: "Libro Mayor de Tecnologías",
    aboutInvestors: "Sobre Nosotros e Inversores",
    aiLicensing: "Cofre de Datos de IA",
    terminateSession: "Terminar Sesión",
    walletIdentity: "Identidad de Billetera",
    disconnected: "Desconectado",
    establishingIdentity: "Estableciendo Enlace de Identidad...",

    // Hero Section
    heroMainTitle1: "Asegure su Propiedad",
    heroMainTitle2: "Intelectual",
    heroMainTitleSub: "Impulsando la Economía de Creadores",
    heroDescription: "Sovranly IP aporta una sólida arquitectura Zero Trust a la propiedad intelectual. Registre, licencie y comercialice sin problemas sus activos mediante contratos inteligentes automatizados y pruebas de propiedad inmutables.",
    deployIpBtn: "Desplegar Activo de PI",
    exploreMarketplaceBtn: "Explorar Mercado",

    // Features Section
    featureSubtitle: "Aseguramos la economía de los creadores mediante una arquitectura tecnológica sólida.",
    feat1Title: "Gobernanza Zero Trust",
    feat1Desc: "Sistema de permisos criptográficamente seguro y validado continuamente que protege el acceso y los derechos de visualización de archivos de gran valor.",
    feat2Title: "Fraccionamiento de Regalías",
    feat2Desc: "Las capas de contratos inteligentes autoejecutables distribuyen tarifas de microlicencias de igual a igual y regalías de manera instantánea en la cadena.",
    feat3Title: "Firma Digital Inmutable",
    feat3Desc: "Registro de marcas de tiempo permanentes que almacena hashes criptográficos de alta fidelidad, ofreciendo evidencia sólida de autoría.",

    // Secondary Hubs
    aiHubTitle: "Inducción Inteligente con IA",
    aiHubDesc: "¿Tiene preguntas sobre cómo registrar su derechos de autor o configurar su billetera? Nuestro asistente de IA está listo para guiarle.",
    aiHubBtn: "Iniciar Chat de Ayuda de IA",
    wikiHubTitle: "Centro de Wiki y FAQ",
    wikiHubDesc: "Explore la documentación detallada, las listas de verificación de cumplimiento normativo y los planos técnicos de Sovranly IP.",
    wikiHubBtn: "Explorar Wiki de Sovranly",

    // Support Form
    contactSupportTitle: "Contactar Soporte de Desarrollador",
    contactSupportDesc: "¿Listo para personalizar o tiene preguntas? Póngase en contacto directamente con nuestro equipo.",
    formName: "Nombre",
    formNamePlaceholder: "Ej. Jane Doe",
    formEmail: "Correo electrónico",
    formEmailPlaceholder: "create@sovranlyip.com",
    formDetails: "Detalles de la Consulta",
    formDetailsPlaceholder: "Describa lo que desea lograr o cualquier duda sobre la arquitectura...",
    submitBtn: "Enviar Mensaje de Soporte",
    dispatchedTitle: "Mensaje Enviado con Seguridad",
    dispatchedDesc: "Hemos recibido su solicitud y nos pondremos en contacto con usted en breve.",
    loadingProgress: "Estableciendo Consola Criptográfica..."
  },
  ja: {
    // Brand & General
    brandName: "SOVRANLY IP",
    brandSubtitle: "自主的IP機関",
    zeroTrustTag: "ゼロトラスト ブロックチェーン自主的知的財産局",
    trustNoone: "誰も信用するな。すべてを検証せよ。",
    home: "ホーム",
    wiki: "ウィキ / ヘルプ",
    faq: "よくある質問",
    marketplace: "マーケットプレイス",
    chatHelp: "AIオンボーディング",
    launchConsole: "コンソール起動",
    returnHome: "← ホームに戻る",
    sessionContinuous: "安全なゲートウェイ • セッション持続検証中",
    copyright: "© 2026 Creative Sovereignty LLC. 自主的知的財産管理 & ゼロトラスト保護. 全データブロックチェーン保護.",

    // Sidebar & Navigation
    commandCenter: "司令センター",
    userProfile: "ユーザープロファイル",
    ipAssetRegistry: "IP資産レジストリ",
    analytics: "分析ダッシュボード",
    licensingCompacts: "ライセンス契約",
    royaltySandbox: "ロイヤリティ検証",
    creatorInbox: "クリエイター受信トレイ",
    launchPlanner: "ローンチプランナー",
    techStackLedger: "技術スタック台帳",
    aboutInvestors: "会社情報・投資家情報",
    aiLicensing: "AIデータ・ライセンス",
    terminateSession: "セッション終了",
    walletIdentity: "ウォレットアドレス",
    disconnected: "未接続",
    establishingIdentity: "IDリンク確立中...",

    // Hero Section
    heroMainTitle1: "知的財産権を",
    heroMainTitle2: "安全に保護",
    heroMainTitleSub: "クリエイターエコノミーを強化する",
    heroDescription: "Sovranly IPは、知的財産に堅牢なゼロトラスト・アーキテクチャをもたらします。自動化されたスマートコントラクトと不変の所有権証明により、資産の登録、ライセンス供与、およびシームレスな商用化を実現します。",
    deployIpBtn: "IP資産を構築する",
    exploreMarketplaceBtn: "市場を探索する",

    // Features Section
    featureSubtitle: "堅牢な技術システムにより、クリエイターコミュニティの権利を徹底保護します。",
    feat1Title: "ゼロトラスト統治",
    feat1Desc: "機密性の高いメディアやデータの閲覧権限を保護する、暗号化され継続的に検証される安全な権限管理システム。",
    feat2Title: "特許権ロイヤリティ自動分配",
    feat2Desc: "自主実行型スマートコントラクトにより、ピアツーピアのライセンス料やマイクロ・ロイヤリティがブロックチェーン上で即座に決済されます。",
    feat3Title: "改ざん不可能なデジタル指紋",
    feat3Desc: "メディアファイルの高度な暗号化ハッシュを永久タイムスタンプとして記録し、法廷でも通用する確固たる著作権証明を提供します。",

    // Secondary Hubs
    aiHubTitle: "スマートAIオンボーディング",
    aiHubDesc: "著作権の登録、スマートライセンスの設定、またはウォレットについてご質問がありますか？AIコンパニオンがいつでもお応えします。",
    aiHubBtn: "AIチャットヘルプを起動",
    wikiHubTitle: "ウィキ ＆ FAQ センター",
    wikiHubDesc: "詳細な仕様書、コンプライアンスのチェックリスト、およびSovranly IPの動作を説明する技術設計書をご覧ください。",
    wikiHubBtn: "ウィキを閲覧する",

    // Support Form
    contactSupportTitle: "デベロッパーサポートへのお問い合わせ",
    contactSupportDesc: "カスタマイズのご要望、またはご質問がありますか？直接チームまでご連絡ください。",
    formName: "お名前",
    formNamePlaceholder: "例：山田 太郎",
    formEmail: "メールアドレス",
    formEmailPlaceholder: "create@sovranlyip.com",
    formDetails: "お問い合せ内容",
    formDetailsPlaceholder: "構成についてご質問や開発したい要望を詳しくお答えください...",
    submitBtn: "サポートメッセージを送信",
    dispatchedTitle: "メッセージは安全に送信されました",
    dispatchedDesc: "お問い合わせを正常に受け付けました。折り返し担当者よりご連絡いたします。",
    loadingProgress: "クリプトコンソールを構築中..."
  },
  fr: {
    // Brand & General
    brandName: "SOVRANLY IP",
    brandSubtitle: "Autorité Souveraine de la PI",
    zeroTrustTag: "Autorité Souveraine de Propriété Intellectuelle Blockchain Zero Trust",
    trustNoone: "Ne faites confiance à personne. Authentifiez tout.",
    home: "Accueil",
    wiki: "Wiki / Aide",
    faq: "FAQ",
    marketplace: "Marché",
    chatHelp: "Intégration IA",
    launchConsole: "Lancer la Console",
    returnHome: "← Retourner à l'Accueil",
    sessionContinuous: "PASSERELLE SÉCURISÉE • VALIDATION DE SESSION CONTINUE",
    copyright: "© 2026 Creative Sovereignty LLC. Gestion Souveraine & Protection Blockchain Zero Trust. Tous les travaux sont protégés sur la chaîne.",

    // Sidebar & Navigation
    commandCenter: "Centre de Commande",
    userProfile: "Profil Utilisateur",
    ipAssetRegistry: "Registre des Actifs de PI",
    analytics: "Analyses",
    licensingCompacts: "Pactes de Licence",
    royaltySandbox: "Bac à sable de Redevances",
    creatorInbox: "Boîte du Créateur",
    launchPlanner: "Planificateur de Lancement",
    techStackLedger: "Registre Technologique",
    aboutInvestors: "À Propos & Investisseurs",
    aiLicensing: "Coffre de Données IA",
    terminateSession: "Terminer la Session",
    walletIdentity: "Identité du Portefeuille",
    disconnected: "Déconnecté",
    establishingIdentity: "Établissement du lien d'identité...",

    // Hero Section
    heroMainTitle1: "Sécurisez la Propriété",
    heroMainTitle2: "Intellectuelle",
    heroMainTitleSub: "Propulser l'Économie des Créateurs",
    heroDescription: "Sovranly IP apporte une architecture Zero Trust robuste à la propriété intellectuelle. Enregistrez, concédez sous licence et commercialisez vos actifs grâce à des contrats intelligents automatisés et à des preuves de propriété immuables.",
    deployIpBtn: "Déployer l'Actif de PI",
    exploreMarketplaceBtn: "Explorer le Marché",

    // Features Section
    featureSubtitle: "Nous sécurisons l'économie des créateurs grâce à des infrastructures technologiques robustes.",
    feat1Title: "Gouvernance Zero Trust",
    feat1Desc: "Système d'autorisations cryptographiques hautement sécurisé et validé en continu, protégeant l'accès à vos données sensibles.",
    feat2Title: "Redevances Automatisées",
    feat2Desc: "Des contrats intelligents auto-exécutables distribuent instantanément les frais de micro-licence de pair à pair et les fractions de redevances sur la chaîne.",
    feat3Title: "Empreinte Digitale Immuable",
    feat3Desc: "Registre d'horodatage permanent stockant les hachages cryptographiques haute fidélité des fichiers multimédias, offrant une preuve solide d'auteur.",

    // Secondary Hubs
    aiHubTitle: "Intégration Assistée par l'IA",
    aiHubDesc: "Des questions sur l'enregistrement des droits d'auteur, les licences ou la configuration de votre portefeuille ? Notre IA vous accompagne.",
    aiHubBtn: "Démarrer l'Aide IA Chat",
    wikiHubTitle: "Centre Wiki & FAQ",
    wikiHubDesc: "Plongez dans la documentation détaillée, les guides de conformité et les blueprints techniques décrivant le fonctionnement de Sovranly IP.",
    wikiHubBtn: "Parcourir le Wiki",

    // Support Form
    contactSupportTitle: "Contacter le Support Développeur",
    contactSupportDesc: "Prêt à personnaliser ou vous avez des questions ? Contactez directement notre équipe.",
    formName: "Nom complet",
    formNamePlaceholder: "Ex. Jane Doe",
    formEmail: "Adresse E-mail",
    formEmailPlaceholder: "create@sovranlyip.com",
    formDetails: "Détails de votre demande",
    formDetailsPlaceholder: "Décrivez ce que vous souhaitez accomplir ou vos questions sur l'architecture...",
    submitBtn: "Envoyer le Message",
    dispatchedTitle: "Message Transmis en Toute Sécurité",
    dispatchedDesc: "Nous avons bien reçu votre demande et reviendrons vers vous très prochainement.",
    loadingProgress: "Établissement de la console crypto..."
  }
};

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sovranly-lang') as LanguageCode;
      if (stored && (stored === 'en' || stored === 'es' || stored === 'ja' || stored === 'fr')) {
        return stored;
      }
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sovranly-lang', lang);
    }
  };

  const t = (key: TranslationKey): string => {
    const translationSet = translations[language] || translations.en;
    return translationSet[key] || translations.en[key] || String(key);
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
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
