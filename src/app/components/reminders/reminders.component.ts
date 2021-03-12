import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatSnackBar } from '@angular/material';
import { Reminder } from 'src/app/models/Reminder.model';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';


export interface Group{
  /*** value es el valor real que tendra */
  value: any,
  /**   * es el valor a mostrar de a interface*/
  viewValue: any
}

 export interface Grade{
  /**   * value es el valor real que tendra    */
  value: any,
  /**   * es el valor a mostrar de a interface   */
  viewValue: any
}

//para los checkbox
export interface Task {
  completed: boolean;
  grade:number;
  group:string;
  subtasks1?: Task[];
  subtasks2?: Task[];
  subtasks3?: Task[];
}

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css'],
  providers: [MatSnackBar]
})
export class RemindersComponent implements OnInit {
  //para la fecha
  createAt:any;
  //para la seccion desplegable
  panelOpenState = false;
  //select de profesores
  profesSelect:any=false;
  //contenido de los checkboxs
  task: Task = {
    group: 'Todo',
    completed: false,
    grade: 1,
    subtasks1: [
      {group: 'A', grade: 1, completed: false},
      {group: 'B', grade: 1, completed: false},
      {group: 'C', grade: 1, completed: false},
      {group: 'D', grade: 1, completed: false},
      {group: 'E', grade: 1, completed: false},
      {group: 'F', grade: 1, completed: false},
      {group: 'G', grade: 1, completed: false},
      {group: 'H', grade: 1, completed: false},
      {group: 'I', grade: 1, completed: false},
      {group: 'J', grade: 1, completed: false},
    ],
    subtasks2: [
      {group: 'A', grade: 2, completed: false},
      {group: 'B', grade: 2, completed: false},
      {group: 'C', grade: 2, completed: false},
      {group: 'D', grade: 2, completed: false},
      {group: 'E', grade: 2, completed: false},
      {group: 'F', grade: 2, completed: false},
      {group: 'G', grade: 2, completed: false},
      {group: 'H', grade: 2, completed: false},
      {group: 'I', grade: 2, completed: false},
      {group: 'J', grade: 2, completed: false},
    ],
    subtasks3: [
      {group: 'A', grade: 3, completed: false},
      {group: 'B', grade: 3, completed: false},
      {group: 'C', grade: 3, completed: false},
      {group: 'D', grade: 3, completed: false},
      {group: 'E', grade: 3, completed: false},
      {group: 'F', grade: 3, completed: false},
      {group: 'G', grade: 3, completed: false},
      {group: 'H', grade: 3, completed: false},
      {group: 'I', grade: 3, completed: false},
      {group: 'J', grade: 3, completed: false},
    ]
  };


  allComplete: boolean = false;
  allComplete1: boolean = false;
  allComplete2: boolean = false;
  allComplete3: boolean = false;

  dataSource: MatTableDataSource<Reminder>;
  displayedColumns: string[] = ['idKey','reminder','publication', 'delet'];
  textAreaReminder: string="";
  titleReminder:string="";

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(
    private database: AngularFireDatabase,
    public firebase: FirebaseService,
    private router: Router,
    private snackBar: MatSnackBar,
    ) {
      
     }

  ngOnInit() {
    this.getRemind();
  }

