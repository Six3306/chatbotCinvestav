import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { User } from 'src/app/models/User.model';
import { Subject } from 'src/app/models/Subject.model';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ScoreUserComponent } from 'src/app/dialogs/score-user/score-user.component';
import { Router } from '@angular/router';
import { Scores } from 'src/app/models/Scores.model';

/**
 * Interace para mantener dos valores uno a mostrar y otro el valor que relamente tendra
 */
export interface Grade {
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
export interface Group {
  /**
   * value es el valor real que tendra 
   */
  value: any,
  /**
   * es el valor a mostrar de a interface
   */
  viewValue: any
}

export interface Materia {
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
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css'],
  providers: [MatSnackBar]
})
export class ScoresComponent implements OnInit {
  /**
    * Arraeglo que contiene a todos los alumnos buscados
    */
  arrayStudents: Array<User>;

  /**
    * Arraglo que contiene a todos los grados y materias de un profesor
    */
  arraySubjects: Array<Subject>;
  /**
    * Arreglo que contiene a todos las materias de cierto profesor y grado
    */
  arrayMaterias: Array<Subject>;

  /**
   * Arreglo que contiene todas las materias de los alumnos
   */
  arrayLessons: Array<Subject>;

  /**
   * Indica si ya se buscaron materias  
   */
  materias: Boolean = false;
  /**
   * Indica si ya se buscaron estudiantes anteriormente
   */
  estudiantes: Boolean = false;

  /**
   * Arreglo que tiene todos los alumnos seleccionados
   */
  selection = new SelectionModel<any>(true, []);


  /**
   * Columnas a mostrar para los alumnos
   */
  displayedColumns: string[] = ['nameStudent', 'b1', 'b2', 'b3', 'b4', 'b5', 'calificar'];

  /**
   * Tabla donde estan los datos de los usuarios
   */
  dataSource: MatTableDataSource<User>;

  //dataSource para la tabla de calificaciones
  dataSourceScores: MatTableDataSource<Scores>;

  /**
   * Contiene el valor del grado seleccionado
   */
  gradeSelected: String

  /**
   * Contiene el valor del grupo seleccionado
   */
  groupSelected: String

  /**
   * Contiene el valor de la materia seleccionada
   */
  materiaSelected: String;
  bimRepSelected: number;

  /**
   *  Propiedad que sirve para tener los grados de los alumnos
   * @param value es el valor que tendra como tal la seleccion 
   * @param viewValue es el valor que que se muestra para la seleccion 
   * 
   */
  retornaGrados() {
    this.user = JSON.parse(localStorage.getItem("user"));
    //obtenemos la lista de los grados en los que da clase el profesor actualmente logeado
    let grades: Grade[] = [];
    for (let i = 1; i <= 3; i++) {
      this.firebase.getGradesProfesor(this.user.username, i).then(response => {
        if (response == true) {
          grades.push({ value: i, viewValue: i });
        }
      })
    }
    this.grades = grades;
  }

  subjects: Materia[];
  grades: Grade[];

  /**
   * Propiedad que indica 
   * @param value es el valor que tendra como tal la seleccion 
   * @param viewValue es el valor que que se muestra para la seleccion 
   * 
   */
  groups: Group[] = [
    { value: 'A', viewValue: "A" },
    { value: 'B', viewValue: "B" },
    { value: 'C', viewValue: "C" },
    { value: 'D', viewValue: "D" },
    { value: 'E', viewValue: "E" },
    { value: 'F', viewValue: "F" },
    { value: 'E', viewValue: "G" },
    { value: 'F', viewValue: "H" },
    { value: 'E', viewValue: "I" },
    { value: 'F', viewValue: "J" }
  ];

  bimReportArray: number[] = [1, 2, 3, 4, 5];

  /**
 * @param user usuario actual del sistema
 */
  user: User;


  @ViewChildren(MatPaginator,) paginator: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sort: QueryList<MatSort>;

