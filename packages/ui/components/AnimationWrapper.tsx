import styled from '@emotion/styled';

type AnimationWrapperProps = {
  tag: string;
};

export const AnimationWrapper = styled.div<AnimationWrapperProps>`
  ${({ tag }) => tag}:hover {
    display: block;
    animation: skew-x-shake 1.3s;
    animation-iteration-count: infinite;
  }

  @keyframes skew-x-shake {
    0% {
      transform: skewX(-15deg);
    }
    5% {
      transform: skewX(15deg);
    }
    10% {
      transform: skewX(-15deg);
    }
    15% {
      transform: skewX(15deg);
    }
    20% {
      transform: skewX(0deg);
    }
    100% {
      transform: skewX(0deg);
    }
  }
`;
