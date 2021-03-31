import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { APIService } from 'src/app/services/api/api.service';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-configure-account',
  templateUrl: './configure-account.component.html',
  styleUrls: ['./configure-account.component.css'],
  providers: [MatSnackBar]
})
export class ConfigureAccountComponent implements OnInit {

  user:User;
  name:String;
  idU:String;

  //para el switch boton
  isChecked = false ;

    /**
   * @param submitted es la variable que indica si existe algun error en el formulario de existir su valor se vuelve True
   */
  submitted=false; 

  //formulario
  formUpdateUser : FormGroup; 

  constructor(
    private api: APIService,
    private formbuilder : FormBuilder,
    private snackBar: MatSnackBar,
    ) {
    this.user= JSON.parse(localStorage.getItem("user"));
    this.formUpdateUser = this.formbuilder.group({
      // archivo : ['',[Validators.required]],
      password : [''],
      confirmPassword : [''],
    });
   }

  ngOnInit() {
    this.name = this.user.username;
    this.idU = this.user.id;
    
    this.formUpdateUser.disable({ emitEvent: false });
    this.formUpdateUser.invalid;
  }

  sendRegister(){
    this.submitted=true;
    if(this.isChecked && (this.formUpdateUser.get("password").value == this.formUpdateUser.get("confirmPassword").value ) && 
    (this.formUpdateUser.get("password").value!="" && this.formUpdateUser.get("confirmPassword").value!="" )){
      let params= {
        id : this.idU,
        password: this.formUpdateUser.get("password").value
      }
      console.log(params);

      this.api.changePassword(params).subscribe(response=>{
        this.openCustomerSnackBar();
        this.formUpdateUser.setValue({password: '', confirmPassword: ''});
        this.isChecked = false;
      });
    }else{
      console.log("NO CAMBIAMOS");
    }
    this.submitted=false;
  }


  changePassword(){
    //si desea modificar la contraseña
    if(this.isChecked){
      this.formUpdateUser.enable();
      this.formUpdateUser.valid;
    }else{
      this.formUpdateUser.disable();
      this.formUpdateUser.invalid;
    }
  }

   //metodo para mostrar una notificacion emergente de que la contraseña fue modificada correctamente
   openCustomerSnackBar(){
    return this.snackBar.openFromComponent(CustomSnackBarComponentUpdatePassword, {duration: 4000});
  }

}


@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #00ff4ce3;'><strong>Contraseña Actualizada Correctamente</strong></span>`
})
export class CustomSnackBarComponentUpdatePassword{}