/**
 * Internationalization (i18n) Module
 * Supports: English, Spanish, French, Portuguese
 * Version: 2.1.0
 */
console.log('[i18n] Loading version 2.1.0');

const translations = {
  en: {
    // Header
    'header.tagline': 'Tradition Meets Innovation',

    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.expertise': 'Expertise',
    'nav.insights': 'Insights',
    'nav.contact': 'Contact',
    'nav.cta': 'Schedule Consultation',
    'nav.portal': 'Client Portal',

    // Hero
    'hero.title1': 'Where Goals',
    'hero.title2': 'Become Reality.',
    'hero.subtitle': 'Independent financial advisory and investment banking boutique. We translate your ambition into executable financial structures.',
    'hero.cta1': 'Schedule a Consultation',
    'hero.cta2': 'Explore Our Services',
    'hero.stat1': 'Structured Products',
    'hero.stat2': 'Global Issuers',
    'hero.stat3': 'Institutional Experience',

    // Trust Bar
    'trust.label': 'Global Presence Across Financial Centers',

    // About - The Firm
    'about.label': 'The Firm',
    'about.title1': 'The Beekman',
    'about.title2': 'Difference',
    'about.desc': 'Beekman Strategic is a boutique financial advisory firm with a dual identity. We merge the high-touch, relationship-first approach of traditional private banking with the speed and precision of modern investment banking. Our greatest differentiator is our ability to truly understand our clients\' long-term vision—and then translate those insights into practical tools, structures, and investment vehicles.',
    'about.feature1': 'Principal-Led: Clients work directly with principals, not junior associates',
    'about.feature2': 'Network-Backed: Access to 35+ top-tier global issuers and legal partners',
    'about.feature3': 'Technology-Driven: Beekman AI enhances structure design with advanced automation',
    'about.feature4': 'Global Footprint: Experience across 8 international financial centers',
    'about.visual': 'Global Financial Centers',

    // Team / Leadership
    'team.label': 'Leadership',
    'team.title1': 'The Team',
    'team.title2': 'Behind the Strategy',
    'team.desc': 'A lean team of senior operators backed by a massive global network. Like special forces in finance—small team, massive impact through strategic partnerships.',
    'team.member1.name': 'Oscar Libreros',
    'team.member1.role': 'Founder & Principal',
    'team.member1.bio': '23 years of institutional experience spanning Société Générale and elite private banking. Specializes in cross-border structuring, capital markets, and translating complex client visions into executable financial architectures.',
    'team.member2.name': 'Juan Carlos Palau Olano',
    'team.member2.role': 'Legal Structuring',
    'team.member2.bio': 'U.S.-trained securities attorney with 20+ years on the NY Bar. LL.M. in Securities & Financial Regulation from Northwestern, dual qualification in NY and Colombia. Expertise in M&A, investment vehicle structuring, and cross-border transactions.',
    'team.member3.name': 'Glen Andrews',
    'team.member3.role': 'Financial Modeling',
    'team.member3.bio': '20+ year finance career spanning investment banking at Merrill Lynch and Lazard, and private equity as Executive Director at AGC Equity Partners (London). Created a $500M specialized shipping fund and served on the ENEL Russia board.',
    'team.ecosystem.title': 'The Ecosystem',
    'team.ecosystem.role': 'Global Partner Network',
    'team.ecosystem.desc': 'While our core team is lean, our network is massive. We operate like special forces—a small, elite team that leverages strategic partnerships with 35+ global issuers, legal experts, and administrators to deliver institutional-scale impact.',

    // Who We Serve
    'clients.label': 'Who We Serve',
    'clients.title1': 'Sophisticated clients',
    'clients.title2': 'demand sophisticated solutions',
    'clients.c1.title': 'Ultra-High-Net-Worth Individuals',
    'clients.c1.desc': 'Clients with $30M+ seeking complex cross-border structuring, privacy, and access to institutional-grade products typically reserved for banks.',
    'clients.c2.title': 'Entrepreneurs & Business Owners',
    'clients.c2.desc': 'Visionaries seeking pre-liquidity planning, securitization of business assets, and strategic capital raising.',
    'clients.c3.title': 'Multigenerational Families',
    'clients.c3.desc': 'Families requiring governance frameworks to preserve legacy and educate the next generation across borders.',
    'clients.c4.title': 'International Clients',
    'clients.c4.desc': 'Families in Latin America and Europe seeking access to US markets, currency hedging, and political risk mitigation.',

    // Services
    'services.label': 'Our Services',
    'services.title1': 'We don\'t just advise—',
    'services.title2': 'we engineer solutions',
    'services.desc': 'Beekman Strategic acts as the bridge between private clients and institutional markets. We design, structure, and execute sophisticated cross-border strategies.',
    'services.s1.title': 'Asset & Wealth Management',
    'services.s1.tagline': 'Clarity, Protection, and Legacy.',
    'services.s1.desc': 'Strategic wealth planning, global portfolio oversight, legacy structuring, risk management, and family-office advisory. Clarity, protection, and legacy across jurisdictions.',
    'services.s2.title': 'Investment Banking',
    'services.s2.tagline': 'Boutique banking for the private world.',
    'services.s2.desc': 'Bespoke financial instruments, liquidity solutions, capital markets advisory, and asset transformation. Turning illiquid assets into bankable securities.',
    'services.s3.title': 'Fund & Vehicle Structuring',
    'services.s3.tagline': 'Engineering institutional-grade products.',
    'services.s3.desc': 'Vehicle architecture for SPVs, LPs, ETP (Exchange Traded Products), and bespoke frameworks. Capital raise support, launch coordination, and ongoing advisory for institutional-grade products.',
    'services.s4.title': 'Powered by Beekman AI',
    'services.s4.desc': 'Proprietary AI solutions with human oversight that modernize the structuring process - ensuring speed, accuracy, and a seamless digital experience. Taking go to market from months to days.',

    // Process / Expertise
    'process.label': 'Our Approach',
    'process.title1': 'The Translation',
    'process.title2': 'Process',
    'process.desc': 'We turn intent into impact. A systematic methodology that transforms your vision into executable structures with precision and efficiency.',
    'process.step1.title': 'Objective Definition',
    'process.step1.desc': 'We articulate your ambitions and identify regulatory, tax, or operational constraints that inform the optimal path forward.',
    'process.step2.title': 'Jurisdiction Analysis',
    'process.step2.desc': 'We select the optimal domicile—Delaware, Luxembourg, UK, Switzerland—based on your specific goals and circumstances.',
    'process.step3.title': 'Entity Structuring',
    'process.step3.desc': 'We layer legal entities and governance frameworks to ensure protection, efficiency, and alignment with your objectives.',
    'process.step4.title': 'Implementation',
    'process.step4.desc': 'We handle formation, banking setup, and regulatory approvals for a seamless launch with ongoing governance support.',

    // Stats
    'stats.stat1': 'Structured Products',
    'stats.stat2': 'Qualified from Investors',
    'stats.stat3': 'Top-Tier Global Issuers',
    'stats.stat4': 'Institutional Experience',

    // Why Us / Philosophy
    'why.label': 'Our Philosophy',
    'why.title1': 'Human Oversight',
    'why.title2': 'on an AI powered solution',
    'why.card1.title': 'Principal-Led Execution',
    'why.card1.desc': 'Clients work directly with senior operators, not junior associates. Direct accountability and institutional expertise from the first conversation to final implementation.',
    'why.card2.title': 'AI-Enhanced Efficiency',
    'why.card2.desc': 'Our proprietary AI legal engines and financial agents compress timelines from months to days—enabling rapid structuring without compromising institutional rigor.',
    'why.card3.title': 'Global Partner Ecosystem',
    'why.card3.desc': 'We wield the power of a global institution through our curated network of issuers, administrators, custodians, and legal partners across eight financial centers.',

    // Case Studies
    'cases.label': 'Track Record',
    'cases.title1': 'Proof of',
    'cases.title2': 'Impact',
    'cases.desc': 'Select examples of how we\'ve translated ambitious visions into structured, investable realities across borders.',
    'cases.case1.tag': 'Sustainability',
    'cases.case1.title': 'Amazon Carbon Credit Securitization',
    'cases.case1.desc': 'Structured carbon credit emissions from the Colombian Amazon into a Swiss-listed bond, creating a liquid, institutional-grade security from an environmental asset. A landmark transaction bridging sustainability and capital markets.',
    'cases.case1.location': 'Colombia → Switzerland',
    'cases.case2.tag': 'Social Impact',
    'cases.case2.title': 'Free Trade Zone Healthcare Cluster',
    'cases.case2.desc': 'Structured and launched a $100M+ healthcare cluster within a Colombian Free Trade Zone, serving over 1.3 million people. Demonstrated how sophisticated structuring can drive both returns and meaningful social impact.',
    'cases.case2.location': 'Colombia',

    // Insights
    'insights.label': 'Perspectives',
    'insights.title1': 'Strategic insights',
    'insights.title2': 'for global markets',
    'insights.desc': 'Navigating the complexities of global finance requires more than data—it requires perspective. Explore the latest thinking from the Beekman Strategic team.',
    'insights.article1.title': 'The Evolution of the Family Office',
    'insights.article1.desc': 'How modern families are integrating AI with traditional governance to manage multi-jurisdictional assets and preserve legacy.',
    'insights.article2.title': 'Swiss Securities vs. NYSE Listings',
    'insights.article2.desc': 'A comparative analysis of structuring options for international clients seeking capital market access.',
    'insights.article3.title': 'Efficient Pre-IPO Structuring',
    'insights.article3.desc': 'Best practices for entrepreneurs preparing for public markets while optimizing tax efficiency and governance.',

    // Newsletter
    'newsletter.title': 'Stay Informed',
    'newsletter.desc': 'Receive our latest market insights and structuring strategies directly to your inbox.',
    'newsletter.placeholder': 'Enter your email',
    'newsletter.btn': 'Subscribe',

    // Media & Press
    'media.title': 'Beekman in the Media',
    'media.desc': 'Featured coverage and industry recognition. More press mentions coming soon.',
    'media.coming': 'Press coverage coming soon',

    // CTA
    'cta.title1': 'Let\'s translate your ambition',
    'cta.title2': 'into reality',
    'cta.desc': 'Schedule a confidential consultation with our principals to discuss your objectives and explore how we can help.',
    'cta.btn': 'Schedule a Consultation',

    // Contact
    'contact.label': 'Contact',
    'contact.title1': 'Start the',
    'contact.title2': 'conversation',
    'contact.desc': 'Ready to discuss how Beekman Strategic can serve your objectives? Connect directly with our principals for a confidential consultation.',
    'contact.email': 'Email',
    'contact.location': 'Headquarters',
    'contact.global': 'Global Network',

    // Form
    'form.name': 'Name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.company': 'Company',
    'form.interest': 'Area of Interest',
    'form.message': 'Tell us about your objectives',
    'form.submit': 'Send Message',

    // Footer
    'footer.desc': 'Independent financial advisory and investment banking. Tradition meets innovation—where goals become reality.',
    'footer.services': 'Services',
    'footer.company': 'Company',
    'footer.locations': 'Global Presence',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.disclosures': 'Disclosures'
  },

  es: {
    // Header
    'header.tagline': 'Tradición e Innovación',

    // Navigation
    'nav.home': 'Inicio',
    'nav.about': 'Nosotros',
    'nav.services': 'Servicios',
    'nav.expertise': 'Experiencia',
    'nav.insights': 'Perspectivas',
    'nav.contact': 'Contacto',
    'nav.cta': 'Agendar Consulta',
    'nav.portal': 'Portal de Cliente',

    // Hero
    'hero.title1': 'Donde los Objetivos',
    'hero.title2': 'Se Hacen Realidad.',
    'hero.subtitle': 'Asesoría financiera independiente y banca de inversión boutique. Traducimos su ambición en estructuras financieras ejecutables.',
    'hero.cta1': 'Agendar una Consulta',
    'hero.cta2': 'Explorar Servicios',
    'hero.stat1': 'Productos Estructurados',
    'hero.stat2': 'Emisores Globales',
    'hero.stat3': 'Experiencia Institucional',

    // Trust Bar
    'trust.label': 'Presencia Global en Centros Financieros',

    // About - The Firm
    'about.label': 'La Firma',
    'about.title1': 'La Diferencia',
    'about.title2': 'Beekman',
    'about.desc': 'Beekman Strategic es una firma boutique de asesoría financiera con doble identidad. Fusionamos el enfoque de alto contacto y relaciones de la banca privada tradicional con la velocidad y precisión de la banca de inversión moderna. Nuestro mayor diferenciador es nuestra capacidad de comprender verdaderamente la visión a largo plazo de nuestros clientes—y luego traducir esas perspectivas en herramientas prácticas, estructuras y vehículos de inversión.',
    'about.feature1': 'Liderazgo de Principales: Los clientes trabajan directamente con los directores, no con asociados junior',
    'about.feature2': 'Respaldo de Red: Acceso a más de 35 emisores globales de primer nivel y socios legales',
    'about.feature3': 'Impulsado por Tecnología: Beekman AI mejora el diseño de estructuras con automatización avanzada',
    'about.feature4': 'Presencia Global: Experiencia en 8 centros financieros internacionales',
    'about.visual': 'Centros Financieros Globales',

    // Team / Leadership
    'team.label': 'Liderazgo',
    'team.title1': 'El Equipo',
    'team.title2': 'Detrás de la Estrategia',
    'team.desc': 'Un equipo reducido de operadores senior respaldado por una red global masiva. Como fuerzas especiales en finanzas—equipo pequeño, impacto masivo a través de asociaciones estratégicas.',
    'team.member1.name': 'Oscar Libreros',
    'team.member1.role': 'Fundador y Principal',
    'team.member1.bio': '23 años de experiencia institucional en Société Générale y banca privada de élite. Especialista en estructuración transfronteriza, mercados de capitales y traducción de visiones complejas de clientes en arquitecturas financieras ejecutables.',
    'team.member2.name': 'Juan Carlos Palau Olano',
    'team.member2.role': 'Estructuración Legal',
    'team.member2.bio': 'Abogado de valores capacitado en EE.UU. con más de 20 años en el Colegio de Abogados de NY. LL.M. en Regulación de Valores y Financiera de Northwestern, doble calificación en NY y Colombia. Experiencia en fusiones y adquisiciones, estructuración de vehículos de inversión y transacciones transfronterizas.',
    'team.member3.name': 'Glen Andrews',
    'team.member3.role': 'Modelado Financiero',
    'team.member3.bio': 'Carrera de más de 20 años en finanzas en banca de inversión en Merrill Lynch y Lazard, y capital privado como Director Ejecutivo en AGC Equity Partners (Londres). Creó un fondo de transporte especializado de $500M y fue miembro de la junta de ENEL Rusia.',
    'team.ecosystem.title': 'El Ecosistema',
    'team.ecosystem.role': 'Red Global de Socios',
    'team.ecosystem.desc': 'Aunque nuestro equipo central es reducido, nuestra red es masiva. Operamos como fuerzas especiales—un equipo pequeño y de élite que aprovecha asociaciones estratégicas con más de 35 emisores globales, expertos legales y administradores para entregar impacto a escala institucional.',

    // Who We Serve
    'clients.label': 'A Quién Servimos',
    'clients.title1': 'Clientes sofisticados',
    'clients.title2': 'demandan soluciones sofisticadas',
    'clients.c1.title': 'Individuos de Ultra Alto Patrimonio',
    'clients.c1.desc': 'Clientes con $30M+ buscando estructuración transfronteriza compleja, privacidad y acceso a productos de grado institucional típicamente reservados para bancos.',
    'clients.c2.title': 'Empresarios y Propietarios de Negocios',
    'clients.c2.desc': 'Visionarios buscando planificación pre-liquidez, securitización de activos empresariales y levantamiento estratégico de capital.',
    'clients.c3.title': 'Familias Multigeneracionales',
    'clients.c3.desc': 'Familias que requieren marcos de gobernanza para preservar el legado y educar a la próxima generación a través de fronteras.',
    'clients.c4.title': 'Clientes Internacionales',
    'clients.c4.desc': 'Familias en América Latina y Europa buscando acceso a mercados estadounidenses, cobertura cambiaria y mitigación de riesgo político.',

    // Services
    'services.label': 'Nuestros Servicios',
    'services.title1': 'No solo asesoramos—',
    'services.title2': 'diseñamos soluciones',
    'services.desc': 'Beekman Strategic actúa como puente entre clientes privados y mercados institucionales. Diseñamos, estructuramos y ejecutamos estrategias transfronterizas sofisticadas.',
    'services.s1.title': 'Gestión de Activos y Patrimonio',
    'services.s1.tagline': 'Claridad, Protección y Legado.',
    'services.s1.desc': 'Planificación patrimonial estratégica, supervisión global de portafolios, estructuración de legado, gestión de riesgos y asesoría de family office. Claridad, protección y legado a través de jurisdicciones.',
    'services.s2.title': 'Banca de Inversión',
    'services.s2.tagline': 'Banca boutique para el mundo privado.',
    'services.s2.desc': 'Instrumentos financieros a medida, soluciones de liquidez, asesoría en mercados de capitales y transformación de activos. Convirtiendo activos ilíquidos en valores bancables.',
    'services.s3.title': 'Estructuración de Fondos y Vehículos',
    'services.s3.tagline': 'Diseñando productos de grado institucional.',
    'services.s3.desc': 'Arquitectura de vehículos para SPVs, LPs, ETP (Exchange Traded Products) y marcos a medida. Apoyo en levantamiento de capital, coordinación de lanzamiento y asesoría continua para productos de grado institucional.',
    'services.s4.title': 'Impulsado por Beekman AI',
    'services.s4.desc': 'Soluciones propietarias de IA con supervisión humana que modernizan el proceso de estructuración - garantizando velocidad, precisión y una experiencia digital fluida. Llevando el lanzamiento al mercado de meses a días.',

    // Process / Expertise
    'process.label': 'Nuestro Enfoque',
    'process.title1': 'El Proceso de',
    'process.title2': 'Traducción',
    'process.desc': 'Convertimos la intención en impacto. Una metodología sistemática que transforma su visión en estructuras ejecutables con precisión y eficiencia.',
    'process.step1.title': 'Definición de Objetivos',
    'process.step1.desc': 'Articulamos sus ambiciones e identificamos restricciones regulatorias, fiscales u operativas que informan el camino óptimo.',
    'process.step2.title': 'Análisis de Jurisdicción',
    'process.step2.desc': 'Seleccionamos el domicilio óptimo—Delaware, Luxemburgo, Reino Unido, Suiza—basado en sus objetivos y circunstancias específicas.',
    'process.step3.title': 'Estructuración de Entidades',
    'process.step3.desc': 'Diseñamos capas de entidades legales y marcos de gobernanza para asegurar protección, eficiencia y alineación con sus objetivos.',
    'process.step4.title': 'Implementación',
    'process.step4.desc': 'Manejamos formación, configuración bancaria y aprobaciones regulatorias para un lanzamiento fluido con soporte continuo de gobernanza.',

    // Stats
    'stats.stat1': 'Productos Estructurados',
    'stats.stat2': 'Calificado de Inversionistas',
    'stats.stat3': 'Emisores Globales de Primer Nivel',
    'stats.stat4': 'Experiencia Institucional',

    // Why Us / Philosophy
    'why.label': 'Nuestra Filosofía',
    'why.title1': 'Supervisión Humana',
    'why.title2': 'sobre una solución impulsada por IA',
    'why.card1.title': 'Ejecución Liderada por Principales',
    'why.card1.desc': 'Los clientes trabajan directamente con operadores senior, no con asociados junior. Responsabilidad directa y experiencia institucional desde la primera conversación hasta la implementación final.',
    'why.card2.title': 'Eficiencia Mejorada por IA',
    'why.card2.desc': 'Nuestros motores legales de IA propietarios y agentes financieros comprimen los plazos de meses a días—permitiendo estructuración rápida sin comprometer el rigor institucional.',
    'why.card3.title': 'Ecosistema Global de Socios',
    'why.card3.desc': 'Ejercemos el poder de una institución global a través de nuestra red curada de emisores, administradores, custodios y socios legales en ocho centros financieros.',

    // Case Studies
    'cases.label': 'Historial',
    'cases.title1': 'Prueba de',
    'cases.title2': 'Impacto',
    'cases.desc': 'Ejemplos selectos de cómo hemos traducido visiones ambiciosas en realidades estructuradas e invertibles a través de fronteras.',
    'cases.case1.tag': 'Sostenibilidad',
    'cases.case1.title': 'Securitización de Créditos de Carbono del Amazonas',
    'cases.case1.desc': 'Estructuramos emisiones de créditos de carbono del Amazonas colombiano en un bono listado en Suiza, creando un valor líquido de grado institucional a partir de un activo ambiental. Una transacción emblemática que conecta sostenibilidad y mercados de capitales.',
    'cases.case1.location': 'Colombia → Suiza',
    'cases.case2.tag': 'Impacto Social',
    'cases.case2.title': 'Clúster de Salud en Zona Franca',
    'cases.case2.desc': 'Estructuramos y lanzamos un clúster de salud de $100M+ dentro de una Zona Franca colombiana, sirviendo a más de 1.3 millones de personas. Demostramos cómo la estructuración sofisticada puede generar tanto retornos como impacto social significativo.',
    'cases.case2.location': 'Colombia',

    // Insights
    'insights.label': 'Perspectivas',
    'insights.title1': 'Conocimientos estratégicos',
    'insights.title2': 'para mercados globales',
    'insights.desc': 'Navegar las complejidades de las finanzas globales requiere más que datos—requiere perspectiva. Explore el pensamiento más reciente del equipo de Beekman Strategic.',
    'insights.article1.title': 'La Evolución del Family Office',
    'insights.article1.desc': 'Cómo las familias modernas están integrando IA con gobernanza tradicional para gestionar activos multijurisdiccionales y preservar el legado.',
    'insights.article2.title': 'Valores Suizos vs. Cotizaciones NYSE',
    'insights.article2.desc': 'Un análisis comparativo de opciones de estructuración para clientes internacionales que buscan acceso a mercados de capitales.',
    'insights.article3.title': 'Estructuración Pre-IPO Eficiente',
    'insights.article3.desc': 'Mejores prácticas para empresarios preparándose para mercados públicos mientras optimizan eficiencia fiscal y gobernanza.',

    // Newsletter
    'newsletter.title': 'Manténgase Informado',
    'newsletter.desc': 'Reciba nuestros últimos análisis de mercado y estrategias de estructuración directamente en su correo.',
    'newsletter.placeholder': 'Ingrese su correo',
    'newsletter.btn': 'Suscribirse',

    // Media & Press
    'media.title': 'Beekman en los Medios',
    'media.desc': 'Cobertura destacada y reconocimiento de la industria. Más menciones de prensa próximamente.',
    'media.coming': 'Cobertura de prensa próximamente',

    // CTA
    'cta.title1': 'Traduzcamos su ambición',
    'cta.title2': 'en realidad',
    'cta.desc': 'Agende una consulta confidencial con nuestros directores para discutir sus objetivos y explorar cómo podemos ayudar.',
    'cta.btn': 'Agendar una Consulta',

    // Contact
    'contact.label': 'Contacto',
    'contact.title1': 'Inicie la',
    'contact.title2': 'conversación',
    'contact.desc': '¿Listo para discutir cómo Beekman Strategic puede servir sus objetivos? Conéctese directamente con nuestros directores para una consulta confidencial.',
    'contact.email': 'Correo',
    'contact.location': 'Sede Central',
    'contact.global': 'Red Global',

    // Form
    'form.name': 'Nombre',
    'form.email': 'Correo electrónico',
    'form.phone': 'Teléfono',
    'form.company': 'Empresa',
    'form.interest': 'Área de Interés',
    'form.message': 'Cuéntenos sobre sus objetivos',
    'form.submit': 'Enviar Mensaje',

    // Footer
    'footer.desc': 'Asesoría financiera independiente y banca de inversión. Tradición e innovación—donde los objetivos se hacen realidad.',
    'footer.services': 'Servicios',
    'footer.company': 'Empresa',
    'footer.locations': 'Presencia Global',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
    'footer.disclosures': 'Divulgaciones'
  },

  fr: {
    // Header
    'header.tagline': 'Tradition et Innovation',

    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'La Firme',
    'nav.services': 'Services',
    'nav.expertise': 'Expertise',
    'nav.insights': 'Perspectives',
    'nav.contact': 'Contact',
    'nav.cta': 'Planifier une Consultation',
    'nav.portal': 'Portail Client',

    // Hero
    'hero.title1': 'Où les Objectifs',
    'hero.title2': 'Deviennent Réalité.',
    'hero.subtitle': 'Conseil financier indépendant et banque d\'investissement boutique. Nous traduisons votre ambition en structures financières exécutables.',
    'hero.cta1': 'Planifier une Consultation',
    'hero.cta2': 'Explorer Nos Services',
    'hero.stat1': 'Produits Structurés',
    'hero.stat2': 'Émetteurs Mondiaux',
    'hero.stat3': 'Expérience Institutionnelle',

    // Trust Bar
    'trust.label': 'Présence Mondiale dans les Centres Financiers',

    // About - The Firm
    'about.label': 'La Firme',
    'about.title1': 'La Différence',
    'about.title2': 'Beekman',
    'about.desc': 'Beekman Strategic est une société de conseil financier boutique avec une double identité. Nous fusionnons l\'approche relationnelle de la banque privée traditionnelle avec la vitesse et la précision de la banque d\'investissement moderne. Notre plus grand différenciateur est notre capacité à comprendre véritablement la vision à long terme de nos clients—puis à traduire ces perspectives en outils pratiques, structures et véhicules d\'investissement.',
    'about.feature1': 'Direction Principale: Les clients travaillent directement avec les directeurs, pas des associés juniors',
    'about.feature2': 'Réseau Solide: Accès à plus de 35 émetteurs mondiaux de premier plan et partenaires juridiques',
    'about.feature3': 'Technologie Avancée: Beekman AI améliore la conception de structures avec une automatisation avancée',
    'about.feature4': 'Empreinte Mondiale: Expérience dans 8 centres financiers internationaux',
    'about.visual': 'Centres Financiers Mondiaux',

    // Team / Leadership
    'team.label': 'Direction',
    'team.title1': 'L\'Équipe',
    'team.title2': 'Derrière la Stratégie',
    'team.desc': 'Une équipe restreinte d\'opérateurs seniors soutenue par un réseau mondial massif. Comme des forces spéciales en finance—petite équipe, impact massif grâce à des partenariats stratégiques.',
    'team.member1.name': 'Oscar Libreros',
    'team.member1.role': 'Fondateur et Principal',
    'team.member1.bio': '23 ans d\'expérience institutionnelle chez Société Générale et banque privée d\'élite. Spécialiste de la structuration transfrontalière, des marchés de capitaux et de la traduction de visions clients complexes en architectures financières exécutables.',
    'team.member2.name': 'Juan Carlos Palau Olano',
    'team.member2.role': 'Structuration Juridique',
    'team.member2.bio': 'Avocat en valeurs mobilières formé aux États-Unis avec plus de 20 ans au Barreau de NY. LL.M. en réglementation des valeurs mobilières et financières de Northwestern, double qualification à NY et en Colombie. Expertise en fusions et acquisitions, structuration de véhicules d\'investissement et transactions transfrontalières.',
    'team.member3.name': 'Glen Andrews',
    'team.member3.role': 'Modélisation Financière',
    'team.member3.bio': 'Carrière de plus de 20 ans dans la finance, couvrant la banque d\'investissement chez Merrill Lynch et Lazard, et le capital-investissement en tant que directeur exécutif chez AGC Equity Partners (Londres). A créé un fonds de transport spécialisé de 500 millions de dollars et a siégé au conseil d\'administration d\'ENEL Russie.',
    'team.ecosystem.title': 'L\'Écosystème',
    'team.ecosystem.role': 'Réseau Mondial de Partenaires',
    'team.ecosystem.desc': 'Bien que notre équipe centrale soit restreinte, notre réseau est massif. Nous opérons comme des forces spéciales—une petite équipe d\'élite qui tire parti de partenariats stratégiques avec plus de 35 émetteurs mondiaux, experts juridiques et administrateurs pour délivrer un impact à l\'échelle institutionnelle.',

    // Who We Serve
    'clients.label': 'Qui Nous Servons',
    'clients.title1': 'Des clients sophistiqués',
    'clients.title2': 'exigent des solutions sophistiquées',
    'clients.c1.title': 'Particuliers à Très Haute Valeur Nette',
    'clients.c1.desc': 'Clients avec 30M$+ recherchant une structuration transfrontalière complexe, la confidentialité et l\'accès à des produits de qualité institutionnelle généralement réservés aux banques.',
    'clients.c2.title': 'Entrepreneurs et Propriétaires d\'Entreprises',
    'clients.c2.desc': 'Visionnaires recherchant une planification pré-liquidité, la titrisation d\'actifs commerciaux et une levée de capitaux stratégique.',
    'clients.c3.title': 'Familles Multigénérationnelles',
    'clients.c3.desc': 'Familles nécessitant des cadres de gouvernance pour préserver l\'héritage et éduquer la prochaine génération à travers les frontières.',
    'clients.c4.title': 'Clients Internationaux',
    'clients.c4.desc': 'Familles en Amérique latine et en Europe cherchant l\'accès aux marchés américains, la couverture de change et l\'atténuation des risques politiques.',

    // Services
    'services.label': 'Nos Services',
    'services.title1': 'Nous ne conseillons pas seulement—',
    'services.title2': 'nous concevons des solutions',
    'services.desc': 'Beekman Strategic agit comme pont entre les clients privés et les marchés institutionnels. Nous concevons, structurons et exécutons des stratégies transfrontalières sophistiquées.',
    'services.s1.title': 'Gestion d\'Actifs et de Patrimoine',
    'services.s1.tagline': 'Clarté, Protection et Héritage.',
    'services.s1.desc': 'Planification patrimoniale stratégique, supervision globale de portefeuille, structuration d\'héritage, gestion des risques et conseil family office. Clarté, protection et héritage à travers les juridictions.',
    'services.s2.title': 'Banque d\'Investissement',
    'services.s2.tagline': 'Banque boutique pour le monde privé.',
    'services.s2.desc': 'Instruments financiers sur mesure, solutions de liquidité, conseil en marchés de capitaux et transformation d\'actifs. Transformer les actifs illiquides en titres bancables.',
    'services.s3.title': 'Structuration de Fonds et Véhicules',
    'services.s3.tagline': 'Concevoir des produits de qualité institutionnelle.',
    'services.s3.desc': 'Architecture de véhicules pour SPVs, LPs, ETP (Exchange Traded Products) et cadres sur mesure. Soutien à la levée de capitaux, coordination de lancement et conseil continu pour des produits de qualité institutionnelle.',
    'services.s4.title': 'Propulsé par Beekman AI',
    'services.s4.desc': 'Solutions IA propriétaires avec supervision humaine qui modernisent le processus de structuration - garantissant rapidité, précision et une expérience digitale fluide. Réduisant le délai de mise sur le marché de mois à jours.',

    // Process / Expertise
    'process.label': 'Notre Approche',
    'process.title1': 'Le Processus de',
    'process.title2': 'Traduction',
    'process.desc': 'Nous transformons l\'intention en impact. Une méthodologie systématique qui transforme votre vision en structures exécutables avec précision et efficacité.',
    'process.step1.title': 'Définition des Objectifs',
    'process.step1.desc': 'Nous articulons vos ambitions et identifions les contraintes réglementaires, fiscales ou opérationnelles qui informent le chemin optimal.',
    'process.step2.title': 'Analyse de Juridiction',
    'process.step2.desc': 'Nous sélectionnons le domicile optimal—Delaware, Luxembourg, Royaume-Uni, Suisse—basé sur vos objectifs et circonstances spécifiques.',
    'process.step3.title': 'Structuration d\'Entités',
    'process.step3.desc': 'Nous superposons des entités juridiques et des cadres de gouvernance pour assurer protection, efficacité et alignement avec vos objectifs.',
    'process.step4.title': 'Mise en Œuvre',
    'process.step4.desc': 'Nous gérons la formation, la configuration bancaire et les approbations réglementaires pour un lancement fluide avec un soutien de gouvernance continu.',

    // Stats
    'stats.stat1': 'Produits Structurés',
    'stats.stat2': 'Qualifiés d\'Investisseurs',
    'stats.stat3': 'Émetteurs Mondiaux de Premier Plan',
    'stats.stat4': 'Expérience Institutionnelle',

    // Why Us / Philosophy
    'why.label': 'Notre Philosophie',
    'why.title1': 'Supervision Humaine',
    'why.title2': 'sur une solution propulsée par l\'IA',
    'why.card1.title': 'Exécution par les Principaux',
    'why.card1.desc': 'Les clients travaillent directement avec des opérateurs seniors, pas des associés juniors. Responsabilité directe et expertise institutionnelle de la première conversation à la mise en œuvre finale.',
    'why.card2.title': 'Efficacité Améliorée par l\'IA',
    'why.card2.desc': 'Nos moteurs juridiques IA propriétaires et agents financiers compriment les délais de mois en jours—permettant une structuration rapide sans compromettre la rigueur institutionnelle.',
    'why.card3.title': 'Écosystème de Partenaires Mondial',
    'why.card3.desc': 'Nous exerçons le pouvoir d\'une institution mondiale à travers notre réseau curé d\'émetteurs, administrateurs, dépositaires et partenaires juridiques dans huit centres financiers.',

    // Case Studies
    'cases.label': 'Historique',
    'cases.title1': 'Preuve d\'',
    'cases.title2': 'Impact',
    'cases.desc': 'Exemples sélectionnés de la façon dont nous avons traduit des visions ambitieuses en réalités structurées et investissables à travers les frontières.',
    'cases.case1.tag': 'Durabilité',
    'cases.case1.title': 'Titrisation de Crédits Carbone Amazoniens',
    'cases.case1.desc': 'Nous avons structuré des émissions de crédits carbone de l\'Amazonie colombienne en une obligation cotée en Suisse, créant un titre liquide de qualité institutionnelle à partir d\'un actif environnemental. Une transaction emblématique reliant durabilité et marchés de capitaux.',
    'cases.case1.location': 'Colombie → Suisse',
    'cases.case2.tag': 'Impact Social',
    'cases.case2.title': 'Cluster de Santé en Zone Franche',
    'cases.case2.desc': 'Nous avons structuré et lancé un cluster de santé de plus de $100M dans une Zone Franche colombienne, servant plus de 1,3 million de personnes. Démonstration que la structuration sophistiquée peut générer à la fois des rendements et un impact social significatif.',
    'cases.case2.location': 'Colombie',

    // Insights
    'insights.label': 'Perspectives',
    'insights.title1': 'Perspectives stratégiques',
    'insights.title2': 'pour les marchés mondiaux',
    'insights.desc': 'Naviguer dans les complexités de la finance mondiale nécessite plus que des données—cela nécessite de la perspective. Explorez les dernières réflexions de l\'équipe Beekman Strategic.',
    'insights.article1.title': 'L\'Évolution du Family Office',
    'insights.article1.desc': 'Comment les familles modernes intègrent l\'IA avec la gouvernance traditionnelle pour gérer des actifs multijuridictionnels et préserver l\'héritage.',
    'insights.article2.title': 'Titres Suisses vs. Cotations NYSE',
    'insights.article2.desc': 'Une analyse comparative des options de structuration pour les clients internationaux cherchant l\'accès aux marchés de capitaux.',
    'insights.article3.title': 'Structuration Pré-IPO Efficace',
    'insights.article3.desc': 'Meilleures pratiques pour les entrepreneurs se préparant aux marchés publics tout en optimisant l\'efficacité fiscale et la gouvernance.',

    // Newsletter
    'newsletter.title': 'Restez Informé',
    'newsletter.desc': 'Recevez nos dernières analyses de marché et stratégies de structuration directement dans votre boîte mail.',
    'newsletter.placeholder': 'Entrez votre email',
    'newsletter.btn': 'S\'abonner',

    // Media & Press
    'media.title': 'Beekman dans les Médias',
    'media.desc': 'Couverture médiatique et reconnaissance de l\'industrie. Plus de mentions presse à venir.',
    'media.coming': 'Couverture presse à venir',

    // CTA
    'cta.title1': 'Traduisons votre ambition',
    'cta.title2': 'en réalité',
    'cta.desc': 'Planifiez une consultation confidentielle avec nos directeurs pour discuter de vos objectifs et explorer comment nous pouvons vous aider.',
    'cta.btn': 'Planifier une Consultation',

    // Contact
    'contact.label': 'Contact',
    'contact.title1': 'Commencez la',
    'contact.title2': 'conversation',
    'contact.desc': 'Prêt à discuter de comment Beekman Strategic peut servir vos objectifs? Connectez-vous directement avec nos directeurs pour une consultation confidentielle.',
    'contact.email': 'Email',
    'contact.location': 'Siège Social',
    'contact.global': 'Réseau Mondial',

    // Form
    'form.name': 'Nom',
    'form.email': 'Email',
    'form.phone': 'Téléphone',
    'form.company': 'Entreprise',
    'form.interest': 'Domaine d\'Intérêt',
    'form.message': 'Parlez-nous de vos objectifs',
    'form.submit': 'Envoyer le Message',

    // Footer
    'footer.desc': 'Conseil financier indépendant et banque d\'investissement. Tradition et innovation—où les objectifs deviennent réalité.',
    'footer.services': 'Services',
    'footer.company': 'Entreprise',
    'footer.locations': 'Présence Mondiale',
    'footer.rights': 'Tous droits réservés.',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions d\'Utilisation',
    'footer.disclosures': 'Mentions Légales'
  },

  pt: {
    // Header
    'header.tagline': 'Tradição e Inovação',

    // Navigation
    'nav.home': 'Início',
    'nav.about': 'A Firma',
    'nav.services': 'Serviços',
    'nav.expertise': 'Expertise',
    'nav.insights': 'Insights',
    'nav.contact': 'Contato',
    'nav.cta': 'Agendar Consulta',
    'nav.portal': 'Portal do Cliente',

    // Hero
    'hero.title1': 'Onde Objetivos',
    'hero.title2': 'Se Tornam Realidade.',
    'hero.subtitle': 'Assessoria financeira independente e banco de investimento boutique. Traduzimos sua ambição em estruturas financeiras executáveis.',
    'hero.cta1': 'Agendar uma Consulta',
    'hero.cta2': 'Explorar Nossos Serviços',
    'hero.stat1': 'Produtos Estruturados',
    'hero.stat2': 'Emissores Globais',
    'hero.stat3': 'Experiência Institucional',

    // Trust Bar
    'trust.label': 'Presença Global em Centros Financeiros',

    // About - The Firm
    'about.label': 'A Firma',
    'about.title1': 'A Diferença',
    'about.title2': 'Beekman',
    'about.desc': 'Beekman Strategic é uma firma boutique de assessoria financeira com identidade dupla. Fundimos a abordagem de alto contato e relacional do private banking tradicional com a velocidade e precisão do banco de investimento moderno. Nosso maior diferencial é nossa capacidade de verdadeiramente entender a visão de longo prazo de nossos clientes—e então traduzir essas perspectivas em ferramentas práticas, estruturas e veículos de investimento.',
    'about.feature1': 'Liderança de Principais: Clientes trabalham diretamente com os diretores, não associados juniores',
    'about.feature2': 'Rede Sólida: Acesso a mais de 35 emissores globais de primeira linha e parceiros jurídicos',
    'about.feature3': 'Tecnologia Avançada: Beekman AI aprimora o design de estruturas com automação avançada',
    'about.feature4': 'Presença Global: Experiência em 8 centros financeiros internacionais',
    'about.visual': 'Centros Financeiros Globais',

    // Team / Leadership
    'team.label': 'Liderança',
    'team.title1': 'A Equipe',
    'team.title2': 'Por Trás da Estratégia',
    'team.desc': 'Uma equipe enxuta de operadores seniores apoiada por uma rede global massiva. Como forças especiais em finanças—equipe pequena, impacto massivo através de parcerias estratégicas.',
    'team.member1.name': 'Oscar Libreros',
    'team.member1.role': 'Fundador e Principal',
    'team.member1.bio': '23 anos de experiência institucional no Société Générale e private banking de elite. Especialista em estruturação transfronteiriça, mercados de capitais e tradução de visões complexas de clientes em arquiteturas financeiras executáveis.',
    'team.member2.name': 'Juan Carlos Palau Olano',
    'team.member2.role': 'Estruturação Legal',
    'team.member2.bio': 'Advogado de valores mobiliários treinado nos EUA com mais de 20 anos na Ordem dos Advogados de NY. LL.M. em Regulação de Valores Mobiliários e Financeira pela Northwestern, dupla qualificação em NY e Colômbia. Experiência em fusões e aquisições, estruturação de veículos de investimento e transações transfronteiriças.',
    'team.member3.name': 'Glen Andrews',
    'team.member3.role': 'Modelagem Financeira',
    'team.member3.bio': 'Carreira de mais de 20 anos em finanças abrangendo banco de investimento na Merrill Lynch e Lazard, e private equity como Diretor Executivo na AGC Equity Partners (Londres). Criou um fundo de transporte especializado de $500M e serviu no conselho da ENEL Rússia.',
    'team.ecosystem.title': 'O Ecossistema',
    'team.ecosystem.role': 'Rede Global de Parceiros',
    'team.ecosystem.desc': 'Embora nossa equipe central seja enxuta, nossa rede é massiva. Operamos como forças especiais—uma equipe pequena e de elite que aproveita parcerias estratégicas com mais de 35 emissores globais, especialistas jurídicos e administradores para entregar impacto em escala institucional.',

    // Who We Serve
    'clients.label': 'Quem Atendemos',
    'clients.title1': 'Clientes sofisticados',
    'clients.title2': 'demandam soluções sofisticadas',
    'clients.c1.title': 'Indivíduos de Ultra Alto Patrimônio',
    'clients.c1.desc': 'Clientes com $30M+ buscando estruturação transfronteiriça complexa, privacidade e acesso a produtos de grau institucional tipicamente reservados para bancos.',
    'clients.c2.title': 'Empreendedores e Proprietários de Negócios',
    'clients.c2.desc': 'Visionários buscando planejamento pré-liquidez, securitização de ativos empresariais e captação de capital estratégica.',
    'clients.c3.title': 'Famílias Multigeracionais',
    'clients.c3.desc': 'Famílias que requerem estruturas de governança para preservar o legado e educar a próxima geração através de fronteiras.',
    'clients.c4.title': 'Clientes Internacionais',
    'clients.c4.desc': 'Famílias na América Latina e Europa buscando acesso a mercados americanos, hedge cambial e mitigação de risco político.',

    // Services
    'services.label': 'Nossos Serviços',
    'services.title1': 'Não apenas assessoramos—',
    'services.title2': 'engenhamos soluções',
    'services.desc': 'Beekman Strategic atua como ponte entre clientes privados e mercados institucionais. Projetamos, estruturamos e executamos estratégias transfronteiriças sofisticadas.',
    'services.s1.title': 'Gestão de Ativos e Patrimônio',
    'services.s1.tagline': 'Clareza, Proteção e Legado.',
    'services.s1.desc': 'Planejamento patrimonial estratégico, supervisão global de portfólio, estruturação de legado, gestão de riscos e assessoria de family office. Clareza, proteção e legado através de jurisdições.',
    'services.s2.title': 'Banco de Investimento',
    'services.s2.tagline': 'Banco boutique para o mundo privado.',
    'services.s2.desc': 'Instrumentos financeiros sob medida, soluções de liquidez, assessoria em mercados de capitais e transformação de ativos. Transformando ativos ilíquidos em títulos bancáveis.',
    'services.s3.title': 'Estruturação de Fundos e Veículos',
    'services.s3.tagline': 'Engenharia de produtos de grau institucional.',
    'services.s3.desc': 'Arquitetura de veículos para SPVs, LPs, ETP (Exchange Traded Products) e estruturas sob medida. Suporte em captação de capital, coordenação de lançamento e assessoria contínua para produtos de grau institucional.',
    'services.s4.title': 'Impulsionado por Beekman AI',
    'services.s4.desc': 'Soluções proprietárias de IA com supervisão humana que modernizam o processo de estruturação - garantindo velocidade, precisão e uma experiência digital fluida. Reduzindo o tempo de lançamento ao mercado de meses para dias.',

    // Process / Expertise
    'process.label': 'Nossa Abordagem',
    'process.title1': 'O Processo de',
    'process.title2': 'Tradução',
    'process.desc': 'Transformamos intenção em impacto. Uma metodologia sistemática que transforma sua visão em estruturas executáveis com precisão e eficiência.',
    'process.step1.title': 'Definição de Objetivos',
    'process.step1.desc': 'Articulamos suas ambições e identificamos restrições regulatórias, fiscais ou operacionais que informam o caminho ótimo.',
    'process.step2.title': 'Análise de Jurisdição',
    'process.step2.desc': 'Selecionamos o domicílio ótimo—Delaware, Luxemburgo, Reino Unido, Suíça—baseado em seus objetivos e circunstâncias específicas.',
    'process.step3.title': 'Estruturação de Entidades',
    'process.step3.desc': 'Criamos camadas de entidades legais e estruturas de governança para garantir proteção, eficiência e alinhamento com seus objetivos.',
    'process.step4.title': 'Implementação',
    'process.step4.desc': 'Gerenciamos formação, configuração bancária e aprovações regulatórias para um lançamento fluido com suporte contínuo de governança.',

    // Stats
    'stats.stat1': 'Produtos Estruturados',
    'stats.stat2': 'Qualificados de Investidores',
    'stats.stat3': 'Emissores Globais de Primeira Linha',
    'stats.stat4': 'Experiência Institucional',

    // Why Us / Philosophy
    'why.label': 'Nossa Filosofia',
    'why.title1': 'Supervisão Humana',
    'why.title2': 'sobre uma solução impulsionada por IA',
    'why.card1.title': 'Execução Liderada por Principais',
    'why.card1.desc': 'Clientes trabalham diretamente com operadores seniores, não associados juniores. Responsabilidade direta e expertise institucional da primeira conversa até a implementação final.',
    'why.card2.title': 'Eficiência Aprimorada por IA',
    'why.card2.desc': 'Nossos motores jurídicos de IA proprietários e agentes financeiros comprimem prazos de meses para dias—permitindo estruturação rápida sem comprometer o rigor institucional.',
    'why.card3.title': 'Ecossistema Global de Parceiros',
    'why.card3.desc': 'Exercemos o poder de uma instituição global através de nossa rede curada de emissores, administradores, custodiantes e parceiros jurídicos em oito centros financeiros.',

    // Case Studies
    'cases.label': 'Histórico',
    'cases.title1': 'Prova de',
    'cases.title2': 'Impacto',
    'cases.desc': 'Exemplos selecionados de como traduzimos visões ambiciosas em realidades estruturadas e investíveis através de fronteiras.',
    'cases.case1.tag': 'Sustentabilidade',
    'cases.case1.title': 'Securitização de Créditos de Carbono da Amazônia',
    'cases.case1.desc': 'Estruturamos emissões de créditos de carbono da Amazônia colombiana em um título listado na Suíça, criando um valor líquido de grau institucional a partir de um ativo ambiental. Uma transação emblemática conectando sustentabilidade e mercados de capitais.',
    'cases.case1.location': 'Colômbia → Suíça',
    'cases.case2.tag': 'Impacto Social',
    'cases.case2.title': 'Cluster de Saúde em Zona Franca',
    'cases.case2.desc': 'Estruturamos e lançamos um cluster de saúde de $100M+ dentro de uma Zona Franca colombiana, atendendo mais de 1,3 milhão de pessoas. Demonstramos como a estruturação sofisticada pode gerar tanto retornos quanto impacto social significativo.',
    'cases.case2.location': 'Colômbia',

    // Insights
    'insights.label': 'Perspectivas',
    'insights.title1': 'Insights estratégicos',
    'insights.title2': 'para mercados globais',
    'insights.desc': 'Navegar as complexidades das finanças globais requer mais que dados—requer perspectiva. Explore o pensamento mais recente da equipe Beekman Strategic.',
    'insights.article1.title': 'A Evolução do Family Office',
    'insights.article1.desc': 'Como famílias modernas estão integrando IA com governança tradicional para gerenciar ativos multijurisdicionais e preservar o legado.',
    'insights.article2.title': 'Títulos Suíços vs. Listagens NYSE',
    'insights.article2.desc': 'Uma análise comparativa de opções de estruturação para clientes internacionais buscando acesso a mercados de capitais.',
    'insights.article3.title': 'Estruturação Pré-IPO Eficiente',
    'insights.article3.desc': 'Melhores práticas para empreendedores se preparando para mercados públicos enquanto otimizam eficiência fiscal e governança.',

    // Newsletter
    'newsletter.title': 'Mantenha-se Informado',
    'newsletter.desc': 'Receba nossos últimos insights de mercado e estratégias de estruturação diretamente em seu email.',
    'newsletter.placeholder': 'Digite seu email',
    'newsletter.btn': 'Inscrever-se',

    // Media & Press
    'media.title': 'Beekman na Mídia',
    'media.desc': 'Cobertura em destaque e reconhecimento da indústria. Mais menções na imprensa em breve.',
    'media.coming': 'Cobertura de imprensa em breve',

    // CTA
    'cta.title1': 'Vamos traduzir sua ambição',
    'cta.title2': 'em realidade',
    'cta.desc': 'Agende uma consulta confidencial com nossos diretores para discutir seus objetivos e explorar como podemos ajudar.',
    'cta.btn': 'Agendar uma Consulta',

    // Contact
    'contact.label': 'Contato',
    'contact.title1': 'Inicie a',
    'contact.title2': 'conversa',
    'contact.desc': 'Pronto para discutir como a Beekman Strategic pode servir seus objetivos? Conecte-se diretamente com nossos diretores para uma consulta confidencial.',
    'contact.email': 'Email',
    'contact.location': 'Sede',
    'contact.global': 'Rede Global',

    // Form
    'form.name': 'Nome',
    'form.email': 'Email',
    'form.phone': 'Telefone',
    'form.company': 'Empresa',
    'form.interest': 'Área de Interesse',
    'form.message': 'Conte-nos sobre seus objetivos',
    'form.submit': 'Enviar Mensagem',

    // Footer
    'footer.desc': 'Assessoria financeira independente e banco de investimento. Tradição e inovação—onde objetivos se tornam realidade.',
    'footer.services': 'Serviços',
    'footer.company': 'Empresa',
    'footer.locations': 'Presença Global',
    'footer.rights': 'Todos os direitos reservados.',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Serviço',
    'footer.disclosures': 'Divulgações'
  }
};

