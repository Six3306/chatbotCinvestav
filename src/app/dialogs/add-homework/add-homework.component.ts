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
  selector: 'app-add-homework',
  templateUrl: './add-homework.component.html',
  styleUrls: ['./add-homework.component.css']
})
export class AddHomeworkComponent implements OnInit {

  displayedColumns: string[] = ['name', 'origen', 'fecha', 'info', 'link'];

  rols: string[] = ['Profesor', 'Alumno'];

  professorSelected: string = "";

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: Email[] = [];

  /**
   * Propiedad que indica 
   * @param value es el valor que tendra como tal la seleccion 
   * @param viewValue es el valor que que se muestra para la seleccion 
   * 
   */


  formFileSend: FormGroup;
  formFileDes: FormGroup;

  public nombreArchivo = "";
  generalFiles: GeneralFile[];

  dataSourceUsers: MatTableDataSource<User>;

  displayedColumnsUsers: string[] = ['name', 'email', 'activated'];

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

  subjectRI: any;
  homeworkIdRI: any;
  statusHG = "";

  /**
   * Arreglo que contiene a todos los estudiantes buscados
   */
  arrStudents: Array<Student>;
  /**
* Tabla donde estan los datos de los estudiantes
*/
  dataSourceStudent: MatTableDataSource<Student>;

  user: User;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private formbuilder: FormBuilder,
    private firebaseStorage: FirebaseService,
    private snackBar: MatSnackBar,
    private firebase: FirebaseService,
    public dialogRef: MatDialogRef<AddHomeworkComponent>,
    @Inject(MAT_DIALOG_DATA) public dataR: any
  ) {

    this.formFileSend = this.formbuilder.group({
      archivo: ['', [Validators.required]],
      description: [''],
    });

    this.formFileDes = this.formbuilder.group({
      subject: ['', Validators.required],
    });

    this.user = JSON.parse(localStorage.getItem("user"));

    if (dataR == null) {
    } else {
      this.subjectRI = dataR.subjectR;
      this.homeworkIdRI = dataR.homeworkIdR;
    }
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
      }
    } else {
      // this.mensajeArchivo = 'No hay un archivo seleccionado';
    }
  }

  searchHomeworks() {
    this.homeworks = [];
    this.firebase.getHomeworksBySubject(this.student, this.materiaSelected).then(response => {
      for (let i = 0; i < response.length; i++) {
        this.homeworks.push({ value: response[i].id, viewValue: response[i].theme });
      }
    });
  }


  //consulta el estatus de una tarea por un alumno
  viewStatusHomework(){
    var data = {
      "subject": this.materiaSelected,
      "homework": this.homeworkSelected,
      "student": this.student.username,
      "grade": this.student.grade,
      "group": this.student.group,
    }
    
    this.firebase.getStatusHomeworkStudent(data).then(r=>{
      if(r==0){
        this.statusHG = "Nunca has entregado esta tarea";
      }else if(r==1){
        this.statusHG = "Ya entregaste esta tarea";
      }else if(r ==2){
        this.statusHG = "Ya entregaste fuera de tiempo esta tarea";
      }

    });
  }

  listarDesti() {

  }


  getSubjects() {
    this.firebase.getInfoStudent(this.user.username, this.user.email).then(response => {
      this.student = new Student(response.username, response.grade, response.group, response.email, response.activated);
      this.firebase.getSubjectsNameByGrade(response.grade).then(response2 => {
        for (let i = 0; i < response2.length; i++) {
          this.subjects.push({ value: response2[i], viewValue: response2[i] })
        }
      });

    });
  }

  //Sube el archivo a Cloud Storage
  public subirArchivo() {
    if (this.homeworkIdRI == null || this.homeworkIdRI == '') {
      let archivo = this.datosFormulario.get('archivo');
      let description = this.formFileSend.get('description').value;
      if (archivo == null) {
        console.log("Seleccione el archivo a enviar!");
      } else {

        let fecha = new Date();
        let fechaStr = fecha.getDate() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getFullYear() + " T " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();

        var data = {
          'userEmail': this.student.email,
          'grade': this.student.grade,
          'group': this.student.group,
          'idHomework': this.homeworkSelected,
          'subject': this.materiaSelected,
          'title': this.homeworkSelected + "--" + this.student.username,
          'nameStudent': this.student.username,
        };
        this.firebaseStorage.saveHomework(data, fechaStr, description, archivo).then(()=>{
          if(this.statusHG!="Nunca has entregado esta tarea"){
            this.firebase.refreshFeedbackHomework(data);
            this.firebase.refreshFeedbackHomeworkStudent(data);
          }
          this.dialogRef.close(1);
        });
      }
    }else{
      let archivo = this.datosFormulario.get('archivo');
      let description = this.formFileSend.get('description').value;
      if (archivo === null) {
        alert("Seleccione el archivo a enviar!");
      } else {
        let fecha = new Date();
        let fechaStr = fecha.getDate() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getFullYear() + " T " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
        var data2 = {
          'userEmail': this.student.email,
          'grade': this.student.grade,
          'group': this.student.group,
          'idHomework': this.homeworkIdRI,
          'subject': this.subjectRI,
          'title': this.homeworkIdRI + "--" + this.student.username,
          'nameStudent': this.student.username,
        };        
        this.firebaseStorage.saveHomework(data2, fechaStr, description, archivo).then(r=>{
           if(this.statusHG!="Nunca has entregado esta tarea"){
            this.firebase.refreshFeedbackHomework(data2);
            this.firebase.refreshFeedbackHomeworkStudent(data2);
           }
           this.dialogRef.close(1);
        });
      }
    }

    
  }

  //inicialmente listamos los archivos que han llegado invocando a la funcion de listar2
  ngOnInit() {
    this.getSubjects();
  }

  //para regresar al menu principal
  menuP() {
    this.router.navigateByUrl("Menu");
  }


}
