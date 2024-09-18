import { animate, state, style, transition, trigger } from '@angular/animations';
const popupHidden = { opacity: '0' };
const popupVisible = { opacity: '1' };
const timing = '225ms ease-in';

export const fadeIn = trigger('fadeIn', [
    transition(':enter', [style(popupHidden), animate(timing, style(popupVisible))]),
    transition(':leave', [style(popupVisible), animate(timing, style(popupHidden))]),
]);

export const toggleWidth25 = trigger('toggleWidth25', [
    transition(':enter', [
        style({ width: '0', opacity: 0 }),
        animate('0.2s ease-out', style({ width: '380px', opacity: 1 }))
    ]),
    transition(':leave', [
        animate('0.2s ease-out', style({ width: '0', opacity: 0 }))
    ])
]);

export const toggleWidth30 = trigger('toggleWidth30', [
    transition(':enter', [
        style({ width: '0', opacity: 0 }),
        animate('0.2s ease', style({ width: '440px', opacity: 1 }))
    ]),
    transition(':leave', [
        animate('0.2s ease', style({ width: '0', opacity: 0 }))
    ])
]);

export const expandChat = trigger('expandChat', [
    transition(':enter', [
        style({ flexGrow: 1, width: '100%' }),
        animate('0.2s ease', style({ flexGrow: 2, width: 'auto' }))
    ]),
    transition(':leave', [
        animate('0.2s ease', style({ flexGrow: 1, width: '100%' }))
    ])
]);

export const slideFromBottom = trigger('slideFromBottom', [
    transition(':enter', [style({ transform: 'translateY( 1000px)' }), animate('0.2s ease-out', style({ transform: 'translateY( 0)' }))]),
    transition(':leave', [style({ transform: 'translateY( 0)' }), animate('0.2s ease-out', style({ transform: 'translateY( 1000px)' }))]),
])