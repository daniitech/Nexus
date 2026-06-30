import { useEffect, useRef } from "react";

export function CursorEffect() {
  const dotRef = useRef<HTMLDivElement>(null);
  const lastTrail = useRef(0);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      const now = performance.now();
      if (now - lastTrail.current > 35) {
        lastTrail.current = now;
        const trail = document.createElement("div");
        trail.className = "cursor-trail";
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 600);
      }
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.25;
      currentY += (targetY - currentY) * 0.25;
      dot.style.left = `${currentX}px`;
      dot.style.top = `${currentY}px`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={dotRef} className="cursor-laser hidden md:block" aria-hidden />;
}
