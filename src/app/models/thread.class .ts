import { Message } from "./message.class";

export class Thread {
    id: string;
    rootMessage: Message;
    messages: Message[];

    constructor(obj?: Partial<Thread>){
        this.id = obj?.id ?? '';
        this.rootMessage = obj?.rootMessage ?? new Message;
        this.messages = obj?.messages ?? [];
    }
}