import { text } from "@/lib/i18n";
import type { Localized } from "@shared/courseContent";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <header className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 inline-flex rounded-full bg-[#e7efff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#3155a7]">{eyebrow || "UX Academy"}</p><h1 className="font-serif text-4xl leading-[0.98] tracking-[-0.04em] text-[#1b2445] sm:text-5xl">{title}</h1>{description && <p className="mt-3 max-w-2xl text-sm leading-6 text-[#566481] sm:text-base">{description}</p>}</div>{action}</header>;
}

export function ProgressMeter({ value, label, compact = false }: { value: number; label?: string; compact?: boolean }) {
  return <div><div className="mb-2 flex justify-between gap-4 text-xs font-medium text-[#5e6c8c]"><span>{label}</span><span>{value}%</span></div><div className={`overflow-hidden rounded-full bg-[#e3e9f5] ${compact ? "h-1.5" : "h-2"}`}><div className="h-full rounded-full bg-[#1d45a5] transition-[width] duration-300" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div></div>;
}

export function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "forest" | "copper" | "success" }) {
  const tones = { neutral: "bg-[#edf0f7] text-[#55647f]", forest: "bg-[#dff5e7] text-[#17633b]", copper: "bg-[#fff0cf] text-[#91450f]", success: "bg-[#dcf5eb] text-[#08764e]" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[tone]}`}>{children}</span>;
}

export function ModuleCard({ module, locale, progress = 0, score }: { module: { id: string; order: number; level: Localized; title: Localized; summary: Localized; lessons: unknown[] }; locale: "es" | "pt" | "en"; progress?: number; score?: number }) {
  return <Link href={`/module/${module.id}`} className="group block rounded-[1.4rem] border border-[#dce3ef] bg-white p-5 shadow-[0_8px_24px_-22px_rgba(28,47,109,.7)] transition duration-200 hover:-translate-y-1 hover:border-[#7290d8] hover:shadow-[0_18px_35px_-23px_rgba(28,47,109,.7)]"><div className="flex items-start justify-between gap-3"><span className="font-mono text-[11px] font-medium text-[#3155a7]">{String(module.order).padStart(2, "0")}</span><ArrowUpRight size={16} className="text-[#75819a] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#1d45a5]" /></div><p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#687695]">{text(module.level, locale)}</p><h2 className="mt-1 font-serif text-2xl leading-tight text-[#1b2445]">{text(module.title, locale)}</h2><p className="mt-3 min-h-12 text-sm leading-5 text-[#63708b]">{text(module.summary, locale)}</p><div className="mt-5 flex items-center justify-between"><span className="text-xs text-[#687695]">{module.lessons.length} {locale === "es" ? "lecciones" : locale === "pt" ? "lições" : "lessons"}</span>{score !== undefined && <Tag tone="copper">{score}/100</Tag>}</div><div className="mt-4"><ProgressMeter value={progress} compact /></div></Link>;
}

export function EmptyNotice({ title, detail }: { title: string; detail: string }) {
  return <div className="rounded-[1.5rem] border border-dashed border-[#bdcbe6] bg-[#f8faff] p-8 text-center"><p className="font-serif text-2xl text-[#1b2445]">{title}</p><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#63708b]">{detail}</p></div>;
}