  //para obtener los avisos que anteriormente han sido registrados en el sistema
  getRemind(){
    let arrayReminders: Array<Reminder>=[];        
    this.database.database.ref('Recordatorios/').once('value').then((snapshot) => {
      const value = snapshot.val();     
      if (value !== null || value!==undefined) {
          for (var val in value) {
              let remindr = new Reminder(val,value[val].reminder, value[val].publication, value[val].delet);
              if(remindr){
                arrayReminders.push(remindr);
              
              }
          }
      }
      this.dataSource = new MatTableDataSource(arrayReminders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  });

} 

//para dar de alta un aviso en el sistema
  registerReminder(){

    let dateAct: Date = new Date();
    // let data={
    //   reminder:this.textAreaReminder,
    //   publication: 
    //   delet: 1,
    // };
    // this.firebase.addReminder(data);  

    // this.openCustomerSnackBar();

    // this.getRemind();
    // this.textAreaReminder = "";
    let arraySelects: Array<any>= [];   
    this.task.subtasks1.forEach(v =>{
      if(v.completed){
        let data = {
          grade: "1",
          group: v.group
        }
        arraySelects.push(data);
      }
    });
    this.task.subtasks2.forEach(v =>{
      if(v.completed){
        let data = {
          grade: "2",
          group: v.group
        }
        arraySelects.push(data);
      }
    });
    this.task.subtasks3.forEach(v =>{
      if(v.completed){
        let data = {
          grade: "3",
          group: v.group
        }
        arraySelects.push(data);
      }
    })

    if((arraySelects.length>0 || this.profesSelect!=false) && this.titleReminder.length>0 && this.createAt!=undefined && this.textAreaReminder.length>0){
      let data={
        title: this.titleReminder,
        datePub: dateAct.getDate()+"-"+(dateAct.getMonth()+1)+"-"+dateAct.getFullYear(),
        dateExp: this.createAt.getDate()+"-"+(this.createAt.getMonth()+1)+"-"+this.createAt.getFullYear(),
        content: this.textAreaReminder,
        professor: this.profesSelect
      }
      this.firebase.addEventG(data, arraySelects);
    }else{
      console.log("ERROR");
    }

    
   // this.firebase.addEventG(data, arraySelects);

  }



  //para cambiar el estado de un aviso, de activado a desactivado y viceversa
  changeActivated(activated:Boolean, remin : Reminder){
    if(activated){
      remin.delet=1;      
    }else{
      remin.delet=0;
    }
    let data={
      reminder:remin.reminder,
      publication: remin.publication,
      delet: remin.delet,
    };
    // console.log(remin); 
    this.firebase.updateReminderActivated(remin.idKey, data);
  }


  //para las acciones de los checkbox
  updateAllComplete() {
    this.allComplete = this.task.subtasks1 != null && this.task.subtasks1.every(t => t.completed) &&  
    this.task.subtasks2 != null && this.task.subtasks2.every(t => t.completed) &&
    this.task.subtasks3 != null && this.task.subtasks3.every(t => t.completed);
  }

  updateAllComplete1() {
    this.allComplete1 = this.task.subtasks1 != null && this.task.subtasks1.every(t => t.completed);
  }

  updateAllComplete2() {
    this.allComplete1 = this.task.subtasks2 != null && this.task.subtasks2.every(t => t.completed);
  }

  updateAllComplete3() {
    this.allComplete1 = this.task.subtasks3 != null && this.task.subtasks3.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks1 == null || this.task.subtasks2 == null || this.task.subtasks3 == null) {
      return false;
    }
    return (this.task.subtasks1.filter(t => t.completed).length > 0 || this.task.subtasks2.filter(t => t.completed).length > 0 || this.task.subtasks3.filter(t => t.completed).length > 0) 
    && !this.allComplete;
  }

  someComplete1(): boolean {
    if (this.task.subtasks1 == null) {
      return false;
    }
    return (this.task.subtasks1.filter(t => t.completed).length > 0) 
    && !this.allComplete1;
  }
  someComplete2(): boolean {
    if (this.task.subtasks1 == null) {
      return false;
    }
    return (this.task.subtasks2.filter(t => t.completed).length > 0) 
    && !this.allComplete2;
  }
  someComplete3(): boolean {
    if (this.task.subtasks1 == null) {
      return false;
    }
    return (this.task.subtasks3.filter(t => t.completed).length > 0) 
    && !this.allComplete3;
  }


  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks1 == null || this.task.subtasks2 == null || this.task.subtasks3 == null) {
      return;
    }
    this.task.subtasks1.forEach(t => t.completed = completed);
    this.task.subtasks2.forEach(t => t.completed = completed);
    this.task.subtasks3.forEach(t => t.completed = completed);
  }

  setAll1(completed: boolean) {
    this.allComplete1 = completed;
    if (this.task.subtasks1 == null) {
      return;
    }
    this.task.subtasks1.forEach(t => t.completed = completed);
  }
  setAll2(completed: boolean) {
    this.allComplete2 = completed;
    if (this.task.subtasks2 == null) {
      return;
    }
    this.task.subtasks2.forEach(t => t.completed = completed);
  }
  setAll3(completed: boolean) {
    this.allComplete3 = completed;
    if (this.task.subtasks3 == null) {
      return;
    }
    this.task.subtasks3.forEach(t => t.completed = completed);
  }


  //para abrir una notificacion emergente y dar el mensaje de que el recordatorio se registro correctamente
  openCustomerSnackBar(){
    return this.snackBar.openFromComponent(CustomSnackBarComponent, {duration: 4000});
  }

  //regresar al menu principal
  menuP(){
    this.router.navigateByUrl("Menu");
  } 
}

@Component({
  selector: 'custom-snackbar',
  template: `<span style='color: #00ff4ce3;'><strong>Recordatorio Registrado Correctamente</strong></span>`
})
export class CustomSnackBarComponent{}
