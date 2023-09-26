import { NextPage } from 'next';
import { RegisterTemplate } from 'ui';
import { Logo } from '../components/LogoWhite';

const RegisterPage: NextPage = () => <RegisterTemplate Logo={Logo} />;

export default RegisterPage;
