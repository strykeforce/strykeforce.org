import React from 'react';
import styled from '@emotion/styled';
import { CardWrapper } from '../CardGallery/CardWrapper';

export const BLUE = 'hsl(206.25, 74.7663551402%, 50%)';
export const YELLOW = 'rgb(241, 186, 27)';

interface ContactFormProps {
  title: string;
  color: string;
}

const Wrapper = styled('div')`
  max-width: 25em;
  margin: 0.625em auto;
  padding: 1em;
  background: #f7f7f7;

  & input[type='text'],
  & input[type='date'],
  & input[type='datetime'],
  & input[type='email'],
  & input[type='number'],
  & input[type='search'],
  & input[type='time'],
  & input[type='url'],
  & textarea,
  & select {
    transition: all 0.3s ease-in-out;
    outline: none;
    box-sizing: border-box;
    width: 100%;
    background: white;
    margin-bottom: 4%;
    border: 1px solid #ccc;
    padding: 3%;
    color: #555;
    font-size: 95%;

    &:focus {
      box-shadow: 0 0 5px ${BLUE};
      border: 1px solid ${BLUE};
      padding: 3%;
    }
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

interface ColorProps {
  formColor: string;
}

const Title = styled('h1')<ColorProps>`
  background: ${(props): string => props.formColor};
  padding: 20px 0;
  font-size: 140%;
  font-weight: 300;
  text-align: center;
  color: white;
  margin: -16px -16px 16px -16px;
`;

const Submit = styled('input')<ColorProps>`
  box-sizing: border-box;
  width: 100%;
  padding: 3%;
  color: white;
  background: ${(props): string => props.formColor};
  border-bottom: 2px solid ${(props): string => props.formColor};
  border-top-style: none;
  border-right-style: none;
  border-left-style: none;
  font-size: 95%;
`;

export const ContactFormCard: React.FC<ContactFormProps> = ({ title, color, children }) => (
  <CardWrapper>
    <Wrapper>
      <Title formColor={color}>{title}</Title>
      <form name={title} method="POST" action="/" netlify-honeypot="subject" data-netlify={true}>
        {children}
        <HiddenInput type="text" name="subject" />
        <input type="hidden" name="form-name" value={title} />
        <Submit formColor={color} type="submit" value="Send" />
      </form>
    </Wrapper>
  </CardWrapper>
);
