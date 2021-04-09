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



@Component({
  selector: 'app-progress-student',
  templateUrl: './progress-student.component.html',
  styleUrls: ['./progress-student.component.css']
})
export class ProgressStudentComponent implements OnInit, AfterViewChecked {

  grade: any
  user: User;
  arrScores: arrayScores[]=[];
  nVal:number=100;
  band:boolean=false;
  listSubjects:any;
  bimTop:number;
  // lstSubjects:ntSubject[];


  constructor(
    private firebase: FirebaseService
  ) {
    this.user= JSON.parse(localStorage.getItem("user"));
    
   }

  ngOnInit() { 
    //this.showArr();
    this.getNameSubjects();
  }

  ngAfterViewChecked(){
    if(this.nVal==this.arrScores.length && this.band==false){
      this.band=true;
      this.showArr();
    }
  }

  getNameSubjects(){
    let _arrScores: arrayScores[] = [];
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
            }).finally(()=>{
              this.arrScores = _arrScores;
            });
          })
        }

      })
    });    
  }

  selectSubject(){
    this.bimTop;
  }

  showArr(){
    console.log(this.arrScores);
    console.log(this.arrScores[1]);

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
  }

  //grafica de diamante-------------------------------------
  public radarChartOptions: RadialChartOptions = {
    responsive: true,
  };
  public radarChartLabels: Label[] = ['Español', 'Historia', 'Ingles', 'Geografia', 'Matematicas'];

  public radarChartData: ChartDataSets[] = [
    { data: [65, 59, 90, 81, 56], label: 'Calificaciones' }
  ];

  public radarChartType: ChartType = 'radar';

  public radarChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(29, 43, 70, 0.68)',
      borderColor: 'rgba(27, 40, 65, 1)',
      pointBackgroundColor: 'rgba(29, 43, 70, 0.68)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(165, 183, 217, 1)'
    }
  ];

}
