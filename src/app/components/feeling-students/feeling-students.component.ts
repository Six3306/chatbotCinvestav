import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../models/User.model';
import { FirebaseService } from '../../services/firebase/firebase.service';


export interface Grade{
  value: any,
  viewValue: any
}
export interface Group{
  value: any,
  viewValue: any
}


@Component({
  selector: 'app-feeling-students',
  templateUrl: './feeling-students.component.html',
  styleUrls: ['./feeling-students.component.css']
})
export class FeelingStudentsComponent implements OnInit {

  formFileDes: FormGroup;
  user:User;
  bimSelected:any;
  bimSelected2:any;
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
    this.user= JSON.parse(localStorage.getItem("user"));    
  }

  ngOnInit() {
  }


  searchStudents(){
    this.bimSelected=undefined;
    this.bimSelected2=undefined;

    if(this.user.type=="Profesor"){
      if (this.gradeSelected){
        let data={
          grade: this.gradeSelected,
          group: this.groupSelected,
        };

        this.firebase.getListFeelingStudents(data).then(response=>{
          console.log(JSON.stringify(response)+"...");
          
        });
  
        
      }
    }

  }


}
