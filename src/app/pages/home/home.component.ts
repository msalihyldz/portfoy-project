import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private eref: ElementRef) {
    console.log("Home component is constructed.")
  }

  ngOnInit() {
    console.log("Home component is ngOnInit.")
  }

  ngAfterViewInit() { 
    console.log("Home component is ngAfterViewInit.")
  }
}