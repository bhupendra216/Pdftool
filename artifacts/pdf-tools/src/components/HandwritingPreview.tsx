import React, { useEffect, useState } from 'react';

export const HANDWRITING_STYLES = [
  { value: 'caveat', label: 'Caveat' },
  { value: 'italianno', label: 'Italianno' },
  { value: 'tangerine', label: 'Tangerine' },
  { value: 'parisienne', label: 'Parisienne' },
  { value: 'amiri', label: 'Amiri' },
  { value: 'tillana', label: 'Tillana' },
  { value: 'nanum-pen-script', label: 'Nanum Pen Script' },
] as const;

export type HandwritingStyle = (typeof HANDWRITING_STYLES)[number]['value'];

export const handwritingStyleOptions = HANDWRITING_STYLES;

const FONT_NAMES: HandwritingStyle[] = ['caveat', 'italianno', 'tangerine', 'parisienne', 'amiri', 'tillana', 'nanum-pen-script'];

// Module-level caches to avoid repeated network loads across mounts
let rendererPromise: Promise<any> | null = null;
const fontCache: Record<string, any> = {};

export function HandwritingPreview({ text, style = 'caveat', className = '' }: { text?: string; style?: HandwritingStyle; className?: string }) {
  const [Renderer, setRenderer] = useState<any | null>(null);
  const [font, setFont] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Load Tegaki renderer once
  useEffect(() => {
    let mounted = true;
    setLoading((s) => s || true);

    if (!rendererPromise) {
      rendererPromise = import('tegaki').then((mod) => mod.TegakiRenderer || mod.default || null);
    }

    rendererPromise
      .then((R) => {
        if (!mounted) return;
        setRenderer(() => R);
      })
      .catch(() => {
        // ignore
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Load only the selected font (and cache it)
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    async function loadFont(s: HandwritingStyle) {
      if (fontCache[s]) {
        if (mounted) {
          setFont(fontCache[s]);
          setLoading(false);
        }
        return;
      }

      try {
        const m = await import(/* @vite-ignore */ `tegaki/fonts/${s}`);
        const f = m.default || m;
        fontCache[s] = f;
        if (mounted) {
          setFont(f);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) setLoading(false);
      }
    }

    loadFont(style as HandwritingStyle);

    return () => {
      mounted = false;
    };
  }, [style]);

  const displayText = (text || 'Handwriting preview').trim() || 'Handwriting preview';

  const wrapperClass = ['rounded-[2rem] border border-border/70 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-5 shadow-sm', className]
    .filter(Boolean)
    .join(' ');

  // Immediate lightweight CSS-based preview to reduce perceived load time.
  const cssPreview = (
    <div className={wrapperClass}>
      <div style={{ minHeight: 160, padding: 16 }}>
        <div
          style={{
            fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
            lineHeight: 1.4,
            color: '#111827',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            // CSS cursive fallback to approximate handwriting when Tegaki not loaded
            fontFamily: {
              caveat: "'Caveat', 'Brush Script MT', 'Segoe Script', cursive",
              italianno: "'Italianno', 'Brush Script MT', cursive",
              tangerine: "'Tangerine', 'Segoe Script', cursive",
              parisienne: "'Parisienne', 'Segoe Script', cursive",
              amiri: "'Amiri', serif",
              tillana: "'Tillana', 'Segoe Script', cursive",
              'nanum-pen-script': "'Nanum Pen Script', 'Segoe Script', cursive",
            }[style as HandwritingStyle] as string,
          }}
        >
          {displayText}
        </div>
      </div>
    </div>
  );

  // Show CSS preview immediately while loading. Also render lined-paper background.
  const linedPaperStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, #fff 0%, #fff 100%)',
    backgroundImage: "repeating-linear-gradient( to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 28px, rgba(0,0,0,0.06) 29px )",
    padding: 12,
    borderRadius: 16,
  };

  if (!Renderer || !font) {
    return (
      <div>
        <div className={wrapperClass} style={linedPaperStyle}>
          <div style={{ minHeight: 160 }}>
            <div
              style={{
                fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
                lineHeight: 1.4,
                color: '#111827',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: {
                  caveat: "'Caveat', 'Brush Script MT', 'Segoe Script', cursive",
                  italianno: "'Italianno', 'Brush Script MT', cursive",
                  tangerine: "'Tangerine', 'Segoe Script', cursive",
                  parisienne: "'Parisienne', 'Segoe Script', cursive",
                  amiri: "'Amiri', serif",
                  tillana: "'Tillana', 'Segoe Script', cursive",
                  'nanum-pen-script': "'Nanum Pen Script', 'Segoe Script', cursive",
                }[style as HandwritingStyle] as string,
              }}
            >
              {displayText}
            </div>
          </div>
        </div>

        {loading && <div className="mt-2 text-xs text-muted-foreground">Rendering handwriting preview…</div>}
      </div>
    );
  }

  return (
    <div className={wrapperClass} style={linedPaperStyle}>
      <Renderer
        as="div"
        font={font}
        text={displayText}
        style={{
          fontSize: 'clamp(2.1rem, 4vw, 4.1rem)',
          lineHeight: 1.1,
          color: '#111827',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          width: '100%',
          maxWidth: '100%',
        }}
      />
    </div>
  );
}
