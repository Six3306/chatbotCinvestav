import { Component, Input, OnInit, SimpleChanges, QueryList, ViewChildren } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { User } from '../../../models/User.model';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { Doubt } from '../../../models/Doubt.model';
import { DetailsDoubtComponent } from '../../../dialogs/details-doubt/details-doubt.component';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

export interface HomeworkTmp {
  id: any,
  theme: any,
}

@Component({
  selector: 'app-homework-doubts',
  templateUrl: './homework-doubts.component.html',
  styleUrls: ['./homework-doubts.component.css']
})


export class HomeworkDoubtsComponent implements OnInit {

  @Input()
  grade: any
  @Input()
  group: any
  @Input()
  subject: any

  homeworkSelected: String;
  homeworks: HomeworkTmp[] = [];
  user: User;
  descriptionH: String;

  dataSourceHomeworkDoubt: MatTableDataSource<Doubt>;
  displayedColumnsHomework: string[] = ['student', 'date', 'hour', 'status', 'details', 'recommendedMaterial', 'email', 'id'];

  @ViewChildren('paginatorH') paginator: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sort: QueryList<MatSort>;



  constructor(public firebase: FirebaseService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.user = JSON.parse(localStorage.getItem("user"));
  }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.grade != undefined || changes.group != undefined || changes.subject != undefined) {
      this.homeworkSelected = null;
      this.homeworks = [];
      this.descriptionH = "";
      this.pieChartData = [0, 0, 0];
      if ((this.grade == "1" || this.grade == "2" || this.grade == "3") && (this.group == "A" || this.group == "B" || this.group == "C" || this.group == "D" || this.group == "E" || this.group == "F" || this.group == "G" || this.group == "H" || this.group == "I" || this.group == "J") && (this.subject != undefined)) {
        let data = {
          "grade": this.grade,
          "group": this.group,
          "subject": this.subject
        }
        this.firebase.getHomeworksNameBySubject(data).then(response => {
          for (let i = 0; i < response.length; i++) {
            this.homeworks.push({ "id": response[i]["id"], "theme": response[i]["theme"] });
          }
        });
      }

    }
  }

  selectHomework() {
    let data = {
      "grade": this.grade,
      "group": this.group,
      "subject": this.subject,
      "idHomework": this.homeworkSelected,
    }
    this.firebase.getDoubtsByHomework(data).then(response => {
      this.descriptionH = response["description"];
      this.dataSourceHomeworkDoubt = new MatTableDataSource(response["homeworkDoubts"]);
      this.dataSourceHomeworkDoubt.paginator = this.paginator.first;
      // this.dataSourceHomeworkDoubt.sort = this.sort.first;
      this.pieChartData = [response["sumD"], response["sumF"], response["sumL"]];
    });
  }

  viewFeedbackH(row) {
    const dialogRef = this.dialog.open(DetailsDoubtComponent, {
      data: {
        "student": row.student,
        "hour": row.hour,
        "date": row.date,
        "status": row.status,
        "grade": this.grade,
        "group": this.group,
        "subject": this.subject,
        "idG": this.homeworkSelected,
        "type": "h",
        "recomended": row.recommendedMaterial,
        "email": row.email,
        "id": row.id,
      }

    });
    dialogRef.afterClosed().subscribe(response => {
      if (response == 1 || response == "1") {
        row.statusFeedback = 1;
        this.openCustomerSnackBar();
      } else if (response == 0 || response == "0") {
        this.openCustomerSnackBarNot();
      }
    });
  }

  //GRAFICA

  public pieChartOptions: ChartOptions = {
    responsive: true
  }

  public pieChartLabels: Label[] = ['Desconocido', 'Fallado', 'Logrado'];
  public pieChartData: number[] = [0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartColors = [
    {
      backgroundColor: ['rgba(29, 43, 70, 0.88)', 'rgba(44, 64, 104, 0.88)', 'rgba(66, 97, 158, 0.88)', 'rgba(100, 130, 190, 0.88)', 'rgba(136, 159, 205, 0.8)', 'rgba(169, 185, 219, 0.72)'],
    },
  ];

  //metodo para mostrar una notificacion emergente de que la respuesta a la duda fue añadida correctamente
  openCustomerSnackBar() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentResponseH, { duration: 4000 });
  }

  //metodo para mostrar una notificacion emergente de que la respuesta a la duda no pudo ser añadida
  openCustomerSnackBarNot() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentResponseHNot, { duration: 4000 });
  }

}


@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #00ff4ce3;'><strong>Respuesta de la duda de la tarea añadida correctamente</strong></span>`
})
export class CustomSnackBarComponentResponseH { }

@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #D63513;'><strong>Ingresa una respuesta válida para la duda de esa tarea</strong></span>`
})
export class CustomSnackBarComponentResponseHNot { }