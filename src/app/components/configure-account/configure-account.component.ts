import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { APIService } from 'src/app/services/api/api.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-configure-account',
  templateUrl: './configure-account.component.html',
  styleUrls: ['./configure-account.component.css'],
  providers: [MatSnackBar]
})
export class ConfigureAccountComponent implements OnInit {

  user: User;
  name: String;
  idU: String;
  typeUser: any;

  //para el switch boton
  isChecked = false;
  isCheckedReception;

  /**
 * @param submitted es la variable que indica si existe algun error en el formulario de existir su valor se vuelve True
 */
  submitted = false;

  //formulario
  formUpdateUser: FormGroup;

  constructor(
    private api: APIService,
    private formbuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private firebase: FirebaseService,
  ) {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.typeUser = this.user.type;
    this.formUpdateUser = this.formbuilder.group({
      password: [''],
      confirmPassword: [''],
    });

    if (this.typeUser == "Profesor") {
      this.firebase.getStatusReception(this.user.email.split("@")[0]).then(response => {
        this.isCheckedReception = true ? response == 1 : response == 0;
      });
    }
  }

  ngOnInit() {
    this.name = this.user.username;
    this.idU = this.user.id;
    this.formUpdateUser.disable({ emitEvent: false });
    this.formUpdateUser.invalid;
  }

  sendRegister() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        msg: "¿Seguro que deseas modificar tu contraseña?",
      }
    });

    dialogRef.afterClosed().subscribe(responseDialog => {
      if (responseDialog) {
        if (responseDialog == 1) {
          this.submitted = true;
          if (this.isChecked && (this.formUpdateUser.get("password").value == this.formUpdateUser.get("confirmPassword").value) &&
            (this.formUpdateUser.get("password").value != "" && this.formUpdateUser.get("confirmPassword").value != "") &&
            (this.formUpdateUser.get("password").value.trim() != "" && this.formUpdateUser.get("confirmPassword").value.trim() != "")) {
            let params = {
              id: this.idU,
              password: this.formUpdateUser.get("password").value
            }

            this.api.changePassword(params).subscribe(response => {
              this.openCustomerSnackBar();
              this.formUpdateUser.setValue({ password: '', confirmPassword: '' });
              this.isChecked = false;
            });
          } else {
            this.openCustomerSnackBarNot();
          }
          this.submitted = false;
        }
      }
    });
  }


  changePassword() {
    //si desea modificar la contraseña
    if (this.isChecked) {
      this.formUpdateUser.enable();
      this.formUpdateUser.valid;
    } else {
      this.formUpdateUser.disable();
      this.formUpdateUser.invalid;
    }
  }

  //para cambiar el estatus de poder o no recibir mensajes/arhivos de ciertos alumnos de otros grupos
  changeReception() {
    if (this.isCheckedReception) {//habilitada
      this.firebase.setStatusReception(this.user.email.split("@")[0], 1);
    } else {//deshabilitada
      this.firebase.setStatusReception(this.user.email.split("@")[0], 0);
    }
  }

  //metodo para mostrar una notificacion emergente de que la contraseña fue modificada correctamente
  openCustomerSnackBar() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentUpdatePassword, { duration: 4000 });
  }

  //metodo para mostrar una notificacion emergente de que la contraseña no pudo ser modificada
  openCustomerSnackBarNot() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentUpdatePasswordNot, { duration: 4000 });
  }

}


@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #00ff4ce3;'><strong>Contraseña actualizada correctamente</strong></span>`
})
export class CustomSnackBarComponentUpdatePassword { }

@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #D63513;'><strong>La contraseña no pudo ser actualizada (Deben coincidir ambas contraseñas y no se permiten contraseñas vacias)</strong></span>`
})
export class CustomSnackBarComponentUpdatePasswordNot { }