import { Component, OnInit, Input, SimpleChanges, QueryList, ViewChildren } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { AddAdviceWComponent } from '../../../dialogs/add-advice-w/add-advice-w.component';
import { User } from '../../../models/User.model';


export interface Feel {
  nameStudent: any,
  feelR: any,
  date: any,
  hour: any,
  status: any
}


@Component({
  selector: 'app-feeling-group',
  templateUrl: './feeling-group.component.html',
  styleUrls: ['./feeling-group.component.css']
})
export class FeelingGroupComponent implements OnInit {
  @Input()
  grade: any
  @Input()
  group: any
  @Input()
  dataGeneral: any


  user: User;
  typeU: string;

  feelRegisterInOrder: Feel[] = [];
  feelRegisterInOrderW: Feel[] = [];
  dataSourceScoresH: MatTableDataSource<Feel>;
  displayedColumnsH: string[] = ['date', 'hour', 'nameStudent', 'feelR'];
  dataSourceScoresW: MatTableDataSource<Feel>;
  displayedColumnsW: string[] = ['date', 'hour', 'nameStudent', 'status'];


  //grafica de pastel
  public pieChartOptions: ChartOptions = {
    responsive: true
  }

  public pieChartLabels: Label[] = ['Triste', 'Alegre', 'Miedoso', 'Enojado', 'Cansado', 'Hambriento', 'Desesperado', 'Sin definir', "Matar"];
  public pieChartData: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartColors = [
    {
      backgroundColor: ['rgba(14, 20, 32, 0.88)', 'rgba(22, 31, 49, 0.88)', 'rgba(28, 38, 63, 0.86)', 'rgba(29, 43, 70, 0.88)', 'rgba(44, 64, 104, 0.88)', 'rgba(66, 97, 158, 0.88)', 'rgba(100, 130, 190, 0.88)', 'rgba(136, 159, 205, 0.8)', 'rgba(169, 185, 219, 0.72)'],
    },
  ];

  //grafica de dona-----------------------------------------------------------
  public doughnutChartLabels: Label[] = ['Si compartio', 'No compartio'];
  public doughnutChartData: number[] = [0, 0];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartLegend = true;
  public doughnutChartColors = [
    {
      backgroundColor: ['rgba(29, 43, 70, 0.88)', 'rgba(6, 51, 96, 0.49)'],
    },
  ];

  @ViewChildren(MatPaginator) paginator: QueryList<MatPaginator>;
  @ViewChildren(MatPaginator) paginator2: QueryList<MatPaginator>;

  @ViewChildren(MatSort) sort: QueryList<MatSort>;

