import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { APIService } from 'src/app/services/api/api.service';
import { Subject } from 'src/app/models/Subject.model';
import { AddSubjectComponent } from 'src/app/dialogs/add-subject/add-subject.component';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { SubjectG } from 'src/app/models/SubjectG.model';

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

@Component({
  selector: 'app-class-g',
  templateUrl: './class-g.component.html',
  styleUrls: ['./class-g.component.css'],
  providers: [MatSnackBar]
})
export class ClassGComponent implements OnInit {

  /**
   * Arreglo que contiene todas las materias de los alumnos
   */
  arrayLessons: Array<Subject>;
  
  arraySubjects: Array<SubjectG>;


  /**
   * Indica si ya se buscaron materias  
   */
  materias: Boolean =false;

  /**
   * Columnas a mostrar para las materias
   */
  displayedColumnsLessons: String[] = ['name', 'grade', 'professor','status'];
  
  
  /**
   * Tabla donde estan los datos de los usuarios
   */
  dataSourceLessons: MatTableDataSource<Subject>;
  
  dataSourceSubjects: MatTableDataSource<SubjectG>;




  /**
   * Contiene el valor del grado seleccionado
   */
  gradeSelected:String

  /**
   * Contiene el valor del grupo seleccionado
   */
  profeSelected:String
  /**
   *  Propiedad que sirve para tener los grados de los alumnos
   * @param value es el valor que tendra como tal la seleccion 
   * @param viewValue es el valor que que se muestra para la seleccion 
   * 
   */
  grades:Grade[] = [
    {value: '1', viewValue:"1°"},
    {value: '2', viewValue:"2°"},
    {value: '3', viewValue:"3°"}
  ];
 

  @ViewChildren(MatPaginator, ) paginator:QueryList<MatPaginator>;
  @ViewChildren(MatSort)  sort:QueryList< MatSort>;

  /**
   * Constructor de la clase 
   * @param api es la variable de la api que conecta con la base de datos
   * @param dialog variable para hacer llamada a un dialog externo
   */
  constructor(
    private api: APIService,
    public dialog : MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private firebase: FirebaseService,
  ) {

  }

  ngOnInit() {    
  }


  /**
   * Metodo que elimina una materia 
   * @param row Matetria qu recibe como parametro para eliminar
   */
  deleted(row:Subject){
    // row.status=true;
    // this.api.updateSubject(row).subscribe(response=>{
    //   // console.log(response);
    //   let params={
    //     grade:this.gradeSelected
    //   }
  
    //   this.api.getSubjectsGrade(params).subscribe(response=>{
    //     this.materias=true
    //     this.arrayLessons=response as Array<Subject>
    //     this.dataSourceLessons = new MatTableDataSource(this.arrayLessons);
    //     this.dataSourceLessons.paginator = this.paginator.first;
    //     this.dataSourceLessons.sort = this.sort.first;
    //   });
    // })
    
  }

  changeActivated(activated:Boolean, row : any){
    row.status=activated;
    this.firebase.updateStatusSubject(row);
    // console.log(row.name+" ... "+row.status);
    
    // this.api.updateUser(user).subscribe(response=>{
    //   // console.log(response)
    // })
  }

  viewSubjects(){
    let params={
      grade:this.gradeSelected
    }

    this.firebase.getSubjectsByGrade(params).then(response=>{
      this.dataSourceSubjects = new MatTableDataSource(response);
      this.dataSourceSubjects.paginator = this.paginator.first;
      this.dataSourceSubjects.sort = this.sort.first;
    });
  }
 

  //Metodo para mostrar las materias de cierto grado seleccionado
  searchSubjects(){ 
    if (this.gradeSelected){
      this.viewSubjects();
    }
  }

  /**
   * Metodo para añadir una nueva materia abre un dialog
   */
  addSubject(){
    const dialogRef = this.dialog.open(AddSubjectComponent,{
      data: {
        grade: this.gradeSelected
      }
    });
    dialogRef.afterClosed().subscribe(response=>{
        if(response){
          //añadiendo a Firebase la nueva materia
          let classGData = {
            subject: response.materia,
            grade: response.grado,
            professor: response.profesor,
          }
          this.firebase.addSubject(classGData);
        
          this.viewSubjects();
          this.openCustomerSnackBarLesson();         
        } 
           
    })
  }



  //metodo para regresar al menu principal
  menuP(){
    this.router.navigateByUrl("Menu");
  } 

  //para mostrar un cuadro emergente con el mensaje de que una materia ha sido agregada correctamente
  openCustomerSnackBarLesson(){
    return this.snackBar.openFromComponent(CustomSnackBarComponentUserLessonsAddLesson, {duration: 4000});
  }

}


@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #00ff4ce3;'><strong>Materia Añadida Correctamente</strong></span>`
})
export class CustomSnackBarComponentUserLessonsAddLesson{}
