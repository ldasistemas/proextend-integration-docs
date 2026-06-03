import React, { useState, useCallback, useEffect, useRef } from 'react';
import Mermaid from '@theme-original/Mermaid';
import styles from './styles.module.css';

export default function MermaidWrapper(props) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  return (
    <>
      <div className={styles.diagram}>
        <Mermaid {...props} />
        <button
          type="button"
          className={styles.zoomButton}
          onClick={() => setOpen(true)}
          aria-label="Ampliar diagrama em tela cheia"
          title="Ampliar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      </div>

      {open && <FullscreenViewer onClose={close}>{<Mermaid {...props} />}</FullscreenViewer>}
    </>
  );
}

function FullscreenViewer({ children, onClose }) {
  const stageRef = useRef(null);
  const viewportRef = useRef(null);
  const state = useRef({ scale: 1, x: 0, y: 0, dragging: false, startX: 0, startY: 0, moved: false });

  const apply = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const { scale, x, y } = state.current;
    stage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }, []);

  const reset = useCallback(() => {
    state.current.scale = 1;
    state.current.x = 0;
    state.current.y = 0;
    apply();
  }, [apply]);

  useEffect(() => {
    let raf;
    let tries = 0;
    const ensureAspect = () => {
      const svg = stageRef.current?.querySelector('svg');
      if (svg) {
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        return;
      }
      if (tries > 30) return;
      tries += 1;
      raf = requestAnimationFrame(ensureAspect);
    };
    raf = requestAnimationFrame(ensureAspect);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onWheel = useCallback(
    (e) => {
      e.preventDefault();
      const s = state.current;
      const delta = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      s.scale = Math.min(Math.max(s.scale * delta, 0.2), 12);
      apply();
    },
    [apply],
  );

  const onPointerDown = useCallback((e) => {
    const s = state.current;
    s.dragging = true;
    s.moved = false;
    s.startX = e.clientX - s.x;
    s.startY = e.clientY - s.y;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      const s = state.current;
      if (!s.dragging) return;
      const nextX = e.clientX - s.startX;
      const nextY = e.clientY - s.startY;
      if (Math.abs(nextX - s.x) > 3 || Math.abs(nextY - s.y) > 3) s.moved = true;
      s.x = nextX;
      s.y = nextY;
      apply();
    },
    [apply],
  );

  const onPointerUp = useCallback((e) => {
    state.current.dragging = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  }, []);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.toolbar}>
        <button type="button" onClick={reset} className={styles.toolButton} title="Resetar zoom">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
        <button type="button" onClick={onClose} className={styles.toolButton} title="Fechar (Esc)" aria-label="Fechar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className={styles.hint}>Scroll para zoom · arraste para mover · Esc para fechar</div>

      <div
        ref={viewportRef}
        className={styles.viewport}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={(e) => {
          if (state.current.moved) return;
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div ref={stageRef} className={styles.stage}>
          {children}
        </div>
      </div>
    </div>
  );
}
