import { EmptyNotice, PageHeading, Tag } from "@/components/AcademyUI";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ClipboardCheck, ShieldCheck } from "lucide-react";
import { useState } from "react";

const levels = ["novice", "competent", "advanced", "professional"] as const;
const criterionLabels = { research: "Research", ai: "Responsible IA", wireframes: "Wireframes & flows", ui: "UI craft", accessibility: "Accessibility", testing: "Testing", documentation: "Documentation", portfolio: "Portfolio case" } as const;
type Criterion = keyof typeof criterionLabels;
type Level = (typeof levels)[number];
const defaultCriteria: Record<Criterion, Level> = { research: "competent", ai: "competent", wireframes: "competent", ui: "competent", accessibility: "competent", testing: "competent", documentation: "competent", portfolio: "competent" };

export default function CapstoneReview() {
  const { user } = useAuth();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [criteria, setCriteria] = useState<Record<Criterion, Level>>(defaultCriteria);
  const [decision, setDecision] = useState<"revise" | "pass">("pass");
  const [feedback, setFeedback] = useState("");
  const list = trpc.admin.capstoneSubmissions.useQuery(undefined, { enabled: user?.role === "admin" });
  const review = trpc.admin.reviewCapstone.useMutation({ onSuccess: () => { list.refetch(); setActiveId(null); setFeedback(""); } });
  const issueCertificate = trpc.admin.issueCertificate.useMutation({ onSuccess: () => list.refetch() });
  if (user?.role !== "admin") return <EmptyNotice title="Internal review only" detail="This area is restricted to program administrators." />;
  const active = list.data?.find(item => item.id === activeId);
  const select = (item: NonNullable<typeof list.data>[number]) => { setActiveId(item.id); setCriteria({ ...defaultCriteria, ...(item.review?.criteria ?? {}) }); setDecision(item.review?.decision ?? "pass"); setFeedback(item.review?.feedback ?? ""); };
  return <>
    <PageHeading eyebrow="Internal review" title="Capstone evaluation" description="Apply the published rubric, record the level reached, and write evidence-based formative feedback. This decision is traceable and controls internal certificate eligibility." />
    <div className="rounded-2xl border border-[#dfd8ce] bg-[#edf2ec] p-5 text-sm leading-6 text-[#4a604e]"><ShieldCheck className="mb-2" size={19}/><strong>Review standard.</strong> Evaluate the submitted capstone against research, problem definition, IA, UI, accessibility, testing, documentation and portfolio evidence. Do not issue an external credential or claim affiliation with Google.</div>
    <div className="mt-7 grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
      <section className="space-y-3">
        {list.isLoading ? <div className="h-32 animate-pulse rounded-2xl bg-[#eae4da]"/> : list.data?.length ? list.data.map(item => <button key={item.id} onClick={() => select(item)} className={`w-full rounded-2xl border p-5 text-left ${activeId === item.id ? "border-[#1d382d] bg-[#1d382d] text-white" : "border-[#dfd8ce] bg-[#fffdf9] text-[#304035]"}`}><div className="flex items-center justify-between gap-3"><span className="font-mono text-xs">#{item.id}</span><Tag tone={item.review ? "forest" : "copper"}>{item.review ? item.review.decision : "awaiting review"}</Tag></div><p className="mt-3 font-serif text-xl">{item.summary.slice(0, 72)}{item.summary.length > 72 ? "…" : ""}</p><p className="mt-3 text-xs opacity-75">{item.review ? `Level: ${item.review.level}` : "Submitted capstone"}</p></button>) : <EmptyNotice title="No capstones submitted" detail="Submitted capstones will appear here for internal review."/>}
      </section>
      <section>
        {active ? <form onSubmit={event => { event.preventDefault(); review.mutate({ submissionId: active.id, decision, feedback, criteria }); }} className="rounded-3xl border border-[#dfd8ce] bg-[#fffdf9] p-6"><div className="flex items-center gap-2"><ClipboardCheck className="text-[#96724d]"/><h2 className="font-serif text-3xl">Review #{active.id}</h2></div><p className="mt-5 text-sm leading-6 text-[#536055]"><strong>Student summary:</strong> {active.summary}</p>{active.reflection && <p className="mt-3 rounded-xl bg-[#f3eee6] p-4 text-sm leading-6 text-[#5b675d]"><strong>Reflection:</strong> {active.reflection}</p>}<div className="mt-6 rounded-2xl bg-[#f3eee6] p-4"><p className="text-xs font-bold uppercase tracking-[.13em] text-[#96724d]">Criterion rubric</p><p className="mt-2 text-xs leading-5 text-[#637066]">The recorded overall level is the lowest level reached across the eight required dimensions.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{(Object.keys(criterionLabels) as Criterion[]).map(key => <label key={key} className="text-xs font-bold text-[#4d5b50]">{criterionLabels[key]}<select value={criteria[key]} onChange={event => setCriteria(current => ({ ...current, [key]: event.target.value as Level }))} className="mt-1.5 w-full rounded-lg border border-[#d8d0c5] bg-white px-2 py-2 text-sm font-normal"><option value="novice">Novice</option><option value="competent">Competent</option><option value="advanced">Advanced</option><option value="professional">Professional</option></select></label>)}</div></div><label className="mt-5 block text-sm font-semibold">Decision<select value={decision} onChange={event => setDecision(event.target.value as "revise" | "pass")} className="mt-2 w-full rounded-xl border border-[#d8d0c5] bg-white px-3 py-2.5 text-sm"><option value="pass">Pass</option><option value="revise">Revise</option></select></label><label className="mt-5 block text-sm font-semibold" htmlFor="capstone-feedback">Evidence-based feedback</label><textarea id="capstone-feedback" value={feedback} onChange={event => setFeedback(event.target.value)} minLength={20} required className="mt-2 min-h-48 w-full rounded-xl border border-[#d8d0c5] bg-white p-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-[#c78f54]" placeholder="Connect strengths, evidence gaps, and next actions to the published rubric."/><div className="mt-5 flex flex-wrap gap-3"><button disabled={review.isPending} className="rounded-full bg-[#1d382d] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{review.isPending ? "Saving…" : "Record review"}</button><button type="button" disabled={issueCertificate.isPending} onClick={() => issueCertificate.mutate({ userId: active.userId })} className="rounded-full border border-[#b68a5a] px-5 py-3 text-sm font-bold text-[#684b2c] disabled:opacity-40">{issueCertificate.isPending ? "Checking…" : "Validate & issue internal certificate"}</button></div>{issueCertificate.error && <p className="mt-3 text-sm text-[#9a513b]">Requirements are not yet satisfied for issue. Review the learner’s curriculum, score, final exam, projects, and capstone decision.</p>}{issueCertificate.data && <p className="mt-3 text-sm text-[#2f6048]">Internal certificate recorded: {issueCertificate.data.certificateCode}</p>}</form> : <EmptyNotice title="Select a capstone" detail="Choose a submitted capstone to record a level and decision."/>}
      </section>
    </div>
  </>;
}
