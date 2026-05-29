import { useEffect, useState } from 'react';
import { CELESTE_REVEAL_DATE, useCelesteStore } from 'shared';

const KICKOFF = CELESTE_REVEAL_DATE.getTime();

const daysUntil = (ms: number) => Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));

export const BannerStrip = () => {
  const hydrated = useCelesteStore(s => s.hydrated);
  const [diff, setDiff] = useState<number | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    const update = () => setDiff(KICKOFF - Date.now());
    update();
    const id = window.setInterval(update, 60000);
    return () => window.clearInterval(id);
  }, [hydrated]);

  if (!hydrated) return null;

  const days = diff !== null ? daysUntil(diff) : null;
  const tail = days === null ? '' : days > 0 ? ` - faltan ${days} días` : ' - dale Uruguay';

  return (
    <div className="credi-banner-strip">
      Mundial 2026 - #soyceleste{tail}
    </div>
  );
};
