import { Component, OnInit, QueryList, ViewChildren, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { GeneralFile } from 'src/app/models/GeneralFile.model';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { User } from 'src/app/models/User.model';
import { Student } from 'src/app/models/Student.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { StudentHomeworks } from 'src/app/models/StudentsHomeworks.model';


export interface Email {
  email: string;
}

export interface Materia {
  value: any,
  viewValue: any
}

export interface Homework {
  value: any,
  viewValue: any
}

export interface Url {
  url: string;
}


@Component({
  selector: 'app-feedback-homework',
  templateUrl: './feedback-homework.component.html',
  styleUrls: ['./feedback-homework.component.css']
})
export class FeedbackHomeworkComponent implements OnInit {

  displayedColumns: string[] = ['name', 'origen', 'fecha', 'info', 'link'];

  rols: string[] = ['Profesor', 'Alumno'];

  professorSelected: string = "";

  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: Email[] = [];

  feedbackComment: String = "";

  /**
   * Propiedad que indica 
   * @param value es el valor que tendra como tal la seleccion 
   * @param viewValue es el valor que que se muestra para la seleccion 
   * 
   */

  formFileSend: FormGroup;

  public nombreArchivo = "";
  generalFiles: GeneralFile[];



  //email de quien va a enviar los archivos
  public nameUserAct = (JSON.parse(localStorage.getItem("user")).email).split("@")[0];

  public datosFormulario = new FormData();//obtener y almacenar todos los valores del input (los archivos q selecciona el user)

  @ViewChildren(MatPaginator,) paginator: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sort: QueryList<MatSort>;

  materiaSelected: String;
  homeworkSelected: String;
  subjects: Materia[] = [];
  homeworks: Homework[] = [];
  student: Student;


  /**
   * Arreglo que contiene a todos los estudiantes buscados
   */
  arrStudents: Array<Student>;
  /**
* Tabla donde estan los datos de los estudiantes
*/
  dataSourceStudent: MatTableDataSource<Student>;

  user: User;
  nameStudent: string;
  grade: any;
  group: string;
  subject: string;
  homeworkName: string;
  statusFeedback: string;
  fileUrl:string="";
  archivo = null;
  feedbackCommentA = null;


  constructor(
    private router: Router,
    public dialog: MatDialog,
    private formbuilder: FormBuilder,
    private firebaseStorage: FirebaseService,
    private snackBar: MatSnackBar,
    private firebase: FirebaseService,
    public dialogRef: MatDialogRef<FeedbackHomeworkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.formFileSend = this.formbuilder.group({
      archivo: [''],
      FeedbackComment: [''],
    });

    this.nameStudent = data.nameStudent;
    this.grade = data.grade;
    this.group = data.group;
    this.subject = data.subject;
    this.homeworkName = data.homework;
    this.statusFeedback = data.statusFeedback;

    this.firebase.getFeedbackComment(data).then(r => {
      this.feedbackComment = r;
    });

    this.getHomeworkInfoAndFile();

    this.user = JSON.parse(localStorage.getItem("user"));
  }


  //Evento que se gatilla cuando el input de tipo archivo cambia
  public cambioArchivo(event) {
    //verifica si hay archivos seleccionados
    if (event.target.files.length > 0) {
      //recorre la lista de archivos
      for (let i = 0; i < event.target.files.length; i++) {
        this.nombreArchivo = event.target.files[i].name;
        this.datosFormulario.delete('archivo');//elimina el archivo 
        this.datosFormulario.append('archivo', event.target.files[i], event.target.files[i].name)//añade los archivos creados
        this.archivo = "r";
      }
    } else {
      this.archivo = null
      // this.mensajeArchivo = 'No hay un archivo seleccionado';
    }
  }

  //Sube el archivo a Cloud Storage

  public subirArchivo() {
    let archivoF = this.datosFormulario.get('archivo');

    this.feedbackCommentA = this.formFileSend.get('FeedbackComment').value;

    if(this.feedbackCommentA == null || this.feedbackCommentA == ""){
      this.feedbackCommentA = this.feedbackComment;
    }

    if (this.archivo === null && (this.feedbackCommentA == null || this.feedbackCommentA == "")) {
      alert("Seleccione el archivo a enviar!");
    } else {
      let fecha = new Date();
        let dateA = ((fecha.getDate()<10)? "0"+fecha.getDate() : fecha.getDate()+"") + "-" + (((fecha.getMonth() + 1) < 10)? "0"+(fecha.getMonth() + 1): (fecha.getMonth() + 1)+"") + "-" + (fecha.getFullYear()+"");
        let timeA = ((fecha.getHours()<10)? "0"+fecha.getHours() : fecha.getHours()+"") + ":" + ((fecha.getMinutes()<10)? "0"+fecha.getMinutes() : fecha.getMinutes()+"") + ":" + ((fecha.getSeconds()<10)? "0"+fecha.getSeconds() : fecha.getSeconds()+"");
        var data = {
          'grade': this.grade,
          'group': this.group,
          'idHomework': this.homeworkName,
          'subject': this.subject,
          'title': this.homeworkName + "--" + this.nameStudent,
          'nameStudent': this.nameStudent,
        };
      if (archivoF === null) {
        this.firebaseStorage.saveFeedbackCommentHomework(data, dateA, timeA+"", this.feedbackCommentA);
      } else {  
        this.firebaseStorage.saveFeedbackHomework(data, dateA, timeA+"", this.feedbackCommentA, archivoF);
      }
    }
    this.dialogRef.close(1);
  }

  getHomeworkInfoAndFile() {
    // var studentsRegister: StudentHomeworks[] = [];
    var data = {
      "grade": this.grade,
      "group": this.group,
      "subject": this.subject,
      "idHomework": this.homeworkName,
      'title': this.homeworkName + "--" + this.nameStudent,
    }


    this.firebaseStorage.listHomeworkFileFeedbackStudents(data).then(response => {
      if(response!=undefined || response!=""){
        this.fileUrl = response;
      }
    }, onReject =>{
      this.fileUrl = "";
    });

  }


  //inicialmente listamos los archivos que han llegado invocando a la funcion de listar2
  ngOnInit() {
  }

  //para regresar al menu principal
  menuP() {
    this.router.navigateByUrl("Menu");
  }
  // //para mostrar un mensaje emergente notificando que un archivo ha sido enviado correctamente.
  //   openCustomerSnackBar(){
  //     return this.snackBar.openFromComponent(CustomSnackBarComponentSendGeneralFile, {duration: 4000});
  //   }

}


// @Component({
//   selector: 'custom-snackbar',
//   template: `<span style='color: #00ff4ce3;'><strong>Archivo Enviado Correctamente</strong></span>`
// })
// export class CustomSnackBarComponentSendGeneralFile{}