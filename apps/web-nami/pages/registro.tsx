import { NextPage } from 'next';
import { GaPage, RegisterTemplate } from 'ui';
import { Logo } from '../components/LogoElectric';

const RegisterPage: NextPage = () => (
  <GaPage page="Register">
    <RegisterTemplate Logo={Logo} />
  </GaPage>
);

export default RegisterPage;
