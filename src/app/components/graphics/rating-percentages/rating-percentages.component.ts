import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rating-percentages',
  templateUrl: './rating-percentages.component.html',
  styleUrls: ['./rating-percentages.component.css']
})
export class RatingPercentagesComponent implements OnInit {

  @Input()
  grade:any
  @Input()
  group:any

  constructor() { }

  ngOnInit() {
  }

}
