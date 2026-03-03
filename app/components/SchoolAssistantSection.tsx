"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { safeTrack } from "../../lib/analytics";

type AssistantSource = {
  label: string;
  href: string;
};

type AssistantApiResponse = {
  status: "answered" | "escalate";
  answer: string;
  confidence: number;
  sources: AssistantSource[];
  followUps: string[];
};

type Message = {
  role: "assistant" | "user";
  text: string;
  status?: "answered" | "escalate";
  sources?: AssistantSource[];
  followUps?: string[];
};

const starterPrompts = [
  "What are the term dates this year?",
  "How do I apply for Year 7?",
  "Where can I find uniform guidance?",
  "How do I access Edulink?",
];

export default function SchoolAssistantSection() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Ask me about admissions, term dates, uniform, transport, clubs, lunches and parent information. I only answer from school-published information.",
      status: "answered",
    },
  ]);

  const latestAssistant = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === "assistant") return messages[i];
    }
    return null;
  }, [messages]);

  const submitQuestion = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    safeTrack("assistant_question_submitted", { location: "homepage" });

    try {
      const response = await fetch("/api/school-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = (await response.json()) as AssistantApiResponse | { error?: string };

      if (!response.ok || !("answer" in data)) {
        const fallback = (data && "error" in data && data.error) || "I could not answer that right now.";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `${fallback} Please contact school reception for direct support.`,
            status: "escalate",
            sources: [{ label: "Contact reception", href: "/contact#message" }],
          },
        ]);
        safeTrack("assistant_response_error", { location: "homepage" });
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
          status: data.status,
          sources: data.sources,
          followUps: data.followUps,
        },
      ]);

      safeTrack("assistant_response_received", {
        location: "homepage",
        status: data.status,
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I could not connect right now. Please contact school reception for direct help.",
          status: "escalate",
          sources: [{ label: "Contact reception", href: "/contact#message" }],
        },
      ]);
      safeTrack("assistant_response_error", { location: "homepage" });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitQuestion(input);
  };

  return (
    <section id="ask-morpeth" className="scroll-mt-24 bg-white" data-kpi-section="ai-assistant">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-6 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-5 md:grid-cols-[1.1fr,1fr] md:p-7">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
              AI school assistant
            </p>
            <h2 className="mt-2 text-xl font-heading uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.55rem]">
              Ask Morpeth
            </h2>
            <p className="mt-3 text-sm text-slate-700">
              Grounded responses from school-published pages. If confidence is low, it escalates you to staff.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
                  onClick={() => submitQuestion(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={message.role === "user" ? "text-right" : "text-left"}>
                  <div
                    className={`inline-block max-w-[95%] rounded-2xl px-3 py-2 text-sm ${
                      message.role === "user" ? "bg-morpeth-navy text-white" : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {latestAssistant?.sources && latestAssistant.sources.length > 0 ? (
              <div className="mt-4 border-t border-slate-200 pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Sources</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {latestAssistant.sources.map((source) => {
                    const isExternal = source.href.startsWith("http") || source.href.startsWith("mailto:") || source.href.startsWith("tel:");
                    if (isExternal) {
                      return (
                        <a
                          key={`${source.label}-${source.href}`}
                          href={source.href}
                          target={source.href.startsWith("http") ? "_blank" : undefined}
                          rel={source.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 hover:bg-slate-50"
                        >
                          {source.label}
                        </a>
                      );
                    }
                    return (
                      <Link
                        key={`${source.label}-${source.href}`}
                        href={source.href}
                        className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 hover:bg-slate-50"
                      >
                        {source.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {latestAssistant?.followUps && latestAssistant.followUps.length > 0 ? (
              <p className="mt-3 text-xs text-slate-600">{latestAssistant.followUps[0]}</p>
            ) : null}

            <form onSubmit={onSubmit} className="mt-4 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a question..."
                className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                aria-label="Ask the Morpeth assistant"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-morpeth-navy px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Ask"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
