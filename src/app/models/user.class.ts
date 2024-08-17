export class User {
    id: string;
    uid: string;
    email: string;
    username: string;
    createdAt: number | string; // timestamp
    img: string;
    currentlyLoggedIn: boolean;

    constructor(obj?: Partial<User>){
        this.id = obj?.id ?? '';
        this.uid = obj?.uid ?? '';
        this.email = obj?.email ?? '';
        this.username = obj?.username ?? '';
        this.createdAt = obj?.createdAt ?? 0;
        this.img = obj?.img ?? '';
        this.currentlyLoggedIn = obj?.currentlyLoggedIn ?? false;
    }
}