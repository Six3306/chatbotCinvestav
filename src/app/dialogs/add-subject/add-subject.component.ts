import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { APIService } from 'src/app/services/api/api.service';
import { Grade } from 'src/app/components/users-lessons/users-lessons.component';
import { User } from 'src/app/models/User.model';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';


@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.css']
})
export class AddSubjectComponent implements OnInit {

 /**
  * Form con los datos del archivo a subir
  */
  formFile:FormGroup;

  /**
   */
  enviado:Boolean;

 /**
   * Arraeglo que contiene a todos los grados y materias de un profesor
   */
  arrayUsers: Array<User>;
  
  /**
   *  Propiedad que sirve para tener el grado al que pertenecera el archivo 
   * @param value es el valor que tendra como tal la seleccion 
   * @param viewValue es el valor que que se muestra para la seleccion 
   * 
   */
  grades:Grade[] = [
    {value: '1', viewValue:"1°"},
    {value: '2', viewValue:"2°"},
    {value: '3', viewValue:"3°"}
  ];



  //metodo que permite retornar todos los profesores registrados en el sistema
  retornaProfes(){
     
    this.firebase.getProfessors().then(response=>{
      let profes: Grade[] = [];
      for (let i = 0; i < response.length; i++) {
        profes.push({value: 0, viewValue: response[i]});
      }
      this.profes = profes;
    });
  
   }
  
   profes:Grade[];


  /**
   * 
   * @param formBuilder Constructor clasico de un form 
   * @param dialogRef Referencia para tener acceso al dialog
   * @param data información recibida del componente que invoco al dialog 
   */
  constructor(
    private api: APIService,
    public formBuilder: FormBuilder,
    public dialogRef : MatDialogRef<AddSubjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private firebase: FirebaseService,
  ) { 
    this.formFile = this.formBuilder.group({
      grado:[data.grade, [Validators.required]],
      materia:['', [Validators.required]],
      profesor:['', [Validators.required]]
    });

  }
  /**
   * Funcion para cerrar el dialog
   */
  onClickNo():void{
    this.dialogRef.close()
  }

  ngOnInit() {
    this.retornaProfes();
  }


}
