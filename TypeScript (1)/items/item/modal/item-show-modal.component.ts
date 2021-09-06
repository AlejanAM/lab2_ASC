import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SharedService } from '../../../../shared/shared.service';

@Component({
  selector: 'app-item-show-modal',
  templateUrl: './item-show-modal.component.html',
  styleUrls: ['../../../common/styles/style.scss']
})
class ItemShowModalComponent {

  public imgSrc: string;
  public modalId: string;

  @Output()
  changeShowState: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.imgSrc = SharedService.imgSrc;
    this.modalId = SharedService.modalId;
  }

  closeModal() {
    SharedService.isOpen = false;
    this.changeShowState.emit(SharedService.isOpen);
  }
}
export { ItemShowModalComponent }
