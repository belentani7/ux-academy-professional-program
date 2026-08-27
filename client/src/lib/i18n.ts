import type { Localized } from "@shared/courseContent";
import type { Locale } from "@shared/courseContent";

export const text = (value: Localized, locale: Locale) => value[locale];

export const ui = {
  es: {
    dashboard: "Inicio", catalog: "Programa", lab: "Practice Lab", projects: "Proyectos", notes: "Notas", resources: "Biblioteca", portfolio: "Portfolio", certificate: "Certificado", profile: "Perfil", continue: "Continuar", signIn: "Entrar al aula", signOut: "Cerrar sesión", language: "Idioma", minutes: "min", complete: "Marcar completada", completed: "Completada", inProgress: "En progreso", notStarted: "Pendiente", points: "puntos", of: "de", next: "Siguiente actividad", locked: "Disponible tras tu primer intento", save: "Guardar", submit: "Entregar", program: "Programa profesional", internalCertificate: "Reconocimiento interno", allModules: "módulos", lessons: "lecciones", feedback: "Feedback formativo",
  },
  pt: {
    dashboard: "Início", catalog: "Programa", lab: "Practice Lab", projects: "Projetos", notes: "Notas", resources: "Biblioteca", portfolio: "Portfólio", certificate: "Certificado", profile: "Perfil", continue: "Continuar", signIn: "Entrar na sala", signOut: "Sair", language: "Idioma", minutes: "min", complete: "Marcar como concluída", completed: "Concluída", inProgress: "Em andamento", notStarted: "Pendente", points: "pontos", of: "de", next: "Próxima atividade", locked: "Disponível após sua primeira tentativa", save: "Salvar", submit: "Entregar", program: "Programa profissional", internalCertificate: "Reconhecimento interno", allModules: "módulos", lessons: "lições", feedback: "Feedback formativo",
  },
  en: {
    dashboard: "Home", catalog: "Program", lab: "Practice Lab", projects: "Projects", notes: "Notes", resources: "Library", portfolio: "Portfolio", certificate: "Certificate", profile: "Profile", continue: "Continue", signIn: "Enter classroom", signOut: "Sign out", language: "Language", minutes: "min", complete: "Mark complete", completed: "Completed", inProgress: "In progress", notStarted: "Not started", points: "points", of: "of", next: "Next activity", locked: "Available after your first attempt", save: "Save", submit: "Submit", program: "Professional program", internalCertificate: "Internal recognition", allModules: "modules", lessons: "lessons", feedback: "Formative feedback",
  },
} as const;
