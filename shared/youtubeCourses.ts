import { t, type Localized } from "./courseContent";

export type YouTubeCourse = {
  id: string;
  order: number;
  channel: string;
  channelUrl: string;
  playlistId: string;
  playlistUrl: string;
  title: Localized;
  description: Localized;
  level: Localized;
  duration: Localized;
  lessonsCount: number;
  topics: Localized[];
  thumbnail: string;
  language: "en" | "es" | "pt" | "multi";
  isOfficial: boolean;
  certificateUrl?: string;
};

export type YouTubeChannel = {
  id: string;
  name: string;
  handle: string;
  url: string;
  description: Localized;
  avatar: string;
  subscriberCount: string;
  playlists: YouTubeCourse[];
};

const ytCourse = (
  id: string,
  order: number,
  channel: string,
  channelUrl: string,
  playlistId: string,
  title: Localized,
  description: Localized,
  level: Localized,
  duration: Localized,
  lessonsCount: number,
  topics: Localized[],
  thumbnail: string,
  language: "en" | "es" | "pt" | "multi" = "en",
  isOfficial: boolean = true,
  certificateUrl?: string
): YouTubeCourse => ({
  id,
  order,
  channel,
  channelUrl,
  playlistId,
  playlistUrl: `https://www.youtube.com/playlist?list=${playlistId}`,
  title,
  description,
  level,
  duration,
  lessonsCount,
  topics,
  thumbnail,
  language,
  isOfficial,
  certificateUrl,
});

