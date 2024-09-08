import { v4 as uuidv4 } from 'uuid';
import { Message } from "./message.class";
import { User } from "./user.class";

export class Channel {
    id: string;
    description: string;
    name: string;
    creator: string;
    users: string[];
    messages: Message[];
    comments: string[];
    reactions: string[];
    data: any[];
    channelActive: boolean;

    /**
     * Constructs a new channel instance
     * Initializes with default values, if no values provided
     * @param obj 
     */
    constructor(obj?: Partial<Channel>){
        this.id = obj?.id ?? uuidv4();
        this.description = obj?.description ?? '';
        this.name = obj?.name ?? '';
        this.creator = obj?.creator ?? '';
        this.users = obj?.users ?? [];
        this.messages = obj?.messages ?? [];
        this.comments = obj?.comments ?? [];
        this.reactions = obj?.reactions ?? [];
        this.data = obj?.data ?? [];
        this.channelActive = obj?.channelActive ?? false;
    }

}