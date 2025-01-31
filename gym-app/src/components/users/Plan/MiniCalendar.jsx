import React, { useEffect, useState } from 'react'
import { useDate } from "../../../contexts/DateContextProvider";
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

const MiniCalendar = () => {

  const { currentDate, setCurrentDate } = useDate();
  const [displayDate, setDisplayDate] = useState(new Date(currentDate));
  const [calendarDays, setCalendarDays] = useState([]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    setDisplayDate(currentDate);
    console.log("miniCalendar currentDate: " + currentDate)
  }, [currentDate]);

  useEffect(() => {
    renderCalendar(displayDate)

  }, [displayDate])
  

  const renderCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfLastMonth = new Date(year, month, 0).getDate();

    const today = new Date();
    const days = [];

    // Previous month dates
    const startDay = (firstDayOfMonth === 0 ? 7 : firstDayOfMonth) - 1;
    for (let i = startDay; i > 0; i--) {
      days.push({ date: lastDayOfLastMonth - i + 1, isCurrentMonth: false });
    }

    // Current month dates
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const isToday = year === today.getFullYear() && month === today.getMonth() && i === today.getDate();
      days.push({ date: i, isCurrentMonth: true, isToday });
    }

    // Next month dates
    const remainingCells = 42 - days.length; 
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ date: i, isCurrentMonth: false });
    }

    setCalendarDays(days);
  };

  const handlePrevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    const newDate = displayDate.setDate(date)
    setCurrentDate(new Date(newDate));
  };

  return (
    <div className='cal-container'>
      <div className="calendar">
        <div className="month">
          <a className="nav prev" onClick={handlePrevMonth}><ChevronLeftRoundedIcon /></a>
          <div>
            <span className="current-month">{monthNames[displayDate.getMonth()]}</span> 
            <span className="year">{displayDate.getFullYear()}</span>
          </div>
          <a className="nav next"onClick={handleNextMonth}><ChevronRightRoundedIcon /></a>
        </div>
        <div className="days">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
        <div className="dates">
          {calendarDays.map((day, index) => (
            <button 
              key={index} 
              className={day.isToday ? 'today' : ''}
              style={{ opacity: day.isCurrentMonth ? 1 : 0.5 }}
              onClick={() => handleDateClick(day.date)}
            >
              <time>{day.date}</time>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MiniCalendar