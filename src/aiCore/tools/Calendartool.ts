import { tool } from "ai";
import { z } from "zod";
import * as Calendar from 'expo-calendar'

/**
 * Creates a new calendar event with specified title, date, time and duration
 */
export const createCalendarEvent = tool({
  description: 'Create a new calendar event',
  inputSchema: z.object({
    title: z.string().describe('Event title'),
    date: z.string().describe('Event date (YYYY-MM-DD)'),
    time: z.string().optional().describe('Event time (HH:MM)'),
    duration: z.number().optional().describe('Duration in minutes'),
  }),
  execute: async ({ title, date, time, duration = 60 }) => {
    await Calendar.requestCalendarPermissionsAsync()

    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    )

    const eventDate = new Date(date)
    if (time) {
      const [hours, minutes] = time.split(':').map(Number)
      eventDate.setHours(hours, minutes)
    }

    await Calendar.createEventAsync(calendars[0].id, {
      title,
      startDate: eventDate,
      endDate: new Date(eventDate.getTime() + duration * 60 * 1000),
    })

    return { message: `Created "${title}"` }
  },
})
