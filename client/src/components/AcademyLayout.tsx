import { useAuth } from "@/_core/hooks/useAuth";
import { useLocale } from "@/contexts/LocaleContext";
import { ui } from "@/lib/i18n";
import { trpc } from "@/lib/trpc";
import { BookOpen, BriefcaseBusiness, ClipboardCheck, Copy, FileCheck2, FlaskConical, LayoutDashboard, Library, LogOut, Medal, Network, NotebookPen, Rocket, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

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

  const changeLocale = (next: "es" | "pt" | "en") => {
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

  if (loading) return <div className="min-h-screen bg-[#f7f4ee]" aria-label="Loading classroom" />;

  return <div className="min-h-screen bg-[#fbfaf7] text-[#1b2445]">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-[#253b79] bg-[#142653] px-4 py-6 text-[#f0f4ff] md:flex">
      <Link href="/dashboard" className="mb-10 flex items-center gap-3 px-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ffd264] text-[#1d45a5]"><BookOpen size={18} strokeWidth={2.4} /></span><span><span className="block font-serif text-xl leading-none">UX Academy</span><span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b9caf5]">{copy.program}</span></span></Link>
      <nav className="space-y-1" aria-label="Course navigation">{navItems.map(item => { const Icon = item.icon; const active = location === item.path || (item.path === "/catalog" && location.startsWith("/learn")); return <Link key={item.path} href={item.path} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-[#315bc4] text-white shadow-[0_6px_18px_-12px_rgba(0,0,0,.8)]" : "text-[#c6d5fa] hover:bg-white/10 hover:text-white"}`}><Icon size={17} /><span>{copy[item.key]}</span></Link>; })}{isAdmin && <Link href="/review" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${location === "/review" ? "bg-[#315bc4] text-white" : "text-[#c6d5fa] hover:bg-white/10 hover:text-white"}`}><ClipboardCheck size={17}/><span>Internal review</span></Link>}</nav>
      <div className="mt-auto border-t border-white/10 pt-4">
        <div className="mb-3 rounded-xl bg-white/8 px-3 py-2"><p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#b9caf5]">{copy.points}</p><p className="mt-1 font-serif text-2xl">{dashboard.data?.profile.totalPoints ?? 0}</p></div>
        <div className="mb-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2"><div className="flex items-center justify-between gap-2"><p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#b9caf5]">ID del alumno</p><button type="button" onClick={copyLearnerId} disabled={!user?.openId} className="rounded-md p-1 text-[#c6d5fa] hover:bg-white/10 disabled:opacity-40" aria-label="Copiar ID del alumno"><Copy size={13}/></button></div><p className="mt-1 truncate font-mono text-[10px] text-[#f0f4ff]" title={learnerId}>{learnerId}</p>{copied && <p className="mt-1 text-[10px] text-[#75dfbc]">Copiado</p>}</div>
        <div className="flex items-center justify-between gap-2 px-1"><span className="flex min-w-0 items-center gap-2 text-sm"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#ffd264] text-xs font-bold text-[#1d45a5]">{learnerName.slice(0, 1).toUpperCase()}</span><span className="truncate">{learnerName}</span></span><button onClick={() => logout()} className="rounded-md p-2 text-[#c6d5fa] hover:bg-white/10 hover:text-white" aria-label={copy.signOut}><LogOut size={16} /></button></div>
      </div>
    </aside>
    <div className="md:pl-[264px]"><header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#dde4f2] bg-[#fbfaf7]/92 px-5 backdrop-blur md:px-9"><Link href="/dashboard" className="flex items-center gap-2 font-serif text-lg text-[#1b2445] md:hidden"><BookOpen size={18} /> UX Academy</Link><p className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-[#64729b] md:block">{copy.internalCertificate}</p><div className="flex items-center gap-3"><label className="sr-only" htmlFor="language-select">{copy.language}</label><select id="language-select" value={locale} onChange={event => changeLocale(event.target.value as "es" | "pt" | "en")} className="rounded-xl border border-[#d5deef] bg-white px-2.5 py-1.5 text-sm text-[#30416f] focus:outline-none focus:ring-2 focus:ring-[#4b70c8]"><option value="es">ES</option><option value="pt">PT</option><option value="en">EN</option></select><Link href="/profile" className="rounded-xl p-2 text-[#52648b] hover:bg-[#e9effc]" aria-label={copy.profile}><UserRound size={18} /></Link></div></header><main className="mx-auto w-full max-w-[1480px] px-5 py-7 md:px-9 md:py-10">{children}</main></div>
  </div>;
}
