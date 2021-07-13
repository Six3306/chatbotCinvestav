import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { Email } from '../feedback-homework/feedback-homework.component';

@Component({
  selector: 'app-details-doubt',
  templateUrl: './details-doubt.component.html',
  styleUrls: ['./details-doubt.component.css']
})
export class DetailsDoubtComponent implements OnInit {

  student:string;
  recommendedM = [];
  formFileSend: FormGroup;
  feedbackCommentA = null;
  statusD = null;
  email = null;
  grade = null;
  group = null;
  subject = null;
  idG = null;
  type = null;
  id = null;
  verify = null;

  constructor(
    public dialogRef: MatDialogRef<DetailsDoubtComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formbuilder: FormBuilder,
    private firebase: FirebaseService,
    ) {
      this.student = data.student;
      this.recommendedM = (data.recomended);
      this.statusD = data.status;
      this.email = data.email;
      this.grade = data.grade;
      this.group = data.group;
      this.subject = data.subject
      this.idG = data.idG;
      this.type = data.type;
      this.id = data.id;

      this.firebase.getStatusFeedbackDoubt(this.id, this.email).then(r =>{
        if(r==true){
  this.verify = true;
        }else{
          this.verify = false;
        }
        
      });


      this.formFileSend = this.formbuilder.group({
        FeedbackComment: [''],
      });

     }

  ngOnInit() {
  }

 /**
   * Funcion para cerrar el dialog 
   */
  okClick():void{
    this.dialogRef.close(0);
  }

  setAnswerDoubt(){
    let data = {
      "grade": this.grade,
      "group": this.group,
      "email":this.email,
      "student": this.student,
      "subject": this.subject, 
      "type": this.type,
      "idG": this.idG,
      "feedB": this.feedbackCommentA,
      "id": this.id,
    }
    this.firebase.setFeedBackDoubtStudent(data).then(()=>{
      this.dialogRef.close(1);
    });
  }


}
