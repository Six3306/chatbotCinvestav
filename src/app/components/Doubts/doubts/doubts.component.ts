import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { User } from '../../../models/User.model';

/**
 * Interace para mantener dos valores uno a mostrar y otro el valor que relamente tendra
 */
 export interface Grade{
  /**
   * value es el valor real que tendra 
   */
  value: any,
  /**
   * es el valor a mostrar de a interface
   */
  viewValue: any
}
/**
 * Interace para mantener dos valores uno a mostrar y otro el valor que relamente tendra
 */
export interface Group{
  /**
   * value es el valor real que tendra 
   */
  value: any,
  /**
   * es el valor a mostrar de a interface
   */
  viewValue: any
}

export interface Materia{
  /**
   * value es el valor real que tendra 
   */
  value: any,
  /**
   * es el valor a mostrar de a interface
   */
  viewValue: any
}

@Component({
  selector: 'app-doubts',
  templateUrl: './doubts.component.html',
  styleUrls: ['./doubts.component.css']
})
export class DoubtsComponent implements OnInit {

  /**
   * Contiene el valor del grado seleccionado
   */
  gradeSelected:String

  /**
   * Contiene el valor del grupo seleccionado
   */
  groupSelected:String

  /**
   * Contiene el valor de la materia seleccionada
   */
  materiaSelected:String;

  user:User;

  grades:Grade[];

  /**
   * Propiedad que indica 
   * @param value es el valor que tendra como tal la seleccion 
   * @param viewValue es el valor que que se muestra para la seleccion 
   * 
   */
   subjects:Materia[];
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


  constructor(public firebase: FirebaseService) { 
  this.user= JSON.parse(localStorage.getItem("user"));

  }

  ngOnInit() {
    this.retornaGrados();
  }

  selectGrade(){
    this.groupSelected = null;
    this.materiaSelected = null;
  }


  searchStudents(){
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

    if (this.gradeSelected != null && this.groupSelected != null && this.materiaSelected != null) {
    //   this.showScores();
    //   let dataN = {
    //     subject: this.materiaSelected,
    //     grade: this.gradeSelected,
    //     group: this.groupSelected,
    //   }
    //   this.firebase.getbimReport(dataN).then(response=>{
    //     console.log(response);
        
    //     this.bimRepSelected = response;
    //   });
    // }
    }
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
