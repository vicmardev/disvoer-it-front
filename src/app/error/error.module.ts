import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { HttpClientModule} from '@angular/common/http';




@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    ErrorRoutingModule,
    HttpClientModule,
    ErrorRoutingModule
  ],
  exports:[
    NotFoundComponent

  ]
})
export class ErrorModule { }
