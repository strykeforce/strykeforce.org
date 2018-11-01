import React from 'react'
import styled from 'react-emotion'

const EventDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
  font-size: 0.85em;
`

const Name = styled.span`
  font-weight: bold;
  padding-bottom: 0.15em;
`

const Date = styled.span`
  font-weight: normal;
  padding-bottom: 0.25em;
`

const Address = styled.span`
  font-size: 0.9em;
`

const Event: React.SFC<{ event: EventData }> = ({ event }) => (
  <EventDiv>
    <Name>{event.name}</Name>
    <Date>{event.date}</Date>
    <Address>{event.venue}</Address>
    <Address>{event.street}</Address>
    <Address>
      {event.city}, {event.state} {event.zip}
    </Address>
  </EventDiv>
)

export default Event
