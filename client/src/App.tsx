import { useState, useEffect, useRef } from "react";

// ── Waveform icon (Sound Wave Bee concept) ──────────────────────────────────
function WaveformBeeIcon({ size = 40, animated = false }: { size?: number; animated?: boolean }) {
  const bars = [3, 6, 9, 12, 9, 6, 3];
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Bee body dot (microphone) */}
      <circle cx="20" cy="24" r="3.5" fill="#F5A623" />
      {/* Waveform wings */}
      {bars.map((h, i) => (
        <rect
          key={i}
          x={4 + i * 5}
          y={16 - h / 2}
          width="3"
          height={h}
          rx="1.5"
          fill="#F5A623"
          style={
            animated
              ? {
                  transformOrigin: `${5.5 + i * 5}px ${16}px`,
                  animation: `wave 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.12}s`,
                }
              : undefined
          }
        />
      ))}
    </svg>
  );
}

// ── Waveform animation (listening state) ───────────────────────────────────
function ListeningWave({ active }: { active: boolean }) {
  const heights = [20, 35, 55, 70, 55, 35, 20, 35, 55, 70, 55, 35, 20];
  return (
    <div className="flex items-center gap-[3px] h-16">
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-honey"
          style={{
            height: active ? `${h}%` : "15%",
            transition: "height 0.15s ease",
            animation: active ? `wave 1.2s ease-in-out infinite` : undefined,
            animationDelay: active ? `${i * 0.08}s` : undefined,
            opacity: active ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}

// ── Voice command demo ──────────────────────────────────────────────────────
const DEMO_COMMANDS = [
  { command: "Schedule a team lunch Friday at noon", response: "Done — Team Lunch added for Friday, April 18 at 12:00 PM." },
  { command: "Move my 3pm meeting to Thursday", response: "Got it — moved to Thursday, April 17 at 3:00 PM." },
  { command: "What's my day look like tomorrow?", response: "Tomorrow you have 3 events: Standup at 9am, Design review at 1pm, and dinner at 7pm." },
  { command: "Find 45 minutes for focused work this week", response: "Found it — Tuesday 10:15 AM to 11:00 AM is open. Want me to block it?" },
];

function VoiceDemoCard() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [phase, setPhase] = useState<"idle" | "listening" | "responding" | "done">("idle");
  const [displayedResponse, setDisplayedResponse] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = (idx: number) => {
    setActiveIdx(idx);
    setDisplayedResponse("");
    setPhase("listening");

    timerRef.current = setTimeout(() => {
      setPhase("responding");
      const response = DEMO_COMMANDS[idx].response;
      let i = 0;
      const type = () => {
        setDisplayedResponse(response.slice(0, i + 1));
        i++;
        if (i < response.length) {
          timerRef.current = setTimeout(type, 22);
        } else {
          setPhase("done");
          timerRef.current = setTimeout(() => {
            run((idx + 1) % DEMO_COMMANDS.length);
          }, 3000);
        }
      };
      type();
    }, 1800);
  };

  useEffect(() => {
    const t = setTimeout(() => run(0), 800);
    return () => {
      clearTimeout(t);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const current = DEMO_COMMANDS[activeIdx];

  return (
    <div className="relative bg-navy-light rounded-2xl border border-white/10 p-6 max-w-md w-full shadow-2xl">
      {/* Phone chrome */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-red-400/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
        <div className="w-2 h-2 rounded-full bg-green-400/60" />
        <span className="ml-2 text-xs text-white/30 font-mono">Busy Bee</span>
      </div>

      {/* Command chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {DEMO_COMMANDS.map((d, i) => (
          <button
            key={i}
            onClick={() => {
              if (timerRef.current) clearTimeout(timerRef.current);
              run(i);
            }}
            className={`text-xs px-3 py-1 rounded-full border transition-all ${
              i === activeIdx
                ? "bg-honey text-navy border-honey"
                : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/70"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* User voice command */}
      <div className="flex items-start gap-3 mb-4">
        <div className="mt-1 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xs">
          You
        </div>
        <div className="bg-white/8 rounded-xl rounded-tl-none px-4 py-3 text-sm text-white/90 flex-1">
          "{current.command}"
        </div>
      </div>

      {/* Waveform listening */}
      <div className="flex justify-center mb-4">
        <div className={`transition-all duration-300 ${phase === "listening" ? "animate-pulse-glow rounded-full p-3" : "p-3"}`}>
          <ListeningWave active={phase === "listening"} />
        </div>
      </div>

      {/* Assistant response */}
      <div className="flex items-start gap-3 min-h-[60px]">
        <div className="mt-1 w-7 h-7 rounded-full bg-honey/20 flex items-center justify-center flex-shrink-0">
          <WaveformBeeIcon size={16} />
        </div>
        <div className="bg-honey/10 border border-honey/20 rounded-xl rounded-tl-none px-4 py-3 text-sm text-honey flex-1">
          {phase === "listening" && <span className="text-white/40 italic">Listening…</span>}
          {(phase === "responding" || phase === "done") && (
            <>
              {displayedResponse}
              {phase === "responding" && <span className="inline-block w-0.5 h-3.5 bg-honey ml-0.5 animate-pulse" />}
            </>
          )}
          {phase === "idle" && <span className="text-white/20">...</span>}
        </div>
      </div>
    </div>
  );
}

// ── Waitlist form ───────────────────────────────────────────────────────────
function WaitlistForm({ source = "hero", dark = false }: { source?: string; dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (res.ok || res.status === 200) {
        setStatus(data.message === "already_registered" ? "duplicate" : "success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 bg-honey/10 border border-honey/30 rounded-xl px-5 py-4 max-w-md">
        <span className="text-2xl">🐝</span>
        <div>
          <p className="font-semibold text-honey">You're on the list!</p>
          <p className="text-sm text-white/60">We'll email you the moment Busy Bee launches.</p>
        </div>
      </div>
    );
  }

  if (status === "duplicate") {
    return (
      <div className="flex items-center gap-3 bg-white/5 border border-white/20 rounded-xl px-5 py-4 max-w-md">
        <span className="text-2xl">✓</span>
        <div>
          <p className="font-semibold text-white/90">Already on the list!</p>
          <p className="text-sm text-white/50">You're already signed up. We'll be in touch soon.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all border ${
          dark
            ? "bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-honey focus:bg-white/15"
            : "bg-navy border-navy-light text-white placeholder-white/40 focus:border-honey"
        }`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-honey hover:bg-honey-dark text-navy font-bold px-6 py-3 rounded-xl text-sm transition-all disabled:opacity-60 whitespace-nowrap flex-shrink-0 shadow-lg shadow-honey/20"
      >
        {status === "loading" ? "Joining…" : "Get Early Access"}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-xs mt-1 sm:col-span-2">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}

// ── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-navy/95 backdrop-blur-md border-b border-white/10 py-3" : "py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WaveformBeeIcon size={28} animated />
          <span className="font-bold text-lg tracking-tight">
            <span className="text-honey">Busy</span>{" "}
            <span className="text-white">Bee</span>
          </span>
        </div>
        <a
          href="#waitlist"
          className="bg-honey hover:bg-honey-dark text-navy font-semibold px-4 py-2 rounded-lg text-sm transition-all"
        >
          Get Early Access
        </a>
      </div>
    </nav>
  );
}

// ── Features ────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "🎙️",
    title: "Voice-first scheduling",
    desc: "Create, move, and check events by speaking. No unlock, no tap, no context switch.",
  },
  {
    icon: "🤖",
    title: "AI conflict resolution",
    desc: "Busy Bee automatically reschedules when things overlap — and tells you what it moved.",
  },
  {
    icon: "💬",
    title: "Natural language",
    desc: "Talk like a human. \"Move my dentist to next week\" just works.",
  },
  {
    icon: "🔗",
    title: "Works with your calendar",
    desc: "Connects with Google Calendar, iCloud, and Outlook. Your existing events, now voice-controlled.",
  },
  {
    icon: "🛡️",
    title: "Focus time protection",
    desc: "Busy Bee defends your deep work blocks. Meetings can't eat into them without your OK.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Shared calendar support",
    desc: "Manage family and team schedules. Say \"Schedule dinner with the family Saturday\" and it's done.",
  },
];

// ── Personas ─────────────────────────────────────────────────────────────────
const PERSONAS = [
  {
    emoji: "🚗",
    role: "Sales reps on the road",
    quote: "I reschedule three calls a day. I used to pull over to do it. Now I just say it.",
  },
  {
    emoji: "👩‍👧‍👦",
    role: "Parents juggling everything",
    quote: "My hands are always full — literally. Busy Bee is the first calendar app that gets that.",
  },
  {
    emoji: "🎓",
    role: "Students between classes",
    quote: "Walking to my next class, I just say what I need. By the time I get there, it's on my calendar.",
  },
  {
    emoji: "🔧",
    role: "Field workers",
    quote: "I can't be tapping on a phone all day. Voice scheduling is the only thing that works for my job.",
  },
];

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-navy font-sans">
      <Nav />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-honey/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl w-full mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-honey/10 border border-honey/20 rounded-full px-4 py-1.5 text-sm text-honey mb-6">
              <WaveformBeeIcon size={16} />
              Launching April 14, 2026 — Join the waitlist
            </div>

            <h1 className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              <span className="text-white">Say it.</span>
              <br />
              <span className="text-gradient">Scheduled.</span>
            </h1>

            <p className="text-lg text-white/70 leading-relaxed mb-4 max-w-lg">
              Busy Bee is the voice-first calendar assistant that schedules your life{" "}
              <strong className="text-white/90">while your hands are full.</strong>
            </p>
            <p className="text-base text-white/50 mb-8 max-w-lg">
              No typing, no tapping, no switching apps. Just talk — and it's done.
            </p>

            <WaitlistForm source="hero" />

            <p className="text-xs text-white/30 mt-3">
              Free early access · iOS · No spam, ever
            </p>
          </div>

          {/* Right: demo */}
          <div className="flex justify-center lg:justify-end">
            <VoiceDemoCard />
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-y border-white/10 bg-navy-dark py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-white/50 text-center">
          <span>📅 Google Calendar · iCloud · Outlook</span>
          <span>🔒 Your data stays yours</span>
          <span>📱 iOS — iPhone & iPad</span>
          <span>🐝 Built by Vorentoe</span>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Your calendar finally <span className="text-gradient">listens.</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Everything a modern calendar should do — controlled entirely by your voice.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-navy-light border border-white/8 rounded-2xl p-6 hover:border-honey/30 transition-all group"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-honey transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voice commands showcase */}
      <section className="py-20 px-6 bg-navy-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Just say what you need.
          </h2>
          <p className="text-white/50 mb-12">Real commands. Real results.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Schedule a team lunch Friday at noon",
              "Move my dentist appointment to next week",
              "What's tomorrow look like?",
              "Find 45 minutes for focused work this week",
              "Block Thursday afternoon — I need to prep",
              "Remind me about the Johnson proposal at 8am Monday",
            ].map((cmd) => (
              <div
                key={cmd}
                className="flex items-center gap-3 bg-navy border border-white/10 rounded-xl px-5 py-4 text-left"
              >
                <span className="text-honey text-lg flex-shrink-0">🎙️</span>
                <span className="text-sm text-white/80 italic">"{cmd}"</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built for people who are <span className="text-gradient">always moving.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PERSONAS.map((p) => (
              <div
                key={p.role}
                className="bg-navy-light border border-white/8 rounded-2xl p-6"
              >
                <div className="text-4xl mb-4">{p.emoji}</div>
                <p className="text-sm font-semibold text-honey mb-3">{p.role}</p>
                <p className="text-sm text-white/60 italic leading-relaxed">"{p.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clockwise migration */}
      <section className="py-20 px-6 bg-navy-dark border-y border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 text-sm text-red-400 mb-6">
            📢 Clockwise shut down March 27, 2026
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Switching from Clockwise?
          </h2>
          <p className="text-white/60 mb-4 leading-relaxed">
            Clockwise was the best smart scheduler out there. Now it's gone — and Reclaim is built for enterprise teams, not individual iPhone users.
          </p>
          <p className="text-white/60 mb-8 leading-relaxed">
            Busy Bee picks up where Clockwise left off: AI-powered scheduling, conflict resolution, and focus time protection — all on iOS, all by voice.
          </p>
          <div className="flex flex-col items-center gap-4">
            <WaitlistForm source="clockwise" />
            <p className="text-sm text-honey">
              Clockwise users get free early access + 1 free month of Busy Bee Premium.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="waitlist" className="py-28 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <WaveformBeeIcon size={56} animated />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            <span className="text-gradient">Say it.</span> Scheduled.
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            Join the waitlist. Be first when Busy Bee launches April 14.
          </p>
          <div className="flex justify-center">
            <WaitlistForm source="footer" />
          </div>
          <p className="text-xs text-white/25 mt-4">
            iOS only · Free early access · No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <WaveformBeeIcon size={18} />
            <span>Busy Bee by Vorentoe</span>
          </div>
          <p>© 2026 Vorentoe. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="mailto:shannon@govorentoe.com" className="hover:text-white/60 transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-white/60 transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
