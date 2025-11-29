import { FastifyInstance } from "fastify";
import { createCalendarFeed, getFeedsForMember } from "./calendarFeed.service.js";

export async function registerCalendarFeedRoutes(app: FastifyInstance) {
  app.post("/calendar-feeds", {
    schema: {
      body: {
        type: "object",
        required: ["familyMemberId", "url"],
        properties: {
          familyMemberId: { type: "string", format: "uuid" },
          url: { type: "string" }
        }
      }
    }
  }, async (req, reply) => {
    const feed = await createCalendarFeed(req.body as any);
    return reply.send(feed);
  });

  app.get("/calendar-feeds/:memberId", async (req, reply) => {
    const { memberId } = req.params as any;
    const feeds = await getFeedsForMember(memberId);
    return reply.send(feeds);
  });
}