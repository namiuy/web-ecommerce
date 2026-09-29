const CELESTE_COLORS = ['#5CBCEB', '#FFFFFF', '#FCD116'];

let confettiPromise: Promise<any> | null = null;

const loadConfetti = () => {
  if (!confettiPromise) {
    confettiPromise = import('canvas-confetti').then(mod => mod.default);
  }
  return confettiPromise;
};

export const fire = async () => {
  if (typeof window === 'undefined') return;
  const confetti = await loadConfetti();
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.7 },
    colors: CELESTE_COLORS,
  });
};
