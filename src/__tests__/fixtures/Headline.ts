import styled from 'styled-components';

export default styled.h1.withConfig({
  shouldForwardProp(p) {
    return !['blue'].includes(p);
  },
})<{ blue?: boolean }>`
  background-color: ${({ blue }) => (blue ? 'blue' : 'fuchsia')};
  &:hover {
    background-color: red;
  }
`;
