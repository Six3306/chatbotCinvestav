import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AdviceW } from '../../models/adviceW.model';
import { User } from '../../models/User.model';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-add-advice-w',
  templateUrl: './add-advice-w.component.html',
  styleUrls: ['./add-advice-w.component.css']
})
export class AddAdviceWComponent implements OnInit {

  student: string = "";
  dateReg: string = "";
  hourReg: string = "";
  title: string = "";
  status: number = 0;
  formFile: FormGroup;
  bSP: boolean = false;
  textAreaReminder: string = "";
  studentAdviceW: Array<AdviceW> = [];
user:User;

  constructor(
    public formBuilder: FormBuilder,
    public firebase: FirebaseService,
    public dialogRef: MatDialogRef<AddAdviceWComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formFile = this.formBuilder.group({
      nameStud: [data.student,],
      dateRStud: [data.dateR,],
      hourRStud: [data.hourR,],
      statusT: [data.status,],
      adviceContent: []
    });
    this.student = data.student;
    this.hourReg = data.hourR;
    this.dateReg = data.dateR;
    this.status = data.status;
    this.title = data.title;
    this.user= JSON.parse(localStorage.getItem("user"));    
    this.firebase.getInfoStatusAdviceProfessorStudent(data.title, this.user).then(response => {
      if(response && this.status == 0){
        this.bSP = true;
      }
    });
    // console.log("aaaaaaaaaaaaa");
    
  }

  ngOnInit() {
    this.getListAdvice();
  }

  onClickNo(): void {
    this.dialogRef.close()
  }

  getListAdvice(){
    this.firebase.getListAdviceStudent(this.title.split("---")[0], this.student).then(response => {
      console.log(JSON.stringify(response));
      this.studentAdviceW = response;
    });
  }
}
