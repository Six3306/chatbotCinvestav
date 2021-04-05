import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pass-fail',
  templateUrl: './pass-fail.component.html',
  styleUrls: ['./pass-fail.component.css']
})
export class PassFailComponent implements OnInit {

  @Input()
  grade:any
  @Input()
  group:any
  
  constructor() { }

  ngOnInit() {
  }

}
