import { useState, useEffect } from 'react';
import { Logo as logoAutoparts } from './LogoAutoparts';
import { Logo as logoTools } from './LogoTools';
import { Logo as logoElectric } from './LogoElectric';
import { Logo as logoClima } from './LogoClima';
import { Logo as logoRobotec } from './LogoRobotec';

const logos: Record<string, any> = {
  AUTOPARTS: logoAutoparts,
  CLIMA: logoClima,
  TOOLS: logoTools,
  NAMI: logoTools,
  ELECTRIC: logoElectric,
  ROBOTEC: logoRobotec,
};

export const Logo = () => {
  const [CurrentLogo, setCurrentLogo] = useState<any>(() => logoTools);

  useEffect(() => {
    import('shared').then((mod) => {
      const envId = mod.getEnvId();
      setCurrentLogo(() => logos[envId] || logoTools);
    });
  }, []);

  return <CurrentLogo />;
};
