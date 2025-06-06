import { getReplyToEmail } from "@calcom/lib/getReplyToEmail";

import { renderEmail } from "../";
import generateIcsFile, { GenerateIcsRole } from "../lib/generateIcsFile";
import AttendeeScheduledEmail from "./attendee-scheduled-email";

export default class AttendeeLocationChangeEmail extends AttendeeScheduledEmail {
  protected async getNodeMailerPayload(): Promise<Record<string, unknown>> {
    return {
      icalEvent: generateIcsFile({
        calEvent: this.calEvent,
        role: GenerateIcsRole.ATTENDEE,
        status: "CONFIRMED",
      }),
      to: `${this.attendee.name} <${this.attendee.email}>`,
      from: `${this.calEvent.organizer.name} <${this.getMailerOptions().from}>`,
      replyTo: getReplyToEmail(this.calEvent),
      subject: `${this.t("location_changed_event_type_subject", {
        eventType: this.calEvent.type,
        name: this.calEvent.team?.name || this.calEvent.organizer.name,
        date: this.getFormattedDate(),
      })}`,
      html: await renderEmail("AttendeeLocationChangeEmail", {
        calEvent: this.calEvent,
        attendee: this.attendee,
      }),
      text: this.getTextBody("event_location_changed"),
    };
  }
}
