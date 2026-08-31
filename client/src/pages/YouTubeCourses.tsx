import { PageHeading, Tag } from "@/components/AcademyUI";
import { useLocale } from "@/contexts/LocaleContext";
import { text } from "@/lib/i18n";
import { youtubeCourses, youtubeChannels, type YouTubeCourse, type YouTubeChannel } from "@shared/youtubeCourses";
import { ArrowUpRight, CheckCircle2, ExternalLink, ShieldCheck, PlayCircle, Users, Clock, Star } from "lucide-react";
import { useMemo, useState } from "react";

const copy = {
  es: {
    eyebrow: "Cursos de YouTube oficiales",
    title: "Aprende con los canales oficiales de Google",
    description: "Curamos las mejores listas de reproducción de los canales oficiales de Google en YouTube. Organizados por tema, nivel y canal para que elijas tu ruta.",
    tracks: "cursos",
    channels: "canales",
    lessons: "lecciones",
    all: "Todos",
    level: "Nivel",
    duration: "Duración",
    lessonsLabel: "lecciones",
    byChannel: "Por canal",
    byTopic: "Por tema",
    outcome: "Qué aprenderás",
    studio: "Proyecto sugerido",
    deliverable: "Entregable",
    guardrail: "Límite de práctica",
    resources: "Recursos y enlaces",
    open: "Abierto / gratis",
    linked: "Enlace público",
    attribution: "Uso y atribución",
    official: "Oficial",
    community: "Comunidad",
  },
  pt: {
    eyebrow: "Cursos oficiais do YouTube",
    title: "Aprenda com os canais oficiais do Google",
    description: "Curamos as melhores playlists dos canais oficiais do Google no YouTube. Organizadas por tema, nível e canal para que você escolha sua trilha.",
    tracks: "cursos",
    channels: "canais",
    lessons: "aulas",
    all: "Todos",
    level: "Nível",
    duration: "Duração",
    lessonsLabel: "aulas",
    byChannel: "Por canal",
    byTopic: "Por tema",
    outcome: "O que você aprenderá",
    studio: "Projeto sugerido",
    deliverable: "Entregável",
    guardrail: "Limite de prática",
    resources: "Recursos e links",
    open: "Aberto / grátis",
    linked: "Link público",
    attribution: "Uso e atribuição",
    official: "Oficial",
    community: "Comunidade",
  },
  en: {
    eyebrow: "Official YouTube Courses",
    title: "Learn from Google's official channels",
    description: "We've curated the best playlists from Google's official YouTube channels. Organized by topic, level, and channel so you can choose your path.",
    tracks: "courses",
    channels: "channels",
    lessons: "lessons",
    all: "All",
    level: "Level",
    duration: "Duration",
    lessonsLabel: "lessons",
    byChannel: "By channel",
    byTopic: "By topic",
    outcome: "What you'll learn",
    studio: "Suggested project",
    deliverable: "Deliverable",
    guardrail: "Practice boundary",
    resources: "Resources & links",
    open: "Open / free",
    linked: "Public link",
    attribution: "Use and attribution",
    official: "Official",
    community: "Community",
  }
} as const;

