import { useLayoutEffect, useRef } from "react";

export function useOverflowHits(watch: unknown) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      root.querySelectorAll<HTMLElement>("[data-stress]").forEach((node) => {
        const overflowX = node.scrollWidth - node.clientWidth > 1;
        const overflowY = node.scrollHeight - node.clientHeight > 1;
        node.dataset.broken = overflowX || overflowY ? "true" : "false";
      });
    };

    measure();
    const frame = window.requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [watch]);

  return rootRef;
}
