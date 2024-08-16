export class User {
    id: string;
    email: string;
    username: string;
    date: number; // timestamp
    img: string;

    constructor(obj?: Partial<User>){
        this.id = obj?.id ?? '';
        this.email = obj?.email ?? '';
        this.username = obj?.username ?? '';
        this.date = obj?.date ?? 0;
        this.img = obj?.img ?? '';
    }
}