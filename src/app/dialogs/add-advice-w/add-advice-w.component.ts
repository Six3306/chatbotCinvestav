import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { AdviceW } from '../../models/adviceW.model';

@Component({
  selector: 'app-add-advice-w',
  templateUrl: './add-advice-w.component.html',
  styleUrls: ['./add-advice-w.component.css']
})
export class AddAdviceWComponent implements OnInit {

  student: string = "";
  dateReg: string = "";
  hourReg: string = "";
  status: number = 0;
  formFile: FormGroup;
  textAreaReminder: string = "";
  studentAdviceW: Array<AdviceW> = [];


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
  }

  ngOnInit() {
    this.getListAdvice();
  }

  onClickNo(): void {
    this.dialogRef.close()
  }

  getListAdvice(){
    this.firebase.getListAdviceStudent(this.student).then(response => {
      console.log(JSON.stringify(response));
      this.studentAdviceW = response;
    });
  }
}
