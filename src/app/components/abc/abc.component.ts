import { Component, OnInit } from '@angular/core';
import { PushNotificationService } from '../../services/push-notification.service';

@Component({
  selector: 'app-abc',
  templateUrl: './abc.component.html',
  styleUrls: ['./abc.component.css']
})
export class AbcComponent implements OnInit {

  // nowYear;
  // messageReceived = '';

  constructor(
  ) {
    // notificacion.requestPermission().then(token=>{
    //   console.log(token);
    // })
   }

  ngOnInit() {

    // var fecha = new Date();

    // this.nowYear = fecha.getFullYear();


    // this.notificacion.receiveMessage().subscribe(payload=>{
    //   console.log(payload);      
    }

    // fecha

    // //admin.initializeApp(firebaseConfig);
    // // var database = firebase.database();
    // //agent.add('estamos consultando examenes!');
    // var t = null;

    // const examenes = admin.database().ref("Examenes").once('value', (snapshot) => {
    //     snapshot.forEach((childSnapshot) => {
    //         var childKey = childSnapshot.key;
    //         var childData = childSnapshot.val();
    //         t = childKey + " " + childData+" "+t;
    //         // console.log('DATOSSSSSSSSSSS: ' + childData);
    //     });

    //     this.contenido = t;

    // });
    // console.log(t);
    // //agent.add('estamos consultando examenes!');

    // //agent.add('Resultado: ' + examenes);
    // //agent.add('RESULTADO: ' + from_data.data);



  // }

}
