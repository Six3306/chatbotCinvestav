import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Scores } from '../../../models/Scores.model';

@Component({
  selector: 'app-general-progress',
  templateUrl: './general-progress.component.html',
  styleUrls: ['./general-progress.component.css']
})
export class GeneralProgressComponent implements OnInit {

  @Input()
  grade:any
  @Input()
  group:any
  @Input()
  subject:any
  @Input()
  bimRepSelected:any
  @Input() arrScores:Array<Scores>=[];
  
  // @Input() set arrScores(_arrScores:Array<Scores>=[]):void{

  
  
  constructor() { }

  ngOnInit(){
  }

  ngOnChanges(changes: SimpleChanges) {
    // if(changes.arrScores != undefined && this.arrScores.length>0){
      this.calculateAverageBim();
    // }
  }

  

  //puntos a graficar
  public lineChartData: ChartDataSets[] = [{ data: [0,0,0,0,0], label: 'Materia X' }];

  public lineChartLabels: Label[] = ['Bimestre 1', 'Bimestre 2', 'Bimestre 3', 'Bimestre 4', 'Bimestre 5'];

  public lineChartOptions:any = {
    responsive: true
  };

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';


  //para calcular los promedios
  calculateAverageBim(){
    let _lineChartLabels: Label[];
    let sums:Array<any> = new Array(this.bimRepSelected); 
    for (let i = 0; i < sums.length; i++) {
      sums[i]=0;      
    }    
    for (let i = 0; i < this.arrScores.length; i++) {
      if(this.bimRepSelected==1){
        sums[0]=sums[0]+this.arrScores[i].b1;
        _lineChartLabels = ['Bimestre 1'];
      }else if(this.bimRepSelected==2){
        sums[0]=sums[0]+this.arrScores[i].b1;
        sums[1]=sums[1]+this.arrScores[i].b2;
        _lineChartLabels = ['Bimestre 1', 'Bimestre 2'];
      }else if(this.bimRepSelected==3){
        sums[0]=sums[0]+this.arrScores[i].b1;
        sums[1]=sums[1]+this.arrScores[i].b2;
        sums[2]=sums[2]+this.arrScores[i].b3;
        _lineChartLabels = ['Bimestre 1', 'Bimestre 2', 'Bimestre 3'];
      }else if(this.bimRepSelected==4){
        sums[0]=sums[0]+this.arrScores[i].b1;
        sums[1]=sums[1]+this.arrScores[i].b2;
        sums[2]=sums[2]+this.arrScores[i].b3;
        sums[3]=sums[3]+this.arrScores[i].b4;
        _lineChartLabels = ['Bimestre 1', 'Bimestre 2', 'Bimestre 3', 'Bimestre 4'];
      }else if(this.bimRepSelected==5){
        sums[0]=sums[0]+this.arrScores[i].b1;
        sums[1]=sums[1]+this.arrScores[i].b2;
        sums[2]=sums[2]+this.arrScores[i].b3;
        sums[3]=sums[3]+this.arrScores[i].b4;
        sums[4]=sums[4]+this.arrScores[i].b5;
        _lineChartLabels = ['Bimestre 1', 'Bimestre 2', 'Bimestre 3', 'Bimestre 4', 'Bimestre 5'];
      }
    }   
    for (let i = 0; i < sums.length; i++) {
      sums[i]= sums[i]/this.arrScores.length;
    }
    this.lineChartLabels = _lineChartLabels;
    this.generateGrap(sums);
  }


  //para graficar
  public generateGrap(averages): void {   
    if(this.subject!=undefined){
      this.lineChartData[0].label=this.subject;  
    }
    let _lineChartData:Array<any> = new Array(1);   
    _lineChartData[0]= {data: new Array(averages.length), label: this.lineChartData[0].label};

     for (let j = 0; j < averages.length; j++) {
      _lineChartData[0].data[j] = averages[j];
     
    }
    this.lineChartData = _lineChartData;
  }

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
}
