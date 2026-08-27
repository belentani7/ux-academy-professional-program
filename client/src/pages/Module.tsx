import { EmptyNotice, PageHeading, ProgressMeter, Tag } from "@/components/AcademyUI";
import { useLocale } from "@/contexts/LocaleContext";
import { text } from "@/lib/i18n";
import { trpc } from "@/lib/trpc";
import { courseModules } from "@shared/courseContent";
import { ArrowRight, BookOpenCheck, ClipboardList, FlaskConical, FolderKanban, GraduationCap } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function Module() {
  const [, params] = useRoute("/module/:moduleId");
  const { locale } = useLocale();
  const dashboard = trpc.learning.dashboard.useQuery();
  const module = courseModules.find(item => item.id === params?.moduleId);
  const label = (es: string, pt: string, en: string) => locale === "es" ? es : locale === "pt" ? pt : en;

  if (!module) return <EmptyNotice title="Module not found" detail="Return to the program to select a published module." />;

  const progress = dashboard.data?.moduleProgress.find(item => item.moduleId === module.id);
  const completed = new Set(dashboard.data?.completedLessonIds ?? []);
  const projectForModule = module.order <= 5 ? "pulse" : module.order <= 10 ? "civic-desk" : module.order <= 12 ? "field-notes" : module.order <= 14 ? "product-challenge" : "capstone";

  return <>
    <PageHeading
      eyebrow={`${String(module.order).padStart(2, "0")} · ${text(module.level, locale)}`}
      title={text(module.title, locale)}
      description={text(module.summary, locale)}
      action={<Tag tone="forest">{progress?.completed ?? 0} / {module.lessons.length} {label("lecciones", "lições", "lessons")}</Tag>}
    />
    <section className="rounded-3xl bg-[#1d382d] p-6 text-white sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#c7d5c5]">{label("Caso de estudio", "Estudo de caso", "Case study")}</p>
          <p className="mt-3 max-w-3xl font-serif text-2xl leading-snug">{text(module.caseStudy, locale)}</p>
          <div className="mt-6 flex flex-wrap gap-2">{module.competencies.map(item => <Tag key={item[locale]} tone="copper">{text(item, locale)}</Tag>)}</div>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[.13em] text-[#c7d5c5]">{label("Progreso", "Progresso", "Progress")}</p>
          <p className="mt-2 font-serif text-4xl">{progress?.percentage ?? 0}%</p>
          <div className="mt-5"><ProgressMeter value={progress?.percentage ?? 0} /></div>
        </div>
      </div>
    </section>
    <section className="mt-8 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
      <div className="rounded-3xl border border-[#dfd8ce] bg-[#fffdf9] p-6">
        <div className="flex items-center gap-2"><BookOpenCheck size={19} className="text-[#96724d]"/><h2 className="font-serif text-3xl">{label("Lecciones", "Lições", "Lessons")}</h2></div>
        <div className="mt-5 divide-y divide-[#e7e0d6]">
          {module.lessons.map((lesson, index) => {
            const isCompleted = completed.has(lesson.id);
            return <Link key={lesson.id} href={`/learn/${module.id}/${lesson.id}`} className="group flex items-center gap-4 py-4">
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[10px] ${isCompleted ? "bg-[#2f6048] text-white" : "bg-[#eee8df] text-[#796044]"}`}>{isCompleted ? "✓" : index + 1}</span>
              <div className="min-w-0 flex-1"><p className="font-medium text-[#2d3a31]">{text(lesson.title, locale)}</p><p className="mt-1 line-clamp-1 text-xs text-[#667066]">{text(lesson.objectives, locale)}</p></div>
              <span className="text-xs text-[#768075]">{lesson.duration} {label("min", "min", "min")}</span><ArrowRight size={16} className="text-[#7b847b] transition group-hover:translate-x-1"/>
            </Link>;
          })}
        </div>
      </div>
      <div className="space-y-5">
        <article className="rounded-3xl border border-[#dfd8ce] bg-[#fffdf9] p-6"><FlaskConical className="text-[#96724d]" size={20}/><h2 className="mt-4 font-serif text-2xl">Practice Lab</h2><p className="mt-2 text-sm leading-6 text-[#657064]">{text(module.guidedPractice, locale)}</p><p className="mt-3 font-mono text-[11px] font-medium uppercase tracking-[.08em] text-[#8c6943]">{dashboard.data?.practiceByModule[module.id] ?? 0} {label("intentos guardados", "tentativas salvas", "saved attempts")}</p><Link href="/lab" className="mt-5 inline-flex text-sm font-bold text-[#2f6048]">{label("Abrir caso", "Abrir caso", "Open case")} <ArrowRight className="ml-2" size={15}/></Link></article>
        <article className="rounded-3xl bg-[#ece6dc] p-6"><FolderKanban className="text-[#96724d]" size={20}/><h2 className="mt-4 font-serif text-2xl">{label("Proyecto aplicado", "Projeto aplicado", "Applied project")}</h2><p className="mt-2 text-sm leading-6 text-[#657064]">{text(module.miniProject, locale)}</p><Link href="/projects" className="mt-5 inline-flex text-sm font-bold text-[#2f6048]">{label("Gestionar entrega", "Gerenciar entrega", "Manage submission")} <ArrowRight className="ml-2" size={15}/></Link></article>
        <article className="rounded-3xl border border-[#dfd8ce] bg-[#fffdf9] p-6"><GraduationCap className="text-[#96724d]" size={20}/><h2 className="mt-4 font-serif text-2xl">{label("Criterios", "Critérios", "Criteria")}</h2><div className="mt-4 flex flex-wrap gap-2">{module.rubricFocus.map(item => <Tag key={item[locale]}>{text(item, locale)}</Tag>)}</div><p className="mt-4 text-xs text-[#667066]">{label("Proyecto asociado: ", "Projeto associado: ", "Associated project: ")}{projectForModule}</p></article>
      </div>
    </section>
    <section className="mt-8 rounded-3xl border border-[#dfd8ce] bg-[#fffdf9] p-6">
      <div className="flex items-center gap-2"><ClipboardList size={19} className="text-[#96724d]"/><h2 className="font-serif text-3xl">{label("Glosario del módulo", "Glossário do módulo", "Module glossary")}</h2></div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">{module.glossary.map(item => <article key={item.term} className="rounded-xl bg-[#f3eee6] p-4"><p className="font-mono text-xs font-bold text-[#815e3a]">{item.term}</p><p className="mt-2 text-sm leading-6 text-[#556057]">{text(item.definition, locale)}</p></article>)}</div>
    </section>
  </>;
}
