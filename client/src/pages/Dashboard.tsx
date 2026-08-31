import { EmptyNotice, ModuleCard, PageHeading, ProgressMeter, Tag } from "@/components/AcademyUI";
import { useLocale } from "@/contexts/LocaleContext";
import { text, ui } from "@/lib/i18n";
import { courseModules } from "@shared/courseContent";
import { useStaticData } from "@/lib/staticData";
import { ArrowUpRight, Award, BookOpen, Check, Clock3, Target } from "lucide-react";
import { Link } from "wouter";
import { useMemo } from "react";

export default function Dashboard() {
  const { locale } = useLocale();
  const copy = ui[locale];
  const { getDashboardData } = useStaticData();
  const dashboard = useMemo(() => getDashboardData(), [getDashboardData]);
  
  const data = dashboard;
  if (!data) {
    return (
      <section aria-labelledby="guest-space-title" className="rounded-3xl border border-[#dce4f1] bg-white p-7 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#3155a7]">
          {locale === "es" ? "Aula abierta" : locale === "pt" ? "Sala aberta" : "Open classroom"}
        </p>
        <h1 id="guest-space-title" className="mt-3 font-serif text-3xl text-[#1b2445]">
          {locale === "es" ? "Empieza el curso sin registro." : locale === "pt" ? "Comece o curso sem cadastro." : "Start the course without signing up."}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#586684]">
          {locale === "es"
            ? "El contenido curricular y la pr\u00e1ctica siguen disponibles. Cuando el almacenamiento remoto est\u00e9 conectado, tu identidad an\u00f3nima conservar\u00e1 el progreso mediante una cookie segura."
            : locale === "pt"
            ? "O conte\u00fado curricular e a pr\u00e1tica continuam dispon\u00edveis. Quando o armazenamento remoto estiver conectado, sua identidade an\u00f4nima conservar\u00e1 o progresso por meio de um cookie seguro."
            : "Curriculum content and practice remain available. When remote storage is connected, your anonymous identity will keep progress through a secure cookie."}
        </p>
        <Link href="/catalog" className="mt-6 inline-flex items-center rounded-xl bg-[#1d45a5] px-4 py-3 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd264]">
          {locale === "es" ? "Abrir programa" : locale === "pt" ? "Abrir programa" : "Open curriculum"}
        </Link>
      </section>
    );
  }

  const next = courseModules.flatMap(module => module.lessons.map(lesson => ({ module, lesson }))).find(item => item.lesson.id === data.nextLessonId) || { module: courseModules[0], lesson: courseModules[0].lessons[0] };
  const moduleProgress = (id: string) => data.moduleProgress.find(item => item.moduleId === id)?.percentage ?? 0;

  return (
    <>
      <PageHeading
        eyebrow={locale === "es" ? "Tu estudio" : locale === "pt" ? "Seu estudo" : "Your study"}
        title={locale === "es" ? "Buenas decisiones requieren pr\u00e1ctica." : locale === "pt" ? "Boas decis\u00f5es exigem pr\u00e1tica." : "Good decisions require practice."}
        description={locale === "es" ? "Tu progreso permanece vinculado a las competencias, no solo a las pantallas completadas." : locale === "pt" ? "Seu progresso permanece ligado a compet\u00eancias, n\u00e3o apenas a telas conclu\u00eddas." : "Your progress stays connected to competencies, not merely completed screens."}
      />
      <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-3xl bg-[#1d382d] p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#cbd9c9]">{copy.next}</p>
          <h2 className="mt-3 font-serif text-3xl">{text(next.lesson.title, locale)}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#cbd9c9]">{text(next.lesson.objectives, locale)}</p>
          <Link href={`/learn/${next.module.id}/${next.lesson.id}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#e9c79f] px-5 py-2.5 text-sm font-semibold text-[#1d2822]">
            {copy.continue}
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="rounded-3xl border border-[#e0d9cf] bg-[#fffdf9] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#70776e]">{locale === "es" ? "Programa" : locale === "pt" ? "Programa" : "Program"}</p>
              <p className="mt-1 font-serif text-4xl">{data.programProgress}%</p>
            </div>
            <Target className="text-[#c78f54]" />
          </div>
          <div className="mt-5"><ProgressMeter value={data.programProgress} /></div>
          <p className="mt-3 text-xs text-[#6d756b]">{data.completedLessons} {copy.of} {data.totalLessons} {copy.lessons}</p>
        </div>
      </section>
      <section className="mt-5 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-[#e0d9cf] bg-[#fffdf9] p-5">
          <Clock3 size={18} className="text-[#96724d]" />
          <p className="mt-5 font-semibold text-[#27345a]">{copy.timeSpent}</p>
          <p className="mt-1 text-sm text-[#6d756b]">{data.totalMinutes}h {data.totalMinutes % 60}m</p>
        </article>
        <article className="rounded-2xl border border-[#e0d9cf] bg-[#fffdf9] p-5">
          <BookOpen size={18} className="text-[#96724d]" />
          <p className="mt-5 font-semibold text-[#27345a]">{copy.lessonsDone}</p>
          <p className="mt-1 text-sm text-[#6d756b]">{data.completedLessons}</p>
        </article>
        <article className="rounded-2xl border border-[#e0d9cf] bg-[#fffdf9] p-5">
          <Award size={18} className="text-[#96724d]" />
          <p className="mt-5 font-semibold text-[#27345a]">{copy.certificates}</p>
          <p className="mt-1 text-sm text-[#6d756b]">{data.certificatesEarned}</p>
        </article>
      </section>
      <section className="mt-5">
        <PageHeading
          eyebrow={copy.modules}
          title={copy.myProgress}
          description={copy.progressDesc}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courseModules.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              locale={locale}
              progress={moduleProgress(module.id)}
              score={dashboard.latestQuizByModule[module.id]}
            />
          ))}
        </div>
      </section>
    </>
  );
}