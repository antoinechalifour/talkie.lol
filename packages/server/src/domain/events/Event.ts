export abstract class Event {
  protected constructor(public type: string, public date: Date) {}
}
