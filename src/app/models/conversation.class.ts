import { v4 as uuidv4 } from 'uuid';
import { Message } from "./message.class";
import { User } from "./user.class";

export class Conversation {
    id: string;
    participants: Participants
    messages: Message[];
    active: boolean;

    constructor(obj?: Partial<Conversation>) {
        this.id = obj?.id ?? uuidv4();
        this.participants = obj?.participants ?? new Participants;
        this.messages = obj?.messages ?? [];
        this.active = obj?.active ?? false;
    }
}

export class Participants {
    first: string;
    second: string;

    constructor(obj?: Partial<Participants>){
        this.first = obj?.first ?? '';
        this.second = obj?.second ?? '';
    }
}