import { User } from "./user.class";

export class Channel {
    id: string;
    name: string;
    users: User[];
    messages: string[];
    comments: string[];
    reactions: string[];
    data: any[];

    /**
     * Constructs a new channel instance
     * Initializes with default values, if no values provided
     * @param obj 
     */
    constructor(obj?: Partial<Channel>){
        this.id = obj?.id ?? '';
        this.name = obj?.name ?? '';
        this.users = obj?.users ?? [];
        this.messages = obj?.messages ?? [];
        this.comments = obj?.comments ?? [];
        this.reactions = obj?.reactions ?? [];
        this.data = obj?.data ?? [];
    }

}