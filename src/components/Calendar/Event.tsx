import React from 'react';
import styled from 'react-emotion';

const EventDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
  font-size: 0.85em;
`;

const Name = styled.span`
  font-weight: bold;
  padding-bottom: 0.15em;
`;

const Date = styled.time`
  font-weight: normal;
  padding-bottom: 0.25em;
`;

const Address = styled.address`
  font-size: 0.9em;
  font-style: normal;
`;

const Event: React.FC<{ event: EventData }> = ({ event }) => (
  <EventDiv>
    <Name>{event.name}</Name>
    <Date>{event.date}</Date>
    <Address>
      {event.venue}
      <br />
      {event.street}
      <br />
      {event.city}, {event.state} {event.zip}
      <br />
    </Address>
  </EventDiv>
);

export default Event;
