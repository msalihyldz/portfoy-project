import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';



@NgModule({
  declarations: [ 
    HomeComponent,
    HeaderComponent,
    FooterComponent ],
  imports: [
    CommonModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
