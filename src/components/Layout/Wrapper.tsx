import styled from 'react-emotion'

interface WrapperProps {
  maxWidth?: string
  padding?: string
}

export const Wrapper = styled.div`
  box-sizing: border-box;
  position: relative;
  margin: 0 auto;
  max-width: ${(props: WrapperProps) =>
    props.maxWidth ? props.maxWidth : '75em'};
  padding: 0 ${(props: WrapperProps) => (props.padding ? props.padding : '1em')};
`
