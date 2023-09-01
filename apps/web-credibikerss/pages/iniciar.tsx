import { NextPage } from 'next';
import { Logo } from '../components/Logo';
import { SignInTemplate } from 'ui';

const SignInPage: NextPage = () => <SignInTemplate Logo={Logo} />;

export default SignInPage;
