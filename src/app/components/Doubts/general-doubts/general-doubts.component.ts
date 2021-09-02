import { Component, Input, OnInit, SimpleChanges, QueryList, ViewChildren } from '@angular/core';
import { DetailsDoubtComponent } from '../../../dialogs/details-doubt/details-doubt.component';
import { MatTableDataSource, MatDialog, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { Doubt } from '../../../models/Doubt.model';
import { User } from '../../../models/User.model';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

export interface GeneralTmp {
  id: any,
  theme: any,
}

@Component({
  selector: 'app-general-doubts',
  templateUrl: './general-doubts.component.html',
  styleUrls: ['./general-doubts.component.css']
})

export class GeneralDoubtsComponent implements OnInit {


  @Input()
  grade: any
  @Input()
  group: any
  @Input()
  subject: any

  generalSelected: String;
  generals: GeneralTmp[] = [];
  user: User;
  descriptionE: String;

  dataSourceGeneralDoubt: MatTableDataSource<Doubt>;
  displayedColumnsGeneral: string[] = ['student', 'date', 'hour', 'status', 'details', 'recommendedMaterial', 'email', 'id', 'doubt'];

  @ViewChildren('paginator2') paginator: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sort: QueryList<MatSort>;


  constructor(public firebase: FirebaseService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.user = JSON.parse(localStorage.getItem("user"));
  }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.grade != undefined || changes.group != undefined || changes.subject != undefined) {
      this.generalSelected = null;
      this.generals = [];
      this.descriptionE = "";
      this.pieChartData = [0, 0, 0];
      if ((this.grade == "1" || this.grade == "2" || this.grade == "3") && (this.group == "A" || this.group == "B" || this.group == "C" || this.group == "D" || this.group == "E" || this.group == "F" || this.group == "G" || this.group == "H" || this.group == "I" || this.group == "J") && (this.subject != undefined)) {
        this.selectExam();
      }

    }
  }

  selectExam() {
    let data = {
      "grade": this.grade,
      "group": this.group,
      "subject": this.subject,
    }

    this.firebase.getDoubtsGeneral(data).then(response => {
      this.dataSourceGeneralDoubt = new MatTableDataSource(response["generalDoubts"]);
      this.dataSourceGeneralDoubt.paginator = this.paginator.first;
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
        "idG": this.generalSelected,
        "type": "g",
        "doubtC": row.doubt,
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
    return this.snackBar.openFromComponent(CustomSnackBarComponentResponseG, { duration: 4000 });
  }

  //metodo para mostrar una notificacion emergente de que la respuesta a la duda no pudo ser añadida
  openCustomerSnackBarNot() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentResponseGNot, { duration: 4000 });
  }

}


@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #00ff4ce3;'><strong>Respuesta a la duda general añadida correctamente</strong></span>`
})
export class CustomSnackBarComponentResponseG { }

@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #D63513;'><strong>Ingresa una respuesta válida para la duda general</strong></span>`
})
export class CustomSnackBarComponentResponseGNot { }