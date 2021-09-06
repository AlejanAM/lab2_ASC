import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemShowModalComponent } from './item-show-modal.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ItemShowModalComponent
  ],
  exports: [
    ItemShowModalComponent
  ]
})
export class ItemShowModalModule {}
