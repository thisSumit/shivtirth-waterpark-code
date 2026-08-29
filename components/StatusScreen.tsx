import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

type StatusScreenProps = {
  code: string;
  title: string;
  description: string;
};

export default function StatusScreen({
  code,
  title,
  description,
}: StatusScreenProps) {
  return (
    <main className="relative isolate flex min-h-screen items-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(37,129,129,0.18),_transparent_34%),linear-gradient(180deg,_#faf9f6_0%,_#f4fbfb_58%,_#ffffff_100%)] px-4 pb-20 pt-36 text-slate-900 md:px-8 md:pt-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-30 bg-slate-600" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-56 w-[42rem] -translate-x-1/2 rounded-full bg-slate-900/5 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-4xl rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur md:p-12">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-accent" />
              {title}
            </div>
            <p className="font-heading text-7xl font-black leading-none text-primary md:text-[9rem]">
              {code}
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <InteractiveHoverButton href="/" className="w-full sm:w-auto">
            Go Home
          </InteractiveHoverButton>
          <InteractiveHoverButton href="/offers" className="w-full sm:w-auto bg-primary text-white">
            Explore Offers
          </InteractiveHoverButton>
        </div>
      </section>
    </main>
  );
}