  constructor(
    public firebase: FirebaseService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.typeU = this.user.type.toString();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataGeneral != undefined) {
      let _doughnutChartData: number[] = [0, 0];
      this.doughnutChartData = _doughnutChartData;
      this.feelRegisterInOrder = [];
      this.feelRegisterInOrderW = [];

      if ((this.grade == 1 || this.grade == 2 || this.grade == 3) && JSON.stringify(this.dataGeneral).length > 0) {
        this.generateGraph();
      }
    }
  }

  generateGraph() {
    let _pieChartData: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var yReg = 0;
    var nReg = 0;
    for (var student in this.dataGeneral) {
      if (this.dataGeneral[student]["feelings"].length > 0) {
        yReg++;
        for (var feel in this.dataGeneral[student]["feelings"]) {

          var feelMin: Feel;

          var feelRTmp: Feel;

          feelMin = { nameStudent: this.dataGeneral[student]["username"], feelR: this.dataGeneral[student]["feelings"][feel]["feeling"], date: this.dataGeneral[student]["feelings"][feel]["date"], hour: this.dataGeneral[student]["feelings"][feel]["hour"], status: this.dataGeneral[student]["feelings"][feel]["status"] };
          var d = feelMin.date.split("-");
          var f = feelMin.hour.split(":");
          var fechaRMin = new Date(+(d[2]), +(d[1]) - 1, +(d[0]), +(f[0]), +(f[1]), +(f[2]));

          for (let i = 0; i < this.feelRegisterInOrder.length; i++) {
            var dI = this.feelRegisterInOrder[i].date.split("-");
            var fI = this.feelRegisterInOrder[i].hour.split(":");
            var fechaRI = new Date(+(dI[2]), +(dI[1]) - 1, +(dI[0]), +(fI[0]), +(fI[1]), +(fI[2]));
            if (fechaRMin >= fechaRI) {
              fechaRMin = fechaRI;
              feelRTmp = feelMin;
              feelMin = this.feelRegisterInOrder[i];
              this.feelRegisterInOrder[i] = feelRTmp;
            }
          }
          this.feelRegisterInOrder.push(feelMin);



          if (this.dataGeneral[student]["feelings"][feel]["feeling"] == "triste") {
            _pieChartData[0] += 1;
          } else if (this.dataGeneral[student]["feelings"][feel]["feeling"] == "alegre") {
            _pieChartData[1] += 1;
          } else if (this.dataGeneral[student]["feelings"][feel]["feeling"] == "miedoso") {
            _pieChartData[2] += 1;
          } else if (this.dataGeneral[student]["feelings"][feel]["feeling"] == "enojado") {
            _pieChartData[3] += 1;
          } else if (this.dataGeneral[student]["feelings"][feel]["feeling"] == "cansado") {
            _pieChartData[4] += 1;
          } else if (this.dataGeneral[student]["feelings"][feel]["feeling"] == "hambriento") {
            _pieChartData[5] += 1;
          } else if (this.dataGeneral[student]["feelings"][feel]["feeling"] == "desesperado") {
            _pieChartData[6] += 1;
          } else if (this.dataGeneral[student]["feelings"][feel]["feeling"] == "no se") {
            _pieChartData[7] += 1;
          } else if (this.dataGeneral[student]["feelings"][feel]["feeling"] == "matar") {
            _pieChartData[8] += 1;
          }
        }
      } else {
        nReg++;
      }
      let _doughnutChartData: number[] = [yReg, nReg];
      this.doughnutChartData = _doughnutChartData;
    }

    this.dataSourceScoresH = new MatTableDataSource(this.feelRegisterInOrder);
    this.dataSourceScoresH.paginator = this.paginator.first;

    for (let i = 0; i < this.feelRegisterInOrder.length; i++) {
      this.feelRegisterInOrder[i].feelR == "matar" ? this.feelRegisterInOrderW.push(this.feelRegisterInOrder[i]) : null;
    }
    this.dataSourceScoresW = new MatTableDataSource(this.feelRegisterInOrderW);
    this.pieChartData = _pieChartData;
  }

  //para ver consejos 
  setAdviceR(row) {
    const dialogRef = this.dialog.open(AddAdviceWComponent, {
      data: {
        student: row.nameStudent,
        hourR: row.hour,
        dateR: row.date,
        title: row.hour + "--" + row.date + "---" + row.nameStudent,
        status: 0,
      },
      width: '50%',
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response != undefined) {
        var data = {
          "studentName": response.stautsT,
        }
      }
    })
  }

  //para dar consejo
  setAdvice(row) {
    const dialogRef = this.dialog.open(AddAdviceWComponent, {
      data: {
        student: row.nameStudent,
        hourR: row.hour,
        dateR: row.date,
        title: row.hour + "--" + row.date + "---" + row.nameStudent,
        status: 1,
      },
      width: '50%',
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response != undefined) {
        var dA = new Date();
        var data = {
          "fA": dA.getDate() + "-" + (dA.getMonth() + 1) + "-" + dA.getFullYear(),
          "hA": dA.getHours() + ":" + dA.getMinutes() + ":" + dA.getSeconds(),
          "professorN": this.user.username,
          "professorE": this.user.email,
          "adviceC": response.adviceContent,
          "studentName": response.nameStud,
          "dateRW": response.dateRStud,
          "hourRW": response.hourRStud,
        }

        if (response.adviceContent.trim() != "") {
          this.firebase.setAdviceToStudent(data).then((r) => {
            if (r) {
              this.openCustomerSnackBar();
            } else {
              this.openCustomerSnackBarNot();
            }
          });
        } else {
          this.openCustomerSnackBarNot();
        }
      }
    })
  }

  //metodo para mostrar una notificacion emergente de que el consejo se registro correctamente
  openCustomerSnackBar() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentAddAdvice, { duration: 4000 });
  }

  //metodo para mostrar una notificacion emergente de que el consejo no han podido ser registrado
  openCustomerSnackBarNot() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentAddAdviceNot, { duration: 4000 });
  }

}

@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #00ff4ce3;'><strong>Consejo añadido correctamente</strong></span>`
})
export class CustomSnackBarComponentAddAdvice { }

@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #D63513;'><strong>El consejo no se pudo añadir, verifica que el texto de tu consejo sea adecuado</strong></span>`
})
export class CustomSnackBarComponentAddAdviceNot { }