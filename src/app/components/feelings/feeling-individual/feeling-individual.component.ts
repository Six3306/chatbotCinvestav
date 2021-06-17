import { Component, OnInit, Input, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { Label } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';

export interface Feel {
  nameStudent: any,
  feelR: any,
  date: any,
  hour: any,
  status: any
}


@Component({
  selector: 'app-feeling-individual',
  templateUrl: './feeling-individual.component.html',
  styleUrls: ['./feeling-individual.component.css']
})
export class FeelingIndividualComponent implements OnInit {

  @Input()
  grade: any
  @Input()
  group: any
  @Input()
  dataGeneral: any

  formFileDes: FormGroup;
  studentSelected: any;
  students: String[] = [];

  band:boolean=false;
  feelRegisterInOrder: Feel[] = [];
  feelRegisterInOrderW: Feel[] = [];

  dataSourceScoresH: MatTableDataSource<Feel>;
  displayedColumnsH: string[] = [ 'date', 'hour', 'feelR'];



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

  @ViewChildren(MatPaginator) paginator:QueryList<MatPaginator>;


  constructor(
    private formbuilder: FormBuilder,
  ) {
    this.formFileDes = this.formbuilder.group({
      studentSel: [''],
    });
    // this.user= JSON.parse(localStorage.getItem("user"));   
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.students = [];
    if (changes.dataGeneral != undefined) {
      if ((this.grade == 1 || this.grade == 2 || this.grade == 3) && JSON.stringify(this.dataGeneral).length > 0) {
        this.getListStudent();
      }
    }
  }

  getListStudent() {
    for (var student in this.dataGeneral) {
      this.students.push(this.dataGeneral[student]["username"]);
    }
  }

  selectStudent() {
    this.feelRegisterInOrder = [];
    this.band = true;
    console.log("NNNNNNNNNN"+this.studentSelected);

    let _pieChartData: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var student in this.dataGeneral) {
      if (this.dataGeneral[student]["username"] == this.studentSelected) {
        if (this.dataGeneral[student]["feelings"].length > 0) {
          for (var feel in this.dataGeneral[student]["feelings"]) {

            var feelMin: Feel;
            var feelRTmp: Feel;
  
            feelMin = { nameStudent: this.dataGeneral[student]["username"], feelR: this.dataGeneral[student]["feelings"][feel]["feeling"], date: this.dataGeneral[student]["feelings"][feel]["date"], hour: this.dataGeneral[student]["feelings"][feel]["hour"], status: this.dataGeneral[student]["feelings"][feel]["status"] };
            var d = feelMin.date.split("-");
            var f = feelMin.hour.split(":");
            var fechaRMin = new Date(+(d[2]), +(d[1])-1, +(d[0]), +(f[0]), +(f[1]), +(f[2]));
  
              for (let i = 0; i < this.feelRegisterInOrder.length; i++) {
                var dI = this.feelRegisterInOrder[i].date.split("-");
                var fI = this.feelRegisterInOrder[i].hour.split(":");              
                var fechaRI = new Date(+(dI[2]), +(dI[1])-1, +(dI[0]), +(fI[0]), +(fI[1]), +(fI[2]));                          
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
        } 
        break;
      }
    }
    this.pieChartData = _pieChartData;
    console.log(JSON.stringify(this.feelRegisterInOrder));
    
    this.dataSourceScoresH = new MatTableDataSource(this.feelRegisterInOrder);
    this.dataSourceScoresH.paginator = this.paginator.first;

  }

}
