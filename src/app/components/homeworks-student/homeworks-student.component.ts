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
      console.log(response);

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


    // var studentsRegister: StudentHomeworks[] = [];
    // // var data = {
    // //   "grade": this.gradeSelected,
    // //   "group": this.groupSelected,
    // //   "subject": this.subjectSelected,
    // //   "idHomework": this.homeworkSelected
    // // }
    // this.firebase.getHomeworkStudentsStatus(data).then(res => {
    //   for (let s in res) {
    //     let nHomeworkStudent = new StudentHomeworks("", "", "", "", "", "","","");       
    //     nHomeworkStudent.setNameStudent(res[s].split("@")[1]);
    //     nHomeworkStudent.setStatus(res[s].split("@")[0]);
    //     nHomeworkStudent.setStatusFeedback(res[s].split("@")[2]);
    //     nHomeworkStudent.setFeedbackComment(res[s].split("@")[3]);
    //     nHomeworkStudent.setTimeSend("-");
    //     nHomeworkStudent.setNameFile("-");
    //     nHomeworkStudent.setDescription("-");
    //     nHomeworkStudent.setUrl("-");
    //     studentsRegister.push(nHomeworkStudent);
    //   }
    //   this.firebaseStorage.listHomeworkFileStudents(data).then(response => {
    //     response.items.forEach(function (ite) {
    //       ite.getMetadata().then(r => {
    //         studentsRegister.forEach(rS=>{
    //           if(rS.nameStudent==ite.name.split("--")[1]){
    //             rS.setNameFile(ite.name);
    //             rS.setDescription(r["customMetadata"].description);
    //             rS.setTimeSend(r["customMetadata"].fecha);
    //               ite.getDownloadURL().then((rL) => {
    //                 rS.setUrl(rL);
    //               });                  
    //           }
    //         });
    //       });
    //     });

    //   }).then(()=>{
    //     this.dataSourceHomeworks = new MatTableDataSource(studentsRegister);
    //     this.dataSourceHomeworks.paginator = this.paginator.first;
    //     this.dataSourceHomeworks.sort = this.sort.first;
    //   });
    // })
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


  viewDetails(row){
    const dialogRef = this.dialog.open(ViewDetailsHomeworksComponent,{
      data: {
        "nameStudent": row.nameStudent,
        "timeSend": row.timeSend,
        "description": row.description,
        "status": row.status,
      }
    });
    dialogRef.afterClosed().subscribe(response=>{
  });
    
  }

  
  viewFeedbackH(row){

    const dialogRef = this.dialog.open(FeedbackHomeworkComponent,{
      data: {
        "nameStudent": row.nameStudent,
        "timeSend": row.timeSend,
        "description": row.description,
        "status": row.status,
        "statusFeedback": row.statusFeedback,
        "grade": this.gradeSelected,
        "group": this.groupSelected,
        "subject": this.subjectSelected,
        "homework": this.homeworkSelected,
      }
      
    });
    dialogRef.afterClosed().subscribe(response=>{
      if(response==1 || response=="1"){
        row.statusFeedback = 1;
      }      
    });
  }

  

  //para regresar al menu principal
  menuP() {
    this.router.navigateByUrl("Menu");
  }


}

