import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

export async function requestCalendarPermissions() {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  return status === 'granted';
}

async function getDefaultCalendarSource() {
  if (Platform.OS === 'ios') {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  } else {
    return { isLocalAccount: true, name: 'Expo Calendar' };
  }
}

export async function createAppCalendar() {
  const source = await getDefaultCalendarSource();
  return await Calendar.createCalendarAsync({
    title: 'Tareas App',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    source,
    name: 'App Calendar',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
    ownerAccount: 'local',
  });
}

export async function createCalendarEvent(calendarId, { title, startDate, endDate }) {
  return await Calendar.createEventAsync(calendarId, {
    title,
    startDate,
    endDate,
    timeZone: 'GMT',
    location: 'Mi App',
  });
}

export async function getCalendarEvents(calendarIds, startDate, endDate) {
  return await Calendar.getEventsAsync(calendarIds, startDate, endDate);
}

export async function getAllCalendarIds() {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  return calendars.map(cal => cal.id);
}

export async function updateExternalEvent(eventId, { title, startDate, endDate, notes, location }) {
  return await Calendar.updateEventAsync(eventId, {
    title: title || '',
    startDate,
    endDate,
    notes: notes || '',
    location: location || '',
  });
}

export async function deleteExternalEvent(eventId) {
  return await Calendar.deleteEventAsync(eventId);
}