import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileText,
  Fingerprint,
  HeartHandshake,
  HeartPulse,
  Layers,
  Menu,
  MessageCircle,
  Network,
  PhoneCall,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const workflow = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Listen and understand",
    description:
      "Organize complaint statements and conversation transcripts while preserving the context of what a person shares.",
    color: "bg-[#EAF5F1] text-[#328B86] border-[#CBE5DC]",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Identify distress signals",
    description:
      "Highlight relevant language, reported emotions, contextual factors, and potential safety concerns.",
    color: "bg-[#F3EFFB] text-[#6B46C1] border-[#E2D6F5]",
  },
  {
    number: "03",
    icon: Fingerprint,
    title: "Make insights explainable",
    description:
      "Present supporting evidence, uncertainty, and missing information for a trained responder to review.",
    color: "bg-[#FCF8EE] text-[#9B6C28] border-[#E8DAC0]",
  },
  {
    number: "04",
    icon: HeartHandshake,
    title: "Support human decisions",
    description:
      "Help responders consider appropriate counselling, legal, medical, and other support pathways.",
    color: "bg-[#EBF7F2] text-[#248261] border-[#CAEADF]",
  },
];

const principles = [
  {
    icon: Users,
    title: "Human-led decisions",
    description:
      "AI provides context and suggestions. Trained professionals remain responsible for consequential decisions.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy by design",
    description:
      "Sensitive information should be minimized, protected, and accessible only to authorized people.",
  },
  {
    icon: Fingerprint,
    title: "Explainable insights",
    description:
      "Assessment indicators should connect to relevant evidence instead of presenting unexplained scores.",
  },
  {
    icon: HeartPulse,
    title: "Care without assumptions",
    description:
      "Language, writing style, and an experimental score cannot establish a person's diagnosis or credibility.",
  },
];

const whyMattersItems = [
  {
    number: "01",
    icon: HeartPulse,
    title: "Distress is not always obvious",
    text: "Fear, confusion, helplessness and other concerns can be expressed differently by different people.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Context matters",
    text: "A statement may contain important details about ongoing difficulties, immediate needs, and safety concerns.",
  },
  {
    number: "03",
    icon: HeartHandshake,
    title: "Support needs understanding",
    text: "Responders need relevant evidence and context—not just a score or an unexplained automated label.",
  },
];

