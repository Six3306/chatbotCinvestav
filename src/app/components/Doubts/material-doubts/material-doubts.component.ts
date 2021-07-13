import { Component, OnInit, Input, SimpleChanges, QueryList, ViewChildren } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { User } from '../../../models/User.model';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

export interface Material {
  viewValue: any,
  value: any,
}

export interface ExamTmp {
  name: any,
  score: any,
}

export interface HomeworkTmp {
  name: any,
  score: any,
}

@Component({
  selector: 'app-material-doubts',
  templateUrl: './material-doubts.component.html',
  styleUrls: ['./material-doubts.component.css']
})
export class MaterialDoubtsComponent implements OnInit {

  @Input()
  grade: any
  @Input()
  group: any
  @Input()
  subject: any


  materialSelected:String;
  homeworkSelected:String;
  examSelected:String;
  user:User;
  materials:Material[] = [];
  homeworks:HomeworkTmp[] = [];
  exams:ExamTmp[] = [];

  levelExam:number;
  levelHomework:number;
  descripcion:any;
  estatus:any;
  fecha:any;
  nconsultado:any;
  links:any[]= [];

  constructor(public firebase: FirebaseService) { this.user= JSON.parse(localStorage.getItem("user"));  
}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.grade != undefined || changes.group != undefined || changes.subject != undefined) {
      this.materialSelected = null;
      this.materials = [];
      if ((this.grade == "1" || this.grade == "2" || this.grade == "3") && (this.group == "A" ||this.group == "B" ||this.group == "C" ||this.group == "D" ||this.group == "E" ||this.group == "F" ||this.group == "G" ||this.group == "H" ||this.group == "I" ||this.group == "J") && (this.subject!=undefined)){
          let data = {
            "grade": this.grade,
            "group": this.group,
            "subject": this.subject
          }
          this.firebase.getListMaterials(data).then(response=>{
            for (let i = 0; i < response.length; i++) {
              this.materials.push({'viewValue': response[i], 'value': response[i]});
              
            }
  
          });
      }

    }
  }

  selectMaterial(){
    this.pieChartData = [0,0,0];
    this.links = [];
    this.homeworks = [];
    this.exams = [];
    this.examSelected = null;
    this.homeworkSelected = null;
    let data = {
      "grade": this.grade,
      "group": this.group,
      "subject": this.subject,
      "materialSelected": this.materialSelected,
    }
    this.firebase.getInfoMaterialSelected(data).then(response=>{
      this.descripcion = response["descripcion"];
      this.fecha = response["fecha"];
      this.estatus = response["estatus"];
      this.nconsultado = response["nconsultado"];
      
      for(var link in response["links"]){
        this.links.push(response["links"][link]["url"]);
      }

      for (let i = 0; i < response["exams"].length; i++) {
        this.exams.push({"name": response["exams"][i]["nameExam"], "score": response["exams"][i]["score"]});
      }
     
      for (let i = 0; i < response["homeworks"].length; i++) {
        this.homeworks.push({"name": response["homeworks"][i]["nameHomework"], "score":  response["homeworks"][i]["score"]});
      }

      this.pieChartData = [response["generalD"], response["generalF"], response["generalL"]];

    });
  }

  selectHomework(){
    if(parseInt(this.homeworkSelected+"")==0){
      this.levelHomework = 2;
    }else if(parseInt(this.homeworkSelected+"")>0){
      this.levelHomework = 1;
    }else if(parseInt(this.homeworkSelected+"")<0){
      this.levelHomework = 0;
    }
  }

  selectExam(){
    if(parseInt(this.examSelected+"")==0){
      this.levelExam = 2;
    }else if(parseInt(this.examSelected+"")>0){
      this.levelExam = 1;
    }else if(parseInt(this.examSelected+"")<0){
      this.levelExam = 0;
    }
  }


  //GRAFICA

  public pieChartOptions: ChartOptions = {
    responsive: true
  }

  public pieChartLabels: Label[] = ['Desconocido', 'Fallado', 'Logrado'];
  public pieChartData: number[] = [0,0,0];
  public pieChartType: ChartType = 'pie';
  public pieChartColors = [
    {
      backgroundColor: ['rgba(29, 43, 70, 0.88)', 'rgba(44, 64, 104, 0.88)', 'rgba(66, 97, 158, 0.88)', 'rgba(100, 130, 190, 0.88)','rgba(136, 159, 205, 0.8)','rgba(169, 185, 219, 0.72)'],
    }, 
  ];
  

}
