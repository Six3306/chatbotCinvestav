import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { User } from 'src/app/models/User.model';
import { AddStudentComponent } from 'src/app/dialogs/add-student/add-student.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { Student } from '../../models/Student.model';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';

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

@Component({
  selector: 'app-users-lessons',
  templateUrl: './users-lessons.component.html',
  styleUrls: ['./users-lessons.component.css'],
  providers: [MatSnackBar]
})
export class UsersLessonsComponent implements OnInit {
  /**
   * Arraeglo que contiene a todos los alumnos buscados
   */
  arrayStudents: Array<User>;

  /**
  * Arreglo que contiene a todos los estudiantes buscados
  */
  arrStudents: Array<Student>;

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
  displayedColumns: string[] = ['select', 'name', 'email', 'delet'];

  /**
   * Tabla donde estan los datos de los usuarios
   */
  dataSource: MatTableDataSource<User>;

  /**
 * Tabla donde estan los datos de los estudiantes
 */
  dataSourceStudent: MatTableDataSource<Student>;

  /**
   * Contiene el valor del grado seleccionado
   */
  gradeSelected: String

  /**
   * Contiene el valor del grupo seleccionado
   */
  groupSelected: String

  /**
   * Contiene el valor del grupo seleccionado
   */
  profeSelected: String
  /**
   *  Propiedad que sirve para tener los grados de los alumnos
   * @param value es el valor que tendra como tal la seleccion 
   * @param viewValue es el valor que que se muestra para la seleccion 
   * 
   */
  grades: Grade[] = [
    { value: '1', viewValue: "1°" },
    { value: '2', viewValue: "2°" },
    { value: '3', viewValue: "3°" }
  ];

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



  @ViewChildren(MatPaginator,) paginator: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sort: QueryList<MatSort>;

