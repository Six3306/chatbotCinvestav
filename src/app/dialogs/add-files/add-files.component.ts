import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User.model';
import { Subject } from 'src/app/models/Subject.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
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

export interface Url {
  url: string;
}

@Component({
  selector: 'app-add-files',
  templateUrl: './add-files.component.html',
  styleUrls: ['./add-files.component.css']
})
export class AddFilesComponent implements OnInit {

  //elementos para las etiquedas de url
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  urls: Url[] = [];

  grades: Grade[];
  user: User;
  arraySubjects: Array<Subject>;
  subjects: Materia[];
  gradeSelected: String;
  groupSelected: String
  materiaSelected: String

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

  arrayMaterias: Array<Subject>;

  response: Boolean;

  /**
   * form con los datos del archivo
   */
  formFile: FormGroup;

  /**
   * variable que indica si ya se envio la respuesta
   */
  enviado: Boolean;

  /**
   * Variable que tiene los datos a guardar del archivo
   * @param descripcion la descripcion del archivo
   * @param grado el grado para los alumnos del archivo
   * @param grupo el grupo para los alumnos del archivo
   * @param materia la materia a la que pertenece el archivo
   */
  data = {
    title: "",
    description: "",
    grade: "",
    group: "",
    subject: "Materia",
  };
  /**
   * 
   * @param formBuilder Contructor base de un form
   * @param dialogRef variable para hacer la referencia al dialogo 
   * @param firebase variable de la conexion con firebase
   * @param message mensaje a recibir de la ventana que invoca al dialog
   */
  constructor(
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddFilesComponent>,
    public firebase: FirebaseService,
    @Inject(MAT_DIALOG_DATA) public message: string,
    private snackBar: MatSnackBar,
  ) {
    this.formFile = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      grade: ['', [Validators.required]],
      group: ['', [Validators.required]],
      subject: ['Materia', [Validators.required]],
    });

  }

  /**
   * Funcion para cerrar el dialog  
   */
  onClickNo(): void {
    this.dialogRef.close()
  }
  ngOnInit() {
    this.retornaGrados();
  }

  //metodo para obtener los grados del profe actual
  retornaGrados() {
    this.user = JSON.parse(localStorage.getItem("user"));
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

  /**
   * Funcion para enviar el archivo
   */
  sendFile() {
    var b = true;
    this.data = this.formFile.value;
    var caP = ["{", "}", "[", "]", "-", "_", "|", "&", ".delete", ".update", "alert("];

    for (let i = 0; i < caP.length; i++) {
      if (this.data.title.includes(caP[i]) || this.data.description.includes(caP[i])) {
        b = false;
      }
    }

    if (this.data.title.trim() == "" && this.data.description.trim() == "") {
      b = false;
    }

    if (b) {
      let date: Date = new Date();
      let publicationDate: String = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      this.firebase.addLinkMaterial(this.data, this.urls, publicationDate);
      this.openCustomerSnackBar();
    } else {
      this.openCustomerSnackBarNot();
    }

  }

  //metodo para listar las materias que da un profesor en determinado grado
  darMaterias() {
    if (this.gradeSelected) {
      let subjects: Materia[] = [];
      let data = {
        grade: this.gradeSelected,
        group: this.groupSelected,
        professor: this.user.username
      };

      this.firebase.getSubjectsByProfessorGrade(data).then(response => {
        response.forEach(element => {
          subjects.push({ value: element, viewValue: element });
        });
        this.subjects = subjects;
      });
    }
  }

  //para añadir a las url
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    var b = true;

    if ((value || '').trim()) {
      if (value.includes("http")) {
        for (let i = 0; i < this.urls.length; i++) {
          // console.log("si"+this.urls[i].);

          if (this.urls[i].url == value) {
            b = false;
          }
        }

        if (b) {
          this.urls.push({ url: value });
        }
      }
    }
    if (input) {
      input.value = '';
    }
  }

  //remueve las url
  remove(url: Url): void {
    const index = this.urls.indexOf(url);
    if (index >= 0) {
      this.urls.splice(index, 1);
    }
  }

  //para abrir la ventana de notificacion emergente y mostrar que la operacion de agregar material de apoyo se realizo correctamente
  openCustomerSnackBar() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentAddFilesChatbot, { duration: 4000 });
  }

  //para abrir la ventana de notificacion emergente y mostrar que la operacion de agregar material de apoyo no agrego el material
  openCustomerSnackBarNot() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentAddFilesChatbotNot, { duration: 4000 });
  }

}


@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #00ff4ce3;'><strong>Material de apoyo agregado correctamente</strong></span>`
})
export class CustomSnackBarComponentAddFilesChatbot { }

@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #D63513;'><strong>El material de apoyo no fue añadido, verifica que tu información sea correcta</strong></span>`
})
export class CustomSnackBarComponentAddFilesChatbotNot { }
