import { FeelingIStudent } from './FeelingIStudent.model';
/**
 * Clase FeelingStudent la cual modela el sentimiento de un estudiante de la aplicación
 * 
 */
 export class FeelingStudent{
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
        public feelings:any
      ){
  
      }
    } 