const approachFeatures = [
  {
    icon: MessageCircle,
    title: "Conversation context",
    text: "Bring relevant statements and details into one reviewable view.",
  },
  {
    icon: BrainCircuit,
    title: "Observable indicators",
    text: "Surface potential signals without treating them as a diagnosis.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent reasoning",
    text: "Show the evidence and limitations behind provisional findings.",
  },
  {
    icon: HeartHandshake,
    title: "Support pathways",
    text: "Help professionals consider suitable next steps and referrals.",
  },
];

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FCFBF8] text-[#123052] selection:bg-[#CBE6DF] selection:text-[#123052]">
      {/* ========================================================
          1. NAVIGATION BAR
          ======================================================== */}
      <header className="sticky top-0 z-50 border-b border-[#DCE7E2] bg-[#FCFBF8]/95 backdrop-blur-md transition-colors">
        <nav
          className="mx-auto flex h-[76px] max-w-[1360px] items-center justify-between px-5 sm:px-8 lg:px-12"
          aria-label="Main Navigation"
        >
          {/* Brand Logo & Title */}
          <a
            href="#home"
            onClick={closeMenu}
            className="group flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#328B86] rounded-xl p-1"
            aria-label="SAHYOG AI Home"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#123052] text-[#EAF5F1] shadow-sm transition-transform duration-200 group-hover:scale-105">
              <HeartHandshake size={23} strokeWidth={2} />
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-[#123052]">
                SAHYOG <span className="text-[#328B86]">AI</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A6E82]">
                Human Support Workspace
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-8 lg:flex">
            <a
              href="#problem"
              className="text-sm font-medium text-[#5A6E82] transition-colors hover:text-[#328B86]"
            >
              The Challenge
            </a>
            <a
              href="#approach"
              className="text-sm font-medium text-[#5A6E82] transition-colors hover:text-[#328B86]"
            >
              Our Approach
            </a>
            <a
              href="#workflow"
              className="text-sm font-medium text-[#5A6E82] transition-colors hover:text-[#328B86]"
            >
              How It Works
            </a>
            <a
              href="#responsible-ai"
              className="text-sm font-medium text-[#5A6E82] transition-colors hover:text-[#328B86]"
            >
              Responsible AI
            </a>
          </div>

          {/* Desktop Dashboard Button */}
          <div className="hidden lg:block">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-[#123052] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#1A406D] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Dashboard</span>
              <ArrowUpRight size={16} strokeWidth={2.2} />
            </a>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE7E2] bg-white text-[#123052] transition-colors hover:bg-[#EAF5F1] lg:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="border-t border-[#DCE7E2] bg-[#FCFBF8] px-5 py-5 shadow-lg lg:hidden">
            <div className="flex flex-col gap-1.5">
              {[
                ["The Challenge", "#problem"],
                ["Our Approach", "#approach"],
                ["How It Works", "#workflow"],
                ["Responsible AI", "#responsible-ai"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-[#123052] transition-colors hover:bg-[#EAF5F1]"
                >
                  {label}
                </a>
              ))}
              <div className="mt-3 pt-3 border-t border-[#E8F0EC]">
                <a
                  href="/dashboard"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#123052] px-4 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#1A406D]"
                >
                  <span>Open Responder Dashboard</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ========================================================
            2. HERO SECTION
            ======================================================== */}
        <section id="home" className="relative isolate overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-28">
          {/* Subtle Ambient Background Gradient */}
          <div
            className="pointer-events-none absolute -top-24 right-0 -z-10 h-[560px] w-[560px] rounded-full bg-[#EAF5F1]/80 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-1/2 left-0 -z-10 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-[#F4FAF7]/70 blur-3xl"
            aria-hidden="true"
          />

          <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
            <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
              
              {/* Left Column: Messaging & CTAs */}
              <div className="flex flex-col items-start">
                
                {/* Eyebrow Label */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[#C8DFD7] bg-[#EAF5F1]/80 px-4 py-1.5 text-xs font-bold tracking-[0.16em] text-[#246F6B] uppercase shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-[#328B86] animate-pulse" />
                  <span>HUMAN-CENTRED AI FOR SOCIAL SUPPORT</span>
                </div>

                {/* Main Heading */}
                <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#123052] sm:text-5xl lg:text-[62px] lg:leading-[1.08]">
                  Every voice <br className="hidden sm:inline" />
                  deserves to be <br />
                  <span className="font-serif italic text-[#328B86]">heard.</span>
                </h1>

                {/* Supporting Text */}
                <p className="mt-6 text-lg font-semibold tracking-tight text-[#123052] sm:text-xl">
                  AI-assisted distress assessment. Human-led support.
                </p>

                {/* Explanatory Paragraph */}
                <p className="mt-3.5 max-w-xl text-[15px] leading-relaxed text-[#5A6E82] sm:text-base">
                  SAHYOG AI helps trained responders organize reported distress,
                  identify potential safety concerns, and consider appropriate
                  support pathways through the NHAAS (14566) helpline and its
                  integrated portal.
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
                  <a
                    href="#workflow"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123052] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1A406D] hover:shadow-md"
                  >
                    <span>Explore how it works</span>
                    <ArrowRight size={17} strokeWidth={2.2} />
                  </a>
                  <a
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE7E2] bg-white px-6 py-3.5 text-sm font-semibold text-[#123052] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#328B86] hover:bg-[#EAF5F1]/40"
                  >
                    <span>Open responder dashboard</span>
                    <ArrowUpRight size={17} strokeWidth={2.2} />
                  </a>
                </div>

                {/* Compact Trust Indicators */}
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-[#E8F0EC] text-xs font-semibold text-[#5A6E82]">
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={17} className="text-[#328B86]" strokeWidth={2.2} />
                    <span>Human oversight</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Network size={17} className="text-[#328B86]" strokeWidth={2.2} />
                    <span>Explainable insights</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <HeartHandshake size={17} className="text-[#328B86]" strokeWidth={2.2} />
                    <span>Human-centred support</span>
                  </span>
                </div>
              </div>

              {/* Right Column: "THE SAHYOG APPROACH" Workflow Card */}
              <div className="relative mx-auto w-full max-w-[540px]">
                {/* Soft mint backdrop aura */}
                <div
                  className="absolute inset-4 rounded-3xl bg-[#EAF5F1] blur-2xl"
                  aria-hidden="true"
                />

                <div className="relative overflow-hidden rounded-[26px] border border-[#DCE7E2] bg-white p-5 sm:p-7 shadow-[0_20px_50px_rgba(18,48,82,0.08)]">
                  
                  {/* Card Header Bar */}
                  <div className="flex items-center justify-between border-b border-[#EBF2EE] pb-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#328B86]">
                        THE SAHYOG APPROACH
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-[#123052]">
                        From conversation to contextual care
                      </p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF5F1] text-[#328B86]">
                      <Sparkles size={18} strokeWidth={2} />
                    </div>
                  </div>

                  {/* Structured Workflow Illustration */}
                  <div className="relative pt-6 pb-2">
                    
                    {/* Step 1: A Person's Voice */}
                    <div className="relative z-10 flex w-full justify-center">
                      <div className="flex w-full items-center justify-between rounded-xl border border-[#DCE7E2] bg-[#FCFBF8] p-3.5 shadow-xs transition hover:border-[#328B86]">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF5F1] text-[#328B86]">
                            <MessageCircle size={20} strokeWidth={2.2} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#123052]">
                              A person's voice
                            </p>
                            <p className="text-xs text-[#5A6E82]">
                              Words, context and concerns
                            </p>
                          </div>
                        </div>
                        <span className="hidden sm:inline-flex rounded-full bg-[#EAF5F1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#328B86]">
                          Raw Input
                        </span>
                      </div>
                    </div>

                    {/* Connecting Visual Lines */}
                    <div className="my-3 flex justify-center">
                      <svg
                        className="h-9 w-full max-w-[380px]"
                        viewBox="0 0 380 36"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M 190 0 V 16 M 190 16 C 190 26, 95 24, 95 36 M 190 16 C 190 26, 285 24, 285 36"
                          stroke="#9BC9C0"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                        <circle cx="190" cy="16" r="3" fill="#328B86" />
                        <circle cx="95" cy="36" r="3" fill="#328B86" />
                        <circle cx="285" cy="36" r="3" fill="#9B6C28" />
                      </svg>
                    </div>

                    {/* Step 2: Two Side-by-Side Panels */}
                    <div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      
                      {/* Left Sub-panel: AI-assisted insights (Mint / Teal) */}
                      <div className="flex flex-col justify-between rounded-xl border border-[#C8DFD7] bg-[#EAF5F1]/80 p-3.5 transition-all hover:border-[#328B86] hover:bg-[#EAF5F1]">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#328B86] shadow-xs">
                              <BrainCircuit size={17} strokeWidth={2.2} />
                            </span>
                            <span className="rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#328B86] uppercase">
                              AI Assisted
                            </span>
                          </div>
                          <p className="mt-2.5 text-xs font-bold text-[#123052]">
                            Observable indicators
                          </p>
                          <p className="mt-1 text-[11px] leading-relaxed text-[#5A6E82]">
                            Distress cues, safety signals, and explicit statements
                          </p>
                        </div>
                        <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-[#246F6B]">
                          <Check size={12} strokeWidth={2.5} />
                          <span>Evidence-anchored</span>
                        </div>
                      </div>

                      {/* Right Sub-panel: Human review (Warm Amber) */}
                      <div className="flex flex-col justify-between rounded-xl border border-[#E8DAC0] bg-[#FCF8EE] p-3.5 transition-all hover:border-[#9B6C28]">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#9B6C28] shadow-xs">
                              <Users size={17} strokeWidth={2.2} />
                            </span>
                            <span className="rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#9B6C28] uppercase">
                              Human Review
                            </span>
                          </div>
                          <p className="mt-2.5 text-xs font-bold text-[#123052]">
                            Professional judgement
                          </p>
                          <p className="mt-1 text-[11px] leading-relaxed text-[#5A6E82]">
                            Responder expertise, emotional nuance, and caller safety
                          </p>
                        </div>
                        <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-[#78511B]">
                          <Check size={12} strokeWidth={2.5} />
                          <span>Human validation</span>
                        </div>
                      </div>
                    </div>

                    {/* Connecting Visual Lines down to Footer Panel */}
                    <div className="my-3 flex justify-center">
                      <svg
                        className="h-9 w-full max-w-[380px]"
                        viewBox="0 0 380 36"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M 95 0 C 95 12, 190 10, 190 22 M 285 0 C 285 12, 190 10, 190 22 M 190 22 V 36"
                          stroke="#9BC9C0"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                        <circle cx="190" cy="22" r="3" fill="#328B86" />
                        <circle cx="190" cy="36" r="3" fill="#123052" />
                      </svg>
                    </div>

                    {/* Step 3: Prominent Navy Footer Panel */}
                    <div className="relative z-10 flex w-full items-center justify-between gap-3 rounded-xl bg-[#123052] p-4 text-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#A6D8CE]">
                          <HeartHandshake size={21} strokeWidth={2} />
                        </span>
                        <div>
                          <p className="text-sm font-bold text-white">
                            Informed support pathways
                          </p>
                          <p className="text-xs text-[#D5E4EC]">
                            Recommendations reviewed by a human responder
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex rounded-lg bg-white/10 px-2.5 py-1 text-[10px] font-bold text-[#A6D8CE] uppercase tracking-wider">
                        14566 NHAAS
                      </span>
                    </div>

                  </div>

                  {/* Card Disclaimer */}
                  <div className="mt-4 flex items-start gap-2 border-t border-[#EBF2EE] pt-3 text-[11px] leading-relaxed text-[#5A6E82]">
                    <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#328B86]" />
                    <p>
                      Conceptual illustration. AI insights support human review;
                      they do not establish a diagnosis.
                    </p>
                  </div>
                </div>

                {/* Floating Trust Badge */}
                <div className="absolute -bottom-4 -left-3 hidden rounded-xl border border-[#DCE7E2] bg-white px-3.5 py-2 shadow-md sm:flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF5F1] text-[#248261]">
                    <Check size={15} strokeWidth={2.5} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#123052]">
                      Human oversight first
                    </p>
                    <p className="text-[10px] text-[#5A6E82]">
                      Designed around responders
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ========================================================
            3. PROJECT CONTEXT SECTION
            ======================================================== */}
        <section className="border-y border-[#DCE7E2] bg-[#EAF5F1] py-8">
          <div className="mx-auto flex max-w-[1360px] flex-col gap-4 px-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#328B86]">
                THE PROJECT CONTEXT
              </p>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[#123052]/90">
                Developed in response to a problem statement from the Ministry
                of Social Justice and Empowerment, focusing on AI-assisted
                distress assessment and human-reviewed support.
              </p>
            </div>
            <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#C8DFD7] bg-white px-4 py-2 text-xs font-semibold text-[#123052] shadow-xs">
              <ShieldCheck size={16} className="text-[#328B86]" />
              <span>Prototype demonstration</span>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. WHY THIS MATTERS SECTION
            ======================================================== */}
        <section id="problem" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
            
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#328B86]">
                WHY THIS MATTERS
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#123052] sm:text-4xl lg:text-5xl">
                Behind every case <br />
                is a human story.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#5A6E82]">
                When someone reaches out for help, the details that matter may be
                spread across a conversation. Organizing that context can help a
                responder ask better questions and consider appropriate next steps.
              </p>
            </div>

            {/* 3 Distinct Cards */}
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {whyMattersItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.number}
                    className="group flex flex-col justify-between rounded-2xl border border-[#DCE7E2] bg-white p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#328B86] hover:shadow-md sm:p-8"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-widest text-[#328B86]">
                          {item.number}
                        </span>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF5F1] text-[#328B86] transition-transform duration-200 group-hover:scale-105">
                          <Icon size={20} strokeWidth={2} />
                        </span>
                      </div>
                      <div className="my-5 h-px w-full bg-[#EBF2EE] transition-colors group-hover:bg-[#C8DFD7]" />
                      <h3 className="text-xl font-bold leading-snug text-[#123052]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#5A6E82]">
                        {item.text}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

          </div>
        </section>

        {/* ========================================================
            5. OUR APPROACH SECTION (Deep Navy)
            ======================================================== */}
        <section
          id="approach"
          className="scroll-mt-24 bg-[#123052] py-20 text-white sm:py-24 lg:py-28"
        >
          <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
              
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6D8CE]">
                  OUR APPROACH
                </p>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                  Technology should <br />
                  help people <br />
                  <span className="font-serif italic text-[#A6D8CE]">
                    understand people.
                  </span>
                </h2>
                <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[#D5E4EC]">
                  SAHYOG AI explores how conversational information can be
                  organized into explainable indicators and useful context for
                  trained responders. The objective is not to replace a
                  professional, but to help make relevant information easier
                  to review.
                </p>
                <div className="mt-8">
                  <a
                    href="#workflow"
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-[#A6D8CE] border border-white/15 transition-all hover:bg-white/20 hover:gap-3"
                  >
                    <span>Explore the workflow</span>
                    <ArrowRight size={17} />
                  </a>
                </div>
              </div>

              {/* 2x2 Feature Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {approachFeatures.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article
                      key={item.title}
                      className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-xs transition-all duration-200 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.10]"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#A6D8CE]">
                        <Icon size={22} strokeWidth={2} />
                      </div>
                      <h3 className="mt-4 text-base font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#D5E4EC]">
                        {item.text}
                      </p>
                    </article>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================
            6. HOW IT WORKS SECTION
            ======================================================== */}
        <section id="workflow" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
            
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#328B86]">
                HOW IT WORKS
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#123052] sm:text-4xl lg:text-5xl">
                Four steps. <br />
                One human-centred process.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#5A6E82]">
                A conceptual workflow for turning a conversation into reviewable
                information and potential support options.
              </p>
            </div>

            {/* 4 Steps Grid */}
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {workflow.map((step) => {
                const Icon = step.icon;
                return (
                  <article
                    key={step.number}
                    className="flex flex-col justify-between rounded-2xl border border-[#DCE7E2] bg-white p-6 sm:p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#328B86] hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-[0.16em] text-[#5A6E82]/70">
                          STEP {step.number}
                        </span>
                        <span
                          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${step.color}`}
                        >
                          <Icon size={21} strokeWidth={2} />
                        </span>
                      </div>
                      <h3 className="mt-6 text-lg font-bold text-[#123052]">
                        {step.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#5A6E82]">
                        {step.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Starting Point Banner */}
            <div className="mt-10 flex flex-col gap-5 rounded-2xl border border-[#C8DFD7] bg-[#EAF5F1] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-base font-bold text-[#123052]">
                  The assessment is a starting point, not a final answer.
                </p>
                <p className="mt-1 text-sm text-[#5A6E82]">
                  Findings must be reviewed in context by a trained human responder.
                </p>
              </div>
              <a
                href="/dashboard"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#123052] px-5 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#1A406D]"
              >
                <span>Explore the dashboard</span>
                <ArrowRight size={16} strokeWidth={2.2} />
              </a>
            </div>

          </div>
        </section>

        {/* ========================================================
            7. SEE THE DIFFERENCE (Illustrative Assessment)
            ======================================================== */}
        <section className="border-y border-[#DCE7E2] bg-[#F4FAF7] py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
            
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
              
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#328B86]">
                  SEE THE DIFFERENCE
                </p>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#123052] sm:text-4xl">
                  From raw words <br />
                  to useful context.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#5A6E82]">
                  An illustrative example of how a responder-facing interface
                  might organize a statement. This example is fictional and does
                  not represent a validated model result.
                </p>
              </div>

              {/* Dashboard-Style Card */}
              <div className="overflow-hidden rounded-2xl border border-[#DCE7E2] bg-white shadow-md">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#EBF2EE] bg-[#FCFBF8] px-5 py-4 sm:px-7">
                  <div>
                    <p className="text-sm font-bold text-[#123052]">
                      Illustrative assessment
                    </p>
                    <p className="mt-0.5 text-xs text-[#5A6E82]">
                      Synthetic example · Not a real case
                    </p>
                  </div>
                  <span className="rounded-full border border-[#E8DAC0] bg-[#FCF8EE] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9B6C28]">
                    Demo only
                  </span>
                </div>

                <div className="space-y-6 p-5 sm:p-7">
                  
                  {/* Statement Quote */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#5A6E82]">
                      Example statement
                    </p>
                    <blockquote className="mt-2.5 rounded-r-xl border-l-4 border-[#328B86] bg-[#EAF5F1]/70 px-4 py-3.5 text-sm italic leading-relaxed text-[#123052]">
                      “I am very scared and I don't know what to do. I don't feel
                      safe going back home.”
                    </blockquote>
                  </div>

                  {/* 2-Column Detail Panels */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    
                    {/* Observable Indicators (Teal) */}
                    <div className="rounded-xl border border-[#C8DFD7] bg-[#EAF5F1]/80 p-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#246F6B]">
                        <ShieldCheck size={16} strokeWidth={2.2} />
                        <span>Observable indicators</span>
                      </div>
                      <ul className="mt-3 space-y-2 text-xs font-medium text-[#123052]/90">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={13} className="text-[#328B86]" />
                          Explicitly reported fear
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={13} className="text-[#328B86]" />
                          Expressed uncertainty
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={13} className="text-[#328B86]" />
                          Stated concern about safety
                        </li>
                      </ul>
                    </div>

                    {/* Suggested Human Follow-up (Amber) */}
                    <div className="rounded-xl border border-[#E8DAC0] bg-[#FCF8EE] p-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9B6C28]">
                        <Users size={16} strokeWidth={2.2} />
                        <span>Suggested follow-up</span>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-[#5A6E82]">
                        Ask whether the person is in immediate danger and what
                        support would help them feel safe right now.
                      </p>
                    </div>

                  </div>

                  {/* Disclaimer Note */}
                  <div className="flex items-start gap-2.5 rounded-xl border border-[#DCE7E2] bg-[#FCFBF8] p-3.5 text-xs leading-relaxed text-[#5A6E82]">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#328B86]" />
                    <p>
                      These are illustrative observations, not a diagnosis. The
                      statement alone cannot establish what happened or
                      determine the appropriate intervention.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ========================================================
            8. OUR RESPONSIBILITY SECTION
            ======================================================== */}
        <section id="responsible-ai" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
            
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#328B86]">
                  OUR RESPONSIBILITY
                </p>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#123052] sm:text-4xl lg:text-5xl">
                  Support people. <br />
                  Never replace them.
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-[#5A6E82]">
                  Sensitive conversations deserve care, context, and
                  accountability. Responsible AI means being transparent about
                  what a system can do—and what it cannot.
                </p>

                {/* Essential Distinction Callout */}
                <div className="mt-8 rounded-2xl border border-[#DCE7E2] bg-[#EAF5F1]/60 p-5">
                  <p className="text-sm font-bold text-[#123052]">
                    An essential distinction
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#5A6E82]">
                    Detecting language associated with distress is not the same
                    as diagnosing a mental health condition or predicting future
                    harm.
                  </p>
                </div>
              </div>

              {/* 4 Principles Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                {principles.map((principle) => {
                  const Icon = principle.icon;
                  return (
                    <article
                      key={principle.title}
                      className="rounded-2xl border border-[#DCE7E2] bg-white p-6 shadow-xs transition hover:border-[#328B86]"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF5F1] text-[#328B86]">
                        <Icon size={22} strokeWidth={2} />
                      </div>
                      <h3 className="mt-4 text-base font-bold text-[#123052]">
                        {principle.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#5A6E82]">
                        {principle.description}
                      </p>
                    </article>
                  );
                })}
              </div>

            </div>

            {/* Prototype & Safety Notice (Restrained Amber) */}
            <div className="mt-14 flex items-start gap-4 rounded-2xl border border-[#E8DAC0] bg-[#FCF8EE] p-5 sm:p-7 shadow-xs">
              <ShieldAlert className="mt-0.5 shrink-0 text-[#9B6C28]" size={24} />
              <div>
                <h3 className="text-sm font-bold text-[#78511B]">
                  Prototype and safety notice
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#78511B]/90">
                  SAHYOG AI is a decision-support prototype, not a diagnostic
                  tool. Its experimental indicators and provisional scores are
                  not clinically validated. Human review and established
                  emergency procedures remain essential.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            9. FINAL CTA SECTION (Premium Navy)
            ======================================================== */}
        <section className="px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
          <div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[28px] bg-[#123052] px-6 py-14 text-white sm:px-12 sm:py-18 lg:px-16 shadow-lg">
            
            {/* Subtle decorative circles */}
            <div
              className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/10"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -right-4 -top-16 h-64 w-64 rounded-full border border-white/10"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A6D8CE]">
                A MORE THOUGHTFUL APPROACH TO SUPPORT
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl lg:leading-tight">
                Better context. <br />
                More informed human support.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#D5E4EC] sm:text-base">
                Explore how explainable AI concepts can help organize information
                while keeping human judgement at the centre of every consequential
                decision.
              </p>

              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                <a
                  href="#workflow"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#EAF5F1] px-6 py-3.5 text-sm font-bold text-[#123052] shadow-sm transition hover:bg-white"
                >
                  <span>Revisit the workflow</span>
                  <ArrowDown size={16} strokeWidth={2.2} />
                </a>
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <span>Open dashboard</span>
                  <ArrowUpRight size={16} strokeWidth={2.2} />
                </a>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* ========================================================
          10. FOOTER
          ======================================================== */}
      <footer className="border-t border-[#DCE7E2] bg-white px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          
          <a href="#home" className="flex items-center gap-3.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123052] text-[#EAF5F1]">
              <HeartHandshake size={21} strokeWidth={2} />
            </span>
            <div>
              <span className="block text-base font-extrabold tracking-tight text-[#123052]">
                SAHYOG <span className="text-[#328B86]">AI</span>
              </span>
              <span className="block text-xs font-semibold text-[#5A6E82]">
                Human-centred support technology
              </span>
            </div>
          </a>

          {/* Footer Navigation */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-[#5A6E82]">
            <a href="#problem" className="transition hover:text-[#328B86]">
              The Challenge
            </a>
            <a href="#approach" className="transition hover:text-[#328B86]">
              Our Approach
            </a>
            <a href="#workflow" className="transition hover:text-[#328B86]">
              How It Works
            </a>
            <a href="#responsible-ai" className="transition hover:text-[#328B86]">
              Responsible AI
            </a>
            <a href="/dashboard" className="transition hover:text-[#328B86]">
              Dashboard
            </a>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="mx-auto mt-10 max-w-[1360px] border-t border-[#EBF2EE] pt-6 text-xs leading-relaxed text-[#5A6E82]">
          <p>
            SAHYOG AI is a prototype concept. This website does not provide
            counselling, diagnose psychological conditions, or initiate emergency
            referrals. Demonstration content is fictional.
          </p>
          <p className="mt-3 font-medium">
            © {new Date().getFullYear()} SAHYOG AI · Human Support Workspace · Project demonstration
          </p>
        </div>
      </footer>
    </div>
  );
}
