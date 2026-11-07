const panels = new Set<HTMLElement>();
let restore: (() => void) | undefined;

/** Lock the page while allowing an overlay's own scroll area to move. */
export function lockPageScroll(panel: HTMLElement): () => void {
  panels.add(panel);
  if (panels.size === 1) {
    const root = document.documentElement;
    const overflow = root.style.overflow;
    const overscroll = root.style.overscrollBehavior;
    // Lock the root only. Changing body overflow or fixing its position can
    // change the sticky category bar's containing block and move it offscreen.
    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";

    let previousY = 0;
    const onTouchStart = (event: TouchEvent) => {
      previousY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      // Keep pinch zoom available; only constrain single-finger scrolling.
      if (event.touches.length !== 1) return;
      const currentY = event.touches[0].clientY;
      const delta = previousY - currentY;
      previousY = currentY;
      const scroller = [...panels].find((element) =>
        element.contains(event.target as Node),
      );
      const canScroll =
        scroller &&
        scroller.scrollHeight > scroller.clientHeight &&
        (delta === 0 ||
          (delta < 0 && scroller.scrollTop > 0) ||
          (delta > 0 &&
            scroller.scrollTop + scroller.clientHeight <
              scroller.scrollHeight - 1));
      // Safari can otherwise hand a gesture at either end back to the page.
      if (!canScroll && event.cancelable) event.preventDefault();
    };
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    restore = () => {
      root.style.overflow = overflow;
      root.style.overscrollBehavior = overscroll;
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }

  return () => {
    if (!panels.delete(panel) || panels.size) return;
    restore?.();
    restore = undefined;
  };
}
