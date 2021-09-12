import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-reminder',
  templateUrl: './view-reminder.component.html',
  styleUrls: ['./view-reminder.component.css']
})
export class ViewReminderComponent implements OnInit {

  title:string;
  content:string;
  professors: number;
  destinatarys: string="";
  datePublication: string = "";
  dateExpiration: string = "";

  constructor(    @Inject(MAT_DIALOG_DATA) public  data:any,
  public dialogRef : MatDialogRef<ViewReminderComponent>,
 
  ) { }

  ngOnInit() {
    this.title = this.data.title;
    this.content = this.data.content;
    this.professors = this.data.professors;
    this.datePublication = this.data.datePublication;
    this.dateExpiration = this.data.dateExpiration;
    for (let i = 0; i < this.data.destinatarys.length-1; i++) {
      this.destinatarys = this.destinatarys+"   "+this.data.destinatarys[i]+", ";
    }
    if(this.data.destinatarys.length>0){
      this.destinatarys = this.destinatarys+this.data.destinatarys[this.data.destinatarys.length-1];
    }
  }

  ok(){
    this.dialogRef.close()

  }

}
