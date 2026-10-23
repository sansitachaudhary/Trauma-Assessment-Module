
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Eye,
  FileText,
  HandHeart,
  HeartHandshake,
  LifeBuoy,
  LockKeyhole,
  MessageCircleHeart,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import "./home.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAHYOG AI | Trauma-informed support" },
      {
        name: "description",
        content:
          "A human-centred workspace helping trained responders organise reported distress information, review observable indicators, and coordinate appropriate support.",
      },
    ],
  }),
  component: HomePage,
});

const capabilities = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Structured intake",
    description:
      "Capture a fictional or reported concern in a clear, organised format so important context is easier for a responder to review.",
    tone: "mint",
    tag: "Assessment",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Transparent indicators",
    description:
      "Highlight observable phrases using explicit rules, with the aim of helping a trained person decide what deserves closer attention.",
    tone: "lavender",
    tag: "Human review",
  },
  {
    number: "03",
    icon: FileText,
    title: "Organised case information",
    description:
      "Keep case details and follow-up information together in a focused workspace, according to the features available in the prototype.",
    tone: "peach",
    tag: "Case management",
  },
  {
    number: "04",
    icon: HandHeart,
    title: "Support coordination",
    description:
      "Help responders keep appropriate next steps and referral information in view while they coordinate support.",
    tone: "blue",
    tag: "Referrals",
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Listen without judgement",
    description:
      "Give the person's words and concerns space. Use respectful language and avoid assumptions about their experience.",
    icon: MessageCircleHeart,
    tone: "mint",
  },
  {
    number: "02",
    title: "Document the context",
    description:
      "Organise the information that has been shared so a responder can understand the reported concern more clearly.",
    icon: ClipboardCheck,
    tone: "lavender",
  },
  {
    number: "03",
    title: "Review observable indicators",
    description:
      "Consider any rule-based indicators alongside the full context. A highlighted phrase is a prompt for review, not a conclusion.",
    icon: Eye,
    tone: "peach",
  },
  {
    number: "04",
    title: "Coordinate appropriate support",
    description:
      "A trained responder considers suitable next steps, follow-up, and referrals based on the person's circumstances.",
    icon: LifeBuoy,
    tone: "blue",
  },
];

const faqs = [
  {
    question: "What is SAHYOG AI designed to do?",
    answer:
      "SAHYOG AI is a human-support workspace prototype intended to help trained responders organise reported concerns, review illustrative indicators, and coordinate case follow-up and referrals.",
  },
  {
    question: "Does SAHYOG AI diagnose trauma or a mental health condition?",
    answer:
      "No. The prototype is not a diagnostic or clinical assessment tool. Its illustrative indicators must not be treated as a diagnosis, a risk score, or a substitute for professional judgement.",
  },
  {
    question: "Does an indicator prove that someone is in danger?",
    answer:
      "No. An indicator only highlights text that matches a defined rule. It does not establish intent, severity, or whether someone is safe. Equally, no indicator does not mean there is no risk.",
  },
  {
    question: "Who should use this workspace?",
    answer:
      "It is designed around workflows for trained responders and support organisations. It is not a self-diagnosis tool or a replacement for qualified professional care.",
  },
];

