import styled from 'styled-components';

export default styled.h1<{ blue?: boolean }>`
  background-color: ${({ blue }) => (blue ? 'blue' : 'fuchsia')};
  &:hover {
    background-color: red;
  }
`;