class I18n {
  constructor() {
    this.currentLang = this.getStoredLang() || this.detectLang() || 'en';
    this.init();
  }

  init() {
    this.updateContent();
    this.updateLangSelector();
  }

  getStoredLang() {
    return localStorage.getItem('beekman-lang');
  }

  detectLang() {
    const browserLang = navigator.language.split('-')[0];
    return translations[browserLang] ? browserLang : null;
  }

  setLang(lang) {
    if (!translations[lang]) return;

    this.currentLang = lang;
    localStorage.setItem('beekman-lang', lang);
    document.documentElement.lang = lang;
    this.updateContent();
    this.updateLangSelector();
  }

  t(key) {
    const langTranslations = translations[this.currentLang];
    if (langTranslations && langTranslations[key]) {
      return langTranslations[key];
    }
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return key;
  }

  updateContent() {
    console.log('[i18n] updateContent called, lang:', this.currentLang);
    // Update text content (preserve child elements like SVG icons)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const translation = this.t(key);
      if (key === 'nav.home') {
        console.log('[i18n] nav.home translation:', translation);
      }

      // Check if element has child elements (like SVG)
      const hasChildElements = el.querySelector('*') !== null;

      if (!hasChildElements) {
        // No child elements, safe to replace all content
        el.textContent = translation;
      } else {
        // Has child elements - need to preserve them
        // Clone children, set text, then re-append children
        const children = Array.from(el.children);
        el.textContent = translation + ' ';
        children.forEach(child => el.appendChild(child));
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      el.placeholder = this.t(key);
    });
  }

  updateLangSelector() {
    const currentLangEl = document.getElementById('currentLang');
    if (currentLangEl) {
      currentLangEl.textContent = this.currentLang.toUpperCase();
    }

    document.querySelectorAll('.lang-dropdown button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
    });
  }
}

// Initialize after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new I18n();
  });
} else {
  window.i18n = new I18n();
}
