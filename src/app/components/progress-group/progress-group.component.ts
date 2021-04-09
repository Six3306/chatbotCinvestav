import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../models/User.model';
import { Scores } from 'src/app/models/Scores.model';

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

export interface Bim{
  value: any,
}

@Component({
  selector: 'app-progress-group',
  templateUrl: './progress-group.component.html',
  styleUrls: ['./progress-group.component.css']
})
export class ProgressGroupComponent implements OnInit  {

  formFileDes: FormGroup;

  groupSelected:String="";
  gradeSelected:String="";
  bimRepSelected:number;

  user:User;

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
 
  subjects:Materia[];
  bimes:Bim[]=[];
  materiaSelected:String;
  bimSelected:any
  bimSelected2:any
  bimTI:any
  arrayScores: Array<Scores>=[];

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
    this.retornaGrados();
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
      let bimT: Bim[] = [];
      let dataN = {
        subject: this.materiaSelected,
        grade: this.gradeSelected,
        group: this.groupSelected,
      }
      this.firebase.getbimReport(dataN).then(response=>{        
        this.bimRepSelected = response;
        this.bimTI = response;
        for (let i = 0; i < response; i++) {
          bimT.push({value: i+1});
        }
        this.showScores();        
      });
      this.bimes = bimT;
    }
  }

  
  //muestra las calificaciones
  showScores(){
    let params={
      grade: this.gradeSelected,
      group: this.groupSelected,
      subject: this.materiaSelected
    }  
    this.firebase.getScoresStudentsInLesson(params).then(response=>{
      this.arrayScores = response;      
      // console.log(this.arrayScores);
      // console.log(this.bimRepSelected);
      // this.dataSourceScores = new MatTableDataSource(response);
      // this.dataSourceScores.paginator = this.paginator.last;
      // this.dataSourceScores.sort = this.sort.last;
    });
  }

  retornaGrados(){
    this.user= JSON.parse(localStorage.getItem("user"));
    //obtenemos la lista de los grados en los que da clase el profesor actualmente logeado
    let grades: Grade[] = [];
    for (let i = 1; i <= 3; i++) {
      this.firebase.getGradesProfesor(this.user.username,i).then(response=>{
        if(response==true){
          grades.push({value: i, viewValue: i});
        }
      })
    }
    this.grades = grades;
  }

}
 