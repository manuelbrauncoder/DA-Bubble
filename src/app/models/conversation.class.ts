import { Message } from "./message.class";
import { User } from "./user.class";

export class Conversation {
    id: string;
    participants: Participants
    messages: Message[];
    active: boolean;

    constructor(obj?: Partial<Conversation>) {
        this.id = obj?.id ?? '';
        this.participants = obj?.participants ?? new Participants;
        this.messages = obj?.messages ?? [];
        this.active = obj?.active ?? false;
    }
}

export class Participants {
    first: User;
    second: User;

    constructor(obj?: Partial<Participants>){
        this.first = obj?.first ?? new User;
        this.second = obj?.second ?? new User;
    }
}