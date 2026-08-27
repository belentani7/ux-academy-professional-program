import { Toaster } from "@/components/ui/sonner";
import AcademyLayout from "@/components/AcademyLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/contexts/LocaleContext";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Catalog = lazy(() => import("@/pages/Catalog"));
const Module = lazy(() => import("@/pages/Module"));
const Lesson = lazy(() => import("@/pages/Lesson"));
const PracticeLab = lazy(() => import("@/pages/PracticeLab"));
const Projects = lazy(() => import("@/pages/Projects"));
const Notes = lazy(() => import("@/pages/Notes"));
const Resources = lazy(() => import("@/pages/Resources"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const Certificate = lazy(() => import("@/pages/Certificate"));
const CapstoneReview = lazy(() => import("@/pages/CapstoneReview"));
const Profile = lazy(() => import("@/pages/Profile"));
const GoogleEcosystem = lazy(() => import("@/pages/GoogleEcosystem"));

const protectedPage = (Page: React.ComponentType) => () => <AcademyLayout><Suspense fallback={<div className="min-h-[40vh] animate-pulse rounded-3xl bg-[#ece6dc]" aria-label="Loading course area" />}><Page /></Suspense></AcademyLayout>;

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/dashboard" component={protectedPage(Dashboard)} />
    <Route path="/catalog" component={protectedPage(Catalog)} />
    <Route path="/module/:moduleId" component={protectedPage(Module)} />
    <Route path="/learn/:moduleId/:lessonId" component={protectedPage(Lesson)} />
    <Route path="/lab" component={protectedPage(PracticeLab)} />
    <Route path="/projects" component={protectedPage(Projects)} />
    <Route path="/notes" component={protectedPage(Notes)} />
    <Route path="/resources" component={protectedPage(Resources)} />
    <Route path="/google-ecosystem" component={protectedPage(GoogleEcosystem)} />
    <Route path="/portfolio" component={protectedPage(Portfolio)} />
    <Route path="/certificate" component={protectedPage(Certificate)} />
    <Route path="/review" component={protectedPage(CapstoneReview)} />
    <Route path="/profile" component={protectedPage(Profile)} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><LocaleProvider><TooltipProvider><Toaster /><Router /></TooltipProvider></LocaleProvider></ThemeProvider></ErrorBoundary>;
}
