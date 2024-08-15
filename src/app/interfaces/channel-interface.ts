import { UserInterface } from "./user-interface";

export interface ChannelInterface extends UserInterface {
    id: string;
    name: string;
    userData: UserInterface[];
    messages: string[];
    comments: string[];
    reactions: string[];
    data: [];
}
