import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/User.model';

@Component({
  selector: 'app-abc',
  templateUrl: './abc.component.html',
  styleUrls: ['./abc.component.css']
})
export class AbcComponent implements OnInit {
  existUser:boolean=false;

  user:User;

  typeMenu:String ="";

  status:Boolean;

  name:String;

  routeA:String;
  
  /**
   * 
   * @param router varibale para manejar las rutas del header 
   */
  constructor(
    private router: Router,
  ) { 
    this.user= JSON.parse(localStorage.getItem("user"));
  }
  
  /**
   * Metodo que se ejcuta cuando se contruye el nav bar 
   */
  ngOnInit() {
    this.typeMenu=this.user.type;
    this.name= this.user.username;
    this.status = this.user.activated;
    this.routeA = this.router.url;

    if(localStorage.getItem("user")!=undefined)
      this.existUser=true;
    else
      this.existUser=false;
  }
  /**
   * Metodo para cerrar sesion 
   */
  exitAcount(){
    this.router.navigateByUrl("");
  }

  /**
   * Metodo para ir a la ventana de registrase
   */
  register(){
    this.router.navigateByUrl("Register")
  }
  /**
   * Metodo para ir a la ventana de iniciar sesion
   */
  login(){
    this.router.navigateByUrl("Login")
  }

  //metodo para regresar al menu principal
  principal(){
    this.router.navigateByUrl("Menu");
  }
  
  adminUsers(){
    this.router.navigateByUrl("Validate-users")
  }

  adminCourStud(){
    this.router.navigateByUrl("Users-lessons")
  }

  admingClass(){
    this.router.navigateByUrl("Class-g")
  }

  adminRemind(){
    this.router.navigateByUrl("reminders")
  }

  progressGroup(){
    this.router.navigateByUrl("Progress-group")
  }

    /**
   * Metodo para dirigirse a la vista para calificar usuarios 
   */
  goToScoresUsers(){
    this.router.navigateByUrl("Scores");
  }

    /**
   * Metodo para dirigirse a la vista del chatbot
   */
  goToChatbot(){
    this.router.navigateByUrl("Chatbot")
  }

    /**
   * Metodo para dirigirse a la vista del progreso de un estudiante
   */
     goToProgressStudent(){
      this.router.navigateByUrl("Progress-student")
    }
    
    /**
   * Metodo para dirigirse a la vista de archivos
   */
  goToGeneralFiles(){
    this.router.navigateByUrl("General-files");
  }

  //metodo para dirigirse a la vista de homeworks
  goToHomeworks(){
    this.router.navigateByUrl("Homeworks")
  }

  //metodo para ir a dudas de alumnos
  goToDoubts(){
    this.router.navigateByUrl("Doubts")
  }

  //metodo para dirigirse a la vista de sentimientos
  goToFeelings(){
    this.router.navigateByUrl("Feelings")
  }

  /*Dirige al menu principal*/
  goMenuPrincipal(){
    this.router.navigateByUrl("Menu");
  }

    //dirige a configurar la cuenta actual
    goConfigureAccount(){
      this.router.navigateByUrl("Configure-account");
    }

    
    //dirige a las tareas de un alumno
    goToHomeworkStudent(){
      this.router.navigateByUrl('Homeworks-student');
    }
        
}
