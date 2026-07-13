"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function HeroLogo() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;

    function updateLogoState() {
      frameId = 0;
      const heroHeight =
        document.getElementById("inicio")?.offsetHeight || window.innerHeight;
      const progress = window.scrollY / heroHeight;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    }

    function handleScroll() {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateLogoState);
    }

    updateLogoState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const opacity = Math.max(0, 1 - scrollProgress);
  const scale = 1 - scrollProgress * 0.1;

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-20 z-20 flex w-[clamp(9rem,32vw,22rem)] items-center justify-center min-[420px]:top-24 sm:w-[clamp(7.2rem,25.6vw,17.6rem)] md:top-28 xl:w-[clamp(12.8rem,19.2vw,20.8rem)]"
      style={{
        opacity,
        transform: `translateX(-50%) scale(${scale})`,
        transition: "opacity 400ms ease-out, transform 400ms ease-out",
        willChange: "opacity, transform"
      }}
    >
      <Image
        src="/logo.svg"
        alt="Tertulias Criollas"
        width={320}
        height={140}
        className="h-auto w-full object-contain"
        priority
      />
    </div>
  );
}
