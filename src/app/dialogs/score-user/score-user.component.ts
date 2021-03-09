import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { Scores } from 'src/app/models/Scores.model';

@Component({
  selector: 'app-add-subject',
  templateUrl: './score-user.component.html',
  styleUrls: ['./score-user.component.css']
})
export class ScoreUserComponent implements OnInit {

 /** Form con los datos del archivo a subir*/
 formFile:FormGroup;

 /** Variable que comprueba que ya se envio*/
 enviado: Boolean;

  nombreAlumno:any;

 /**
  * 
  * @param formBuilder Constructor clasico de un form 
  * @param dialogRef Referencia para tener acceso al dialog
  * @param data información recibida del componente que invoco al dialog 
  */
 constructor(
   public formBuilder: FormBuilder,
   public firebase: FirebaseService,
   public dialogRef : MatDialogRef<ScoreUserComponent>,
   @Inject(MAT_DIALOG_DATA) public data:any ) { 

    this.formFile = this.formBuilder.group({
      nameStud:[data.nameStudent, ],
      bim1:[data.b1, [Validators.required]],
      bim2:[data.b2, [Validators.required]],
      bim3:[data.b3, [Validators.required]],
      bim4:[data.b4, [Validators.required]],
      bim5:[data.b5, [Validators.required]],
    });
    this.nombreAlumno = data.nameStudent;
 }
 /**
  * Funcion para cerrar el dialog
  */
 onClickNo():void{
   this.dialogRef.close()
 }
 ngOnInit() {
 }

}
