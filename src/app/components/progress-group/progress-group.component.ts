import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface Grade{
  value: any,
  viewValue: any
}
export interface Group{
  value: any,
  viewValue: any
}

@Component({
  selector: 'app-progress-group',
  templateUrl: './progress-group.component.html',
  styleUrls: ['./progress-group.component.css']
})
export class ProgressGroupComponent implements OnInit {

  formFileDes: FormGroup;

  groupSelected:String="";
  gradeSelected:String="";

  grades:Grade[] = [
    {value: '1', viewValue:"1°"},
    {value: '2', viewValue:"2°"},
    {value: '3', viewValue:"3°"}
  ];

  groups:Group[] = [
    {value: 'A', viewValue:"A"},
    {value: 'B', viewValue:"B"},
    {value: 'C', viewValue:"C"},
    {value: 'D', viewValue:"D"},
    {value: 'E', viewValue:"E"},
    {value: 'F', viewValue:"F"},
    {value: 'E', viewValue:"G"},
    {value: 'F', viewValue:"H"},
    {value: 'E', viewValue:"I"},
    {value: 'F', viewValue:"J"}
  ];

  constructor(
    private formbuilder : FormBuilder,
    private firebase: FirebaseService,
  ) { 
    this.formFileDes = this.formbuilder.group({
      gradeSel: ['',Validators.required],
      groupSel: ['',Validators.required],
    });
  }

  ngOnInit() {
  }

  searchStudents(){
    if (this.gradeSelected != null && this.groupSelected != null) {
      this.listarDesti();
    }
  }

  listarDesti(){

  }

}
 