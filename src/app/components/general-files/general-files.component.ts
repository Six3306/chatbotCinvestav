import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { GeneralFile } from 'src/app/models/GeneralFile.model';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { User } from 'src/app/models/User.model';
import { Student } from 'src/app/models/Student.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';


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

export interface Email {
  email: string;
}

@Component({
  selector: 'app-general-files',
  templateUrl: './general-files.component.html',
  styleUrls: ['./general-files.component.css'],
  providers: [MatSnackBar]
})
export class GeneralFilesComponent implements OnInit {

  displayedColumns: string[] = ['name', 'origen', 'fecha', 'info', 'link'];

  rols: string[] = ['Profesor', 'Alumno'];

  professorSelected: string = "";

  grades: Grade[] = [
    { value: '1', viewValue: "1°" },
    { value: '2', viewValue: "2°" },
    { value: '3', viewValue: "3°" }
  ];

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: Email[] = [];


  /**
 * Columnas a mostrar para los alumnos
 */
  displayedColumnsS: string[] = ['name', 'email', 'addStudent'];

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

  groupSelected: String = "";
  gradeSelected: String = "";


  formFileSend: FormGroup;
  formFileDes: FormGroup;

  public nombreArchivo = "";
  generalFiles: GeneralFile[];
  dataSource: MatTableDataSource<GeneralFile>;

  dataSourceUsers: MatTableDataSource<User>;

  displayedColumnsUsers: string[] = ['name', 'email', 'activated'];

  //email de quien va a enviar los archivos
  public nameUserAct = (JSON.parse(localStorage.getItem("user")).email).split("@")[0];

  public datosFormulario = new FormData();//obtener y almacenar todos los valores del input (los archivos q selecciona el user)

