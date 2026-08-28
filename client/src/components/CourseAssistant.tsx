import { trpc } from "@/lib/trpc";
import { useLocale } from "@/contexts/LocaleContext";
import { Loader2, MessageCircle, Mic, Send, Sparkles, Square, Volume2, WandSparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type SpeechRecognitionResultLike = {
  [index: number]: { [index: number]: { transcript: string } };
  length: number;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { results: SpeechRecognitionResultLike }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type WindowWithSpeech = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export default function CourseAssistant() {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [writingDraft, setWritingDraft] = useState("");
  const [answer, setAnswer] = useState("");
  const [rewrittenText, setRewrittenText] = useState("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const askMutation = trpc.ai.ask.useMutation();
  const rewriteMutation = trpc.ai.rewrite.useMutation();

  const copy = useMemo(() => {
    if (locale === "pt") {
      return {
        button: "Mentor IA",
        title: "Mentor de estúdio",
        intro: "Pergunte sobre qualquer método, decisão ou entrega do percurso.",
        placeholder: "O que queres compreender ou decidir?",
        ask: "Perguntar",
        listening: "A ouvir… fala agora",
        mic: "Ditado por voz",
        read: "Ler em voz alta",
        stop: "Parar voz",
        readPage: "Ler esta página",
        writing: "Laboratório de escrita",
        writingPlaceholder: "Cole uma nota, hipótese ou texto de portfólio…",
        rewrite: "Melhorar texto",
        use: "Usar versão",
        empty: "Escreve uma pergunta para começar.",
        unsupported: "O ditado não está disponível neste navegador.",
        ready: "Pronto para praticar",
      };
    }
    if (locale === "en") {
      return {
        button: "AI mentor",
        title: "Studio mentor",
        intro: "Ask about any method, decision, or deliverable in the learning path.",
        placeholder: "What do you want to understand or decide?",
        ask: "Ask",
        listening: "Listening… speak now",
        mic: "Voice dictation",
        read: "Read aloud",
        stop: "Stop voice",
        readPage: "Read this page",
        writing: "Writing lab",
        writingPlaceholder: "Paste a note, hypothesis, or portfolio text…",
        rewrite: "Improve text",
        use: "Use version",
        empty: "Write a question to begin.",
        unsupported: "Voice dictation is not available in this browser.",
        ready: "Ready to practice",
      };
    }
    return {
      button: "Mentor IA",
      title: "Mentor de estudio",
      intro: "Pregunta sobre cualquier método, decisión o entrega del recorrido.",
      placeholder: "¿Qué quieres comprender o decidir?",
      ask: "Preguntar",
      listening: "Escuchando… habla ahora",
      mic: "Dictado por voz",
      read: "Leer en voz alta",
      stop: "Detener voz",
      readPage: "Leer esta página",
      writing: "Laboratorio de escritura",
      writingPlaceholder: "Pega una nota, hipótesis o texto de portfolio…",
      rewrite: "Mejorar texto",
      use: "Usar versión",
      empty: "Escribe una pregunta para comenzar.",
      unsupported: "El dictado no está disponible en este navegador.",
      ready: "Listo para practicar",
    };
  }, [locale]);

  useEffect(() => () => {
    recognitionRef.current?.stop();
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, []);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !text.trim() || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale === "es" ? "es-ES" : locale === "pt" ? "pt-BR" : "en-US";
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startDictation = () => {
    if (typeof window === "undefined") return;
    const speechWindow = window as WindowWithSpeech;
    const Constructor = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Constructor) {
      setVoiceNotice(copy.unsupported);
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new Constructor();
    recognition.lang = locale === "es" ? "es-ES" : locale === "pt" ? "pt-BR" : "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = event => {
      const transcript = Array.from({ length: event.results.length }, (_, index) => event.results[index]?.[0]?.transcript ?? "").join(" ");
      setQuestion(previous => `${previous}${previous ? " " : ""}${transcript}`.trim());
    };
    recognition.onerror = () => {
      setListening(false);
      setVoiceNotice(copy.unsupported);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setVoiceNotice("");
    setListening(true);
    recognition.start();
  };

  const ask = () => {
    const value = question.trim();
    if (!value || askMutation.isPending) return;
    setAnswer("");
    askMutation.mutate({ question: value, locale, page: typeof window === "undefined" ? "/" : window.location.pathname }, {
      onSuccess: result => setAnswer(result),
      onError: error => setAnswer(error.message || copy.empty),
    });
  };

  const improveWriting = () => {
    const value = writingDraft.trim();
    if (!value || rewriteMutation.isPending) return;
    setRewrittenText("");
    rewriteMutation.mutate({ text: value, locale, purpose: "UX/Product Design portfolio or learning evidence" }, {
      onSuccess: result => setRewrittenText(result),
      onError: error => setRewrittenText(error.message || copy.empty),
    });
  };

  const readCurrentPage = () => {
    if (typeof document === "undefined") return;
    const content = document.querySelector("main")?.textContent?.replace(/\s+/g, " ").trim();
    if (content) speak(content.slice(0, 6000));
  };

  return <>
    <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label={copy.button} className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#1d45a5] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-10px_rgba(29,69,165,.75)] transition hover:-translate-y-0.5 hover:bg-[#173b90] active:scale-[.97]">
      <Sparkles size={16} />{copy.button}
    </button>
    {open && <aside aria-label={copy.title} className="fixed bottom-[4.8rem] right-5 z-50 flex max-h-[min(720px,calc(100vh-6.5rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.5rem] border border-[#cdd8f0] bg-[#fbfaf7] text-[#1b2445] shadow-[0_24px_70px_-18px_rgba(22,35,74,.45)]">
      <header className="flex items-start justify-between gap-3 bg-[#1d45a5] px-5 py-4 text-white">
        <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#cbd8ff]"><Sparkles size={14}/>{copy.ready}</p><h2 className="mt-1 font-serif text-2xl">{copy.title}</h2><p className="mt-1 text-xs leading-5 text-[#dce5ff]">{copy.intro}</p></div>
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-[#dce5ff] hover:bg-white/10" aria-label="Close"><X size={18}/></button>
      </header>
      <div className="space-y-4 overflow-y-auto p-4">
        {answer && <section className="rounded-2xl border border-[#d8e1f4] bg-white p-4"><p className="whitespace-pre-wrap text-sm leading-6 text-[#3e4b70]">{answer}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => speaking ? (window.speechSynthesis?.cancel(), setSpeaking(false)) : speak(answer)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#edf2ff] px-2.5 py-1.5 text-xs font-bold text-[#3155a7]">{speaking ? <Square size={13}/> : <Volume2 size={13}/>} {speaking ? copy.stop : copy.read}</button></div></section>}
        <div className="relative"><textarea value={question} onChange={event => setQuestion(event.target.value)} onKeyDown={event => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") ask(); }} placeholder={copy.placeholder} rows={3} className="w-full resize-none rounded-2xl border border-[#d5deef] bg-white px-3.5 py-3 pr-11 text-sm leading-6 outline-none transition focus:border-[#4b70c8] focus:ring-2 focus:ring-[#dfe7fb]"/><button type="button" onClick={startDictation} aria-label={copy.mic} className={`absolute bottom-3 right-3 rounded-lg p-1.5 ${listening ? "bg-[#ffd264] text-[#1d45a5]" : "text-[#68779c] hover:bg-[#edf2ff] hover:text-[#3155a7]"}`}><Mic size={16}/></button></div>
        {voiceNotice && <p className="text-xs text-[#9b4b36]">{voiceNotice}</p>}
        {listening && <p className="text-xs font-semibold text-[#3155a7]">{copy.listening}</p>}
        <div className="flex flex-wrap gap-2"><button type="button" onClick={ask} disabled={!question.trim() || askMutation.isPending} className="inline-flex items-center gap-2 rounded-xl bg-[#1d45a5] px-3.5 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{askMutation.isPending ? <Loader2 size={14} className="animate-spin"/> : <Send size={14}/>} {copy.ask}</button><button type="button" onClick={readCurrentPage} className="inline-flex items-center gap-1.5 rounded-xl border border-[#d5deef] bg-white px-3.5 py-2.5 text-xs font-bold text-[#3155a7]"><Volume2 size={14}/>{copy.readPage}</button></div>
        <section className="border-t border-[#e1e5ef] pt-4"><p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.13em] text-[#69779a]"><WandSparkles size={14}/>{copy.writing}</p><textarea value={writingDraft} onChange={event => setWritingDraft(event.target.value)} placeholder={copy.writingPlaceholder} rows={4} className="w-full resize-none rounded-2xl border border-[#d5deef] bg-white px-3.5 py-3 text-sm leading-6 outline-none transition focus:border-[#4b70c8] focus:ring-2 focus:ring-[#dfe7fb]"/><button type="button" onClick={improveWriting} disabled={!writingDraft.trim() || rewriteMutation.isPending} className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#f4b7df] px-3.5 py-2.5 text-xs font-bold text-[#58224d] disabled:cursor-not-allowed disabled:opacity-50">{rewriteMutation.isPending ? <Loader2 size={14} className="animate-spin"/> : <WandSparkles size={14}/>} {copy.rewrite}</button>{rewrittenText && <div className="mt-3 rounded-2xl border border-[#f0c4e1] bg-[#fff7fc] p-3"><p className="whitespace-pre-wrap text-sm leading-6 text-[#5b3157]">{rewrittenText}</p><button type="button" onClick={() => setWritingDraft(rewrittenText)} className="mt-2 text-xs font-bold text-[#8d3d7b] underline underline-offset-2">{copy.use}</button></div>}</section>
      </div>
    </aside>}
  </>;
}
