import { text } from "@/lib/i18n";
import type { Localized } from "@shared/courseContent";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#96724d]">{eyebrow || "UX Academy"}</p><h1 className="font-serif text-4xl leading-[0.98] tracking-[-0.04em] text-[#1d2822] sm:text-5xl">{title}</h1>{description && <p className="mt-3 max-w-2xl text-sm leading-6 text-[#60685f] sm:text-base">{description}</p>}</div>{action}</header>;
}

export function ProgressMeter({ value, label, compact = false }: { value: number; label?: string; compact?: boolean }) {
  return <div><div className="mb-2 flex justify-between gap-4 text-xs font-medium text-[#667066]"><span>{label}</span><span>{value}%</span></div><div className={`overflow-hidden rounded-full bg-[#e5dfd5] ${compact ? "h-1.5" : "h-2"}`}><div className="h-full rounded-full bg-[#1d624d] transition-[width] duration-300" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div></div>;
}

export function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "forest" | "copper" | "success" }) {
  const tones = { neutral: "bg-[#ebe6de] text-[#596158]", forest: "bg-[#dce9df] text-[#2f6048]", copper: "bg-[#f2e1cb] text-[#855d36]", success: "bg-[#d9eddd] text-[#286043]" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[tone]}`}>{children}</span>;
}

export function ModuleCard({ module, locale, progress = 0, score }: { module: { id: string; order: number; level: Localized; title: Localized; summary: Localized; lessons: unknown[] }; locale: "es" | "pt" | "en"; progress?: number; score?: number }) {
  return <Link href={`/module/${module.id}`} className="group block rounded-2xl border border-[#e2dcd3] bg-[#fffdf9] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#bb8c5a] hover:shadow-[0_12px_30px_-20px_rgba(32,41,35,0.35)]"><div className="flex items-start justify-between gap-3"><span className="font-mono text-[11px] font-medium text-[#96724d]">{String(module.order).padStart(2, "0")}</span><ArrowUpRight size={16} className="text-[#7d867c] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#1d382d]" /></div><p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#6e766d]">{text(module.level, locale)}</p><h2 className="mt-1 font-serif text-2xl leading-tight text-[#243027]">{text(module.title, locale)}</h2><p className="mt-3 min-h-12 text-sm leading-5 text-[#687066]">{text(module.summary, locale)}</p><div className="mt-5 flex items-center justify-between"><span className="text-xs text-[#6a7369]">{module.lessons.length} {locale === "es" ? "lecciones" : locale === "pt" ? "lições" : "lessons"}</span>{score !== undefined && <Tag tone="copper">{score}/100</Tag>}</div><div className="mt-4"><ProgressMeter value={progress} compact /></div></Link>;
}

export function EmptyNotice({ title, detail }: { title: string; detail: string }) {
  return <div className="rounded-2xl border border-dashed border-[#d6cec3] bg-[#fffdf9]/70 p-8 text-center"><p className="font-serif text-2xl text-[#2c382f]">{title}</p><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#697168]">{detail}</p></div>;
}
