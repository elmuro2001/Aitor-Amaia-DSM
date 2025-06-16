import { useEffect, useState } from 'react';
import { requestCalendarPermissions, getCalendarEvents, getAllCalendarIds } from '../servicios/calendar_connection';

const useExternalEvents = (visibleMonth, refreshExternalEvents) => {
  const [externalEvents, setExternalEvents] = useState([]);

  useEffect(() => {
    const loadExternalEvents = async () => {
      const granted = await requestCalendarPermissions();
      if (!granted) return;

      const calendarIds = await getAllCalendarIds();

      const [year, month] = visibleMonth.split('-').map(Number);
      const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
      const end = new Date(year, month, 0, 23, 59, 59, 999);

      const events = await getCalendarEvents(calendarIds, start, end);

      const mapped = events.map(ev => ({
        id: ev.id?.toString(),
        calendarId: ev.calendarId,
        name: ev.title,
        type: 'evento',
        description: ev.notes || '',
        color: '#2196F3',
        location: ev.location || '',
        startDate: ev.startDate,
        endDate: ev.endDate,
        startHour: new Date(ev.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endHour: ev.endDate ? new Date(ev.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
        external: true,
      }));

      setExternalEvents(mapped);
    };

    loadExternalEvents();
  }, [visibleMonth, refreshExternalEvents]);

  return externalEvents;
};

export default useExternalEvents;