export default function YouTubeCourses() {
  const { locale } = useLocale();
  const ui = copy[locale];
  const [viewMode, setViewMode] = useState<"courses" | "channels">("courses");
  const [filter, setFilter] = useState("all");
  const [activeCourseId, setActiveCourseId] = useState(youtubeCourses[0].id);

  const channels = useMemo(() => Array.from(new Set(youtubeCourses.map(c => c.channel))), []);
  const topics = useMemo(() => Array.from(new Set(youtubeCourses.flatMap(c => c.topics.map(t => text(t, locale))))), [locale]);
  const levels = useMemo(() => Array.from(new Set(youtubeCourses.map(c => text(c.level, locale)))), [locale]);

  const visibleCourses = youtubeCourses.filter(course => {
    if (filter === "all") return true;
    if (channels.includes(filter)) return course.channel === filter;
    if (topics.includes(filter)) return course.topics.some(t => text(t, locale) === filter);
    if (levels.includes(filter)) return text(course.level, locale) === filter;
    return true;
  });

  const activeCourse = youtubeCourses.find(c => c.id === activeCourseId) ?? visibleCourses[0] ?? youtubeCourses[0];
  const activeChannel = youtubeChannels.find(c => c.id === activeCourse.channel.toLowerCase().replace(/\s+/g, "-"));

  const totalLessons = youtubeCourses.reduce((sum, c) => sum + c.lessonsCount, 0);

  return (
    <>
      <PageHeading eyebrow={ui.eyebrow} title={ui.title} description={ui.description} />
      
      <section className="mb-8 grid gap-3 sm:grid-cols-4">
        <div className="rounded-[1.5rem] bg-[#1d45a5] p-5 text-white shadow-[5px_5px_0_#ffd264]">
          <p className="font-serif text-3xl">{youtubeCourses.length}</p>
          <p className="mt-1 text-sm text-[#cfdbff]">{ui.tracks}</p>
        </div>
        <div className="rounded-[1.5rem] border border-[#d9e2f2] bg-[#e7f7e4] p-5">
          <p className="font-serif text-3xl text-[#184d31]">{youtubeChannels.length}</p>
          <p className="mt-1 text-sm text-[#4f705b]">{ui.channels}</p>
        </div>
        <div className="rounded-[1.5rem] border border-[#d9e2f2] bg-[#fff0cf] p-5">
          <p className="font-serif text-3xl text-[#793d0d]">{totalLessons}+</p>
          <p className="mt-1 text-sm text-[#7a5a37]">{ui.lessons}</p>
        </div>
        <div className="rounded-[1.5rem] border border-[#d9e2f2] bg-[#fef3e2] p-5">
          <p className="font-serif text-3xl text-[#c78f54]">{youtubeCourses.filter(c => c.isOfficial).length}</p>
          <p className="mt-1 text-sm text-[#a87243]">{ui.official}</p>
        </div>
      </section>

      <section className="mb-7 rounded-[1.5rem] border border-[#d8e2f8] bg-[#edf3ff] p-4 text-sm leading-6 text-[#526381]">
        <div className="flex items-center gap-2 font-bold text-[#1d45a5]">
          <ShieldCheck size={17} /> {ui.attribution}
        </div>
        <p className="mt-2">
          {locale === "es" 
            ? "Contenido curado de canales oficiales de Google en YouTube. Google, YouTube y sus logotipos son marcas registradas de Google LLC. Esta página no está afiliada, patrocinada ni certificada por Google."
            : locale === "pt"
            ? "Conteúdo curado de canais oficiais do Google no YouTube. Google, YouTube e seus logotipos são marcas registradas da Google LLC. Esta página não é afiliada, patrocinada nem certificada pelo Google."
            : "Curated content from Google's official YouTube channels. Google, YouTube, and their logos are trademarks of Google LLC. This page is not affiliated with, sponsored by, or certified by Google."
          }
        </p>
      </section>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => { setViewMode("courses"); setFilter("all"); }}
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${viewMode === "courses" ? "bg-[#1d45a5] text-white" : "bg-[#eaf0fb] text-[#566785]"}`}
        >
          {ui.byTopic}
        </button>
        <button
          onClick={() => { setViewMode("channels"); setFilter("all"); }}
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${viewMode === "channels" ? "bg-[#1d45a5] text-white" : "bg-[#eaf0fb] text-[#566785]"}`}
        >
          {ui.byChannel}
        </button>
        {viewMode === "courses" && [
          ui.all,
          ...channels,
          ...topics,
          ...levels,
        ].map(item => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${filter === item ? "bg-[#1d45a5] text-white" : "bg-[#eaf0fb] text-[#566785]"}`}
          >
            {item}
          </button>
        ))}
        {viewMode === "channels" && youtubeChannels.map(channel => (
          <button
            key={channel.id}
            onClick={() => setFilter(channel.name)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${filter === channel.name ? "bg-[#1d45a5] text-white" : "bg-[#eaf0fb] text-[#566785]"}`}
          >
            {channel.name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(270px,.8fr)_minmax(0,1.8fr)]">
        <aside className="grid content-start gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {viewMode === "courses" 
            ? visibleCourses.map(course => (
                <button
                  key={course.id}
                  onClick={() => setActiveCourseId(course.id)}
                  className={`rounded-[1.35rem] border p-4 text-left transition ${activeCourse.id === course.id ? "border-[#1d45a5] bg-[#1d45a5] text-white shadow-[5px_5px_0_#ffd264]" : "border-[#dce4f1] bg-white hover:border-[#7494dc]"}`}
                >
                  <p className={`text-[10px] font-bold uppercase tracking-[.16em] ${activeCourse.id === course.id ? "text-[#ffd977]" : "text-[#3155a7]"}`}>
                    {String(course.order).padStart(2, "0")} · {text(course.level, locale)}
                  </p>
                  <h2 className="mt-2 font-serif text-xl leading-tight">{text(course.title, locale)}</h2>
                  <p className={`mt-2 text-xs leading-5 ${activeCourse.id === course.id ? "text-[#cfdbff]" : "text-[#657493]"}`}>
                    {course.channel}
                  </p>
                  <div className="mt-2 flex gap-3 text-[11px] text-[#8a94b1]">
                    <span className="flex items-center gap-1"><Clock size={10} /> {text(course.duration, locale)}</span>
                    <span className="flex items-center gap-1"><PlayCircle size={10} /> {course.lessonsCount} {ui.lessonsLabel}</span>
                  </div>
                </button>
              ))
            : youtubeChannels
                .filter(c => filter === "all" || c.name === filter)
                .map(channel => (
                  <button
                    key={channel.id}
                    onClick={() => setFilter(channel.name)}
                    className={`rounded-[1.35rem] border p-4 text-left transition ${filter === channel.name ? "border-[#1d45a5] bg-[#1d45a5] text-white shadow-[5px_5px_0_#ffd264]" : "border-[#dce4f1] bg-white hover:border-[#7494dc]"}`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={channel.avatar} alt="" className="w-10 h-10 rounded-full" />
                      <div>
                        <h3 className="font-semibold text-[#1b2445]">{channel.name}</h3>
                        <p className="text-xs text-[#657493]">{channel.subscriberCount} {ui.community}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-[#657493]">{text(channel.description, locale)}</p>
                    <div className="mt-3 flex gap-2 text-[11px] text-[#8a94b1]">
                      <span className="flex items-center gap-1"><PlayCircle size={10} /> {channel.playlists.length} {ui.tracks}</span>
                    </div>
                  </button>
                ))
          }
        </aside>

        <article className="rounded-[1.8rem] border border-[#dce4f1] bg-white p-5 shadow-[0_18px_40px_-35px_rgba(23,50,125,.85)] md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Tag tone="forest">{activeCourse.channel}</Tag>
              <h1 className="mt-4 font-serif text-4xl leading-[1.02] text-[#1b2445] md:text-5xl">{text(activeCourse.title, locale)}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#566481] md:text-base">{text(activeCourse.description, locale)}</p>
            </div>
            <span className="rounded-full bg-[#fff0cf] px-3 py-1.5 text-xs font-bold text-[#854613]">{text(activeCourse.level, locale)}</span>
          </div>

          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="flex gap-2 rounded-xl bg-[#edf3ff] p-3 text-sm leading-5 text-[#4d5f82]">
              <Clock size={16} className="mt-0.5 shrink-0 text-[#1d45a5" />
              <span>{ui.duration}: {text(activeCourse.duration, locale)}</span>
            </div>
            <div className="flex gap-2 rounded-xl bg-[#edf3ff] p-3 text-sm leading-5 text-[#4d5f82]">
              <PlayCircle size={16} className="mt-0.5 shrink-0 text-[#1d45a5" />
              <span>{activeCourse.lessonsCount} {ui.lessonsLabel}</span>
            </div>
            <div className="flex gap-2 rounded-xl bg-[#edf3ff] p-3 text-sm leading-5 text-[#4d5f82]">
              <Star size={16} className="mt-0.5 shrink-0 text-[#1d45a5" />
              <span>{activeCourse.isOfficial ? ui.official : ui.community}</span>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="font-serif text-2xl text-[#1b2445]">{ui.outcome}</h2>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {activeCourse.topics.map((topic, index) => (
                <div key={index} className="flex gap-2 rounded-xl bg-[#edf3ff] p-3 text-sm leading-5 text-[#4d5f82]">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#1d45a5]" />
                  {text(topic, locale)}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.4rem] bg-[#1d45a5] p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ffd264]">{ui.studio}</p>
              <p className="mt-3 font-serif text-xl leading-7">
                {locale === "es"
                  ? `Completa el curso y crea un proyecto de portfolio aplicando lo aprendido: ${text(activeCourse.topics[0] ?? activeCourse.title, locale)}.`
                  : locale === "pt"
                  ? `Complete o curso e crie um projeto de portfólio aplicando o aprendido: ${text(activeCourse.topics[0] ?? activeCourse.title, locale)}.`
                  : `Complete the course and create a portfolio project applying what you learned: ${text(activeCourse.topics[0] ?? activeCourse.title, locale)}.`
                }
              </p>
              <div className="mt-5 border-t border-white/15 pt-4">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#bdccf4]">{ui.deliverable}</p>
                <p className="mt-2 text-sm leading-6 text-[#e0e8ff]">
                  {locale === "es"
                    ? "Proyecto de portfolio publicado (GitHub Pages, Behance, o sitio personal) con documentación del proceso."
                    : locale === "pt"
                    ? "Projeto de portfólio publicado (GitHub Pages, Behance, ou site pessoal) com documentação do processo."
                    : "Published portfolio project (GitHub Pages, Behance, or personal site) with process documentation."
                  }
                </p>
              </div>
            </div>
            <div className="rounded-[1.4rem] bg-[#fff0cf] p-5">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#9c5216]">{ui.guardrail}</p>
              <p className="mt-3 text-sm leading-7 text-[#6e573e]">
                {locale === "es"
                  ? "No copies código sin entenderlo. Adapta los conceptos a tu propio contexto y documenta tus decisiones."
                  : locale === "pt"
                    ? "Não copie código sem entendê-lo. Adapte os conceitos ao seu próprio contexto e documente suas decisões."
                    : "Don't copy code without understanding it. Adapt concepts to your own context and document your decisions."
                }
              </p>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="font-serif text-2xl text-[#1b2445]">{ui.resources}</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <a
                href={activeCourse.playlistUrl}
                target="_blank"
                rel="noreferrer"
                className="group rounded-[1.25rem] border border-[#dce4f1] p-4 transition hover:-translate-y-0.5 hover:border-[#7192dc]"
              >
                <div className="flex items-center justify-between gap-2">
                  <Tag tone="forest">{ui.open}</Tag>
                  <ExternalLink size={16} className="text-[#71809d]" />
                </div>
                <h3 className="mt-4 font-semibold text-[#27345a]">{activeCourse.title.en}</h3>
                <p className="mt-2 text-sm leading-6 text-[#657493]">
                  {locale === "es"
                    ? "Playlist completa en YouTube con todas las lecciones en orden."
                    : locale === "pt"
                    ? "Playlist completa no YouTube com todas as aulas em ordem."
                    : "Full YouTube playlist with all lessons in order."
                  }
                </p>
                <p className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#a95d25]">
                  YouTube <ArrowUpRight size={13} />
                </p>
              </a>
              <a
                href={activeCourse.channelUrl}
                target="_blank"
                rel="noreferrer"
                className="group rounded-[1.25rem] border border-[#dce4f1] p-4 transition hover:-translate-y-0.5 hover:border-[#7192dc]"
              >
                <div className="flex items-center justify-between gap-2">
                  <Tag tone="neutral">{ui.linked}</Tag>
                  <ExternalLink size={16} className="text-[#71809d]" />
                </div>
                <h3 className="mt-4 font-semibold text-[#27345a]">{activeCourse.channel}</h3>
                <p className="mt-2 text-sm leading-6 text-[#657493]">
                  {locale === "es"
                    ? "Canal oficial en YouTube para más cursos y actualizaciones."
                    : locale === "pt"
                    ? "Canal oficial no YouTube para mais cursos e atualizações."
                    : "Official YouTube channel for more courses and updates."
                  }
                </p>
                <p className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#a95d25]">
                  YouTube <ArrowUpRight size={13} />
                </p>
              </a>
              {activeCourse.certificateUrl && (
                <a
                  href={activeCourse.certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-[1.25rem] border border-[#dce4f1] p-4 transition hover:-translate-y-0.5 hover:border-[#7192dc]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Tag tone="forest">{ui.linked}</Tag>
                    <ExternalLink size={16} className="text-[#71809d]" />
                  </div>
                  <h3 className="mt-4 font-semibold text-[#27345a]">
                    {locale === "es" ? "Certificado oficial en Coursera" : locale === "pt" ? "Certificado oficial no Coursera" : "Official Certificate on Coursera"}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#657493]">
                    {locale === "es"
                      ? "Versión con certificado verificado, proyectos calificados y acceso a comunidad."
                      : locale === "pt"
                      ? "Versão com certificado verificado, projetos avaliados e acesso à comunidade."
                      : "Verified certificate version, graded projects, and community access."
                    }
                  </p>
                  <p className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#a95d25]">
                    Coursera <ArrowUpRight size={13} />
                  </p>
                </a>
              )}
            </div>
          </section>
        </article>
      </div>
    </>
  );
}