import { Component, inject, Input } from '@angular/core';
import { UiService } from '../../../../services/ui.service';
import { FireStorageService } from '../../../../services/fire-storage.service';

@Component({
  selector: 'app-data-detail-view',
  standalone: true,
  imports: [],
  templateUrl: './data-detail-view.component.html',
  styleUrl: './data-detail-view.component.scss'
})
export class DataDetailViewComponent {
  uiService = inject(UiService);
  fireStorageService = inject(FireStorageService);

  @Input() data = '';
  
}
