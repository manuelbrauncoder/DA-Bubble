import { UserInterface } from "./user-interface";

export interface ChatInterface extends UserInterface {
    id: string;
    user: UserInterface[];
    Time: string;
    messages: string[];
    comments: string[];
    reactions: string[];
    data: [];
}
