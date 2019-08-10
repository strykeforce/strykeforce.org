import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import styled from 'react-emotion';
import Event from './Event';

interface CalendarData {
  allCalendarToml: {
    edges: {
      node: {
        events: EventData[];
      };
    }[];
  };
}

const CalendarDiv = styled.div`
  width: 15em;
  padding-top: 1.5em;
  padding-left: 2em;
  padding-right: 0.5em;

  @media (max-width: 480px) {
    width: auto;
  }
`;

const Header = styled.h2`
  text-align: center;
`;

const Calendar: React.FC<{}> = () => (
  <CalendarDiv>
    <Header>Calendar</Header>
    <StaticQuery
      query={graphql`
        query CalendarQuery {
          allCalendarToml {
            edges {
              node {
                events {
                  name
                  date(formatString: "MMMM D, YYYY")
                  venue
                  street
                  city
                  state
                  zip
                }
              }
            }
          }
        }
      `}
      render={(data: CalendarData) => {
        const events: EventData[] = data.allCalendarToml.edges[0].node.events;
        return events.map(e => <Event event={e} key={e.date} />);
      }}
    />
  </CalendarDiv>
);

export default Calendar;
