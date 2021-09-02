import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  messageS = "";

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataR: any
  ) { 

    if (dataR != null) {
      this.messageS = dataR.msg;
    }

  }

  ngOnInit() {
  }

  decline(){
    this.dialogRef.close(0);
  }

  accept(){
    this.dialogRef.close(1);
  }

}
