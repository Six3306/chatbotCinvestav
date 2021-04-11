import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { User } from 'src/app/models/User.model';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

export interface arrayScores{
  nameSubject: any,
  scores: number[],
  bimT: number
}

export interface arrayGeneralScores{
  nameSubject: any,
  score: number,
  bimT: number
}



@Component({
  selector: 'app-progress-student',
  templateUrl: './progress-student.component.html',
  styleUrls: ['./progress-student.component.css']
})
export class ProgressStudentComponent implements OnInit, AfterViewChecked {

  grade: any
  user: User;
  arrScores: arrayScores[]=[];
  arrGScores: arrayGeneralScores[]=[];
  nVal:number=100;
  band:boolean=false;
  listSubjects:any;
  bimTop:number;
  statusSubject:string="";
  betterInd:number=0;
  worstInd:number=0;
  averageInd:number=0;
  msgObs: string = "";

  constructor(
    private firebase: FirebaseService
  ) {
    this.user= JSON.parse(localStorage.getItem("user"));
    
   }

  ngOnInit() { 
    this.getNameSubjects();
  }

  ngAfterViewChecked(){
    if(this.nVal==this.arrScores.length && this.band==false){
      this.band=true;
      this.grapScoresGeneral();
    }
  }

  getNameSubjects(){
    let _arrScores: arrayScores[] = [];
    let _arrGScores: arrayGeneralScores[] = [];
    this.firebase.getInfoStudent(this.user.username, this.user.email).then(response=>{
      this.firebase.getSubjectsNameByGrade(response.grade).then(response2 =>{   
        this.nVal = response2.length     
        for (let i = 0; i < response2.length; i++) {
          let data = {
            grade: response.grade,
            group: response.group, 
            name: response.username,
            subject: response2[i],
          }
          this.firebase.getScoresIndividualStudentInLesson(data).then(response3=>{
            this.firebase.getbimReport(data).then(response4=>{
              _arrScores[i]= {nameSubject: response2[i], scores: [response3.b1,response3.b2,response3.b3,response3.b4,response3.b5], bimT: response4 };
              if(response4==0){
                _arrGScores[i]= {nameSubject: response2[i], score: 0, bimT: response4};
              }else if(response4==1){
                _arrGScores[i]= {nameSubject: response2[i], score: (response3.b1), bimT: response4};
              }else if(response4==2){
                _arrGScores[i]= {nameSubject: response2[i], score: (response3.b1+response3.b2)/2, bimT: response4};
              }else if(response4==3){
                _arrGScores[i]= {nameSubject: response2[i], score: (response3.b1+response3.b2+response3.b3)/3, bimT: response4};
              }else if(response4==4){
                _arrGScores[i]= {nameSubject: response2[i], score: (response3.b1+response3.b2+response3.b3+response3.b4)/4, bimT: response4};
              }else if(response4==5){
                _arrGScores[i]= {nameSubject: response2[i], score: (response3.b1+response3.b2+response3.b3+response3.b4+response3.b5)/5, bimT: response4};
              }
            }).finally(()=>{
              this.arrScores = _arrScores;
              this.arrGScores = _arrGScores;
            });
          })
        }

      })
    });    
  }

  selectSubject(){
    this.bimTop;
  }

  //GRAFICAS:::::::::::::::::::::::
  //grafica de lineas ----------------------------
  public lineChartData: ChartDataSets[] = [{ data: [0,0,0,0,0], label: 'Materia X' }];

  public lineChartLabels: Label[] = ['Bimestre 1', 'Bimestre 2', 'Bimestre 3', 'Bimestre 4', 'Bimestre 5'];

  public lineChartOptions:any = {
    responsive: true
  };

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    // console.log(event, active);
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
  
