import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-general-progress',
  templateUrl: './general-progress.component.html',
  styleUrls: ['./general-progress.component.css']
})
export class GeneralProgressComponent implements OnInit {

  @Input()
  grade:any
  @Input()
  group:any

  constructor() { }

  ngOnInit() {
  }

}
