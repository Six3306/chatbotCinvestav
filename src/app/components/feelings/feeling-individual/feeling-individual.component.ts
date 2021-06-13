import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-feeling-individual',
  templateUrl: './feeling-individual.component.html',
  styleUrls: ['./feeling-individual.component.css']
})
export class FeelingIndividualComponent implements OnInit {

  @Input()
  grade:any
  @Input()
  group:any


  constructor() { }

  ngOnInit() {
  }

}
