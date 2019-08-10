import React from 'react';
import styled from 'react-emotion';
import Calendar from '../Calendar/Calendar';

const Div = styled.div``;

const SideBar: React.FC<{}> = () => (
  <Div>
    <Calendar />
  </Div>
);

export default SideBar;
