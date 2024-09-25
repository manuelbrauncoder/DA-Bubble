import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Input() content: 'send-message' | 'single-message' = 'send-message';
  @Output() sendEmoji = new EventEmitter<string>();

  addReaction(event: any) {
    console.log(event);
    if (this.content === 'send-message') {
      this.sendEmojiToParent(event.emoji.native);
    }
  }

  sendEmojiToParent(emoji: string){
    this.sendEmoji.emit(emoji);
  }
}
