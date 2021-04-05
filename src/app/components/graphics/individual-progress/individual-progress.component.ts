import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-individual-progress',
  templateUrl: './individual-progress.component.html',
  styleUrls: ['./individual-progress.component.css']
})
export class IndividualProgressComponent implements OnInit {

  @Input()
  grade:any
  @Input()
  group:any

  constructor() { }

  ngOnInit() {
  }

}
