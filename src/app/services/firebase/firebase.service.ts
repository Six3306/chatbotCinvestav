import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/models/User.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { SubjectG } from 'src/app/models/SubjectG.model';
import { Student } from 'src/app/models/Student.model';
import { Scores } from 'src/app/models/Scores.model';
import { Reminder } from 'src/app/models/Reminder.model';
import { Homework } from 'src/app/models/Homework.model';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  /**
   * Constructor de la clase
   * @param firestore clase de firebase para guardar datos en firestore
   * @param database clase de firebase en angular para guardar datos en database fire
   */
  constructor(
    private firestore: AngularFirestore, //firebase para usar firestore
    private database: AngularFireDatabase,
    private storage: AngularFireStorage,

  ) {

  }


  public listar() {

    var storageRef = this.storage.storage.refFromURL("/fotos").listAll().then(response => {
      // console.log(response);
    });
    // var storageRef = this.storage.ref("").child('images');

  }

  /**
   * Funcion para guardar un material en firebase
   * @param file arhivo a guardar de firebase este es un json de tipo file
   */
  addLinkMaterial(data, urls, publicationDate) {
    this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Materiales/${data.title}`).set({ links: urls, descripcion: data.description, fechaPublicacion: publicationDate, estatus: 1 });
    return this.database.database.ref(`Usuarios/Alumnos/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          if (value[val].grado == data.grade && value[val].grupo == data.group) {
            this.database.database.ref(`Usuarios/Alumnos/${value[val].correo.split("@")[0]}/notificaciones/`).update({ materiales: 2 });
          }
        }
      }
    });
  }

  addKeyInBD(data): Boolean {
    this.database.database.ref(`KeyProfesor/${data.nameProfesor}`).set({ keyG: data.keyG });
    return true;
  }

  //agrega una materia
  addSubject(data): boolean {
    this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}`).set({ profesor: data.professor, nombreMateria: data.subject, estatus: 1 });
    var arrG: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    for (let i = 0; i < arrG.length; i++) {
      this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${arrG[i]}`).set({ Tareas: "", Materiales: "", RecordatorioClase: "", Examenes: "", DudasAlumnos: "", Calificaciones: "" }).then(response => {
        this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${arrG[i]}/Calificaciones/`).update({ bimestreReportado: 0 });
      });
    }
    return true;
  }

  //obtiene la informacion de un alumno dado su nombre
  getInfoStudent(name, email) {
    let student: Student;
    return this.database.database.ref(`Usuarios/Alumnos/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          if (value[val].nombre == name && value[val].correo == email) {
            student = new Student(value[val].nombre, value[val].grado, value[val].grupo, value[val].correo, value[val].estatus);
          }
        }
      }
      return student;
    });
  }

  //obtiene el grado y grupo de un alumno dado su nombre
  getGradeGroupStudent(name, email) {
    let student: string;
    return this.database.database.ref(`Usuarios/Alumnos/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          if (value[val].nombre == name && value[val].correo == email) {
            if (value[val].estatus == 1) {
              student = value[val].grado + "#" + value[val].grupo;
            }
          }
        }
      }
      return student;
    });
  }

  //obtiene las materias de cierto grado
  getSubjectsByGrade(data) {
    let arraySubject: Array<SubjectG> = [];

    return this.database.database.ref(`Clases/${data.grade}/Materias/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          let subj = new SubjectG(value[val].nombreMateria, data.grade, value[val].profesor, value[val].estatus);
          arraySubject.push(subj);
        }
      }
      return arraySubject;
    });
  }

  //obtiene el nombre de las materias de cierto grado
  getSubjectsNameByGrade(grado) {
    let arraySubjectName: Array<String> = [];

    return this.database.database.ref(`Clases/${grado}/Materias/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          arraySubjectName.push(value[val].nombreMateria);
        }
      }
      return arraySubjectName;
    });
  }

  //regresa las tareas por materia
  getHomeworksBySubject(data, subjectName) {
    let arrayHomeworks: Array<Homework> = [];

    return this.database.database.ref(`Clases/${data.grade}/Materias/${subjectName}/${data.group}/Tareas/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          let nHomework = new Homework(val, value[val].tema, value[val].descripcion, data.grade, data.group, value[val].diaLimite, value[val].horaLimite, value[val].estatus);
          arrayHomeworks.push(nHomework);
        }
      }
      return arrayHomeworks;
    });
  }

  //retorna los datos de una tarea
  getInfoHomeworkStudentSend(data){
    let infoHomework: String;
    return this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Tareas/${data.idHomework}/entregados/${data.nameStudent}`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        infoHomework = (value["estatusFeedback"]+"@"+value["feedbackComment"]+"@"+value["fechaRetroalimentacion"]+"@"+value["horaRetroalimentacion"]+"@"+value["estatus"]);
      }
      return infoHomework;
    });
  }

  //retorna los estatus de tareas
  getHomeworkStudentsStatus(data) {
    let arrayHomeworks: Array<String> = [];
    return this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Tareas/${data.idHomework}/entregados/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          arrayHomeworks.push(value[val].estatus + "@" + val + "@"+value[val].estatusFeedback+"@"+value[val].feedbackComment);
        }
      }
      return arrayHomeworks;
    });
  }

  //retorna los archivos de las tareas retroalimentadas
  getHomeworkStudentFeedback(data) {
    let arrayHomeworks: Array<String> = [];
    return this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Tareas/${data.idHomework}/entregados/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          arrayHomeworks.push(value[val].estatus + "@" + val + "@"+value[val].estatusFeedback+"@"+value[val].feedbackComment);
        }
      }
      return arrayHomeworks;
    });
  }

  //obtiene el comentario de retroalimentacion de cierto alumno en cierta tarea
  getFeedbackComment(data){
    var fComment:String = "";
    return this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Tareas/${data.homework}/entregados/${data.nameStudent}/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        fComment = value["feedbackComment"];
      }
      return fComment;
    });
  }



  //obtiene los estudiantes
  getStudentssByGradeGroup(data) {
    let arrayStudent: Array<Student> = [];

    return this.database.database.ref(`Usuarios/Alumnos/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          if (value[val].grado == data.grade && value[val].grupo == data.group) {
            let student = new Student(value[val].nombre, value[val].grado, value[val].grupo, value[val].correo, value[val].estatus);
            arrayStudent.push(student);
          }
        }
      }
      return arrayStudent;
    });
  }

  //asgina alumnos (y calificaciones) a una nueva materia
  setStudentsOnNewSubject(nameSubject, grade) {
    let arrayStudent: Array<Student> = [];

    return this.database.database.ref(`Usuarios/Alumnos/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          if (value[val].estatus == 1 && value[val].grupo != "" && value[val].grado == grade) {
            this.database.database.ref(`Clases/${value[val].grado}/Materias/${nameSubject}/${value[val].grupo}/Calificaciones/Estudiantes/${value[val].nombre}/`).update({ b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, nombreAlumno: value[val].nombre });
          }
        }
      }
      return arrayStudent;
    });
  }

  //obtiene los estudiantes sin grado y grupo
  getStudentsWithoutGradeGroup() {
    let arrayStudent: Array<Student> = [];

    return this.database.database.ref(`Usuarios/Alumnos/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          if (value[val].estatus == 1 && value[val].grupo == "" && value[val].grado == "") {
            console.log(value[val]);
            let student = new Student(value[val].nombre, "", "", value[val].correo, value[val].estatus);
            arrayStudent.push(student);
          }
        }
      }
      return arrayStudent;
    });
  }

  //remueve el grado y grupo de un estudiante
  deleteGradeGroupStudent(email) {
    this.database.database.ref(`Usuarios/Alumnos/${email}/`).update({ grado: "", grupo: "" });
  }

  //remueve las calificaciones de un alumno en cierta clase
  removeStudentScoreClass(data, subjects) {
    for (var i in subjects) {
      this.database.database.ref(`Clases/${data.grade}/Materias/Estudiantes/${subjects[i]}/${data.group}/Calificaciones/Estudiantes/${data.userName}`).remove();
    }
  }

  //modifica el estatus de una materia
  updateStatusSubject(row) {
    let n: number;
    row.status == true ? n = 1 : n = 0;
    this.database.database.ref(`Clases/${row.grade}/Materias/${row.name}/`).update({ estatus: n });
  }

  //modifica el estatus de un alumno o profesor
  updateStatusUser(data) {
    let n: number;
    var nameU = data.email.split("@");
    data.status == true ? n = 1 : n = 0;
    if (data.type == "Alumno") {
      this.database.database.ref(`Usuarios/Alumnos/${nameU[0]}/`).update({ estatus: n });
    } else if (data.type == "Profesor") {
      this.database.database.ref(`Usuarios/Profesores/${nameU[0]}/`).update({ estatus: n });
    }
  }

  //obtiene la lista de profesores dados de alta
  getProfessors() {
    let arrayProfes: Array<String> = [];
    return this.database.database.ref(`Usuarios/Profesores/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          if (value[val].estatus == 1) {
            arrayProfes.push(value[val].nombre);
          }
        }
      }
      return arrayProfes;
    });
  }

  //obtiene el nombre y correo de los profesores
  getEmailProfessors() {
    let arrayProfes: Array<String> = [];
    return this.database.database.ref(`Usuarios/Profesores/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          if (value[val].estatus == 1) {
            arrayProfes.push(value[val].correo + "#" + value[val].nombre + "#" + value[val].estatusRecepcion);
          }
        }
      }
      return arrayProfes;
    });
  }

  //obtiene los profesores que le dan clases en cierto grado y grupo
  getReceptionProfessorsGradeGroup(grado) {
    var arrayProfes: Array<String> = [];
    var nameProfes: Array<String> = [];
    var cad: string = "", cad2: string = "";
    return this.database.database.ref(`Clases/${grado}/Materias/`).once('value').then((res) => {
      const valu = res.val();
      if (valu !== null) {
        for (var clase in valu) {
          if (valu[clase].estatus == 1) {
            if (!cad2.includes(valu[clase].profesor)) {
              nameProfes.push(valu[clase].profesor);
              cad2 += valu[clase].profesor;
            }
          }
        }
        return nameProfes;
      }
    }).then(response => {
      return this.database.database.ref(`Usuarios/Profesores/`).once('value').then((snapshot) => {
        const value = snapshot.val();
        if (value !== null) {
          for (var profe in value) {
            var bTmp = false;
            for (let i = 0; i < response.length; i++) {
              if (value[profe].nombre == response[i]) {
                if (!cad.includes(value[profe].correo + "#" + value[profe].nombre)) {
                  arrayProfes.push(value[profe].correo + "#" + value[profe].nombre);
                  cad += value[profe].correo + "#" + value[profe].nombre;
                  bTmp = true;
                }
              }
            }
            if(!bTmp){
              if(value[profe].estatusRecepcion == 1){
                arrayProfes.push(value[profe].correo + "#" + value[profe].nombre);
              }
            }
          }
          return arrayProfes;
        }

      });
    });

  }

  //obtiene si en cierto grado da clases cierto profesor
  getGradesProfesor(nameProfesor, grade) {
    let band: Boolean;
    return this.database.database.ref(`Clases/${grade}/Materias/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          if (value[val].profesor == nameProfesor) {
            band = true;
            break;
          }
        }
      }
      return band;
    });
  }

  //obtenemos las materias que imparte un profesor en cierto grado
  getSubjectsByProfessorGrade(data) {
    let arraySubjects: Array<String> = [];
    return this.database.database.ref(`Clases/${data.grade}/Materias/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          if (value[val].profesor == data.professor) {
            arraySubjects.push(value[val].nombreMateria);
          }
        }
      }
      return arraySubjects;
    });
  }

  //obtiene las calificaciones de los alumnos inscritos en cierta clase:
  getScoresStudentsInLesson(data) {
    let arrayScores: Array<Scores> = [];
    return this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Calificaciones/Estudiantes/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          let score = new Scores(value[val].nombreAlumno, value[val].b1, value[val].b2, value[val].b3, value[val].b4, value[val].b5);
          arrayScores.push(score);
        }
      }
      return arrayScores;
    });
  }

  //obtiene las calificaciones un alumno en cierta clase:
  getScoresIndividualStudentInLesson(data) {
    let scores: Scores;
    return this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Calificaciones/Estudiantes/${data.name}`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        scores = new Scores(value.nombreAlumno, value.b1, value.b2, value.b3, value.b4, value.b5);
      }
      return scores;
    });
  }

  /**
   * Funcion para actualizar calificaciones
   */
  updateScore(data, usuario) {
    //return this.firestore.collection("usuarios/").snapshotChanges();
    this.database.database.ref(`Calificaciones/${data.nombreMateria}/${usuario}`).set({
      bi1: data.bi1, bi2: data.bi2, bi3: data.bi3, bi4: data.bi4
      , bi5: data.bi5, id: data.id, nombreMateria: data.nombreMateria, subject_id: data.subject_id, user_id: data.user_id
    });
    // this.database.database.ref(`Recordatorios/${id}`).set({delet:remin.delet,publication:remin.publication,reminder:remin.reminder});
  }

  //asigna hasta que punto (bimestre) se ha calificado cierta materia
  setbimReport(data) {
    this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Calificaciones/`).update({ bimestreReportado: data.bimR });
  }

  //obtiene hasta que punto (bimestre) se ha calificado cierta materia
  getbimReport(data) {
    let bimR: number = 1;
    return this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Calificaciones/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        bimR = value['bimestreReportado'];
      }
      return bimR;
    });
  }

  //asigna a cierto alumno su grado y grupo
  setGradeGroup(data) {
    var nameU = data.email.split("@");
    this.database.database.ref(`Usuarios/Alumnos/${nameU[0]}/`).update({ grado: data.grade, grupo: data.group });
  }

  //asigna inicialmente las calificaciones de un alumno a las clases en donde se esta inscrito
  setStudentScoreClass(data, subjects) {
    for (var i in subjects) {
      this.database.database.ref(`Clases/${data.grade}/Materias/${subjects[i]}/${data.group}/Calificaciones/Estudiantes/${data.username}`).set({ b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, nombreAlumno: data.username });
    }
  }

  //actualiza la calificacion de un estudiante
  refreshStudentScoreClass(data) {
    this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Calificaciones/Estudiantes/${data.nameStudent}/`).update({ b1: data.b1, b2: data.b2, b3: data.b3, b4: data.b4, b5: data.b5 }).then(response => {
      this.database.database.ref(`Usuarios/Alumnos/${data.email}/notificaciones/`).update({ calificaciones: 2 });
    });
  }

  //obtiene el email de cierto estudiante
  getEmailStudent(name) {
    let email: string;
    return this.database.database.ref(`Usuarios/Alumnos/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          if (value[val].nombre == name) {
            email = value[val].correo;
          }
        }
      }
      return email;
    });
  }

  addEventG(data, arr) {
    // for (let i = 0; i < arr.length; i++) {
    //   this.database.database.ref(`AvisosGenerales/${arr[i].grade}/${arr[i].group}/${data.title}`).set({titulo:data.title, fechaPub: data.datePub,fechaExp:data.dateExp, contenido: data.content});
    // }
    if (data.professor) {
      this.database.database.ref(`AvisosGenerales/${data.title}/`).set({ titulo: data.title, fechaPub: data.datePub, fechaExp: data.dateExp, contenido: data.content, status: 1, destinatarios: arr, profesores: 1 });
      this.database.database.ref(`Usuarios/Profesores/`).once('value').then((snapshot) => {
        const value = snapshot.val();
        if (value !== null) {
          for (var val in value) {
            this.database.database.ref(`Usuarios/Profesores/${value[val].correo.split("@")[0]}/notificaciones/`).update({ avisos: 2 });
          }
        }
      }).then(res => {
        this.database.database.ref(`Usuarios/Alumnos/`).once('value').then((snapshot) => {
          const value = snapshot.val();
          if (value !== null) {
            for (var val in value) {
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].grade == value[val].grado && arr[i].group == value[val].grupo) {
                  this.database.database.ref(`Usuarios/Alumnos/${value[val].correo.split("@")[0]}/notificaciones/`).update({ avisos: 2 });
                  // cad += value[val].correo.split("@")[0]+", ";
                }
              }
            }
          }
        })


      });
    } else {
      this.database.database.ref(`AvisosGenerales/${data.title}/`).set({ titulo: data.title, fechaPub: data.datePub, fechaExp: data.dateExp, contenido: data.content, status: 1, destinatarios: arr, profesores: 0 });
      this.database.database.ref(`Usuarios/Profesores/`).once('value').then((snapshot) => {
        const value = snapshot.val();
        if (value !== null) {
          for (var val in value) {
            this.database.database.ref(`Usuarios/Profesores/${value[val].correo.split("@")[0]}/notificaciones/`).update({ avisos: 2 });
          }
        }
      });
    }
  }

  getRemindersG() {
    let arrayReminders: Array<Reminder> = [];

    return this.database.database.ref(`AvisosGenerales/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value) {
          if (value[val].status == 1) {
            let rem = new Reminder(value[val].titulo, value[val].contenido, value[val].fechaPub, value[val].fechaExp, value[val].profesores, value[val].status);
            let arrayDest: Array<String> = [];
            for (var d in value[val].destinatarios) {
              arrayDest.push(value[val].destinatarios[d].grade + "° " + value[val].destinatarios[d].group);
            }
            rem.setDestinatarys(arrayDest);
            arrayReminders.push(rem);
          }
        }
      }
      return arrayReminders;
    });
  }


  /**
   * Función para guardar un usuario e firebase se hizo se probo pero actualmente los usuarios ya no se almacenan ahi
   * @param data objeto tipo usuario
   */
  //   addUser(data:User) {
  //   let id;
  //   return new Promise<any>((resolve, reject) =>{
  //       this.firestore
  //           .collection("Usuarios/")
  //           .add(data)
  //           .then(res => {
  //             // console.log(res.id)
  //             id=res.id;
  //           }, err => reject(err));

  //   });
  // }


  //funcion para añadir usuarios
  addUser(usuario: User): boolean {
    var nameU = usuario.email.split("@");
    if (usuario.type == 'Profesor') {
      this.database.database.ref(`Usuarios/Profesores/${nameU[0]}`).set({ keyG: usuario.username, nombre: usuario.username, alertaAnimo: "", correo: usuario.email, estatus: 0, clave: usuario.password, estatusRecepcion: 0, notificaciones: { avisos: 0, dudasAlumnos: 0, archivos: 0 } });
      return true;
    } else if (usuario.type == 'Alumno') {
      this.database.database.ref(`Usuarios/Alumnos/${nameU[0]}`).set({ nombre: usuario.username, grado: '', grupo: '', correo: usuario.email, estatus: 0, clave: usuario.password, estadosAnimo: "", notificaciones: { calificaciones: 0, examenes: 0, avisos: 0, materiales: 0, tareas: 0, recordatoriosClase: 0, archivos: 0 } });
      return true;
    }
  }

  //obtiene el estatus de recepcion
  getStatusReception(user) {
    var estatusRecepcion;
    return this.database.database.ref(`Usuarios/Profesores/${user}/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        estatusRecepcion = value["estatusRecepcion"];
      }
      return estatusRecepcion;
    });
  }

  //modifica el estatus de recepcion
  setStatusReception(user, status) {
    this.database.database.ref(`Usuarios/Profesores/${user}/`).update({ estatusRecepcion: status });
  }

  //modifica el estatus de la notificacion (estudiante) en el campo de calificaciones
  updateStatusNotification(nombre) {
    this.database.database.ref(`Usuarios/Alumnos/${nombre}/notificaciones/`).update({ calificaciones: 1 });
  }

  /**
   * Función para obtener los usuarios de firebase
   */
  getUsers() {
    return this.firestore.collection("usuarios/").snapshotChanges();
  }

  //verifica si un usuario existe o no
  userExists(email) {
    let band: Boolean = false;
    return this.database.database.ref(`Usuarios/`).once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        for (var val in value['Alumnos']) {
          if (val == email) {
            band = true;
            break;
          }
        }
        if (!band) {
          for (var val in value['Profesores']) {
            if (val == email) {
              band = true;
              break;
            }
          }
        }
      }
      return band;
    });
  }

  /**
   * Función para actualizar un usuario esta funcion esta en proceso
   * @param id id del usuario a actualizar
   * @param user usuario a actualizar
   */
  updateUser(id, user: User) {
    return this.firestore
      .collection("usuarios/")
      .doc(id)
      .set(
        { type: user.type },
        { merge: true });
  }

  viewExamens() {
    this.database.database.ref('Examenes/').once('value').then((snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        var t = "";
        for (var val in value) {
          t = t + value[val].clase;
        }
      }
    });
  }

  updateReminderActivated(title, status) {
    // this.firestore.collection("Recordatorios/id").doc(id).set({ delet: remin.delet },{ merge: true });
    this.database.database.ref(`AvisosGenerales/${title}`).update({ status: status });
  }

  //Tarea para subir y guardar el archivo
  public tareaCloudStorage(carpeta: string, nombreArchivo: string, datos: any) {
    return this.storage.upload(`${carpeta}/` + nombreArchivo, datos);
  }

  //METODO 2 PARA GUARDAR
  public guarda2(userEmailDestinity: string, userEmailOrigin: string, dateInfo: string, description: string, datos: any) {

    var metadata = {
      customMetadata: {
        'remitente': userEmailOrigin,
        'fecha': dateInfo,
        'description': description,
      }
    };

    this.database.database.ref(`Usuarios/Alumnos/${userEmailDestinity}/notificaciones/`).update({ archivos: 2 });

    return this.storage.ref("Files/").child(`${userEmailDestinity}/` + datos.name).put(datos, metadata);
  }

  //guarda el comentario de retroalimentacion del profesor a una tarea, usada regularmente cuando no se sube un archivo corregido o con observaciones y solo se dan las observaciones en texto plano
  public saveFeedbackCommentHomework(data, dateStr:string, hourStr:string ,feedbackComment: string){
    this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Tareas/${data.idHomework}/entregados/${data.nameStudent}/`).update({ estatusFeedback: 1, feedbackComment: feedbackComment, fechaRetroalimentacion:dateStr, horaRetroalimentacion: hourStr});
  }


  //para guardar la retroalimentacion de las tareas con o sin el archivo retroalimentado
  public saveFeedbackHomework(data, dateStr:string, hourStr:string, feedbackComment: string, datos: any){
    if(feedbackComment!="" || feedbackComment!= null){
      this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Tareas/${data.idHomework}/entregados/${data.nameStudent}/`).update({ estatusFeedback: 1, feedbackComment: feedbackComment, fechaRetroalimentacion:dateStr, horaRetroalimentacion: hourStr});
    }
    var metadata = {
      customMetadata: {
        'alumno': data.nameStudent,
        'fecha': dateStr+"T"+hourStr,
      }
    };
    return this.storage.ref(`Tareas/${data.subject}/${data.grade}/${data.group}/`).child(`${data.idHomework}/Retroalimentados/` + data.title).put(datos, metadata);
  }


  //para guardar la tarea datos y archivo en la nube
  public saveHomework(data, dateInfo: string, description: string, datos: any) {

    return this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Tareas/${data.idHomework}/`).once('value').then((snapshot) => {
      var band = true;
      const value = snapshot.val();
      if (value !== null) {
        var tiempoAct = new Date();
        var dAct = value["diaLimite"].split("-");
        var hAct = value["horaLimite"].split(":");

        if (parseInt(dAct[0]) < tiempoAct.getFullYear()) {
          band = false;
        } else if (parseInt(dAct[0]) == tiempoAct.getFullYear() && parseInt(dAct[1]) < tiempoAct.getMonth() + 1) {
          band = false;
        } else if (parseInt(dAct[0]) == tiempoAct.getFullYear() && parseInt(dAct[1]) == (tiempoAct.getMonth() + 1) && parseInt(dAct[2]) < tiempoAct.getDate()) {
          band = false;
        } else if (parseInt(dAct[0]) == tiempoAct.getFullYear() && parseInt(dAct[1]) == (tiempoAct.getMonth() + 1) && parseInt(dAct[2]) == tiempoAct.getDate()) {
          if (parseInt(hAct[0]) < tiempoAct.getUTCHours() - 5) {
            band = false;
          } else if (parseInt(hAct[0]) == tiempoAct.getUTCHours() - 5 && parseInt(hAct[1]) < tiempoAct.getMinutes()) {
            band = false;
          } else if (parseInt(hAct[0]) == tiempoAct.getUTCHours() - 5 && parseInt(hAct[1]) == tiempoAct.getMinutes() && parseInt(hAct[2]) < tiempoAct.getSeconds()) {
            band = false;
          } else if (parseInt(hAct[0]) == tiempoAct.getUTCHours() - 5 && parseInt(hAct[1]) == tiempoAct.getMinutes() && parseInt(hAct[2]) == tiempoAct.getSeconds()) {
            band = false;
          }
        }
        return band;
      }
    }).then(response => {
      if (response) {
        //status no entregado (0), entregado a tiempo (1), entregado fuera de tiempo (2)
        this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Tareas/${data.idHomework}/entregados/${data.nameStudent}/`).update({ estatus: 1 });
        this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Tareas/${data.idHomework}/`).update({ estatus: 0 });
      } else {
        this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Tareas/${data.idHomework}/entregados/${data.nameStudent}/`).update({ estatus: 2 });
        this.database.database.ref(`Clases/${data.grade}/Materias/${data.subject}/${data.group}/Tareas/${data.idHomework}/`).update({ estatus: 0 });
      }
      var metadata = {
        customMetadata: {
          'alumno': data.userEmail,
          'fecha': dateInfo,
          'description': description,
        }
      };
      return this.storage.ref(`Tareas/${data.subject}/${data.grade}/${data.group}/`).child(`${data.idHomework}/` + data.title).put(datos, metadata);
    });
  }

  //METODO 2 PARA LISTAR
  public referenciaCloudStorageList2(userEmail: string) {
    this.database.database.ref(`Usuarios/Alumnos/${userEmail}/notificaciones/`).update({ archivos: 1 });
    return this.storage.storage.ref(`Files/${userEmail}/`).listAll();
  }


  //lista lo contenido en la tarea de ciertos alumnos
  public listHomeworkFileStudents(data) {
    return this.storage.storage.ref(`Tareas/${data.subject}/${data.grade}/${data.group}/${data.idHomework}/`).listAll();
  }

  //obtiene metadatos de una tarea entregada de determinado alumno
  public listDataHomeworkFileStudent(data){
    return this.storage.storage.ref(`Tareas/${data.subject}/${data.grade}/${data.group}/${data.idHomework}/${data.title}/`).getMetadata();
  }

  //obtiene el link de una tarea entregada de determinado alumno
  public listLinkHomeworkFileStudent(data){
    return this.storage.storage.ref(`Tareas/${data.subject}/${data.grade}/${data.group}/${data.idHomework}/${data.title}/`).getDownloadURL();
  }

  //lista lo contenido en la tarea de cierto alumno
  public listHomeworkFileFeedbackStudents(data) {
      return this.storage.storage.ref(`Tareas/${data.subject}/${data.grade}/${data.group}/${data.idHomework}/Retroalimentados/${data.title}/`).getDownloadURL()
  }


  /////
  /////
  /////


  //Referencia del archivo
  public referenciaCloudStorage(carpeta: string, nombreArchivo: string) {
    return this.storage.ref(`${carpeta}/` + nombreArchivo);
  }


  public referenciaCloudStorageList(carpeta: string) {
    //return this.storage.ref(`${carpeta}/`);
    return this.storage.storage.ref(`${carpeta}/`).listAll();
  }



}
