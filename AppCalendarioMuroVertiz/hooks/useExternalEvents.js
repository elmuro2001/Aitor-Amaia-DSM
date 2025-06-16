import { useEffect, useState } from 'react';
import { requestCalendarPermissions, getCalendarEvents, getAllCalendarIds } from '../servicios/calendar_connection';

const useExternalEvents = (visibleMonth) => {
  const [externalEvents, setExternalEvents] = useState([]);

  useEffect(() => {
    const loadExternalEvents = async () => {
      const granted = await requestCalendarPermissions();
      if (!granted) return;

      const calendarIds = await getAllCalendarIds();

      // visibleMonth: formato 'YYYY-MM' (ejemplo: '2024-06')
      const [year, month] = visibleMonth.split('-').map(Number);
      const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
      const end = new Date(year, month, 0, 23, 59, 59, 999);

      const events = await getCalendarEvents(calendarIds, start, end);

      const mapped = events.map(ev => ({
        id: (ev.id ? ev.id : Date.now().toString() + Math.random().toString(36).slice(2, 11)) + '_external',
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
  }, [visibleMonth]);

  return externalEvents;
};

export default useExternalEvents;