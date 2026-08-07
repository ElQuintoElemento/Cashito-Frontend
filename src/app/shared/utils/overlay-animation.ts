/** Opens an overlay panel with fade/scale animation (no setTimeout). */
export function openOverlayPanel(onVisible: () => void): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(onVisible);
  });
}

/** Closes an overlay panel after CSS transition ends (no setTimeout). */
export function closeOverlayPanel(
  element: HTMLElement | null | undefined,
  onHidden: () => void
): void {
  if (!element) {
    onHidden();
    return;
  }

  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    element.removeEventListener('transitionend', onTransitionEnd);
    onHidden();
  };

  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.target === element) {
      done();
    }
  };

  element.addEventListener('transitionend', onTransitionEnd);

  const duration = parseFloat(getComputedStyle(element).transitionDuration) || 0;
  if (duration === 0) {
    requestAnimationFrame(done);
  }
}
