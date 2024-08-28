import { Message } from "./message.class";
import { User } from "./user.class";

export class Conversation {
    id: string;
    participants: User[];
    messages: Message[];
    active: boolean;

    constructor(obj?: Partial<Conversation>){
        this.id = obj?.id ?? '';
        this.participants = obj?.participants ?? [];
        this.messages = obj?.messages ?? [];
        this.active = obj?.active ?? false;
    }
}