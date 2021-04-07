import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { Scores } from '../../../models/Scores.model';

@Component({
  selector: 'app-rating-percentages',
  templateUrl: './rating-percentages.component.html',
  styleUrls: ['./rating-percentages.component.css']
})
export class RatingPercentagesComponent implements OnInit {

  @Input()
  grade:any
  @Input()
  group:any
  @Input()
  subject:any
  @Input()
  arrScores:Array<Scores>=[];
  @Input()
  bimSelected2:any

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    // if(changes.arrScores != undefined && this.arrScores.length>0){
      if(changes.bimSelected2 != undefined){
        this.countScores();
      }
    // }
  }

  public pieChartOptions: ChartOptions = {
    responsive: true
  }

  public pieChartLabels: Label[] = ['10', '9', '8', '7', '6', 'No aprobados'];
  public pieChartData: number[] = [0,0,0,0,0,0];
  public pieChartType: ChartType = 'pie';
  public pieChartColors = [
    {
      backgroundColor: ['rgba(29, 43, 70, 0.88)', 'rgba(44, 64, 104, 0.88)', 'rgba(66, 97, 158, 0.88)', 'rgba(100, 130, 190, 0.88)','rgba(136, 159, 205, 0.8)','rgba(169, 185, 219, 0.72)'],
    },
  ];

  countScores(){
    let _pieChartData:number[] = [0,0,0,0,0,0];
    for (let i = 0; i < this.arrScores.length; i++) {
      if(this.bimSelected2==1){
        if(this.arrScores[i].b1==10){
          _pieChartData[0]+=1;
        }else if(this.arrScores[i].b1<10 && this.arrScores[i].b1>=9){
          _pieChartData[1]+=1;
        }else if(this.arrScores[i].b1<9 && this.arrScores[i].b1>=8){
          _pieChartData[2]+=1;
        }else if(this.arrScores[i].b1<8 && this.arrScores[i].b1>=7){
          _pieChartData[3]+=1;
        }else if(this.arrScores[i].b1<7 && this.arrScores[i].b1>=6){
          _pieChartData[4]+=1;
        }else if(this.arrScores[i].b1<6){
          _pieChartData[5]+=1;
        }
      }else if(this.bimSelected2==2){
        if(this.arrScores[i].b2==10){
          _pieChartData[0]+=1;
        }else if(this.arrScores[i].b2<10 && this.arrScores[i].b2>=9){
          _pieChartData[1]+=1;
        }else if(this.arrScores[i].b2<9 && this.arrScores[i].b2>=8){
          _pieChartData[2]+=1;
        }else if(this.arrScores[i].b2<8 && this.arrScores[i].b2>=7){
          _pieChartData[3]+=1;
        }else if(this.arrScores[i].b2<7 && this.arrScores[i].b2>=6){
          _pieChartData[4]+=1;
        }else if(this.arrScores[i].b2<6){
          _pieChartData[5]+=1;
        }
      }else if(this.bimSelected2==3){
        if(this.arrScores[i].b3==10){
          _pieChartData[0]+=1;
        }else if(this.arrScores[i].b3<10 && this.arrScores[i].b3>=9){
          _pieChartData[1]+=1;
        }else if(this.arrScores[i].b3<9 && this.arrScores[i].b3>=8){
          _pieChartData[2]+=1;
        }else if(this.arrScores[i].b3<8 && this.arrScores[i].b3>=7){
          _pieChartData[3]+=1;
        }else if(this.arrScores[i].b3<7 && this.arrScores[i].b3>=6){
          _pieChartData[4]+=1;
        }else if(this.arrScores[i].b3<6){
          _pieChartData[5]+=1;
        }
      }else if(this.bimSelected2==4){
        if(this.arrScores[i].b4==10){
          _pieChartData[0]+=1;
        }else if(this.arrScores[i].b4<10 && this.arrScores[i].b4>=9){
          _pieChartData[1]+=1;
        }else if(this.arrScores[i].b4<9 && this.arrScores[i].b4>=8){
          _pieChartData[2]+=1;
        }else if(this.arrScores[i].b4<8 && this.arrScores[i].b4>=7){
          _pieChartData[3]+=1;
        }else if(this.arrScores[i].b4<7 && this.arrScores[i].b4>=6){
          _pieChartData[4]+=1;
        }else if(this.arrScores[i].b4<6){
          _pieChartData[5]+=1;
        }
      }else if(this.bimSelected2==5){
        if(this.arrScores[i].b5==10){
          _pieChartData[0]+=1;
        }else if(this.arrScores[i].b5<10 && this.arrScores[i].b5>=9){
          _pieChartData[1]+=1;
        }else if(this.arrScores[i].b5<9 && this.arrScores[i].b5>=8){
          _pieChartData[2]+=1;
        }else if(this.arrScores[i].b5<8 && this.arrScores[i].b5>=7){
          _pieChartData[3]+=1;
        }else if(this.arrScores[i].b5<7 && this.arrScores[i].b5>=6){
          _pieChartData[4]+=1;
        }else if(this.arrScores[i].b5<6){
          _pieChartData[5]+=1;
        }
      }
    }    
    this.pieChartData = _pieChartData;
  }

  //events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

}
