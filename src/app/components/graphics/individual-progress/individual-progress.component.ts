import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Scores } from '../../../models/Scores.model';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';


export interface opStudent{
  value: any,
}

@Component({
  selector: 'app-individual-progress',
  templateUrl: './individual-progress.component.html',
  styleUrls: ['./individual-progress.component.css']
})

export class IndividualProgressComponent implements OnInit {

  @Input()
  grade:any
  @Input()
  group:any
  @Input()
  subject:any
  @Input()
  bimRepSelected:any
  @Input()
  arrScores:Array<Scores>=[];
  

  listStudents:any
  lStudents:opStudent[];

  constructor(private firebase: FirebaseService
  ) { }

  ngOnInit() {
  }

  //puntos a graficar
  public lineChartData: ChartDataSets[] = [{ data: [0,0,0,0,0], label: 'Materia X' }];

  public lineChartLabels: Label[] = ['Bimestre 1', 'Bimestre 2', 'Bimestre 3', 'Bimestre 4', 'Bimestre 5'];

  public lineChartOptions:any = {
    responsive: true
  };

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }



  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(29, 43, 70, 0.88)',
      borderColor: 'rgba(27, 40, 65, 1)',
      pointBackgroundColor: 'rgba(29, 43, 70, 0.88)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(165, 183, 217, 1)'
    }
  ];

  ngOnChanges(changes: SimpleChanges) {
    
     if(changes.arrScores != undefined && this.arrScores.length>0){
      this.getNameListStudent();
     }
  }

  getNameListStudent(){
    let _students: opStudent[] = [];
    for (let i = 0; i < this.arrScores.length; i++) {
      _students.push({value: this.arrScores[i].nameStudent});
    }
    this.lStudents = _students;    
  }

  //obtener las calificaciones del alumno seleccionado
  getScoresByStudentName(){
    let _lineChartLabels: Label[];
    let _lineChartData:Array<any> = new Array(1);   
    _lineChartData[0]= {data: new Array(this.bimRepSelected), label: this.subject};

    for (let i = 0; i < this.arrScores.length; i++) {
      if(this.arrScores[i].nameStudent==this.listStudents){

        if(this.bimRepSelected==1){
          _lineChartLabels = ['Bimestre 1'];
          _lineChartData[0].data = [this.arrScores[i].b1];
        }else if(this.bimRepSelected==2){
          _lineChartLabels = ['Bimestre 1', 'Bimestre 2'];
          _lineChartData[0].data = [this.arrScores[i].b1,this.arrScores[i].b2];
        }else if(this.bimRepSelected==3){
          _lineChartLabels = ['Bimestre 1', 'Bimestre 2','Bimestre 3'];
          _lineChartData[0].data = [this.arrScores[i].b1,this.arrScores[i].b2,this.arrScores[i].b3];
        }else if(this.bimRepSelected==4){
          _lineChartLabels = ['Bimestre 1', 'Bimestre 2','Bimestre 3','Bimestre 4'];
          _lineChartData[0].data = [this.arrScores[i].b1,this.arrScores[i].b2,this.arrScores[i].b3,this.arrScores[i].b4];
        }else if(this.bimRepSelected==5){
          _lineChartLabels = ['Bimestre 1', 'Bimestre 2','Bimestre 3','Bimestre 4','Bimestre 5'];
          _lineChartData[0].data = [this.arrScores[i].b1,this.arrScores[i].b2,this.arrScores[i].b3,this.arrScores[i].b4,this.arrScores[i].b5];
        }

      }
    }
    this.lineChartLabels = _lineChartLabels;
    this.lineChartData = _lineChartData;
  }

}
