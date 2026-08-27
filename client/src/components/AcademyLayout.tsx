import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useLocale } from "@/contexts/LocaleContext";
import { ui } from "@/lib/i18n";
import { trpc } from "@/lib/trpc";
import { BookOpen, BriefcaseBusiness, ClipboardCheck, FileCheck2, FlaskConical, LayoutDashboard, Library, LogOut, Medal, Network, NotebookPen, Rocket, UserRound } from "lucide-react";
import { useEffect } from "react";
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
  const [, navigate] = useLocation();
  const dashboard = trpc.learning.dashboard.useQuery(undefined, { enabled: Boolean(user) });
  const updateLocale = trpc.learning.updateLocale.useMutation();

  useEffect(() => {
    if (dashboard.data?.profile.locale && dashboard.data.profile.locale !== locale) setLocale(dashboard.data.profile.locale);
  }, [dashboard.data?.profile.locale]);

  if (loading) return <div className="min-h-screen bg-[#f7f4ee]" aria-label="Loading classroom" />;
  if (!user) {
    return <main className="grid min-h-screen place-items-center bg-[#f7f4ee] px-6"><section className="max-w-md text-center"><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#96724d]">UX Academy</p><h1 className="font-serif text-4xl text-[#1d2521]">{copy.signIn}</h1><p className="mt-4 text-[#5f655e]">{locale === "es" ? "Tu progreso, notas y evidencias se guardan en un espacio privado." : locale === "pt" ? "Seu progresso, notas e evidências são guardados em um espaço privado." : "Your progress, notes, and evidence are stored in a private space."}</p><button onClick={() => startLogin()} className="mt-8 rounded-full bg-[#1d382d] px-6 py-3 font-medium text-white transition hover:bg-[#294a3b]">{copy.signIn}</button></section></main>;
  }

  const changeLocale = (next: "es" | "pt" | "en") => {
    setLocale(next);
    updateLocale.mutate({ locale: next });
  };

  return <div className="min-h-screen bg-[#fbfaf7] text-[#1b2445]">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-[#253b79] bg-[#142653] px-4 py-6 text-[#f0f4ff] md:flex">
      <Link href="/dashboard" className="mb-10 flex items-center gap-3 px-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ffd264] text-[#1d45a5]"><BookOpen size={18} strokeWidth={2.4} /></span><span><span className="block font-serif text-xl leading-none">UX Academy</span><span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b9caf5]">{copy.program}</span></span></Link>
      <nav className="space-y-1" aria-label="Course navigation">{navItems.map(item => { const Icon = item.icon; const active = location.pathname === item.path || (item.path === "/catalog" && location.pathname.startsWith("/learn")); return <Link key={item.path} href={item.path} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-[#315bc4] text-white shadow-[0_6px_18px_-12px_rgba(0,0,0,.8)]" : "text-[#c6d5fa] hover:bg-white/10 hover:text-white"}`}><Icon size={17} /><span>{copy[item.key]}</span></Link>; })}{user.role === "admin" && <Link href="/review" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${location.pathname === "/review" ? "bg-[#315bc4] text-white" : "text-[#c6d5fa] hover:bg-white/10 hover:text-white"}`}><ClipboardCheck size={17}/><span>Internal review</span></Link>}</nav>
      <div className="mt-auto border-t border-white/10 pt-4"><div className="mb-3 rounded-xl bg-white/8 px-3 py-2"><p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#b9caf5]">{copy.points}</p><p className="mt-1 font-serif text-2xl">{dashboard.data?.profile.totalPoints ?? 0}</p></div><div className="flex items-center justify-between gap-2 px-1"><span className="flex min-w-0 items-center gap-2 text-sm"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#ffd264] text-xs font-bold text-[#1d45a5]">{user.name?.slice(0, 1).toUpperCase() || "U"}</span><span className="truncate">{user.name || copy.profile}</span></span><button onClick={() => logout()} className="rounded-md p-2 text-[#c6d5fa] hover:bg-white/10 hover:text-white" aria-label={copy.signOut}><LogOut size={16} /></button></div></div>
    </aside>
    <div className="md:pl-[264px]"><header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#dde4f2] bg-[#fbfaf7]/92 px-5 backdrop-blur md:px-9"><Link href="/dashboard" className="flex items-center gap-2 font-serif text-lg text-[#1b2445] md:hidden"><BookOpen size={18} /> UX Academy</Link><p className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-[#64729b] md:block">{copy.internalCertificate}</p><div className="flex items-center gap-3"><label className="sr-only" htmlFor="language-select">{copy.language}</label><select id="language-select" value={locale} onChange={event => changeLocale(event.target.value as "es" | "pt" | "en")} className="rounded-xl border border-[#d5deef] bg-white px-2.5 py-1.5 text-sm text-[#30416f] focus:outline-none focus:ring-2 focus:ring-[#4b70c8]"><option value="es">ES</option><option value="pt">PT</option><option value="en">EN</option></select><Link href="/profile" className="rounded-xl p-2 text-[#52648b] hover:bg-[#e9effc]" aria-label={copy.profile}><UserRound size={18} /></Link></div></header><main className="mx-auto w-full max-w-[1480px] px-5 py-7 md:px-9 md:py-10">{children}</main></div>
  </div>;
}
