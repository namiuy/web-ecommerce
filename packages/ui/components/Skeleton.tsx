import { Skeleton as SkeletonChakra, SkeletonProps } from '@chakra-ui/react';

export const Skeleton = (props: SkeletonProps) => (
  <SkeletonChakra startColor="brand.grey.0" endColor="brand.grey.1" {...props} />
);
