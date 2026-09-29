import { useCelesteStore } from 'shared';

export const BannerStrip = () => {
  const hydrated = useCelesteStore(s => s.hydrated);

  if (!hydrated) return null;

  return (
    <div className="credi-banner-strip">
      Mundial 2026 - #soyceleste - dale Uruguay
    </div>
  );
};
