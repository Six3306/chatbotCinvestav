import { Component, Input, OnInit, ViewChildren, QueryList, SimpleChanges } from '@angular/core';
import { User } from '../../../models/User.model';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Doubt } from '../../../models/Doubt.model';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { DetailsDoubtComponent } from '../../../dialogs/details-doubt/details-doubt.component';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';


export interface ExamTmp {
  id: any,
  theme: any,
}


@Component({
  selector: 'app-exam-doubts',
  templateUrl: './exam-doubts.component.html',
  styleUrls: ['./exam-doubts.component.css']
})
export class ExamDoubtsComponent implements OnInit {

  @Input()
  grade: any
  @Input()
  group: any
  @Input()
  subject: any

  examSelected: String;
  exams: ExamTmp[] = [];
  user: User;
  descriptionE: String;

  dataSourceExamDoubt: MatTableDataSource<Doubt>;
  displayedColumnsExam: string[] = ['student', 'date', 'hour', 'status', 'details', 'recommendedMaterial', 'email', 'id'];

  @ViewChildren(MatPaginator,) paginator: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sort: QueryList<MatSort>;


  constructor(public firebase: FirebaseService, public dialog: MatDialog) {
    this.user = JSON.parse(localStorage.getItem("user"));
  }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.grade != undefined || changes.group != undefined || changes.subject != undefined) {
      this.examSelected = null;
      this.exams = [];
      this.descriptionE = "";
      this.pieChartData = [0,0,0];
      if ((this.grade == "1" || this.grade == "2" || this.grade == "3") && (this.group == "A" || this.group == "B" || this.group == "C" || this.group == "D" || this.group == "E" || this.group == "F" || this.group == "G" || this.group == "H" || this.group == "I" || this.group == "J") && (this.subject != undefined)) {
        let data = {
          "grade": this.grade,
          "group": this.group,
          "subject": this.subject
        }


        this.firebase.getExamsNameBySubject(data).then(response => {
          for (let i = 0; i < response.length; i++) {
            this.exams.push({ "id": response[i]["id"], "theme": response[i]["theme"] });

          }

        });
      }

    }
  }

  selectExam() {
    let data = {
      "grade": this.grade,
      "group": this.group,
      "subject": this.subject,
      "idExam": this.examSelected,
    }

    this.firebase.getDoubtsByExam(data).then(response => {
      this.descriptionE = response["descriptionE"];
      this.dataSourceExamDoubt = new MatTableDataSource(response["examDoubts"]);
      this.dataSourceExamDoubt.paginator = this.paginator.first;
      this.dataSourceExamDoubt.sort = this.sort.first;

      this.pieChartData = [response["sumD"], response["sumF"], response["sumL"]];

    });
  }

  viewFeedbackE(row) {
    const dialogRef = this.dialog.open(DetailsDoubtComponent, {
      data: {
        "student": row.student,
        "hour": row.hour,
        "date": row.date,
        "status": row.status,
        "grade": this.grade,
        "group": this.group,
        "subject": this.subject,
        "idG": this.examSelected,
        "type": "e",
        "recomended": row.recommendedMaterial,
        "email": row.email,
        "id": row.id,
      }

    });
    dialogRef.afterClosed().subscribe(response => {
      if (response == 1 || response == "1") {
        row.statusFeedback = 1;
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


}
