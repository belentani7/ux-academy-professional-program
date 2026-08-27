import { ModuleCard, PageHeading } from "@/components/AcademyUI";
import { useLocale } from "@/contexts/LocaleContext";
import { trpc } from "@/lib/trpc";
import { courseModules } from "@shared/courseContent";

export default function Catalog() { const { locale } = useLocale(); const dashboard = trpc.learning.dashboard.useQuery(); const lookup = (id: string) => dashboard.data?.moduleProgress.find(item => item.moduleId === id)?.percentage ?? 0; return <><PageHeading eyebrow="Zero → Professional" title={locale === "es" ? "Programa completo" : locale === "pt" ? "Programa completo" : "Complete program"} description={locale === "es" ? "Diecisiete módulos conectan pensamiento, investigación, interfaz, sistemas, producto y carrera." : locale === "pt" ? "Dezessete módulos conectam pensamento, pesquisa, interface, sistemas, produto e carreira." : "Seventeen modules connect thinking, research, interface, systems, product, and career."} /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{courseModules.map(module => <ModuleCard key={module.id} module={module} locale={locale} progress={lookup(module.id)} score={dashboard.data?.latestQuizByModule[module.id]} />)}</div></>; }
