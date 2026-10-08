"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export interface AccountLoginGateProps {
  isLoggingIn: boolean;
  loginError: string | null;
  onClearError: () => void;
  onLogin: (masterName: string, characterName: string) => Promise<boolean>;
}

/**
 * Fregio angolare cesellato in oro antico in stile Manuale D&D 5e
 */
function DndCornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className={`w-7 h-7 text-[#d4a74a]/75 pointer-events-none select-none ${className}`}
    >
      <path
        d="M2 34V8C2 4.686 4.686 2 8 2H34"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M6 34V10L10 6H34" stroke="currentColor" strokeWidth="0.9" />
      <polygon points="6,6 11,6 6,11" fill="currentColor" />
      <circle cx="13" cy="13" r="1.4" fill="currentColor" />
    </svg>
  );
}

/**
 * Emblema Dado d20 sfaccettato inciso in oro antico
 */
function D20Emblem() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Bagliore radiale dietro il d20 */}
      <div
        aria-hidden="true"
        className="absolute w-20 h-20 rounded-full bg-[#d4a74a]/15 blur-xl pointer-events-none"
      />
      <svg
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
        className="w-16 h-16 sm:w-18 sm:h-18 text-[#e5be67] drop-shadow-[0_4px_14px_rgba(212,167,74,0.3)]"
      >
        {/* Esagono esterno dell'icosaedro */}
        <polygon
          points="50,5 91,28 91,72 50,95 9,72 9,28"
          stroke="currentColor"
          strokeWidth="2.2"
          fill="rgba(22, 15, 12, 0.88)"
        />
        {/* Triangolo centrale */}
        <polygon
          points="50,21 77,67 23,67"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="rgba(140, 29, 20, 0.28)"
        />
        {/* Spigoli interni sfaccettature d20 */}
        <line
          x1="50"
          y1="5"
          x2="50"
          y2="21"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <line
          x1="91"
          y1="28"
          x2="50"
          y2="21"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <line
          x1="9"
          y1="28"
          x2="50"
          y2="21"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <line
          x1="91"
          y1="28"
          x2="77"
          y2="67"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <line
          x1="9"
          y1="28"
          x2="23"
          y2="67"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <line
          x1="91"
          y1="72"
          x2="77"
          y2="67"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <line
          x1="9"
          y1="72"
          x2="23"
          y2="67"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <line
          x1="50"
          y1="95"
          x2="77"
          y2="67"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <line
          x1="50"
          y1="95"
          x2="23"
          y2="67"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        {/* Numero 20 inciso al centro */}
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fill="#f7e3a8"
          className="font-dnd-display font-bold text-[19px] tracking-wider"
        >
          20
        </text>
      </svg>
    </div>
  );
}

const TROLL_TEXT = "D2------------------------------------------------povero illuso";
const TROLL_CHARS = Array.from(TROLL_TEXT);
const FLIGHT_DURATION_MS = 3600;

/**
 * Animazione matematica a 60/120fps tramite requestAnimationFrame:
 * - Parte fuori dallo schermo a sinistra (`x = -width`)
 * - Attraversa lo schermo lungo una traiettoria sinusoidale fluida fino a uscire a destra (`x = viewportWidth`)
 * - Ogni singolo carattere ondeggia in sequenza ("ola" sinusoidale) mentre scorre
 * - Sparisce automaticamente appena oltrepassa il bordo destro
 */
