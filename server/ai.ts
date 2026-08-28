import { invokeLLM } from "./_core/llm";

export type AcademyLocale = "es" | "pt" | "en";

const languageName: Record<AcademyLocale, string> = {
  es: "español",
  pt: "portugués brasileño",
  en: "inglés",
};

const fallback = (locale: AcademyLocale) => {
  if (locale === "pt") return "A mentoria IA está temporariamente indisponível. Continua com a pergunta, explicita a evidência que tens e escolhe o próximo passo reversível.";
  if (locale === "en") return "The AI mentor is temporarily unavailable. Keep working by stating the evidence you have and choosing the next reversible step.";
  return "La mentoría IA no está disponible temporalmente. Sigue trabajando: explicita la evidencia que tienes y elige el siguiente paso reversible.";
};

function responseText(content: unknown) {
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) return content.map(part => typeof part === "string" ? part : "text" in (part as Record<string, unknown>) ? String((part as Record<string, unknown>).text) : "").join(" ").trim();
  return "";
}

export async function answerLearner(input: { question: string; locale: AcademyLocale; page: string }) {
  const question = input.question.trim();
  if (!question) return fallback(input.locale);
  try {
    const result = await invokeLLM({
      model: "gpt-5-mini",
      maxTokens: 900,
      messages: [
        {
          role: "system",
          content: `Eres el mentor de UX Academy. Responde únicamente en ${languageName[input.locale]}. Ayuda a una persona que está aprendiendo UX/Product Design, investigación, accesibilidad, contenido, growth y uso responsable de IA. Da una explicación breve pero sustanciosa, con un marco práctico, un ejemplo y una pregunta de reflexión cuando sea útil. No inventes fuentes, no prometas resultados, no evalúes ni certifiques al alumno y no solicites datos personales o confidenciales. Si la pregunta es ambigua, declara la suposición y ofrece el siguiente paso más reversible.`,
        },
        {
          role: "user",
          content: `La persona está en la ruta ${input.page}. Pregunta: ${question}`,
        },
      ],
    });
    return responseText(result.choices[0]?.message?.content) || fallback(input.locale);
  } catch (error) {
    console.warn("[AI] Falling back to editorial mentor response", error);
    return fallback(input.locale);
  }
}

export async function improveLearnerText(input: { text: string; locale: AcademyLocale; purpose: string }) {
  const text = input.text.trim();
  if (!text) return "";
  try {
    const result = await invokeLLM({
      model: "gpt-5-mini",
      maxTokens: 800,
      messages: [
        {
          role: "system",
          content: `Eres un editor de UX Academy. Reescribe en ${languageName[input.locale]} el texto del alumno para que sea claro, específico, accesible y defendible. Conserva la intención y no inventes datos. Mantén la voz de la persona, evita lenguaje grandilocuente y devuelve solo la versión revisada.`,
        },
        {
          role: "user",
          content: `Propósito: ${input.purpose}\n\nTexto del alumno:\n${text}`,
        },
      ],
    });
    return responseText(result.choices[0]?.message?.content) || text;
  } catch (error) {
    console.warn("[AI] Text improvement unavailable", error);
    return text;
  }
}
