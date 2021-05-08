import { Injectable } from '@angular/core';
import firebase from 'src/firebase-messaging-sw.js';
import { environment } from '../../environments/environment.prod';
// import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  // messagingFirebase = firebase.messaging.Messaging;

  // constructor() {
  //   firebase.initializeApp(environment.firebase );
  //   this.messagingFirebase = firebase.messaging();
  //  }

  //  requestPermission=()=>{
  //    return new Promise(async(resolve, reject)=>{
  //     const permis = await Notification.requestPermission();
  //       if(permis==="granted"){//se aceptan los permisos
  //         const tokenFirebase = await this.messagingFirebase.getToken();
  //         resolve(tokenFirebase);
  //       }else{
  //         reject(new Error("No se otorgaron los permisos"));
  //       }
  //    });
  //  }

  //  private messaginObservable = new Observable(observe =>{
  //    this.messagingFirebase.onMessage(payload=>{
  //      //al recepcionar la info la devolvemos
  //      observe.next(payload);
  //    })
  //  })

  //  receiveMessage(){
  //    return this.messaginObservable;
  //  }

}
