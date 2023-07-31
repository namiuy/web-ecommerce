import { Box } from 'ui';
import { Logo } from '../components/LogoWhite';

const _backgroundColorOne = 'primary.main';

const Login = () => {
  return (
    <>
      <Box bg={_backgroundColorOne} h={'40rem'}>
        <Logo />
      </Box>
    </>
  );
};

export default Login;
