import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api/api.service';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { AlertComponent } from '../alert/alert.component';
import { User } from 'src/app/models/User.model';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MatSnackBar],
  encapsulation: ViewEncapsulation.None,
})


export class RegisterComponent implements OnInit {

  /**
   * @param formRegister es el register 
   */
  formRegister: FormGroup;

  /**
   * @param submitted es la variable que indica si existe algun error en el formulario de existir su valor se vuelve True
   */
  submitted = false;

  /**
   * @param roles son los roles existentes para el registro
   */
  rols: string[] = ['Profesor', 'Alumno'];

  /**
   * @param alertComponentRef componente de alerta todavia no esta terminado
   */
  alertComponentRef: MatDialogRef<AlertComponent>;

  /**
   * Constructor de la clase del registro en el se instancian las variables importadas
   * @param api varibale que permite la conexion con la api alojada en adonis
   * @param formbuilder constructor del formRegister, esta variable solo se encarga de eso
   * @param router es la variable que permite movernos entre vistas de la aplicación
   * @param dialog es la alerta esta variable permite mostrar las alertas todavia esta en desarrollo esa parte
   * @param firabse variable para conectar con el servicio de firebase
   */
  constructor(
    private api: APIService,
    private formbuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private firebase: FirebaseService,
    private snackBar: MatSnackBar,
  ) {
    this.formRegister = this.formbuilder.group({
      username: ['', Validators.required],
      lastNameFather: ['', Validators.required],
      lastNameMother: ['', Validators.required],
      yearsold: ['', Validators.required],
      password: ['', Validators.required],
      rol: ['', Validators.required],
      email: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    })
  }


  /**
   * Inicializacion del controlador
   */
  ngOnInit() { }


  /**
   * Metodo que permite obtener el form para validar errores
   * @returns retorna los controls del form del register
   */
  get f() { return this.formRegister.controls; }


  /**
   * Permite realizar el registro del usuario
   */
  register() {
    var caP = ["{", "}", ".", ",", ";", ":", "[", "]", "(", ")", "-", "_", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "?", "!", "|", "&", "%", "#", "$", "/", "<", ">", "*"];
    var name = this.formRegister.get("username").value;
    var lastnameF = this.formRegister.get("lastNameFather").value;
    var lastnameM = this.formRegister.get("lastNameMother").value;
    var username = name + " " + lastnameF + " " + lastnameM;
    var band = true;

    for (let i = 0; i < caP.length; i++) {
      if (username.includes(caP[i])) {
        band = false;
      }
    }

    if(name.trim()=="" || lastnameF.trim()=="" || lastnameM.trim()=="" ){
      band = false;
    }

    if (band) {
      let user: User;
      user = {
        username: username,
        password: this.formRegister.get("password").value,
        email: this.formRegister.get("email").value,
        age: this.formRegister.get("yearsold").value,
        type: this.formRegister.get("rol").value,
        activated: null,
        id: null
      }

      //valida si email de usuario existe
      this.api.verifyEmail(user.email).subscribe(response => {

        if (response['data'] == false) {//no existe
          this.api.register(user).subscribe(response => {

            //añadiendo a firebase
            var band = this.firebase.addUser(user);

            //verificando si todo salio bien
            if (band) {
              localStorage.setItem("user", JSON.stringify(user));
              // localStorage.setItem("token", response.token) 
              this.router.navigateByUrl("Menu");
            }

          }, error => {
            console.log(error);
          });
        } else {//si existe
          this.router.navigateByUrl("Register");
        }

      });
    }else{
      this.openCustomerSnackBarLesson();
    }
  }

  /**
   * Envia y comprueba que los campos del form esten bien
   * @returns retorna un elemento vacio para terminar la funcion 
   */
  sendRegister() {
    this.submitted = true;
    if (this.formRegister.invalid || (this.formRegister.get("password").value != this.formRegister.get("confirmPassword").value)) {
      this.openCustomerSnackBarLesson();
      return;
    }
    //registrando
    this.register();
    this.submitted = false;
  }
  /**
   * Funcion que redirige al login
   */
  Login() {
    this.router.navigateByUrl("Login")
  }

  //para ir directamente a la ventana del login
  loginP() {
    this.router.navigateByUrl("");
  }

  //para mostrar un mensaje emergente de que algo salio mal al capturar los datos y registrarse
  openCustomerSnackBarLesson() {
    return this.snackBar.openFromComponent(CustomSnackBarComponentRegister, { duration: 4000 });
  }

}


@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #ee0303dc;'><strong>Error al Registrar, Favor de Verificar la Información Ingresada</strong></span>`
})
export class CustomSnackBarComponentRegister { }