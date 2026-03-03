"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { safeTrack } from "../../lib/analytics";

const SCROLL_MILESTONES = [25, 50, 75, 90] as const;

export default function ContinuousImprovementTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const path = pathname || "/";
    if (lastTrackedPath.current === path) return;
    lastTrackedPath.current = path;

    safeTrack("page_view", {
      path,
      low_bandwidth: document.documentElement.dataset.lowBandwidth === "true" ? "on" : "off",
      readable_text: document.documentElement.dataset.readableText === "true" ? "on" : "off",
      high_contrast: document.documentElement.dataset.highContrast === "true" ? "on" : "off",
    });
  }, [pathname]);

  useEffect(() => {
    const path = pathname || "/";
    const hitMilestones = new Set<number>();

    const onScroll = () => {
      const scrollRoot = document.documentElement;
      const scrollableHeight = scrollRoot.scrollHeight - scrollRoot.clientHeight;
      if (scrollableHeight <= 0) return;

      const depth = Math.max(0, Math.min(100, Math.round((window.scrollY / scrollableHeight) * 100)));
      SCROLL_MILESTONES.forEach((milestone) => {
        if (depth >= milestone && !hitMilestones.has(milestone)) {
          hitMilestones.add(milestone);
          safeTrack("scroll_depth", { path, depth: milestone });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    const path = pathname || "/";
    const trackedSections = new Set<string>();
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-kpi-section]"));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const sectionName = (entry.target as HTMLElement).dataset.kpiSection;
          if (!sectionName || trackedSections.has(sectionName)) return;
          trackedSections.add(sectionName);
          safeTrack("section_view", { path, section: sectionName });
        });
      },
      { threshold: 0.45 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
