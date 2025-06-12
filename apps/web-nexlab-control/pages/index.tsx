import { useEffect } from 'react';
import { GaPage, Text, Box, Heading } from 'ui';
import { GroundStats, NpkStats } from '../components';
import { StatsBySector } from '../components/StatsBySector';

declare global {
  interface Window {
    hj: {
      (...args: any[]): void;
      q?: any[];
    };
    _hjSettings: {
      hjid: number;
      hjsv: number;
    };
  }
}

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      (function (h: Window, o: Document, t: string, j: string) {
        h.hj =
          h.hj ||
          function (...args: any[]) {
            (h.hj.q = h.hj.q || []).push(args);
          };
        h._hjSettings = { hjid: 6424230, hjsv: 6 };

        const a: HTMLHeadElement = o.getElementsByTagName('head')[0]!;
        const r: HTMLScriptElement = o.createElement('script');
        r.async = true;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
      })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    }
  }, []);

  const npkData = {
    n: 40,
    p: 15,
    k: 30,
  };

  const groundData = {
    temperature: 22.5,
    humidity: 70,
    ec: 1.2,
    ph: 6.8,
  };

  const npkHistorical = {
    n: [28, 30, 34, 33, 40],
    p: [11, 10.5, 13, 12.7, 15.2],
    k: [19, 21.5, 26, 28.2, 30.5],
  };

  const groundHistorical = {
    temperature: [20.5, 21.3, 22.1, 22.7, 23.2],
    humidity: [58, 63, 65, 68, 70],
    ec: [0.9, 1.0, 1.05, 1.18, 1.3],
    ph: [6.4, 6.5, 6.6, 6.75, 6.85],
  };

  return (
    <GaPage page="Home">
      <>
        <StatsBySector />
      </>
    </GaPage>
  );
}
