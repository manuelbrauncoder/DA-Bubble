export class User {
    uid: string;
    email: string;
    username: string;
    createdAt: number | string; // timestamp
    avatar: string;
    currentlyLoggedIn: boolean;
    userChatActive: boolean;

    constructor(obj?: Partial<User>){
        this.uid = obj?.uid ?? '';
        this.email = obj?.email ?? '';
        this.username = obj?.username ?? '';
        this.createdAt = obj?.createdAt ?? 0;
        this.avatar = obj?.avatar ?? '';
        this.currentlyLoggedIn = obj?.currentlyLoggedIn ?? false;
        this.userChatActive = obj?.userChatActive ?? false;
    }
}