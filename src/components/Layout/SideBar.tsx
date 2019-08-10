import React from 'react';
import styled from '@emotion/styled';
import Calendar from '../Calendar/Calendar';

const Div = styled.div``;

const SideBar: React.FC<{}> = () => (
  <Div>
    <Calendar />
  </Div>
);

export default SideBar;
