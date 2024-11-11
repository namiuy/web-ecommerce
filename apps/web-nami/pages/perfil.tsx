import { ProfileTemplate } from 'ui';
import { Logo } from '../components/Logo';
import { NextPage } from 'next';

const Profile: NextPage = () => <ProfileTemplate Logo={Logo} />;

export default Profile;
