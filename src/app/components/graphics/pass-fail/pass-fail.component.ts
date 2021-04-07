import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { Scores } from '../../../models/Scores.model';

@Component({
  selector: 'app-pass-fail',
  templateUrl: './pass-fail.component.html',
  styleUrls: ['./pass-fail.component.css']
})
export class PassFailComponent implements OnInit {

  @Input()
  grade:any
  @Input()
  group:any
  @Input()
  subject:any
  @Input()
  arrScores:Array<Scores>=[];
  @Input()
  bimSelected:any
  @Input()
  bimes:any

  failStudents: String[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    // if(changes.arrScores != undefined && this.arrScores.length>0){
      if(changes.bimSelected != undefined){
        this.countPF();
      }
      // console.log(this.bimes);
      
        this.countPFGeneral();
      
    // }
  }
  
  //grafica de pastel-----------------------------------------------------------
  public doughnutChartLabels: Label[] = ['Aprobados', 'Reprobados'];
  public doughnutChartData: number[] = [0, 0];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartLegend = true;
  public doughnutChartColors = [
    {
      backgroundColor: ['rgba(29, 43, 70, 0.88)','rgba(6, 51, 96, 0.49)'],
    },
  ];

  //grafica de barras----------------------------------------------------------
  public barChartData: ChartDataSets[] = [
    { data: [0,0,0,0,0], label: 'Aprobados' },
    { data: [0,0,0,0,0], label: 'Reprobados' }
  ];

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    respinsive: true
  }

  public barChartLabels: Label[] = ['Bimestre 1', 'Bimestre 2', 'Bimestre 3', 'Bimestre 4', 'Bimestre 5'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartColors: Array<any> = [
    { // first color
      backgroundColor: 'rgba(29, 43, 70, 0.88)'
    },
    { // second color
      backgroundColor: 'rgba(6, 51, 96, 0.49)'
    }];


    //metodos para manipular los datos y graficas
  countPF(){
    let pass:number = 0;
    let fail:number = 0;
    let _failStudents: String[] = [];

    for (let i = 0; i < this.arrScores.length; i++) {
      if(this.bimSelected==1){
        if(this.arrScores[i].b1>=6){
          pass += 1;
        }else{
          fail += 1;
          _failStudents.push(this.arrScores[i].nameStudent);
        }
      }else if(this.bimSelected==2){
        if(this.arrScores[i].b2>=6){
          pass += 1;
        }else{
          fail += 1;
          _failStudents.push(this.arrScores[i].nameStudent);
        }
      }else if(this.bimSelected==3){
        if(this.arrScores[i].b3>=6){
          pass += 1;
        }else{
          fail += 1;
          _failStudents.push(this.arrScores[i].nameStudent);
        }
      }else if(this.bimSelected==4){
        if(this.arrScores[i].b4>=6){
          pass += 1;
        }else{
          fail += 1;
          _failStudents.push(this.arrScores[i].nameStudent);
        }
      }else if(this.bimSelected==5){
        if(this.arrScores[i].b5>=6){
          pass += 1;
        }else{
          fail += 1;
          _failStudents.push(this.arrScores[i].nameStudent);
        }
      }
    }
    this.failStudents = _failStudents;
    let _doughnutChartData:number[] = [pass, fail];
    this.doughnutChartData=_doughnutChartData; 
  }
  

  countPFGeneral(){
    this.barChartData[0].data = [0, 0, 0, 0, 0]; //aprobados
    this.barChartData[1].data = [0, 0, 0, 0, 0]; //reprobados
    
    this.generateLabelsGBar();


    for (let i = 0; i < this.arrScores.length; i++) {
      (this.arrScores[i].b1<6)? this.barChartData[1].data[0]= (this.barChartData[1].data[0] as number) + 1 : this.barChartData[0].data[0]= (this.barChartData[0].data[0] as number) + 1 ;
      (this.arrScores[i].b2<6)? this.barChartData[1].data[1]= (this.barChartData[1].data[1] as number) + 1 : this.barChartData[0].data[1]= (this.barChartData[0].data[1] as number) + 1 ;
      (this.arrScores[i].b3<6)? this.barChartData[1].data[2]= (this.barChartData[1].data[2] as number) + 1 : this.barChartData[0].data[2]= (this.barChartData[0].data[2] as number) + 1 ;
      (this.arrScores[i].b4<6)? this.barChartData[1].data[3]= (this.barChartData[1].data[3] as number) + 1 : this.barChartData[0].data[3]= (this.barChartData[0].data[3] as number) + 1 ;
      (this.arrScores[i].b5<6)? this.barChartData[1].data[4]= (this.barChartData[1].data[4] as number) + 1 : this.barChartData[0].data[4]= (this.barChartData[0].data[4] as number) + 1 ;
    }
  }

  generateLabelsGBar(){
    let _barChartLabels: Label[];
    if(this.bimes==0 || this.subject==undefined){
      _barChartLabels = ['Bimestre 1'];
      this.barChartData[1].data=[];
      this.barChartData[0].data=[];
    }else if(this.bimes==1){
      _barChartLabels = ['Bimestre 1']
    }else if(this.bimes==2){
      _barChartLabels = ['Bimestre 1','Bimestre 2']
    }else if(this.bimes==3){
      _barChartLabels = ['Bimestre 1','Bimestre 2', 'Bimestre 3']
    }else if(this.bimes==4){
      _barChartLabels = ['Bimestre 1','Bimestre 2', 'Bimestre 3', 'Bimestre 4']
    }else if(this.bimes==5){
      _barChartLabels = ['Bimestre 1','Bimestre 2', 'Bimestre 3', 'Bimestre 4', 'Bimestre 5']
    }
    this.barChartLabels = _barChartLabels;
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

}
