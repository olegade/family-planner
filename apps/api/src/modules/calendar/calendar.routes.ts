import { FastifyInstance } from "fastify";
import { fetchCalendarEvents } from "./calendar.service.js";

export default async function registerCalendarRoutes(app: FastifyInstance) {
  app.get("/family-members/:id/calendar-events", async (req, res) => {
    const { id } = req.params as { id: string };

    const events = await fetchCalendarEvents(id);

    return events;
  });
}