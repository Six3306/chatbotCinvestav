/**
 * Clase usuario la cual modela al usuario de la aplicación
 * 
 */
 export class Student{
    /**
     * @param username es el nombre del usuario
     * @param grade es el grado del usuario
     * @param group es el grupo del usuario 
     * @param email es el correo del usuario
     * @param activated es el status del usuario
     */
     
      constructor (
        public username:String,
        public grade:String,
        public group:String, 
        public email:String,
        public activated: Number
      ){
  
      }
    } 