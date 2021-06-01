import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
  selector: 'app-view-details-homeworks',
  templateUrl: './view-details-homeworks.component.html',
  styleUrls: ['./view-details-homeworks.component.css']
})
export class ViewDetailsHomeworksComponent implements OnInit {

  /** Form con los datos del archivo a subir*/
  formFile: FormGroup;

  /** Variable que comprueba que ya se envio*/
  enviado: Boolean;

  nombreAlumno: any;
  timeSend: any;
  description: any;
  status: any;

  constructor(
    public formBuilder: FormBuilder,
    public firebase: FirebaseService,
    public dialogRef: MatDialogRef<ViewDetailsHomeworksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.nombreAlumno = data.nameStudent;

    if (data.timeSend != "-") {
      var day = data.timeSend.split("T")[0].split("-")[0];
      var month = data.timeSend.split("T")[0].split("-")[1];

      var hour = data.timeSend.split("T")[1].split(":")[0];
      var min = data.timeSend.split("T")[1].split(":")[1];
      var sec = data.timeSend.split("T")[1].split(":")[2];

      var date = (parseInt(day) < 10 ? "0" + day : day) + "-" + (parseInt(month) < 10 ? "0" + month : month) + "-" + data.timeSend.split("T")[0].split("-")[2];
      var time = (parseInt(hour) < 10 ? "0" + hour : hour) + ":" + (parseInt(min) < 10 ? "0" + min : min) + ":" + (parseInt(sec) < 10 ? "0" + sec : sec);

      this.timeSend = date + " a las " + time;
    }else{
      this.timeSend = "-";
    }
    this.description = data.description;
    if (data.status == "0") {
      this.status = "No entregada"
    } else if (data.status == "1") {
      this.status = "Entregada a tiempo"
    } else if (data.status == "2") {
      this.status = "Entregada fuera de tiempo"
    }
  }

  /**
   * Funcion para cerrar el dialog
   */
  onClickNo(): void {
    this.dialogRef.close()
  }
  ngOnInit() {
  }

}
