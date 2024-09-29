import { Injectable } from '@angular/core';
import { interval, Observable, Subject, Subscription, throttle } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private awaySubject = new Subject<boolean>();
  private logoutSubject = new Subject<boolean>();
  private timeoutForAway = 120;
  private timeoutForLogout = 420;
  private lastActivity?: Date;
  private idleCheckInterval = 10;
  private idleSubscription?: Subscription;

  constructor() { 
    this.resetTimer();
    this.startWatching();
   }

  get idleState(): Observable<boolean> {
    return this.awaySubject.asObservable();
  }

  get logoutState(): Observable<boolean> {
    return this.logoutSubject.asObservable();
  }

  public startWatching(): void {
    console.log('start watching');
    
    this.idleSubscription = interval(this.idleCheckInterval * 1000)
      .pipe(throttle(() => interval(1000)))
      .subscribe(() => {
        const now = new Date();

        if (now.getTime() - this.lastActivity?.getTime()! > this.timeoutForAway * 1000) { 
          this.awaySubject.next(true);
        }

        if (now.getTime() - this.lastActivity?.getTime()! > this.timeoutForLogout * 1000) {
          this.logoutSubject.next(true);
        }
      });
  }

  resetTimer(): void {
    this.lastActivity = new Date();
    this.awaySubject.next(false);
  }

  stopWatching(): void {
    if (this.idleSubscription) {
      this.idleSubscription.unsubscribe();
    }
  }
}
