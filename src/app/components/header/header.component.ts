import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('navbarList', [
      transition('* => *', [
        query('li',style({ transform: 'translateY(-200%)'})),
        query('li',
          stagger('400ms', [
            animate('400ms', style({ transform: 'translateY(0)'}))
        ]))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