  @ViewChildren(MatPaginator,) paginator: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sort: QueryList<MatSort>;

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
  ) {
    this.user = JSON.parse(localStorage.getItem("user"));

    this.formFileSend = this.formbuilder.group({
      archivo: ['', [Validators.required]],
      description: [''],
    });

    this.formFileDes = this.formbuilder.group({
      rol: ['', Validators.required],
      gradeSel: ['', Validators.required],
      groupSel: ['', Validators.required],
    });
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

  searchStudents() {
    if (this.gradeSelected != null && this.groupSelected != null) {
      this.listarDesti();
    }
  }

  listarDesti() {
    let params = {
      "grade": this.gradeSelected,
      "group": this.groupSelected
    }
    //buscar en firebase los alumnos segun grado y grupo seleccionado
    this.firebase.getStudentssByGradeGroup(params).then(response => {
      this.arrStudents = response;
    }).then(() => {
      this.showStudentsByGradeGroup();
    });
  }

  showStudentsByGradeGroup() {
    this.dataSourceStudent = new MatTableDataSource(this.arrStudents);
    this.dataSourceStudent.paginator = this.paginator.last;
    this.dataSourceStudent.sort = this.sort.last;
  }

  //remueve las url
  remove(email: Email): void {
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  //para añadir a las url
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.emails.push({ email: value });
    }
    if (input) {
      input.value = '';
    }
  }

  //metodo que permite retornar todos los profesores registrados en el sistema
  retornaProfes() {


    if (this.user.type == "Alumno") {
      this.firebase.getGradeGroupStudent(this.user.username, this.user.email).then((r) => {
       
        this.firebase.getReceptionProfessorsGradeGroup(r.split("#")[0]).then(response => {
         
          let profes: Grade[] = [];
          this.profes = profes;
          for (let i = 0; i < response.length; i++) {
              profes.push({ value: response[i].split("#")[0].split("@")[0], viewValue: response[i].split("#")[1] });
            
          }

          this.profes = profes;
        });

      })
    } else {
      this.firebase.getEmailProfessors().then(response => {
        let profes: Grade[] = [];
        this.profes = profes;
        for (let i = 0; i < response.length; i++) {
          if (response[i].split("#")[0].split("@")[0] != this.nameUserAct) {
            profes.push({ value: response[i].split("#")[0].split("@")[0], viewValue: response[i].split("#")[1] });
          }
        }

        this.profes = profes;

      });
    }


    // this.firebase.getEmailProfessors().then(response => {
    //   let profes: Grade[] = [];

    //   if (this.user.type == "Alumno") {
    //     for (let i = 0; i < response.length; i++) {
    //       if (parseInt(response[i].split("#")[2]) == 1) {

    //       } else {
    //         profes.push({ value: response[i].split("#")[0].split("@")[0], viewValue: response[i].split("#")[1] });
    //       }
    //     }
    //   } else {
    //     for (let i = 0; i < response.length; i++) {
    //       if (response[i].split("#")[0].split("@")[0] != this.nameUserAct) {
    //         profes.push({ value: response[i].split("#")[0].split("@")[0], viewValue: response[i].split("#")[1] });
    //       }
    //     }
    //   }

    //   this.profes = profes;
    // });

  }

  profes: Grade[];

  verifyNotExitsinList(nEmail) {
    let b: boolean = false;
    for (let i = 0; i < this.emails.length; i++) {
      if (this.emails[i].email == nEmail) {
        b = true;
        break
      }
    }
    if (!b) {
      this.emails.push({ email: nEmail });
    }
  }

  addStudent(row) {
    let em = row.email.split("@")[0];
    this.verifyNotExitsinList(em);
  }

  addProfessor() {
    if (this.professorSelected == "") {
      console.log("Selecciona un profesor");
    } else {
      this.verifyNotExitsinList(this.professorSelected);
    }
  }



  //Sube el archivo a Cloud Storage
  public subirArchivo() {
    let archivo = this.datosFormulario.get('archivo');
    let description = this.formFileSend.get('description').value;

    if (archivo === null) {
      alert("Seleccione el archivo a enviar!");
    } else {
      let fecha = new Date();
      let fechaStr = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + " - " + fecha.getHours() + ":" + fecha.getMinutes();
      for (let i = 0; i < this.emails.length; i++) {
        this.firebase.userExists(this.emails[i].email).then(response => {
          // console.log(response+" - "+this.emails[i].email);
          if (response == true) {
            this.firebaseStorage.guarda2(this.emails[i].email, this.nameUserAct, fechaStr, description, archivo);
            this.openCustomerSnackBar();
          }
        });
      }
    }

  }

  //lista los mensajes y archivos que han sido recibidos por el usuario que actualmente esta activo en el sistema, obteniendo además
  //los metadatos del archivo como informacion del remitente, fecha, descripción
  listar2() {

    let nGFilesTmp: GeneralFile[] = [];

    this.firebaseStorage.referenciaCloudStorageList2(this.nameUserAct).then((response) => {
      response.items.forEach(function (ite) {

        let nGF = new GeneralFile("", "", "", "", "");
        ite.getMetadata().then(r => {

          nGF.setNameFile(ite.name);
          nGF.setRemitente(r["customMetadata"].remitente);
          nGF.setTimeSend(r["customMetadata"].fecha);
          nGF.setDescription(r["customMetadata"].description);

          ite.getDownloadURL().then((r) => {
            nGF.setUrl(r);
          });

        });
        nGFilesTmp.push(nGF);
      });

    }).then(() => {

      this.generalFiles = nGFilesTmp;
      this.dataSource = new MatTableDataSource(this.generalFiles);
      this.dataSource.paginator = this.paginator.first;
      this.dataSource.sort = this.sort.first;
    });
  }

  //inicialmente listamos los archivos que han llegado invocando a la funcion de listar2
  ngOnInit() {
    this.listar2();
    this.retornaProfes();
  }

  //para regresar al menu principal
  menuP() {
    this.router.navigateByUrl("Menu");
  }
  //para mostrar un mensaje emergente notificando que un archivo ha sido enviado correctamente.
  openCustomerSnackBar() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentSendGeneralFile, { duration: 4000 });
  }

}


@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #00ff4ce3;'><strong>Archivo Enviado Correctamente</strong></span>`
})
export class CustomSnackBarComponentSendGeneralFile { }