export const youtubeCourses: YouTubeCourse[] = [
  ytCourse(
    "google-ux-design-certificate",
    1,
    "Google Career Certificates",
    "https://www.youtube.com/@GoogleCareerCertificates",
    "PLTZYG7bZ1u6oHnGp4Ib3n0y-CmFQdTW6r",
    t(
      "Certificado Profesional de Diseño UX de Google",
      "Certificado Profissional de Design UX do Google",
      "Google UX Design Professional Certificate"
    ),
    t(
      "Curso oficial de Google que enseña el proceso completo de diseño UX: empatizar, definir, idear, prototipar y probar. Incluye proyectos de portfolio reales.",
      "Curso oficial do Google que ensina o processo completo de design UX: empatizar, definir, idear, prototipar e testar. Inclui projetos reais de portfólio.",
      "Official Google course teaching the complete UX design process: empathize, define, ideate, prototype, and test. Includes real portfolio projects."
    ),
    t("Principiante", "Iniciante", "Beginner"),
    t("~6 meses (10 h/semana)", "~6 meses (10 h/semana)", "~6 months (10 hrs/week)"),
    46,
    [
      t("Fundamentos de UX", "Fundamentos de UX", "UX Foundations"),
      t("Investigación de usuarios", "Pesquisa de usuários", "User Research"),
      t("Wireframing y prototipado", "Wireframing e prototipagem", "Wireframing & Prototyping"),
      t("Pruebas de usabilidad", "Testes de usabilidade", "Usability Testing"),
      t("Portfolio de diseño", "Portfólio de design", "Design Portfolio"),
      t("Accesibilidad", "Acessibilidade", "Accessibility"),
    ],
    "https://img.youtube.com/vi/2QQQtiFwXjU/maxresdefault.jpg",
    "multi",
    true,
    "https://www.coursera.org/professional-certificates/google-ux-design"
  ),
  ytCourse(
    "google-ux-design-foundations",
    2,
    "Google Career Certificates",
    "https://www.youtube.com/@GoogleCareerCertificates",
    "PLHQM7x6Opn3wcNh_NBc8D779yQuLHHbm4",
    t(
      "Fundamentos de la Experiencia de Usuario (UX) Design",
      "Fundamentos da Experiência do Usuário (UX) Design",
      "Foundations of User Experience (UX) Design"
    ),
    t(
      "Primer curso del certificado de UX de Google. Cubre conceptos básicos, investigación, wireframes, prototipos y pruebas.",
      "Primeiro curso do certificado de UX do Google. Cobre conceitos básicos, pesquisa, wireframes, protótipos e testes.",
      "First course of Google's UX Certificate. Covers basics, research, wireframes, prototypes, and testing."
    ),
    t("Principiante", "Iniciante", "Beginner"),
    t("~4 semanas", "~4 semanas", "~4 weeks"),
    11,
    [
      t("Qué es UX Design", "O que é UX Design", "What is UX Design"),
      t("El proceso de diseño", "O processo de design", "The Design Process"),
      t("Investigación con usuarios", "Pesquisa com usuários", "User Research"),
      t("Wireframes y prototipos", "Wireframes e protótipos", "Wireframes & Prototypes"),
    ],
    "https://img.youtube.com/vi/2QQQtiFwXjU/maxresdefault.jpg",
    "multi",
    true
  ),
  ytCourse(
    "material-design-course",
    3,
    "Google Design",
    "https://www.youtube.com/@GoogleDesign",
    "PL8PWUWLnnIXPD3UjX931fFhn3_U5_2uZG",
    t(
      "Curso de Material Design por Google",
      "Curso de Material Design do Google",
      "Material Design Course by Google"
    ),
    t(
      "Ruta de aprendizaje oficial de Material Design de Google. Cubre principios, componentes, theming, motion y implementación.",
      "Rota de aprendizagem oficial de Material Design do Google. Cobre princípios, componentes, theming, motion e implementação.",
      "Official Google Material Design learning path. Covers principles, components, theming, motion, and implementation."
    ),
    t("Todos los niveles", "Todos os níveis", "All levels"),
    t("Auto-guiado", "Auto-guiado", "Self-paced"),
    15,
    [
      t("Principios de Material Design", "Princípios do Material Design", "Material Design Principles"),
      t("Componentes y patrones", "Componentes e padrões", "Components & Patterns"),
      t("Color y tipografía", "Cor e tipografia", "Color & Typography"),
      t("Motion y animación", "Motion e animação", "Motion & Animation"),
      t("Theming personalizado", "Theming personalizado", "Custom Theming"),
    ],
    "https://img.youtube.com/vi/kbZejnPXyLM/maxresdefault.jpg",
    "multi",
    true
  ),
  ytCourse(
    "design-sprint",
    4,
    "Google for Developers",
    "https://www.youtube.com/@GoogleDevelopers",
    "PLEWhp64sMgxIfnxJcyS-03XQNaTwiRWbu",
    t(
      "Design Sprint día a día",
      "Design Sprint dia a dia",
      "Design Sprint Day by Day"
    ),
    t(
      "Metodología de 5 días desarrollada en Google Ventures para resolver problemas críticos de negocio mediante diseño, prototipado y feedback real.",
      "Metodologia de 5 dias desenvolvida no Google Ventures para resolver problemas críticos de negócio através de design, prototipagem e feedback real.",
      "5-day methodology developed at Google Ventures to solve critical business problems through design, prototyping, and real customer feedback."
    ),
    t("Intermedio", "Intermediário", "Intermediate"),
    t("5 días", "5 dias", "5 days"),
    5,
    [
      t("Mapa y objetivo", "Mapa e objetivo", "Map & Target"),
      t("Bocetos y soluciones", "Esboços e soluções", "Sketching & Solutions"),
      t("Decisión y storyboard", "Decisão e storyboard", "Decide & Storyboard"),
      t("Prototipo realista", "Protótipo realista", "Realistic Prototype"),
      t("Prueba con usuarios", "Teste com usuários", "Test with Users"),
    ],
    "https://img.youtube.com/vi/WWEJCLkf1D4/maxresdefault.jpg",
    "multi",
    true
  ),
  ytCourse(
    "firebase-firecasts",
    5,
    "Firebase",
    "https://www.youtube.com/@Firebase",
    "PLl-K7zZEsYLnJVX_0zbKytptZGugPIbJR",
    t(
      "Firecasts para Desarrolladores de Firebase",
      "Firecasts para Desenvolvedores Firebase",
      "Firecasts for Firebase Developers"
    ),
    t(
      "Serie práctica semanal para desarrolladores de Firebase. Cubre Firestore, Auth, Hosting, Functions, Cloud Messaging y más en Android, iOS y Web.",
      "Série prática semanal para desenvolvedores Firebase. Cobre Firestore, Auth, Hosting, Functions, Cloud Messaging e mais no Android, iOS e Web.",
      "Weekly hands-on series for Firebase developers. Covers Firestore, Auth, Hosting, Functions, Cloud Messaging and more on Android, iOS, and Web."
    ),
    t("Intermedio", "Intermediário", "Intermediate"),
    t("Continuo (semanal)", "Contínuo (semanal)", "Ongoing (weekly)"),
    100,
    [
      t("Firestore", "Firestore", "Firestore"),
      t("Authentication", "Autenticação", "Authentication"),
      t("Cloud Functions", "Cloud Functions", "Cloud Functions"),
      t("Hosting", "Hospedagem", "Hosting"),
      t("Cloud Messaging", "Cloud Messaging", "Cloud Messaging"),
      t("Performance", "Desempenho", "Performance"),
    ],
    "https://img.youtube.com/vi/w7xKZ5PWizs/maxresdefault.jpg",
    "en",
    true
  ),
  ytCourse(
    "android-firebase-tutorial",
    6,
    "Firebase",
    "https://www.youtube.com/@Firebase",
    "PLZocXbUzomEHma3HiBLW9RbOJhKaHgp70",
    t(
      "Tutorial de Android con Firebase",
      "Tutorial de Android com Firebase",
      "Android Firebase Tutorial"
    ),
    t(
      "Guía para principiantes de Firebase con Android. Cubre configuración, Auth, Realtime Database, Firestore, Storage y Analytics.",
      "Guia para iniciantes de Firebase com Android. Cobre configuração, Auth, Realtime Database, Firestore, Storage e Analytics.",
      "Beginner guide to Firebase with Android. Covers setup, Auth, Realtime Database, Firestore, Storage, and Analytics."
    ),
    t("Principiante", "Iniciante", "Beginner"),
    t("~3 horas", "~3 horas", "~3 hours"),
    12,
    [
      t("Configuración inicial", "Configuração inicial", "Initial Setup"),
      t("Autenticación", "Autenticação", "Authentication"),
      t("Realtime Database", "Realtime Database", "Realtime Database"),
      t("Cloud Firestore", "Cloud Firestore", "Cloud Firestore"),
      t("Storage", "Armazenamento", "Storage"),
    ],
    "https://img.youtube.com/vi/V0ZrnL-i77Q/maxresdefault.jpg",
    "en",
    true
  ),
  ytCourse(
    "google-cloud-cybersecurity",
    7,
    "Google Cloud",
    "https://www.youtube.com/@GoogleCloud",
    "PLBgogxgQVM9sGgpcBVYatuq67aGjW8wYJ",
    t(
      "Certificado de Ciberseguridad de Google Cloud",
      "Certificado de Cibersegurança do Google Cloud",
      "Google Cloud Cybersecurity Certificate"
    ),
    t(
      "Curso oficial para el certificado de ciberseguridad de Google Cloud. Cubre fundamentos de seguridad, redes, detección de amenazas y respuesta a incidentes.",
      "Curso oficial para o certificado de cibersegurança do Google Cloud. Cobre fundamentos de segurança, redes, detecção de ameaças e resposta a incidentes.",
      "Official course for Google Cloud Cybersecurity Certificate. Covers security fundamentals, networking, threat detection, and incident response."
    ),
    t("Principiante", "Iniciante", "Beginner"),
    t("~3 meses", "~3 meses", "~3 months"),
    6,
    [
      t("Fundamentos de seguridad", "Fundamentos de segurança", "Security Fundamentals"),
      t("Seguridad de redes", "Segurança de redes", "Network Security"),
      t("Detección de amenazas", "Detecção de ameaças", "Threat Detection"),
      t("Respuesta a incidentes", "Resposta a incidentes", "Incident Response"),
    ],
    "https://img.youtube.com/vi/T5CcoAXeVko/maxresdefault.jpg",
    "en",
    true,
    "https://www.coursera.org/professional-certificates/google-cloud-cybersecurity"
  ),
  ytCourse(
    "google-cloud-data-analytics",
    8,
    "Google Cloud",
    "https://www.youtube.com/@GoogleCloud",
    "PLBgogxgQVM9tcNYUyRL2jvFNm7jsYlyPv",
    t(
      "Certificado de Análisis de Datos de Google Cloud",
      "Certificado de Análise de Dados do Google Cloud",
      "Google Cloud Data Analytics Certificate"
    ),
    t(
      "Aprende análisis de datos con BigQuery, Looker, Dataflow y Dataprep. Incluye SQL, visualización y pipelines de datos.",
      "Aprenda análise de dados com BigQuery, Looker, Dataflow e Dataprep. Inclui SQL, visualização e pipelines de dados.",
      "Learn data analytics with BigQuery, Looker, Dataflow, and Dataprep. Includes SQL, visualization, and data pipelines."
    ),
    t("Principiante", "Iniciante", "Beginner"),
    t("~3 meses", "~3 meses", "~3 months"),
    6,
    [
      t("BigQuery", "BigQuery", "BigQuery"),
      t("SQL para análisis", "SQL para análise", "SQL for Analysis"),
      t("Visualización con Looker", "Visualização com Looker", "Visualization with Looker"),
      t("Pipelines de datos", "Pipelines de dados", "Data Pipelines"),
    ],
    "https://img.youtube.com/vi/nSSQwVREXhY/maxresdefault.jpg",
    "en",
    true,
    "https://www.coursera.org/professional-certificates/google-data-analytics"
  ),
  ytCourse(
    "google-cloud-next-2026",
    9,
    "Google Cloud",
    "https://www.youtube.com/@GoogleCloud",
    "PLBgogxgQVM9sSEESQx6XCGgdwSKniFrLK",
    t(
      "Google Cloud Next 2026 - Developer Livestreams",
      "Google Cloud Next 2026 - Livestreams para Desenvolvedores",
      "Google Cloud Next 2026 - Developer Livestreams"
    ),
    t(
      "Sesiones técnicas profundas grabadas en vivo desde Google Cloud Next 2026. IA generativa, agentes, infraestructura y herramientas para desarrolladores.",
      "Sessões técnicas profundas gravadas ao vivo do Google Cloud Next 2026. IA generativa, agentes, infraestrutura e ferramentas para desenvolvedores.",
      "Deep-dive technical sessions recorded live from Google Cloud Next 2026. Generative AI, agents, infrastructure, and developer tools."
    ),
    t("Avanzado", "Avançado", "Advanced"),
    t("~20 horas", "~20 horas", "~20 hours"),
    21,
    [
      t("IA Generativa", "IA Generativa", "Generative AI"),
      t("Agentes de IA", "Agentes de IA", "AI Agents"),
      t("Infraestructura cloud", "Infraestrutura cloud", "Cloud Infrastructure"),
      t("Herramientas de desarrollo", "Ferramentas de desenvolvimento", "Developer Tools"),
    ],
    "https://img.youtube.com/vi/rHWMZLrlmV8/maxresdefault.jpg",
    "en",
    true
  ),
  ytCourse(
    "google-ai-gemini",
    10,
    "Google for Developers",
    "https://www.youtube.com/@GoogleDevelopers",
    "PLTZYG7bZ1u6oHnGp4Ib3n0y-CmFQdTW6r",
    t(
      "Gemini API y IA Generativa",
      "API Gemini e IA Generativa",
      "Gemini API & Generative AI"
    ),
    t(
      "Aprende a integrar Gemini en tus aplicaciones. Cubre prompting, function calling, multimodalidad, seguridad y mejores prácticas.",
      "Aprenda a integrar o Gemini em suas aplicações. Cobre prompting, function calling, multimodalidade, segurança e melhores práticas.",
      "Learn to integrate Gemini into your applications. Covers prompting, function calling, multimodality, safety, and best practices."
    ),
    t("Intermedio", "Intermediário", "Intermediate"),
    t("Auto-guiado", "Auto-guiado", "Self-paced"),
    25,
    [
      t("Introducción a Gemini", "Introdução ao Gemini", "Introduction to Gemini"),
      t("Prompt Engineering", "Engenharia de Prompt", "Prompt Engineering"),
      t("Function Calling", "Function Calling", "Function Calling"),
      t("Multimodalidad", "Multimodalidade", "Multimodality"),
      t("Seguridad y ética", "Segurança e ética", "Safety & Ethics"),
    ],
    "https://img.youtube.com/vi/2QQQtiFwXjU/maxresdefault.jpg",
    "en",
    true
  ),
];

