import HeadNext from 'next/head';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { appName },
} = getConfig();

type Props = {
  title?: string;
};

export const Head = ({ title }: Props) => {
  if (!title) {
    title = appName;
  }
  return (
    <HeadNext>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
    </HeadNext>
  );
};
