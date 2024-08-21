import { User } from "./user.class";

export class Channel {
    id: string;
    description: string;
    name: string;
    users: User[];
    messages: string[];
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
        this.id = obj?.id ?? '';
        this.description = obj?.description ?? '';
        this.name = obj?.name ?? '';
        this.users = obj?.users ?? [];
        this.messages = obj?.messages ?? [];
        this.comments = obj?.comments ?? [];
        this.reactions = obj?.reactions ?? [];
        this.data = obj?.data ?? [];
        this.channelActive = obj?.channelActive ?? false;
    }

}