export const youtubeChannels: YouTubeChannel[] = [
  {
    id: "google-career-certificates",
    name: "Google Career Certificates",
    handle: "@GoogleCareerCertificates",
    url: "https://www.youtube.com/@GoogleCareerCertificates",
    description: t(
      "Canal oficial de Google para certificados profesionales en UX Design, Data Analytics, Project Management, IT Support y más.",
      "Canal oficial do Google para certificados profissionais em UX Design, Data Analytics, Project Management, IT Support e mais.",
      "Official Google channel for professional certificates in UX Design, Data Analytics, Project Management, IT Support and more."
    ),
    avatar: "https://yt3.ggpht.com/ytc/AIdro_lQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ=s88-c-k-c0x00ffffff-no-rj",
    subscriberCount: "500K+",
    playlists: youtubeCourses.filter(c => c.channel === "Google Career Certificates"),
  },
  {
    id: "google-design",
    name: "Google Design",
    handle: "@GoogleDesign",
    url: "https://www.youtube.com/@GoogleDesign",
    description: t(
      "Canal oficial de Google Design. Recursos, guías y perspectivas sobre diseño de productos, Material Design y investigación.",
      "Canal oficial do Google Design. Recursos, guias e perspectivas sobre design de produtos, Material Design e pesquisa.",
      "Official Google Design channel. Resources, guides, and perspectives on product design, Material Design, and research."
    ),
    avatar: "https://yt3.ggpht.com/ytc/AIdro_lQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ=s88-c-k-c0x00ffffff-no-rj",
    subscriberCount: "200K+",
    playlists: youtubeCourses.filter(c => c.channel === "Google Design"),
  },
  {
    id: "google-developers",
    name: "Google for Developers",
    handle: "@GoogleDevelopers",
    url: "https://www.youtube.com/@GoogleDevelopers",
    description: t(
      "Canal principal de Google para desarrolladores. Tutoriales, charlas y actualizaciones sobre Android, Firebase, Cloud, IA, Web y más.",
      "Canal principal do Google para desenvolvedores. Tutoriais, palestras e atualizações sobre Android, Firebase, Cloud, IA, Web e mais.",
      "Main Google channel for developers. Tutorials, talks, and updates on Android, Firebase, Cloud, AI, Web, and more."
    ),
    avatar: "https://yt3.ggpht.com/ytc/AIdro_lQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ=s88-c-k-c0x00ffffff-no-rj",
    subscriberCount: "2M+",
    playlists: youtubeCourses.filter(c => c.channel === "Google for Developers"),
  },
  {
    id: "firebase",
    name: "Firebase",
    handle: "@Firebase",
    url: "https://www.youtube.com/@Firebase",
    description: t(
      "Canal oficial de Firebase. Tutoriales, consejos y mejores prácticas para construir apps con Firestore, Auth, Functions, Hosting y más.",
      "Canal oficial do Firebase. Tutoriais, dicas e melhores práticas para construir apps com Firestore, Auth, Functions, Hosting e mais.",
      "Official Firebase channel. Tutorials, tips, and best practices for building apps with Firestore, Auth, Functions, Hosting, and more."
    ),
    avatar: "https://yt3.ggpht.com/ytc/AIdro_lQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ=s88-c-k-c0x00ffffff-no-rj",
    subscriberCount: "400K+",
    playlists: youtubeCourses.filter(c => c.channel === "Firebase"),
  },
  {
    id: "google-cloud",
    name: "Google Cloud",
    handle: "@GoogleCloud",
    url: "https://www.youtube.com/@GoogleCloud",
    description: t(
      "Canal oficial de Google Cloud. Contenido técnico sobre computación en la nube, IA, datos, seguridad e infraestructura.",
      "Canal oficial do Google Cloud. Conteúdo técnico sobre computação em nuvem, IA, dados, segurança e infraestrutura.",
      "Official Google Cloud channel. Technical content on cloud computing, AI, data, security, and infrastructure."
    ),
    avatar: "https://yt3.ggpht.com/ytc/AIdro_lQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ=s88-c-k-c0x00ffffff-no-rj",
    subscriberCount: "1M+",
    playlists: youtubeCourses.filter(c => c.channel === "Google Cloud"),
  },
];