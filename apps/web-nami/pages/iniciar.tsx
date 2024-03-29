import { NextPage } from 'next';
import { Logo } from '../components/LogoElectric';
import { GaPage, SignInTemplate } from 'ui';

const SignInPage: NextPage = () => (
  <GaPage page="SignIn">
    <SignInTemplate Logo={Logo} />
  </GaPage>
);

export default SignInPage;
