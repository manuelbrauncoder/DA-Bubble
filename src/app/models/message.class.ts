import { Thread } from "./thread.class ";
import { User } from "./user.class";

export class Message{
    time: number;
    sender: User;
    content: string;
    thread: Thread | null;
    data: any[];
    reactions: any[];

    constructor(obj?: Partial<Message>){
        this.time = obj?.time ?? 0;
        this.sender = obj?.sender ?? new User;
        this.content = obj?.content ?? '';
        this.thread = obj?.thread ?? null;
        this.data = obj?.data ?? [];
        this.reactions = obj?.reactions ?? [];
    }
}