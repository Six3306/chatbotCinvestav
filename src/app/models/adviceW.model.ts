
        /**
 * Clase la cual modela un consejo de un profesor en particular de un estudiante de la aplicación, mismo estudiante que ha presentado 
 * sentimientos peligrosos
 * 
 * 
 */
         export class AdviceW{
            /**
             * @param username es el nombre del usuario
             * @param grade es el grado del usuario
             * @param group es el grupo del usuario 
             * @param email es el correo del usuario
             * @param activated es el status del usuario
             */
             
              constructor (
                public date: String,
                public hour: String,
                public advice: String,
                public nameProfesor: String,
                public emailProfesor: String
              ){
          
              }
            } 