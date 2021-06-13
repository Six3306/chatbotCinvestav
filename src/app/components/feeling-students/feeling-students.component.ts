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

export interface Materia{
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
  materiaSelected:String;
  bimSelected:any;
  bimSelected2:any;
  groupSelected:String="";
  gradeSelected:String="";
  subjects:Materia[];

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
      subjectSel: ['',Validators.required],
    });
    this.user= JSON.parse(localStorage.getItem("user"));    
  }

  ngOnInit() {
  }


  searchStudents(){
    this.materiaSelected=undefined;
    this.bimSelected=undefined;
    this.bimSelected2=undefined;
    if (this.gradeSelected){
      let subjects: Materia[] = [];
      let data={
        grade: this.gradeSelected,
        group: this.groupSelected,
        professor: this.user.username,
      };

      this.firebase.getSubjectsByProfessorGrade(data).then(response=>{
        response.forEach(element => {
          subjects.push({value: element, viewValue: element});
        });
        this.subjects = subjects;
      });
    }

  }

  searchStudentsTwo(){
    if (this.gradeSelected != null && this.groupSelected != null && this.materiaSelected != null) {
      // let bimT: Bim[] = [];
      // let dataN = {
      //   subject: this.materiaSelected,
      //   grade: this.gradeSelected,
      //   group: this.groupSelected,
      // }
      // this.firebase.getbimReport(dataN).then(response=>{        
      //   this.bimRepSelected = response;
      //   this.bimTI = response;
      //   for (let i = 0; i < response; i++) {
      //     bimT.push({value: i+1});
      //   }
      //   this.showScores();        
      // });
      // this.bimes = bimT;
    }
  }

}
