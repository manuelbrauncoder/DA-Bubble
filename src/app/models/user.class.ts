export class User {
    uid: string;
    email: string;
    username: string;
    createdAt: number | string;
    avatar: string;
    currentlyLoggedIn: boolean;
    userChatActive: boolean;
    status: 'online' | 'offline' | 'away';

    constructor(obj?: Partial<User>){
        this.uid = obj?.uid ?? '';
        this.email = obj?.email ?? '';
        this.username = obj?.username ?? '';
        this.createdAt = obj?.createdAt ?? 0;
        this.avatar = obj?.avatar ?? '';
        this.currentlyLoggedIn = obj?.currentlyLoggedIn ?? false;
        this.userChatActive = obj?.userChatActive ?? false;
        this.status = obj?.status ?? 'offline'
    }
}