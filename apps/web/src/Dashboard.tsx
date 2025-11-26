import { NextEventSummary } from "./NextEventSummary.js";
import { FamilyPanel } from "./FamilyPanel.js";
import { EventsPanel } from "./EventsPanel.js";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./components/ui/card.js";

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Family Dashboard
        </h1>
        <p className="text-sm text-slate-600">
          Overview of upcoming events and family activity.
        </p>
      </section>

      {/* Next events */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-800">
            Next event per family member
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <NextEventSummary />
        </CardContent>
      </Card>

      {/* Family / Events grid */}
      <section className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Family
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FamilyPanel />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EventsPanel />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}