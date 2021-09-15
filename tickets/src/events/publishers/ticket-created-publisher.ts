import { Publisher, Subjects, TicketCreatedEvent } from '@gjticketing/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}