function HomePage() {
  return (
    <main className="sahyog-home">
      <a className="sh-skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="sh-header">
        <Link to="/" className="sh-brand" aria-label="SAHYOG AI home">
          <span className="sh-brand-mark">
            <HeartHandshake size={25} strokeWidth={1.9} />
          </span>
          <span className="sh-brand-copy">
            <strong>
              SAHYOG<span> AI</span>
            </strong>
            <small>HUMAN SUPPORT WORKSPACE</small>
          </span>
        </Link>

        <nav className="sh-nav" aria-label="Main navigation">
          <a href="#approach">Our approach</a>
          <a href="#capabilities">What it offers</a>
          <a href="#workflow">How it works</a>
          <a href="#trust">Trust &amp; safety</a>
        </nav>

        <Link to="/dashboard" className="sh-header-cta">
          Responder portal <ArrowUpRight size={17} />
        </Link>
      </header>

      <div id="main-content">
        <section className="sh-hero">
          <div className="sh-hero-copy">
            <div className="sh-eyebrow">
              <span className="sh-eyebrow-dot" />
              SUPPORT THAT STARTS BY LISTENING
            </div>

            <h1>
              Every story deserves <em>care,</em> not judgement.
            </h1>

            <p className="sh-hero-lead">
              Supporting someone through distress starts with listening.
              SAHYOG AI helps trained responders organise reported concerns,
              review observable information, and coordinate appropriate
              support—with people at the centre of every decision.
            </p>

            <div className="sh-hero-actions">
              <Link to="/dashboard" className="sh-button sh-button-primary">
                Open responder workspace <ArrowRight size={18} />
              </Link>
              <a href="#approach" className="sh-text-link">
                Explore our approach <ArrowDownRight size={18} />
              </a>
            </div>

            <div className="sh-trust-row" aria-label="Our commitments">
              <span>
                <ShieldCheck size={18} /> Human oversight
              </span>
              <i />
              <span>
                <LockKeyhole size={17} /> Respectful by design
              </span>
              <i />
              <span>
                <HeartHandshake size={18} /> Person-centred
              </span>
            </div>

            <div className="sh-hero-note">
              <span className="sh-hero-note-icon">
                <HeartHandshake size={19} />
              </span>
              <p>
                <strong>A space for understanding, not judgement.</strong>
                <span>
                  Every person's circumstances deserve thoughtful human
                  attention.
                </span>
              </p>
            </div>
          </div>

          <div
            className="sh-hero-visual"
            role="img"
            aria-label="Illustration representing listening, understanding, and human-led support"
          >
            <div className="sh-visual-blob sh-visual-blob-one" />
            <div className="sh-visual-blob sh-visual-blob-two" />
            <div className="sh-orbit sh-orbit-one" />
            <div className="sh-orbit sh-orbit-two" />

            <div className="sh-visual-label">
              <span className="sh-live-dot" />
              A HUMAN-CENTRED APPROACH
            </div>

            <div className="sh-conversation-card">
              <div className="sh-card-top">
                <div className="sh-card-icon">
                  <MessageCircleHeart size={23} />
                </div>
                <div>
                  <strong>Listen first.</strong>
                  <small>Understand the context</small>
                </div>
                <span className="sh-card-kicker">01 / 04</span>
              </div>

              <div className="sh-quote">
                <span className="sh-quote-mark">“</span>
                <p>
                  Behind every report is a person who deserves to be heard
                  with dignity.
                </p>
              </div>

              <div className="sh-card-bottom">
                <div className="sh-avatar-stack" aria-hidden="true">
                  <span>R</span>
                  <span>H</span>
                  <span>
                    <HeartHandshake size={14} />
                  </span>
                </div>
                <span>People first. Always.</span>
                <CheckCircle2 size={19} />
              </div>
            </div>

            <div className="sh-floating-note sh-note-top">
              <span className="sh-note-icon sh-note-lavender">
                <BrainCircuit size={19} />
              </span>
              <span>
                <strong>Clearer information</strong>
                <small>Structured for review</small>
              </span>
            </div>

            <div className="sh-floating-note sh-note-bottom">
              <span className="sh-note-icon sh-note-green">
                <UsersRound size={19} />
              </span>
              <span>
                <strong>Human-led decisions</strong>
                <small>People remain in control</small>
              </span>
            </div>

            <div className="sh-visual-caption">
              A bridge between listening and support
            </div>
          </div>

          <a className="sh-scroll-cue" href="#problem">
            <span>Explore what we are solving</span>
            <ArrowDown size={16} />
          </a>
        </section>

        <section className="sh-principles-strip" id="trust">
          <div className="sh-strip-intro">
            <span className="sh-section-kicker">THE SAHYOG PROMISE</span>
            <strong>Technology in service of people.</strong>
          </div>

          <div className="sh-strip-item">
            <span className="sh-strip-icon sh-tone-mint">
              <ShieldCheck size={21} />
            </span>
            <span>
              <strong>Human oversight</strong>
              <small>People remain responsible for decisions.</small>
            </span>
          </div>

          <div className="sh-strip-item">
            <span className="sh-strip-icon sh-tone-lavender">
              <Sparkles size={21} />
            </span>
            <span>
              <strong>Transparent indicators</strong>
              <small>Observable text, not a diagnosis.</small>
            </span>
          </div>

          <div className="sh-strip-item">
            <span className="sh-strip-icon sh-tone-peach">
              <HeartHandshake size={21} />
            </span>
            <span>
              <strong>Dignity at every step</strong>
              <small>Respectful, person-centred support.</small>
            </span>
          </div>
        </section>

        <section className="sh-problem section-shell" id="problem">
          <div className="sh-problem-heading">
            <span className="sh-section-kicker">
              WHY A THOUGHTFUL WORKFLOW MATTERS
            </span>
            <h2>
              Supporting people is human work.
              <br />
              <em>Organising information can help.</em>
            </h2>
            <p>
              When someone shares a difficult experience, their words and
              circumstances matter. Responders need a clear way to organise
              information without reducing a person's experience to a label.
            </p>
          </div>

          <div className="sh-problem-grid">
            <article className="sh-problem-card sh-problem-card-coral">
              <span className="sh-problem-icon">
                <MessagesSquare size={24} />
              </span>
              <span className="sh-card-overline">THE CHALLENGE 01</span>
              <h3>Important context can be hard to organise</h3>
              <p>
                Concerns may arrive as free-text narratives or conversations.
                Structuring the information can help a responder review what
                was actually shared.
              </p>
              <div className="sh-problem-footer">
                <span>Clear documentation</span>
                <ArrowUpRight size={17} />
              </div>
            </article>

            <article className="sh-problem-card sh-problem-card-lavender">
              <span className="sh-problem-icon">
                <Eye size={24} />
              </span>
              <span className="sh-card-overline">THE CHALLENGE 02</span>
              <h3>Observable concerns need careful review</h3>
              <p>
                A phrase alone cannot explain a person's full situation.
                Information should be reviewed in context, not interpreted
                automatically as a conclusion.
              </p>
              <div className="sh-problem-footer">
                <span>Context before conclusions</span>
                <ArrowUpRight size={17} />
              </div>
            </article>

            <article className="sh-problem-card sh-problem-card-mint">
              <span className="sh-problem-icon">
                <HandHeart size={24} />
              </span>
              <span className="sh-card-overline">THE CHALLENGE 03</span>
              <h3>Follow-up requires coordination</h3>
              <p>
                Appropriate support may involve case follow-up and referrals.
                A focused workspace can help responders keep these tasks
                organised.
              </p>
              <div className="sh-problem-footer">
                <span>Connected next steps</span>
                <ArrowUpRight size={17} />
              </div>
            </article>
          </div>

          <div className="sh-solution-banner">
            <div className="sh-solution-mark">
              <HeartHandshake size={27} />
            </div>
            <div className="sh-solution-copy">
              <span className="sh-section-kicker">THE SAHYOG APPROACH</span>
              <h3>Structure the information. Never lose sight of the person.</h3>
              <p>
                Bring reported concerns, illustrative indicators, case
                information, and support coordination into a workflow that
                keeps trained responders in control.
              </p>
            </div>
            <Link to="/dashboard" className="sh-solution-link">
              Explore workspace <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <section
          className="sh-approach section-shell"
          id="approach"
        >
          <div className="sh-section-heading">
            <span className="sh-section-kicker">
              A MORE THOUGHTFUL WORKFLOW
            </span>
            <h2>
              From listening to the <em>right support.</em>
            </h2>
            <p>
              SAHYOG AI is designed to support the practical steps around a
              conversation—organising information, bringing attention to
              observable details, and helping responders coordinate next steps.
            </p>
          </div>

          <div className="sh-approach-grid">
            <article className="sh-approach-card sh-approach-mint">
              <span className="sh-step-number">01</span>
              <div className="sh-approach-icon">
                <MessageCircleHeart size={24} />
              </div>
              <h3>Listen with care</h3>
              <p>
                Capture reported words and concerns respectfully. The person
                is more than the information entered into a form.
              </p>
              <span className="sh-card-link">
                Start with the person <ChevronRight size={17} />
              </span>
            </article>

            <article className="sh-approach-card sh-approach-lavender">
              <span className="sh-step-number">02</span>
              <div className="sh-approach-icon">
                <BrainCircuit size={24} />
              </div>
              <h3>Organise the context</h3>
              <p>
                Structure the information so reported concerns can be
                considered more clearly by the responder.
              </p>
              <span className="sh-card-link">
                Make information clearer <ChevronRight size={17} />
              </span>
            </article>

            <article className="sh-approach-card sh-approach-peach">
              <span className="sh-step-number">03</span>
              <div className="sh-approach-icon">
                <Eye size={24} />
              </div>
              <h3>Review, don't assume</h3>
              <p>
                Use observable indicators as prompts for careful human review,
                never as proof of a person's intent or safety.
              </p>
              <span className="sh-card-link">
                Keep people in control <ChevronRight size={17} />
              </span>
            </article>

            <article className="sh-approach-card sh-approach-blue">
              <span className="sh-step-number">04</span>
              <div className="sh-approach-icon">
                <LifeBuoy size={24} />
              </div>
              <h3>Coordinate support</h3>
              <p>
                Consider appropriate follow-up and referral options based on
                the person's circumstances and professional judgement.
              </p>
              <span className="sh-card-link">
                Plan the next step <ChevronRight size={17} />
              </span>
            </article>
          </div>
        </section>

        <section className="sh-capabilities section-shell" id="capabilities">
          <div className="sh-capabilities-intro">
            <span className="sh-section-kicker">ONE FOCUSED WORKSPACE</span>
            <h2>
              Thoughtful tools for the work <em>around care.</em>
            </h2>
            <p>
              A responder's work involves more than one conversation. SAHYOG
              AI brings together a set of workflow areas intended to make
              information and follow-up easier to navigate.
            </p>
            <Link to="/dashboard" className="sh-button sh-button-primary">
              Explore the workspace <ArrowRight size={18} />
            </Link>
            <div className="sh-capabilities-note">
              <ShieldCheck size={18} />
              <span>
                A support tool for responders—not a replacement for human
                judgement.
              </span>
            </div>
          </div>

          <div className="sh-capabilities-grid">
            {capabilities.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  className={`sh-capability-card sh-capability-${item.tone}`}
                  key={item.number}
                >
                  <div className="sh-capability-top">
                    <span className="sh-capability-icon">
                      <Icon size={23} />
                    </span>
                    <span className="sh-capability-number">
                      {item.number}
                    </span>
                  </div>
                  <span className="sh-capability-tag">{item.tag}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="sh-capability-bottom">
                    <span>Designed for clarity</span>
                    <Check size={16} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="sh-workflow" id="workflow">
          <div className="sh-workflow-inner">
            <div className="sh-workflow-copy">
              <span className="sh-section-kicker">
                BUILT AROUND HUMAN JUDGEMENT
              </span>
              <h2>
                Make space for the <em>human part</em> of helping.
              </h2>
              <p>
                The goal is not to automate care. It is to help trained
                responders organise information and keep their attention on
                the person, their circumstances, and appropriate next steps.
              </p>
              <Link to="/dashboard" className="sh-button sh-button-light">
                Enter the workspace <ArrowRight size={18} />
              </Link>
              <div className="sh-workflow-caption">
                <LockKeyhole size={16} />
                Use fictional information when exploring this prototype.
              </div>
            </div>

            <div className="sh-workflow-list">
              <div>
                <span className="sh-workflow-check">
                  <CheckCircle2 size={20} />
                </span>
                <p>
                  <strong>Structured case overview</strong>
                  <small>
                    Keep relevant case information clear and organised.
                  </small>
                </p>
              </div>
              <div>
                <span className="sh-workflow-check">
                  <CheckCircle2 size={20} />
                </span>
                <p>
                  <strong>Visible, explainable indicators</strong>
                  <small>
                    Review observable text without treating it as a diagnosis.
                  </small>
                </p>
              </div>
              <div>
                <span className="sh-workflow-check">
                  <CheckCircle2 size={20} />
                </span>
                <p>
                  <strong>Human review at every important step</strong>
                  <small>
                    People—not automated indicators—remain responsible for
                    decisions.
                  </small>
                </p>
              </div>
              <div>
                <span className="sh-workflow-check">
                  <CheckCircle2 size={20} />
                </span>
                <p>
                  <strong>Follow-up and referral coordination</strong>
                  <small>
                    Help keep appropriate next steps visible to responders.
                  </small>
                </p>
              </div>
            </div>

            <div className="sh-workflow-watermark" aria-hidden="true">
              <HeartHandshake size={180} strokeWidth={0.7} />
            </div>
          </div>
        </section>

        <section className="sh-safety section-shell">
          <div className="sh-safety-heading">
            <span className="sh-section-kicker">
              CARE, CLARITY &amp; RESPONSIBILITY
            </span>
            <h2>
              Trust begins with <em>being honest.</em>
            </h2>
            <p>
              Support-related technology must be clear about what it can do
              and where human judgement is essential.
            </p>
          </div>

          <div className="sh-safety-grid">
            <article className="sh-safety-card">
              <span className="sh-safety-icon sh-tone-mint">
                <UsersRound size={23} />
              </span>
              <h3>People remain in control</h3>
              <p>
                Trained responders interpret information, consider context,
                and make decisions. An automated highlight is not a decision.
              </p>
            </article>

            <article className="sh-safety-card">
              <span className="sh-safety-icon sh-tone-lavender">
                <Eye size={23} />
              </span>
              <h3>Indicators have limits</h3>
              <p>
                Rule-based phrase matching can miss context and nuance. A
                highlighted phrase does not establish severity, intent, or
                whether a person is safe.
              </p>
            </article>

            <article className="sh-safety-card">
              <span className="sh-safety-icon sh-tone-peach">
                <LockKeyhole size={23} />
              </span>
              <h3>Respect personal information</h3>
              <p>
                This is a demonstration prototype. Use invented examples and
                do not enter real names, contact details, or personal reports
                while testing it.
              </p>
            </article>
          </div>

          <div className="sh-safety-notice">
            <span className="sh-safety-notice-icon">
              <ShieldCheck size={21} />
            </span>
            <p>
              <strong>Important to remember</strong>
              <span>
                SAHYOG AI is not a diagnostic tool, a validated clinical
                assessment, or an emergency service. The absence of an
                indicator does not mean that a person is safe.
              </span>
            </p>
          </div>
        </section>

        <section className="sh-faq section-shell" id="faq">
          <div className="sh-faq-heading">
            <span className="sh-section-kicker">
              A FEW THINGS WORTH KNOWING
            </span>
            <h2>
              Questions, answered <em>clearly.</em>
            </h2>
            <p>
              A little clarity about the purpose and limitations of this
              workspace.
            </p>
          </div>

          <div className="sh-faq-list">
            {faqs.map((faq, index) => (
              <details className="sh-faq-item" key={faq.question}>
                <summary>
                  <span className="sh-faq-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="sh-faq-question">{faq.question}</span>
                  <span className="sh-faq-toggle">
                    <ChevronRight size={19} />
                  </span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="sh-closing section-shell">
          <div className="sh-closing-decoration sh-closing-decoration-one" />
          <div className="sh-closing-decoration sh-closing-decoration-two" />

          <div className="sh-closing-mark">
            <HeartHandshake size={27} />
          </div>
          <span className="sh-section-kicker">
            SAHYOG AI · HUMAN SUPPORT WORKSPACE
          </span>
          <h2>
            Technology can assist.
            <br />
            <em>Compassion leads.</em>
          </h2>
          <p>
            A more organised workflow can support the people doing the
            helping. Thoughtful listening, human judgement, and dignity
            remain at the heart of the process.
          </p>
          <Link to="/dashboard" className="sh-button sh-button-primary">
            Open responder workspace <ArrowRight size={18} />
          </Link>
          <div className="sh-closing-footnote">
            <ShieldCheck size={16} />
            Designed to support trained responders—not replace professional
            care.
          </div>
        </section>
      </div>

      <footer className="sh-footer">
        <div className="sh-footer-main">
          <Link to="/" className="sh-footer-brand">
            <span className="sh-footer-brand-icon">
              <HeartHandshake size={21} />
            </span>
            <span>
              <strong>SAHYOG AI</strong>
              <small>Human support workspace</small>
            </span>
          </Link>

          <p>
            Thoughtful technology. Human-centred support.
          </p>

          <a href="#main-content" className="sh-back-top">
            Back to top <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="sh-footer-bottom">
          <span>© SAHYOG AI · Prototype demonstration</span>
          <span className="sh-footer-note">
            Not an emergency service or a substitute for professional care.
          </span>
        </div>
      </footer>
    </main>
  );
}
