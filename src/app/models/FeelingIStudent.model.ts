
        /**
 * Clase FeelingIStudent la cual modela el sentimiento en particular de un estudiante de la aplicación
 * 
 */
 export class FeelingIStudent{
    /**
     * @param username es el nombre del usuario
     * @param grade es el grado del usuario
     * @param group es el grupo del usuario 
     * @param email es el correo del usuario
     * @param activated es el status del usuario
     */
     
      constructor (
        public status:number,
        public date: String,
        public hour: String,
        public feeling: String,
        public advicesw:any
      ){
  
      }
    } 