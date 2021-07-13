import { Component, Input, OnInit, SimpleChanges, QueryList, ViewChildren } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { User } from '../../../models/User.model';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Doubt } from '../../../models/Doubt.model';
import { DetailsDoubtComponent } from '../../../dialogs/details-doubt/details-doubt.component';

export interface HomeworkTmp {
  id: any,
  theme: any,
}

@Component({
  selector: 'app-homework-doubts',
  templateUrl: './homework-doubts.component.html',
  styleUrls: ['./homework-doubts.component.css']
})


export class HomeworkDoubtsComponent implements OnInit {

  @Input()
  grade: any
  @Input()
  group: any
  @Input()
  subject: any

  homeworkSelected:String;
  homeworks:HomeworkTmp[] = [];
  user:User;

  dataSourceHomeworkDoubt: MatTableDataSource<Doubt>;
  displayedColumnsHomework: string[] = ['student', 'date', 'hour', 'status', 'details', 'recommendedMaterial', 'email', 'id'];

  @ViewChildren(MatPaginator,) paginator: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sort: QueryList<MatSort>;


  constructor(public firebase: FirebaseService,public dialog: MatDialog) { 
    this.user= JSON.parse(localStorage.getItem("user"));  
  }  

  ngOnInit() {
  }

  
  ngOnChanges(changes: SimpleChanges) {
    if (changes.grade != undefined || changes.group != undefined || changes.subject != undefined) {
      this.homeworkSelected = null;
      this.homeworks = [];
      if ((this.grade == "1" || this.grade == "2" || this.grade == "3") && (this.group == "A" ||this.group == "B" ||this.group == "C" ||this.group == "D" ||this.group == "E" ||this.group == "F" ||this.group == "G" ||this.group == "H" ||this.group == "I" ||this.group == "J") && (this.subject!=undefined)){
          let data = {
            "grade": this.grade,
            "group": this.group,
            "subject": this.subject
          }


          this.firebase.getHomeworksNameBySubject(data).then(response=>{
            for (let i = 0; i < response.length; i++) {
              this.homeworks.push({"id":response[i]["id"], "theme": response[i]["theme"]});
              
            }
  
          });
      }

    }
  }

  selectHomework(){
    let data = {
      "grade": this.grade,
      "group": this.group,
      "subject": this.subject,
      "idHomework": this.homeworkSelected,
    }
    this.firebase.getDoubtsByHomework(data).then(response=>{
      this.dataSourceHomeworkDoubt = new MatTableDataSource(response);
        this.dataSourceHomeworkDoubt.paginator = this.paginator.first;
        this.dataSourceHomeworkDoubt.sort = this.sort.first;
    });
  }

  viewFeedbackH(row){
    const dialogRef = this.dialog.open(DetailsDoubtComponent,{
      data: {
        "student": row.student,
        "hour": row.hour,
        "date": row.date,
        "status": row.status,
        "grade": this.grade,
        "group": this.group,
        "subject": this.subject,
        "idG": this.homeworkSelected,
        "type": "h",
        "recomended": row.recommendedMaterial,
        "email": row.email,
        "id": row.id,
      }
      
    });
    dialogRef.afterClosed().subscribe(response=>{
      if(response==1 || response=="1"){
        row.statusFeedback = 1;
      }      
    });
  }

  

}
