import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Message } from '../../../../models/message.class';
import { ThreadService } from '../../../../services/thread.service';

@Component({
  selector: 'app-reaction-bar',
  standalone: true,
  imports: [],
  templateUrl: './reaction-bar.component.html',
  styleUrl: './reaction-bar.component.scss'
})
export class ReactionBarComponent implements OnInit {
  threadService = inject(ThreadService);

  @Input() currentMessage: Message = new Message()
  @Input() threadMessage: boolean = false;
  @Output() triggerAnswer = new EventEmitter<void>();

  ngOnInit(): void {
    this.currentMessage = new Message(this.currentMessage);
  }

  triggerAnswerInParent() {
    this.triggerAnswer.emit();
  }

  
}
