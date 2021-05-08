/**
 * Clase usuario la cual modela al usuario de la aplicación
 * 
 */
 export class Homework{
    /**
     * @param theme es el nombre del tema de la tarea
     * @param description es la descripcion de la tarea
     * @param grade es el grado del usuario
     * @param group es el grupo del usuario 
     * @param dayLimit es el día limite para entregar la tarea
     * @param hourLimit es la hora limite para entregar la tarea
     * @param activated es el status de la tarea
     */
     
      constructor (
        public id: String,
        public theme:String,
        public description: String,
        public grade:String,
        public group:String, 
        public dayLimit:String,
        public hourLimit:String,
        public activated: Number
      ){
  
      }
    } 