  grapScoreIndividuals(){
    let _lineChartLabels: Label[];
    let _lineChartData:Array<any> = new Array(1);   

    for (let i = 0; i < this.arrScores.length; i++) {

      if(this.arrScores[i].nameSubject==this.listSubjects){
        this.bimTop = this.arrScores[i].bimT;
        _lineChartData[0]= {data: new Array(this.bimTop), label: this.listSubjects};
        
        for (let j = 0; j < this.arrScores[i].scores.length; j++) {
          if(this.bimTop==1){
            _lineChartLabels = ['Bimestre 1'];
            _lineChartData[0].data = [this.arrScores[i].scores[0]];
          }else if(this.bimTop==2){
            _lineChartLabels = ['Bimestre 1','Bimestre 2'];
            _lineChartData[0].data = [this.arrScores[i].scores[0],this.arrScores[i].scores[1]];
          }else if(this.bimTop==3){
            _lineChartLabels = ['Bimestre 1','Bimestre 2','Bimestre 3'];
            _lineChartData[0].data = [this.arrScores[i].scores[0],this.arrScores[i].scores[1],this.arrScores[i].scores[2]];
          }else if(this.bimTop==4){
            _lineChartLabels = ['Bimestre 1','Bimestre 2','Bimestre 3','Bimestre 4'];
            _lineChartData[0].data = [this.arrScores[i].scores[0],this.arrScores[i].scores[1],this.arrScores[i].scores[2],this.arrScores[i].scores[3]];
          }else if(this.bimTop==5){
            _lineChartLabels = ['Bimestre 1', 'Bimestre 2','Bimestre 3','Bimestre 4','Bimestre 5'];
            _lineChartData[0].data = [this.arrScores[i].scores[0],this.arrScores[i].scores[1],this.arrScores[i].scores[2],this.arrScores[i].scores[3],this.arrScores[i].scores[4]];
          }
        }
        this.lineChartLabels = _lineChartLabels;
        this.lineChartData = _lineChartData;
      }
    }
    this.getObsIndividual();
  }


  getObsIndividual(){
    //promedio general, bimestre más alto, bimestre más bajo, tendencia
    console.log(this.lineChartData[0].data);
    
    if(this.lineChartData[0].data.length==0){
      this.statusSubject = "Materia No Calificada";
    }else{
      this.statusSubject="";
      if(this.lineChartData[0].data.length==1){
        this.averageInd = this.lineChartData[0].data[0] as number;
      }else{
        let sum = 0;

        this.betterInd = (this.lineChartData[0].data[0] as number);
        this.worstInd = (this.lineChartData[0].data[0] as number);

        for (let i = 0; i < this.lineChartData[0].data.length; i++) {
          if(this.betterInd<(this.lineChartData[0].data[i] as number)){
            this.betterInd = (this.lineChartData[0].data[i] as number);
          }
          if(this.worstInd>(this.lineChartData[0].data[i] as number)){
            this.worstInd = (this.lineChartData[0].data[i] as number);
          }

          sum += this.lineChartData[0].data[i] as number;
        }
        this.averageInd = sum/ this.lineChartData[0].data.length;
        //verificamos si el promedio es bajo o alto
        if(this.averageInd < 6){
          this.msgObs = "A trabajar por que debes mejorar mucho, animo... Tú puedes!"
        }else if(this.averageInd < 7){
          this.msgObs = "Hay que trabajar más duro, las cosas mejoraran si te esfuerzas más";
        }else if(this.averageInd < 8){
          this.msgObs = "Has trabajado, pero puedes trabajar un poco más, confia en ti";
        }else if(this.averageInd < 9){
          this.msgObs = "Buen trabajo, vas por buen camino, solo no te confies y da un esfuerzo más";
        }else if(this.averageInd < 10){
          this.msgObs = "Excelente, tú esfuerzo ha rendido frutos, no te confies, sigue así";
        }else if(this.averageInd == 10){
          this.msgObs = "Vas en lo más alto, felicidades!";
        }

      }
    }
    
  }

  //grafica de diamante-------------------------------------
  public radarChartOptions: RadialChartOptions = {
    responsive: true,
  };
  public radarChartLabels: Label[]=[];

  public radarChartData: ChartDataSets[] = [
    { data: [], label: 'Calificaciones' }
  ];

  public radarChartType: ChartType = 'radar';

  public radarChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(29, 43, 70, 0.68)',
      borderColor: 'rgba(176, 192, 222, 0.59)',
      pointBackgroundColor: 'rgba(29, 43, 70, 0.68)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(165, 183, 217, 1)'
    }
  ];

  grapScoresGeneral(){
    let _radarChartData: number[] = [];
    for (let i = 0; i < this.arrGScores.length; i++) {
      if(this.arrGScores[i].bimT!=0){
        this.radarChartLabels.push(this.arrGScores[i].nameSubject);
      }else{
        this.radarChartLabels.push(this.arrGScores[i].nameSubject+"(No calificada aún)");
      }
      _radarChartData.push(this.arrGScores[i].score);
    }
    this.radarChartData[0].data = _radarChartData;
  }

}
