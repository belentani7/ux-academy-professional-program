import { Link } from "wouter";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-[#f7f4ee] px-6 text-center"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#96724d]">UX Academy</p><h1 className="mt-3 font-serif text-5xl text-[#1d2521]">404</h1><p className="mt-3 text-[#5f655e]">This learning space could not be found.</p><Link href="/" className="mt-6 inline-block rounded-full bg-[#1d382d] px-5 py-2.5 text-sm font-medium text-white">Return home</Link></div></main>;
}
