import React, { useContext, useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import { useDate } from '../../../contexts/DateContextProvider';
import { LoginContext } from '../../../contexts/LoginContextProvider';

const MainCalendar = () => {

  const { currentDate, setCurrentDate, planList, rsvList, setClickedPlan, setClickedRsv,
          isPlanInfoVisible, setIsPlanInfoVisible,
          isRsvInfoVisible, setIsRsvInfoVisible,
          isPlanInsertVisible, setIsPlanInsertVisible } = useDate();
  const { roles } = useContext(LoginContext);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  const [dateClicked, setDateClicked] = useState(false);

  useEffect(() => {
    var formattedevents = [planList, rsvList].flatMap(events =>
      events.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        description: event.description,
        color: event.color,
        type: event.type
      }))
    );

    setEvents(formattedevents);
  }, [planList, rsvList])

  useEffect(() =>{
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(currentDate);
    }
  },[currentDate])
  
  const handlePrevButtonClick = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(newDate);
    }
    // handleAllModal()
    setCurrentDate(newDate);
  };

  const handleNextButtonClick = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      // handleAllModal()
      calendarApi.gotoDate(newDate);
    }
  };

  // const handleAllModal = () => {
  //   // setIsPlanInsertVisible(false);
  //   setIsPlanInfoVisible(false);
  //   setIsRsvInfoVisible(false);
  // }

  const handleEvnetClick = (info) => {

    console.log('Event clicked:', info.event);
    console.log('Event title:', info.event.title);
    console.log('Event start:', info.event.start);
    console.log('Event end:', info.event.end);
    console.log('Event extendedProps:', info.event.extendedProps);
    const clickedEvent = {
      id: info.event.id, 
      title: info.event.title, 
      eventStart: info.event.start, 
      eventEnd: info.event.end, 
      description: info.event.extendedProps.description
    }
    switch (info.event.extendedProps.type) {
      case 'plan':
        setClickedPlan(clickedEvent)
        setIsPlanInfoVisible(true)
        break;
        case 'reservation':
          setClickedRsv(clickedEvent)
          setIsRsvInfoVisible(true)
        break;
      default:
        break;
    }
  }

  const handleDateClick = (info) => {
    console.log("handleDateClick")
    setCurrentDate(new Date(info.date));
    if (roles.isUser) {
      setIsPlanInsertVisible(true);
    }
  };

  return (
    <div className="card flex-grow-1 flex-shrink-1">
      <div className="container flex-grow-1 flex-shrink-1 border-0">
        <FullCalendar
          ref={calendarRef}
          plugins={[ dayGridPlugin, interactionPlugin ]}
          initialView="dayGridMonth"
          locale={'ko'}
          events={events}
          customButtons={{
            myCustomPrevButton: {
              icon: 'chevron-left',
              click: handlePrevButtonClick,
            },
            myCustomNextButton: {
              icon: 'chevron-right',
              click: handleNextButtonClick,
            },
          }}
          headerToolbar={{
            left: 'title',
            right: 'myCustomPrevButton,myCustomNextButton',
          }}
          eventClick={handleEvnetClick}
          dateClick={handleDateClick}
        />
      </div>
    </div>
  )
}

export default MainCalendar