  /**
   * Constructor de la clase 
   * @param api es la variable de la api que conecta con la base de datos
   * @param dialog variable para hacer llamada a un dialog externo
   */
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private firebase: FirebaseService,
  ) {

  }
  ngOnInit() {
  }

  showStudentsByGradeGroup() {
    let params = {
      "grade": this.gradeSelected,
      "group": this.groupSelected
    }
    //buscar en firebase los alumnos segun grado y grupo seleccionado
    this.firebase.getStudentssByGradeGroup(params).then(response => {

      this.arrStudents = response;

      this.dataSourceStudent = new MatTableDataSource(response);
      this.dataSourceStudent.paginator = this.paginator.last;
      this.dataSourceStudent.sort = this.sort.last;
    });
  }

  /**
   * Metodo que sirve para buscar un estudiante haciendo una llamada a la base de datos por la 
   * API este metodo no recive parametros porque saca los valores de los campos seleccionador de el grado y el grupo
   */
  searchStudents() {
    if (this.gradeSelected != null && this.groupSelected != null) {
      this.showStudentsByGradeGroup();
    }
  }


  /**
   * Filtro para busqueda en la tabla de alumnos
   * @param filterValue Valor a filtrar en la tabla de alumnos
   */
  applyFilter(filterValue: string) {
    if (this.gradeSelected && this.groupSelected) {
      this.dataSourceStudent.filter = filterValue.trim().toLowerCase();
      if (this.dataSourceStudent.paginator) {
        this.dataSourceStudent.paginator.firstPage();
      }
    }
  }

  /**
   * Metodo para añadir un estudiante 
   */
  addStudent() {
    //Abriendo el cuadro de dialogo para seleccionar los o el estudiante a agregar
    const dialogRef = this.dialog.open(AddStudentComponent, {
      data: {
        grade: this.gradeSelected,
        group: this.groupSelected
      }
    });
    //despues de cerrar el cuadro de dialogo
    dialogRef.afterClosed().subscribe(responseDialog => {
      if (responseDialog) {
        console.log(responseDialog);
        if (responseDialog.length == 0) {
          this.openCustomerSnackBarStudentRemoveE();
        } else {
          for (let index = 0; index < responseDialog.length; index++) {
            //añadiendo a Firebase el grado y grupo de un usuario
            let dataU = {
              email: responseDialog[index].email,
              username: responseDialog[index].username,
              grade: responseDialog[index].grade,
              group: responseDialog[index].group
            }
            this.firebase.setGradeGroup(dataU);
            //obtenemos las materias de dicho grado

            this.firebase.getSubjectsNameByGrade(responseDialog[index].grade).then(response => {
              this.firebase.setStudentScoreClass(dataU, response);
              this.firebase.setFeedbackClass(dataU, response);
            });
          }
          this.showStudentsByGradeGroup();
          this.openCustomerSnackBarStudent();
        }
      }
    })
  }

  /**
   * Metodo para eliminar un estudiante
   * @param row Estudiante a eliminar
   */
  deleteStudent(row) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        msg: "¿Seguro que deseas eliminar dicho usuario?",
      }
    });
    dialogRef.afterClosed().subscribe(responseDialog => {
      if (responseDialog) {
        if (responseDialog == 1) {
          this.firebase.deleteGradeGroupStudent(row.email.split("@")[0]);
          this.firebase.getSubjectsNameByGrade(this.gradeSelected).then(response => {
            let data = {
              userName: row.username,
              grade: this.gradeSelected,
              group: this.groupSelected,
              email: row.email.split("@")[0]
            };
            this.firebase.removeStudentScoreClass(data, response);
            this.firebase.removeStudentQuestionsClass(data, response);
            this.firebase.removeStudentQuestionsExamClass(data, response);
            this.firebase.removeStudentQuestionsHomeworkClass(data, response);
            this.firebase.removeStudentFeelDetect(data);
          });
          this.showStudentsByGradeGroup();
          this.selection = new SelectionModel<Student>(true, []);
          this.openCustomerSnackBarStudentRemove();
        }
      }
    })
  }


  /**
   * Metodo para comprobar si todos en una pagina han sido seleccionados
   */
  isAllSelected() {
    if (this.gradeSelected != null && this.groupSelected != null) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSourceStudent.data.length;
      return numSelected === numRows;
    }
  }
  /**
   * Metodo para seleccionar 
   */
  masterToggle() {
    if (this.gradeSelected != null && this.groupSelected != null) {
      this.isAllSelected() ?
        this.selection.clear() :
        this.dataSourceStudent.data.forEach(row => this.selection.select(row));
    }
  }
  /**
   * Metood para eliminar a todo seleccionado
   */
  async removeSelectedRows() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        msg: "¿Seguro que deseas eliminar dicho usuario?",
      }
    });

    dialogRef.afterClosed().subscribe(responseDialog => {
      if (responseDialog) {
        if (responseDialog == 1) {
          if (this.gradeSelected != null && this.groupSelected != null) {
            this.selection.selected.forEach(item => {
              var dir = item.email.split("@");
              this.firebase.deleteGradeGroupStudent(dir[0]);
              //remover las calificaciones del grado y grupo de un alumno(actualmente funcional pero en desuso debido a que solo se elimina el grado y grupo de un alumno)
              this.firebase.getSubjectsNameByGrade(this.gradeSelected).then(response => {
                let data = {
                  userName: item.username,
                  grade: this.gradeSelected,
                  group: this.groupSelected,
                  email: dir[0]
                };
                this.firebase.removeStudentScoreClass(data, response);
                this.firebase.removeStudentQuestionsClass(data, response);
                this.firebase.removeStudentQuestionsExamClass(data, response);
                this.firebase.removeStudentQuestionsHomeworkClass(data, response);
                this.firebase.removeStudentFeelDetect(data);
              });

            });
            this.showStudentsByGradeGroup();
            this.selection = new SelectionModel<Student>(true, []);
          }
        }
      }
    });
  }

  //metodo para regresar al menu principal
  menuP() {
    this.router.navigateByUrl("Menu");
  }

  //para mostrar un cuadro emergente con el mensaje de que un alumno ha sido agregado correctamente
  openCustomerSnackBarStudent() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentUserLessonsAddStudent, { duration: 4000 });
  }

  //para mostrar un cuadro emergente con el mensaje de que un alumno ha sido agregado correctamente
  openCustomerSnackBarStudentRemove() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentUserLessonsRemoveStudent, { duration: 4000 });
  }

  //para mostrar un cuadro emergente con el mensaje de que un alumno no ha sido agregado correctamente
  openCustomerSnackBarStudentRemoveE() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentUserLessonsAddStudentE, { duration: 4000 });
  }

}

@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #00ff4ce3;'><strong>Estudiante agregado correctamente</strong></span>`
})
export class CustomSnackBarComponentUserLessonsAddStudent { }

@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #00ff4ce3;'><strong>Estudiante eliminado correctamente</strong></span>`
})
export class CustomSnackBarComponentUserLessonsRemoveStudent { }

@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #D63513;'><strong>No se agrego ningun estudiante</strong></span>`
})
export class CustomSnackBarComponentUserLessonsAddStudentE { }