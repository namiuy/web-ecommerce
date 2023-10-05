import { NextPage } from 'next';
import { ContactTemplate } from 'ui';
import { NavBar } from '../components';

const ContactPage: NextPage = () => (
  <>
    <NavBar />
    <ContactTemplate />
  </>
);

export default ContactPage;

