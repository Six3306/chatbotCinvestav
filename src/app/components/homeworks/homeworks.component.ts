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

export interface Grade {
  value: any,
  viewValue: any
}

export interface Group {
  value: any,
  viewValue: any
}

@Component({
  selector: 'app-homeworks',
  templateUrl: './homeworks.component.html',
  styleUrls: ['./homeworks.component.css']
})
export class HomeworksComponent implements OnInit {
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

  homeworkSelected: String = null;

  formFileDes: FormGroup;

  dataSourceHomeworks: MatTableDataSource<StudentHomeworks>


  //email de quien va a enviar los archivos
  public nameUserA = (JSON.parse(localStorage.getItem("user")).username);

  @ViewChildren(MatPaginator,) paginator: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sort: QueryList<MatSort>;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private formbuilder: FormBuilder,
    private firebaseStorage: FirebaseService,
    private firebase: FirebaseService,
  ) {
    this.formFileDes = this.formbuilder.group({
      rol: ['', Validators.required],
      gradeSel: ['', Validators.required],
      groupSel: ['', Validators.required],
      subjectSel: ['', Validators.required],
      homeworkSel: ['', Validators.required],
    });
  }

  searchHomewoksGrade() {
    this.groupSelected = null;
    this.subjectSelected = null;
    this.homeworkSelected = null;
  }

  searchHomewoksGroup() {
    this.subjectSelected = null;
    this.homeworkSelected = null;
    if ((this.gradeSelected != null && this.groupSelected != null)) {
      this.listarDesti();
    }
  }

  searchHomewoksSubject() {
    this.homeworkSelected = null;
    if (this.gradeSelected != null && this.groupSelected != null && this.subjectSelected != null) {
      this.listarHomeworksSelGradGrupMat();
    }
  }

  searchHomewoks() {
    if ((this.gradeSelected != null && this.groupSelected != null)) {
      this.listarDesti();
    }
    if (this.gradeSelected != null && this.groupSelected != null && this.subjectSelected != null) {
      this.listarHomeworksSelGradGrupMat();
    }

    if (this.homeworkSelected != null || this.homeworkSelected != "") {
      for (let homework of this.homeworks) {
        if (homework.id == this.homeworkSelected) {
          this.dateHourLimit = homework.dayLimit + " a las " + homework.hourLimit;
          this.description = homework.description;
          this.statusH = homework.activated == 1 ? "activo" : "inactivo";
          this.getHomeworksInfoAndFile();
          break;
        }
      }
    }
  }

  getHomeworksInfoAndFile() {
    var studentsRegister: StudentHomeworks[] = [];
    var data = {
      "grade": this.gradeSelected,
      "group": this.groupSelected,
      "subject": this.subjectSelected,
      "idHomework": this.homeworkSelected
    }
    this.firebase.getHomeworkStudentsStatus(data).then(res => {
      for (let s in res) {
        let nHomeworkStudent = new StudentHomeworks("", "", "", "", "", "","","");       
        nHomeworkStudent.setNameStudent(res[s].split("@")[1]);
        nHomeworkStudent.setStatus(res[s].split("@")[0]);
        nHomeworkStudent.setStatusFeedback(res[s].split("@")[2]);
        nHomeworkStudent.setFeedbackComment(res[s].split("@")[3]);
        nHomeworkStudent.setTimeSend("-");
        nHomeworkStudent.setNameFile("-");
        nHomeworkStudent.setDescription("-");
        nHomeworkStudent.setUrl("-");
        studentsRegister.push(nHomeworkStudent);
      }
      this.firebaseStorage.listHomeworkFileStudents(data).then(response => {
        response.items.forEach(function (ite) {
          ite.getMetadata().then(r => {
            studentsRegister.forEach(rS=>{
              if(rS.nameStudent==ite.name.split("--")[1]){
                rS.setNameFile(ite.name);
                rS.setDescription(r["customMetadata"].description);
                rS.setTimeSend(r["customMetadata"].fecha);
                  ite.getDownloadURL().then((rL) => {
                    rS.setUrl(rL);
                  });                  
              }
            });
          });
        });

      }).then(()=>{
        this.dataSourceHomeworks = new MatTableDataSource(studentsRegister);
        this.dataSourceHomeworks.paginator = this.paginator.first;
        this.dataSourceHomeworks.sort = this.sort.first;
      });
    })
  }

  listarDesti() {
    let params = {
      "grade": this.gradeSelected,
      "group": this.groupSelected,
      "professor": this.nameUserA
    }
    this.firebase.getSubjectsByProfessorGrade(params).then(response => {
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

  //inicialmente listamos los archivos que han llegado invocando a la funcion de listar2
  ngOnInit() {
    // this.retornaProfes();
  }

  //para regresar al menu principal
  menuP() {
    this.router.navigateByUrl("Menu");
  }


}

