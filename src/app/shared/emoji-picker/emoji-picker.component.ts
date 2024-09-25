import { Component } from '@angular/core';
import { PickerComponent, PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [PickerComponent, PickerModule, EmojiComponent],
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.scss'
})
export class EmojiPickerComponent {
  addReaction(event: any) {
    console.log(event);
    
  }
}
