import { useLocale } from "@/contexts/LocaleContext";
import { ui } from "@/lib/i18n";
import { trpc } from "@/lib/trpc";
import { BookOpen, BriefcaseBusiness, ClipboardCheck, Copy, FileCheck2, FlaskConical, LayoutDashboard, Library, LogOut, Medal, Network, NotebookPen, Rocket, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../_core/hooks/useAuth";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { path: "/catalog", icon: BookOpen, key: "catalog" },
  { path: "/lab", icon: FlaskConical, key: "lab" },
  { path: "/projects", icon: BriefcaseBusiness, key: "projects" },
  { path: "/notes", icon: NotebookPen, key: "notes" },
  { path: "/resources", icon: Library, key: "resources" },
  { path: "/google-ecosystem", icon: Network, key: "google" },
  { path: "/growth", icon: Rocket, key: "growth" },
  { path: "/portfolio", icon: FileCheck2, key: "portfolio" },
  { path: "/certificate", icon: Medal, key: "certificate" },
] as const;

type Locale = "es" | "pt" | "en";

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  const { loading, user, logout } = useAuth();
  const { locale, setLocale } = useLocale();
  const copy = ui[locale];
  const [location] = useLocation();
  const [copied, setCopied] = useState(false);
  const dashboard = trpc.learning.dashboard.useQuery(undefined, { enabled: Boolean(user) });
  const updateLocale = trpc.learning.updateLocale.useMutation();
  const isAdmin = user?.role === "admin";
  const learnerName = user?.name || (locale === "es" ? "Alumno invitado" : locale === "pt" ? "Aluno convidado" : "Guest learner");
  const learnerId = user?.openId || "ID temporal";

  useEffect(() => {
    if (dashboard.data?.profile.locale && dashboard.data.profile.locale !== locale) setLocale(dashboard.data.profile.locale);
  }, [dashboard.data?.profile.locale, locale, setLocale]);

  const isActive = (path: string) => location === path || (path === "/catalog" && location.startsWith("/learn"));
  const changeLocale = (next: Locale) => {
    setLocale(next);
    if (user) updateLocale.mutate({ locale: next });
  };

  const copyLearnerId = async () => {
    if (!user?.openId) return;
    try {
      await navigator.clipboard.writeText(user.openId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#f7f4ee]" role="status" aria-live="polite"><span className="sr-only">{locale === "es" ? "Cargando aula" : locale === "pt" ? "Carregando sala" : "Loading classroom"}</span></div>;

  return <div className="min-h-screen bg-[#fbfaf7] text-[#1b2445]">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#ffd264] focus:px-4 focus:py-3 focus:font-bold focus:text-[#142653] focus:shadow-lg">{locale === "es" ? "Saltar al contenido principal" : locale === "pt" ? "Ir para o conteúdo principal" : "Skip to main content"}</a>
    <aside aria-label={locale === "es" ? "Navegación del curso" : locale === "pt" ? "Navegação do curso" : "Course navigation"} className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-[#253b79] bg-[#142653] px-4 py-6 text-[#f0f4ff] md:flex">
      <Link href="/dashboard" className="mb-10 flex items-center gap-3 rounded-xl px-3 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd264]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ffd264] text-[#1d45a5]"><BookOpen size={18} strokeWidth={2.4} /></span><span><span className="block font-serif text-xl leading-none">UX Academy</span><span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b9caf5]">{copy.program}</span></span></Link>
      <nav className="space-y-1" aria-label={locale === "es" ? "Secciones del curso" : locale === "pt" ? "Seções do curso" : "Course sections"}>{navItems.map(item => { const Icon = item.icon; const active = isActive(item.path); return <Link key={item.path} href={item.path} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd264] ${active ? "bg-[#315bc4] text-white shadow-[0_6px_18px_-12px_rgba(0,0,0,.8)]" : "text-[#c6d5fa] hover:bg-white/10 hover:text-white"}`}><Icon size={17} aria-hidden="true" /><span>{copy[item.key]}</span></Link>; })}{isAdmin && <Link href="/review" aria-current={location === "/review" ? "page" : undefined} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#c6d5fa] hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd264]"><ClipboardCheck size={17} aria-hidden="true"/><span>Internal review</span></Link>}</nav>
      <div className="mt-auto border-t border-white/10 pt-4">
        <div className="mb-3 rounded-xl bg-white/8 px-3 py-2" aria-label={`${copy.points}: ${dashboard.data?.profile.totalPoints ?? 0}`}><p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#b9caf5]">{copy.points}</p><p className="mt-1 font-serif text-2xl">{dashboard.data?.profile.totalPoints ?? 0}</p></div>
        <div className="mb-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2"><div className="flex items-center justify-between gap-2"><p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#b9caf5]">ID del alumno</p><button type="button" onClick={copyLearnerId} disabled={!user?.openId} className="rounded-md p-1 text-[#c6d5fa] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd264] disabled:opacity-40" aria-label="Copiar ID del alumno"><Copy size={13} aria-hidden="true" /></button></div><p className="mt-1 truncate font-mono text-[10px] text-[#f0f4ff]" title={learnerId}>{learnerId}</p>{copied && <p className="mt-1 text-[10px] text-[#75dfbc]" role="status" aria-live="polite">Copiado</p>}</div>
        <div className="flex items-center justify-between gap-2 px-1"><span className="flex min-w-0 items-center gap-2 text-sm"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#ffd264] text-xs font-bold text-[#1d45a5]" aria-hidden="true">{learnerName.slice(0, 1).toUpperCase()}</span><span className="truncate">{learnerName}</span></span><button type="button" onClick={() => logout()} className="rounded-md p-2 text-[#c6d5fa] hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd264]" aria-label={copy.signOut}><LogOut size={16} aria-hidden="true" /></button></div>
      </div>
    </aside>
    <div className="md:pl-[264px]"><header className="sticky top-0 z-20 border-b border-[#dde4f2] bg-[#fbfaf7]/95 backdrop-blur"><div className="flex h-16 items-center justify-between px-5 md:px-9"><Link href="/dashboard" className="flex items-center gap-2 rounded-xl font-serif text-lg text-[#1b2445] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315bc4] md:hidden"><BookOpen size={18} aria-hidden="true" /> UX Academy</Link><p className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-[#64729b] md:block">{copy.internalCertificate}</p><div className="flex items-center gap-3"><label className="sr-only" htmlFor="language-select">{copy.language}</label><select id="language-select" value={locale} onChange={event => changeLocale(event.target.value as Locale)} className="rounded-xl border border-[#d5deef] bg-white px-2.5 py-1.5 text-sm text-[#30416f] focus:outline-none focus:ring-2 focus:ring-[#4b70c8]"><option value="es">ES</option><option value="pt">PT</option><option value="en">EN</option></select><Link href="/profile" className="rounded-xl p-2 text-[#52648b] hover:bg-[#e9effc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315bc4]" aria-label={copy.profile}><UserRound size={18} aria-hidden="true" /></Link></div></div><nav className="flex gap-1 overflow-x-auto border-t border-[#e8edf5] px-4 py-2 md:hidden" aria-label={locale === "es" ? "Navegación rápida" : locale === "pt" ? "Navegação rápida" : "Quick navigation"}>{navItems.map(item => { const Icon = item.icon; const active = isActive(item.path); return <Link key={item.path} href={item.path} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315bc4] ${active ? "bg-[#315bc4] text-white" : "text-[#52648b] hover:bg-[#e9effc]"}`}><Icon size={14} aria-hidden="true" />{copy[item.key]}</Link>; })}</nav></header><main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[1480px] px-5 py-7 outline-none md:px-9 md:py-10">{children}</main></div>
  </div>;
}
