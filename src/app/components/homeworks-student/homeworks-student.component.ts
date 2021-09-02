import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Homework } from 'src/app/models/Homework.model';
import { StudentHomeworks } from 'src/app/models/StudentsHomeworks.model';
import { ViewDetailsHomeworksComponent } from '../../dialogs/view-details-homeworks/view-details-homeworks.component';
import { FeedbackHomeworkComponent } from 'src/app/dialogs/feedback-homework/feedback-homework.component';
import { User } from 'src/app/models/User.model';
import { AddHomeworkComponent } from '../../dialogs/add-homework/add-homework.component';

export interface Grade {
  value: any,
  viewValue: any
}

export interface Group {
  value: any,
  viewValue: any
}


@Component({
  selector: 'app-homeworks-student',
  templateUrl: './homeworks-student.component.html',
  styleUrls: ['./homeworks-student.component.css']
})
export class HomeworksStudentComponent implements OnInit {
  displayedColumnsHomework: string[] = ['nameStudent', 'details', 'link', 'status','feedback'];

  grades: Grade[] = [
    { value: '1', viewValue: "1°" },
    { value: '2', viewValue: "2°" },
    { value: '3', viewValue: "3°" }
  ];

  subjects: String[] = [];
  homeworks: Homework[] = [];

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
  subjectSelected: String = "";
  dateHourLimit: String = "";
  description: String = "";
  statusH: String;

  estatusFeedback: any;
  feedbackComment: any;
  fechaRetroalimentacion: any;
  horaRetroalimentacion: any;
  fechaEntrega:any;
  horaEntrega:any;
  comentarioHE:any;
  estatusEntrega:any;
  urlH:any;
  urlF:any;

  homeworkSelected: String = null;
  homeworkSelectedTmp: String;

  formFileDes: FormGroup;
  formSelSubjectandHomework: FormGroup;

  dataSourceHomeworks: MatTableDataSource<StudentHomeworks>


  //email de quien va a enviar los archivos
  public nameUserA = (JSON.parse(localStorage.getItem("user")).username);
  user:User = JSON.parse(localStorage.getItem("user"))


  @ViewChildren(MatPaginator,) paginator: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sort: QueryList<MatSort>;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private formbuilder: FormBuilder,
    private firebaseStorage: FirebaseService,
    private firebase: FirebaseService,
    private snackBar: MatSnackBar,
  ) {
    this.formSelSubjectandHomework = this.formbuilder.group({
      subjectS: ['', Validators.required],
      homeworkS: ['', Validators.required],
    });
  }

  //inicialmente listamos los archivos que han llegado invocando a la funcion de listar2
  ngOnInit() { 
    this.firebase.getInfoStudent(this.user.username, this.user.email).then(response=>{
      this.gradeSelected = response.grade;
      this.groupSelected = response.group;
      this.listarSubject();
    });
    // this.retornaProfes();
  }


  searchHomewoksSubject() {
    this.homeworkSelected = null;
    if (this.subjectSelected != null) {
      this.listarHomeworksSelGradGrupMat();
    }
  }

  searchHomewoks() {
    if (this.homeworkSelected != null || this.homeworkSelected != "") {
      for (let homework of this.homeworks) {
        if (homework.id == this.homeworkSelected) {
          let dateTmp = homework.dayLimit.split("-");
          this.fechaEntrega = dateTmp[2]+"-"+dateTmp[1]+"-"+dateTmp[0];
          this.dateHourLimit = this.fechaEntrega + " a las " + homework.hourLimit;
          this.description = homework.description;
          this.statusH = homework.activated == 1 ? "activa" : "inactiva";
          this.getHomeworksInfoAndFile();
          break;
        }
      }
    }
  }

  getHomeworksInfoAndFile() {
    var data = {
      "grade": this.gradeSelected,
      "group": this.groupSelected,
      "subject": this.subjectSelected,
      "idHomework": this.homeworkSelected,
      "nameStudent": this.user.username,
      "title": this.homeworkSelected+"--"+this.user.username,
    }

    
    this.firebase.getInfoHomeworkStudentSend(data).then(response=>{
      let arrHI = response.split("@");
      this.estatusFeedback = arrHI[0];
      this.feedbackComment = arrHI[1];
      this.fechaRetroalimentacion = arrHI[2];
      this.horaRetroalimentacion = arrHI[3];
      this.estatusEntrega = arrHI[4];
      if(this.estatusEntrega!=0){
        this.firebase.listDataHomeworkFileStudent(data).then(r=>{
          let fechaEntregaTmp = r["timeCreated"].split("T")[0].split("-");
          this.fechaEntrega = fechaEntregaTmp[2]+"-"+fechaEntregaTmp[1]+"-"+fechaEntregaTmp[0];
          this.horaEntrega = r["timeCreated"].split("T")[1].split(".")[0];
          this.comentarioHE = r["customMetadata"]["description"];
          this.firebase.listLinkHomeworkFileStudent(data).then(link=>{
            this.urlH = link;
          });
        });
      }
      if(this.estatusFeedback!=0){
        this.firebase.listHomeworkFileFeedbackStudents(data).then(linkFeedback=>{
          this.urlF = linkFeedback;
        });
      }
      
    });

  }

  openDialogAddHomework(){
    const dialogRef = this.dialog.open(AddHomeworkComponent,{
      data: {
        "subjectR": this.subjectSelected,
        "homeworkIdR": this.homeworkSelected,
      }
    });
    dialogRef.afterClosed().subscribe(response=>{  
      if(response==1){

        // this.listarHomeworksSelGradGrupMat();
        
        this.getHomeworksInfoAndFile();
        this.openCustomerSnackBar();
        // this.searchHomewoks();
        
      }
    })
  }

  listarSubject() {
    this.firebase.getSubjectsNameByGrade(this.gradeSelected).then(response => {
      this.subjects = response;     
    });
  }

  listarHomeworksSelGradGrupMat() {
    let params = {
      "grade": this.gradeSelected,
      "group": this.groupSelected,
    }
    this.firebase.getHomeworksBySubject(params, this.subjectSelected).then(response => {
      this.homeworks = response;
    });

  }
  

  //para regresar al menu principal
  menuP() {
    this.router.navigateByUrl("Menu");
  }

  //metodo para mostrar una notificacion emergente de que la respuesta a la duda fue añadida correctamente
  openCustomerSnackBar() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentResponseSendHomeworkI, { duration: 4000 });
  }

}


@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #00ff4ce3;'><strong>Tu tarea ha sido entregada</strong></span>`
})
export class CustomSnackBarComponentResponseSendHomeworkI { }
