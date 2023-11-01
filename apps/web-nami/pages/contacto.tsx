import { NextPage } from 'next';
import { ContactTemplate, GaPage } from 'ui';
import { NavBar } from '../components';

const ContactPage: NextPage = () => (
  <GaPage page="Contact">
    <>
      <NavBar />
      <ContactTemplate />
    </>
  </GaPage>
);

export default ContactPage;
