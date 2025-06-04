import { Box, VStack } from '@chakra-ui/react';
import { NavBar, Hero, ImageAnalysis, Sensors, Automation, Robots, Workflow, Contact } from '../components';
import { useEffect } from 'react';
import { GaPage } from 'ui';

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

  return (
    <GaPage page="Home">
      <Box bg="#f5f5f7">
        <NavBar />
        <VStack spacing="2.5rem" pb={{ base: '0', lg: '4rem' }}>
          <Hero />
          <Sensors />
          <ImageAnalysis />
          <Automation />
          <Robots />
          <Workflow />
          <Contact />
        </VStack>
      </Box>
    </GaPage>
  );
}
