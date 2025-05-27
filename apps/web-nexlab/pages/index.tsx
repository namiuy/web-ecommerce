import { Box, VStack } from '@chakra-ui/react';
import { NavBar, Hero, ImageAnalysis, Sensors, Automation, Robots, Workflow, Contact } from '../components';

export default function Home() {
  return (
    <Box bg="#f5f5f7">
      <NavBar />
      <VStack spacing="2.5rem" pb={{ base: '0', lg: '4rem' }}>
        <Hero />
        <Sensors />
        <ImageAnalysis />
        <Automation />
        <Robots />
        <Workflow />
        <Contact />
      </VStack>
    </Box>
  );
}
