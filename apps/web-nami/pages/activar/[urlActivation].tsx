import { NextPage } from 'next';
import { GaPage, RegisterActivationTemplate } from 'ui';
import { Logo } from '../../components/Logo';

const RegisterActivationPage: NextPage = () => (
  <GaPage page="Register">
    <RegisterActivationTemplate Logo={Logo} />
  </GaPage>
);

export default RegisterActivationPage;