function TrollWaveFlight({ onComplete }: { onComplete: () => void }) {
  const phraseRef = useRef<HTMLDivElement | null>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let rafId = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / FLIGHT_DURATION_MS);

      const el = phraseRef.current;
      if (el) {
        const vw = window.innerWidth || 1200;
        const textWidth = el.offsetWidth || 650;

        // Parte completamente fuori a sinistra e termina completamente fuori a destra
        const startX = -textWidth - 40;
        const endX = vw + 40;
        const currentX = startX + (endX - startX) * progress;

        // Traiettoria sinusoidale globale dell'intera scritta (3.5 onde lungo lo schermo)
        const waveTrajectoryAngle = progress * Math.PI * 3.5;
        const trajectoryY = Math.sin(waveTrajectoryAngle) * 42;
        const trajectoryTilt = Math.cos(waveTrajectoryAngle) * 4;

        el.style.transform = `translate3d(${currentX.toFixed(1)}px, ${trajectoryY.toFixed(1)}px, 0) rotate(${trajectoryTilt.toFixed(2)}deg)`;
        el.style.opacity = "1";

        // Onda sequenziale sulle singole lettere
        const baseCharPhase = progress * Math.PI * 11;
        for (let i = 0; i < TROLL_CHARS.length; i++) {
          const span = charRefs.current[i];
          if (!span) continue;
          const phase = baseCharPhase - i * 0.36;
          const charY = Math.sin(phase) * 16;
          const charRot = Math.cos(phase) * 7;
          span.style.transform = `translate3d(0, ${charY.toFixed(1)}px, 0) rotate(${charRot.toFixed(1)}deg)`;
        }
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        onCompleteRef.current();
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex items-center overflow-hidden"
    >
      <div
        ref={phraseRef}
        style={{
          transform: "translate3d(-120vw, 0, 0)",
          opacity: 0,
          willChange: "transform",
        }}
        className="font-dnd-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-widest text-[#f604003f] whitespace-nowrap flex items-center"
      >
        {TROLL_CHARS.map((ch, idx) => (
          <span
            key={idx}
            ref={(node) => {
              charRefs.current[idx] = node;
            }}
            style={{
              display: "inline-block",
              willChange: "transform",
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Schermata di accesso minimale a tema Grimorio Scuro & Oro Antico D&D 5e.
 */
export function AccountLoginGate({
  isLoggingIn,
  loginError,
  onClearError,
  onLogin,
}: AccountLoginGateProps) {
  const [masterName, setMasterName] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [trollRunId, setTrollRunId] = useState<number>(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterName.trim() || !characterName.trim() || isLoggingIn) return;
    const ok = await onLogin(masterName, characterName);
    if (!ok) {
      setTrollRunId((prev) => prev + 1);
      cardRef.current?.animate(
        [
          { transform: "translate3d(0, 0, 0)" },
          { transform: "translate3d(-10px, 0, 0) rotate(-1deg)" },
          { transform: "translate3d(9px, 0, 0) rotate(1deg)" },
          { transform: "translate3d(-7px, 0, 0) rotate(-0.6deg)" },
          { transform: "translate3d(6px, 0, 0) rotate(0.6deg)" },
          { transform: "translate3d(0, 0, 0)" },
        ],
        { duration: 460, easing: "cubic-bezier(0.36, 0.07, 0.19, 0.97)" }
      );
    }
  };

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#090605] text-[#f3e7d3] relative overflow-hidden select-none">
      {/* Atmosfera radiale: brace rosso drago e bagliore oro antico */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(140,29,20,0.24),transparent_58%),radial-gradient(circle_at_50%_75%,rgba(197,155,39,0.10),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.92)]"
      />

      {/* Animazione Troll volante fluida e ondeggiata da sinistra verso destra */}
      {trollRunId > 0 && (
        <TrollWaveFlight
          key={`troll-fly-${trollRunId}`}
          onComplete={() => setTrollRunId(0)}
        />
      )}

      {/* Placca Grimorio D&D con unico bordo esterno sottile e fregi angolari */}
      <div
        ref={cardRef}
        className={`relative z-10 w-full max-w-[390px] bg-[#120c0a]/95 border transition-colors duration-300 ${
          trollRunId > 0 ? "border-[#b8281c]" : "border-[#c59b27]/25"
        } shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95),0_0_40px_-10px_rgba(140,29,20,0.3)] px-7 py-9 sm:px-9 sm:py-11`}
      >
        {/* 4 Fregi angolari cesellati allineati all'unico bordo esterno */}
        <DndCornerOrnament className="absolute -top-[2px] -left-[2px]" />
        <DndCornerOrnament className="absolute -top-[2px] -right-[2px] rotate-90" />
        <DndCornerOrnament className="absolute -bottom-[2px] -right-[2px] rotate-180" />
        <DndCornerOrnament className="absolute -bottom-[2px] -left-[2px] -rotate-90" />

        {/* Emblema d20 + Titolo scolpito */}
        <div className="relative flex flex-col items-center text-center mb-8">
          <D20Emblem />

          <h1 className="font-dnd-display mt-4 text-lg sm:text-xl font-bold uppercase tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-b from-[#fff3d1] via-[#e5be67] to-[#b58428]">
            Manuale del Giocatore
          </h1>

          {/* Divisore simmetrico con diamante centrale rosso/oro */}
          <div
            aria-hidden="true"
            className="mt-3.5 flex items-center justify-center gap-2.5 w-48"
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c59b27]/70" />
            <span className="w-2 h-2 rotate-45 bg-[#8c1d14] border border-[#e5be67]" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c59b27]/70" />
          </div>
        </div>

        {/* Form Minimale */}
        <form onSubmit={handleSubmit} className="relative flex flex-col gap-5">
          {/* Campo 1: MASTER */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="dnd-master-name"
              className="font-dnd-display text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d4a74a]/90 text-center"
            >
              Master
            </label>
            <input
              id="dnd-master-name"
              type="text"
              required
              autoComplete="off"
              value={masterName}
              onChange={(e) => {
                setMasterName(e.target.value);
                if (loginError) onClearError();
              }}
              className="font-dnd-serif w-full px-4 py-2.5 bg-[#090605]/90 border border-[#c59b27]/40 text-center text-lg tracking-wider text-[#f7ecd8] placeholder:text-[#ede2d0]/20 focus:outline-none focus:border-[#e5be67] focus:shadow-[0_0_18px_-3px_rgba(212,167,74,0.35)] transition"
            />
          </div>

          {/* Campo 2: PERSONAGGIO */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="dnd-character-name"
              className="font-dnd-display text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d4a74a]/90 text-center"
            >
              Personaggio
            </label>
            <input
              id="dnd-character-name"
              type="text"
              required
              autoComplete="off"
              value={characterName}
              onChange={(e) => {
                setCharacterName(e.target.value);
                if (loginError) onClearError();
              }}
              className="font-dnd-serif w-full px-4 py-2.5 bg-[#090605]/90 border border-[#c59b27]/40 text-center text-lg tracking-wider text-[#f7ecd8] placeholder:text-[#ede2d0]/20 focus:outline-none focus:border-[#e5be67] focus:shadow-[0_0_18px_-3px_rgba(212,167,74,0.35)] transition"
            />
          </div>

          {/* Bottone ENTRA */}
          <button
            type="submit"
            disabled={
              isLoggingIn || !masterName.trim() || !characterName.trim()
            }
            className="font-dnd-display mt-2 relative w-full py-3 px-6 text-xs sm:text-sm font-bold uppercase tracking-[0.32em] text-[#f9ebd2] bg-gradient-to-b from-[#962016] via-[#75160e] to-[#520e08] hover:from-[#ad261b] hover:via-[#8a1b12] hover:to-[#63120b] border border-[#d4a74a]/75 shadow-[0_6px_20px_-4px_rgba(140,29,20,0.6),inset_0_1px_0_rgba(255,235,180,0.25)] disabled:opacity-35 disabled:pointer-events-none active:scale-[0.99] transition cursor-pointer flex items-center justify-center gap-3"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#e5be67]" />
            ) : (
              <>
                <span className="w-1.5 h-1.5 rotate-45 bg-[#e5be67]" />
                <span>Entra</span>
                <span className="w-1.5 h-1.5 rotate-45 bg-[#e5be67]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
