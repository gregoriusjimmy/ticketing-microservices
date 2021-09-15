import { Publisher, Subjects, TicketUpdatedEvent } from '@gjticketing/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
