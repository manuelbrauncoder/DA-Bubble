import { Channel } from "./channel.class";
import { User } from "./user.class";

export class Message{
    type: 'direct' | 'channel';
    time: number;
    sender: User;
    recipient: User | Channel;
    content: string;
    data: any[];
    reactions: any[];

    constructor(obj?: Partial<Message>){
        this.type = obj?.type ?? 'channel';
        this.time = obj?.time ?? 0;
        this.sender = obj?.sender ?? new User;
        this.recipient = obj?.recipient ?? new Channel;
        this.content = obj?.content ?? '';
        this.data = obj?.data ?? [];
        this.reactions = obj?.reactions ?? [];
    }
}