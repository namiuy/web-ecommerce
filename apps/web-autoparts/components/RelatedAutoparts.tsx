import { Divider } from '@chakra-ui/react';
import { Container, Heading, Box } from 'ui';
import { Autopart } from 'shared/entities/autopart';
import { useAutopartRelatedGet, getEmptyArray } from 'shared';
import { AutopartCardCarousel } from './AutopartCardCarousel';

const _containerSize = { lg: '75%', base: '90%' };

type RelatedAutopartsProps = {
  autopart: Autopart;
};

export const RelatedAutoparts = ({ autopart }: RelatedAutopartsProps) => {
  const { data, isLoading, error } = useAutopartRelatedGet(autopart.family || '');

  if (!data?.autoparts?.length || error) {
    if (error) console.log(error);
    return <></>;
  }

  const autoparts = isLoading || !data?.autoparts ? getEmptyArray<Autopart>(4) : data.autoparts.filter(a => a.id);

  return (
    <>
      <Divider mb="3.5rem" />
      <Box mb="3.5rem">
        <Container maxW={_containerSize} px="0" mb="1.5rem">
          <Heading as="h4" size="lg">TAMBIÉN TE PUEDE INTERESAR</Heading>
        </Container>
        <Container maxW={_containerSize} px="0">
          <AutopartCardCarousel autoparts={autoparts ?? []} isLoading={isLoading} />
        </Container>
      </Box>
    </>
  );
};