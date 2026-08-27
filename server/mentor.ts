import { practiceCases } from "../shared/assessmentContent";
import { invokeLLM } from "./_core/llm";

type FeedbackPhase = "review" | "hint" | "approach";

const fallback = (phase: FeedbackPhase, locale: "es" | "pt" | "en", caseId: string) => {
  const practiceCase = practiceCases.find(item => item.id === caseId) ?? practiceCases[0];
  if (phase === "hint") return practiceCase.firstHint[locale];
  if (phase === "approach") return practiceCase.possibleApproach[locale];
  return locale === "es"
    ? "Tu intento ya hace visible una línea de razonamiento. Revisa si distingues claramente entre el síntoma observado, las hipótesis que aún requieren evidencia y el primer método proporcional para reducir incertidumbre. Busca nombrar qué decisión cambiaría cada señal."
    : locale === "pt"
      ? "Sua tentativa já torna uma linha de raciocínio visível. Revise se você distingue claramente o sintoma observado, as hipóteses que ainda exigem evidências e o primeiro método proporcional para reduzir incerteza. Procure nomear qual decisão cada sinal mudaria."
      : "Your attempt already makes a line of reasoning visible. Check whether you clearly distinguish the observed symptom, hypotheses that still need evidence, and the first proportional method to reduce uncertainty. Name which decision each signal would change.";
};

export function parseMentorFeedback(content: unknown, fallbackContent: string) {
  if (!content || typeof content !== "string") return fallbackContent;
  try {
    const parsed = JSON.parse(content) as { feedback?: unknown };
    return typeof parsed.feedback === "string" && parsed.feedback.trim() ? parsed.feedback.trim() : fallbackContent;
  } catch {
    return fallbackContent;
  }
}

export async function generateFormativeFeedback(input: { caseId: string; response: string; locale: "es" | "pt" | "en"; phase: FeedbackPhase }) {
  const practiceCase = practiceCases.find(item => item.id === input.caseId);
  if (!practiceCase) throw new Error("Practice case not found");
  const language = input.locale === "es" ? "Spanish" : input.locale === "pt" ? "Brazilian Portuguese" : "English";
  const phaseGuidance = input.phase === "review"
    ? "Give formative review only. Identify up to two strengths and two improvement opportunities grounded in the learner's response. Ask one reflective question. Do NOT reveal a step-by-step solution, a hint, or a proposed approach."
    : input.phase === "hint"
      ? "Give one concise, non-solution hint that helps the learner deepen their existing response. Do NOT give a full approach, ordered answer, or model solution."
      : "Offer one possible approach as a clearly labeled non-model example. Explain its reasoning, preserve uncertainty, and say that other defensible approaches exist. Do not claim a single correct answer.";
  try {
    const response = await invokeLLM({
      model: "gpt-5-mini",
      maxTokens: 700,
      messages: [
        { role: "system", content: `You are a rigorous UX/Product Design learning mentor. Respond only in ${language}. The learner has already attempted the task. Be constructive, precise, and respectful. Do not score, certify, fabricate sources, or infer personal facts. Do not request, reproduce, or expose personal, confidential, or participant-identifying data. ${phaseGuidance}` },
        { role: "user", content: `Practice case: ${practiceCase.title[input.locale]}\nPrompt: ${practiceCase.prompt[input.locale]}\nSuccess signals: ${practiceCase.successSignals.map(item => item[input.locale]).join("; ")}\n\nLearner response:\n${input.response}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "formative_feedback",
          strict: true,
          schema: {
            type: "object",
            properties: { feedback: { type: "string" } },
            required: ["feedback"],
            additionalProperties: false,
          },
        },
      },
    });
    const fallbackContent = fallback(input.phase, input.locale, input.caseId);
    return parseMentorFeedback(response.choices[0]?.message?.content, fallbackContent);
  } catch (error) {
    console.warn("[Mentor] Falling back to editorial guidance", error);
    return fallback(input.phase, input.locale, input.caseId);
  }
}