  /**
   * Constructor de la clase 
   * @param api es la variable de la api que conecta con la base de datos
   * @param dialog variable para hacer llamada a un dialog externo
   */
  constructor(
    public firebase: FirebaseService,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.user = JSON.parse(localStorage.getItem("user"));
  }

  ngOnInit() {
    this.retornaGrados();
  }
  /**
   * Metodo que sirve para buscar un estudiante haciendo una llamada a la base de datos por la 
   * API este metodo no recibe parametros porque saca los valores de los campos seleccionador de el grado y el grupo
   */
  searchStudents() {

    if (this.gradeSelected) {
      let subjects: Materia[] = [];
      let data = {
        grade: this.gradeSelected,
        group: this.groupSelected,
        professor: this.user.username,
      };

      this.firebase.getSubjectsByProfessorGrade(data).then(response => {
        response.forEach(element => {
          subjects.push({ value: element, viewValue: element });
        });
        this.subjects = subjects;
      });
    }

    if (this.gradeSelected != null && this.groupSelected != null && this.materiaSelected != null) {
      this.showScores();
      let dataN = {
        subject: this.materiaSelected,
        grade: this.gradeSelected,
        group: this.groupSelected,
      }
      this.firebase.getbimReport(dataN).then(response => {
        this.bimRepSelected = response;
      });
    }
  }

  //para indicar hasta que bimestre se ha evaluado
  bimReport() {
    if (this.gradeSelected && this.groupSelected && this.materiaSelected) {
      // this.firebase.setbimReport();
      let data = {
        subject: this.materiaSelected,
        grade: this.gradeSelected,
        group: this.groupSelected,
        bimR: this.bimRepSelected,
      }
      this.firebase.setbimReport(data);
    }
  }

  //muestra las calificaciones
  showScores() {
    let params = {
      grade: this.gradeSelected,
      group: this.groupSelected,
      subject: this.materiaSelected
    }
    this.firebase.getScoresStudentsInLesson(params).then(response => {
      this.dataSourceScores = new MatTableDataSource(response);
      this.dataSourceScores.paginator = this.paginator.last;
      this.dataSourceScores.sort = this.sort.last;
    });
  }

  //ver la info de un usuario dado click en su boton de calificar, ademas el metodo permite modificar o bien registrar
  //una nueva calificacion en el sistema, tanto a nivel mysql como a firebase
  setScores(row) {
    const dialogRef = this.dialog.open(ScoreUserComponent, {
      data: {
        subject: this.materiaSelected,
        grade: this.gradeSelected,
        group: this.groupSelected,
        b1: row.b1,
        b2: row.b2,
        b3: row.b3,
        b4: row.b4,
        b5: row.b5,
        nameStudent: row.nameStudent,
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        if ((response.bim1 >= 0 && response.bim1 <= 10) && (response.bim2 >= 0 && response.bim2 <= 10) && (response.bim3 >= 0 && response.bim3 <= 10) && (response.bim4 >= 0 && response.bim4 <= 10) && (response.bim5 >= 0 && response.bim5 <= 10)) {
          this.firebase.getEmailStudent(response.nameStud).then(response2 => {
            let data = {
              subject: this.materiaSelected,
              grade: this.gradeSelected,
              group: this.groupSelected,
              b1: response.bim1,
              b2: response.bim2,
              b3: response.bim3,
              b4: response.bim4,
              b5: response.bim5,
              nameStudent: response.nameStud,
              email: response2.split("@")[0]
            };

            this.firebase.refreshStudentScoreClass(data);
            this.showScores();
            this.openCustomerSnackBar();

          });
        } else {
          console.log("Ingresa únicamente valores entre 0 y 10 para calificar");
        }
      }
    })

  }

  //metodo para regresar al menu principal
  menuP() {
    this.router.navigateByUrl("Menu");
  }

  //metodo para mostrar una notificacion emergente de que las calificaciones han sido modificadas o añadidas correctamente
  openCustomerSnackBar() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentAddScore, { duration: 4000 });
  }

}

@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #00ff4ce3;'><strong>Calificaciones Añadidas/Modificadas Correctamente</strong></span>`
})
export class CustomSnackBarComponentAddScore { }