import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA } from '@angular/material';

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

  constructor(    @Inject(MAT_DIALOG_DATA) public  data:any, 
  ) { }

  ngOnInit() {
    this.title = this.data.title;
    this.content = this.data.content;
    this.professors = this.data.professors;
    for (let i = 0; i < this.data.destinatarys.length; i++) {
      this.destinatarys = this.destinatarys+"   "+this.data.destinatarys[i];
      
    }
  }

}
