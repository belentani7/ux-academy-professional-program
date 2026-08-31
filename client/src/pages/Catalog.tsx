import { ModuleCard, PageHeading } from "@/components/AcademyUI";
import { useLocale } from "@/contexts/LocaleContext";
import { courseModules } from "@shared/courseContent";
import { useStaticData } from "@/lib/staticData";
import { useMemo } from "react";

export default function Catalog() {
  const { locale } = useLocale();
  const { getDashboardData } = useStaticData();
  const dashboard = useMemo(() => getDashboardData(), [getDashboardData]);
  const lookup = (id: string) => dashboard.moduleProgress.find(item => item.moduleId === id)?.percentage ?? 0;
  return (
    <>
      <PageHeading
        eyebrow="Zero \u2192 Professional"
        title={locale === "es" ? "Programa completo" : locale === "pt" ? "Programa completo" : "Complete program"}
        description={
          locale === "es"
            ? "Diecisiete m\u00f3dulos conectan pensamiento, investigaci\u00f3n, interfaz, sistemas, producto y carrera."
            : locale === "pt"
            ? "Dezessete m\u00f3dulos conectam pensamento, pesquisa, interface, sistemas, produto e carreira."
            : "Seventeen modules connect thinking, research, interface, systems, product, and career."
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courseModules.map(module => (
          <ModuleCard
            key={module.id}
            module={module}
            locale={locale}
            progress={lookup(module.id)}
            score={dashboard.latestQuizByModule[module.id]}
          />
        ))}
      </div>
    </>
  );
}