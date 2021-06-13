import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-feeling-group',
  templateUrl: './feeling-group.component.html',
  styleUrls: ['./feeling-group.component.css']
})
export class FeelingGroupComponent implements OnInit {
  @Input()
  grade:any
  @Input()
  group:any

  
  constructor() { }

  ngOnInit() {
  }

}
