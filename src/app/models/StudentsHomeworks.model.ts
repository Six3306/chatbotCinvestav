export class StudentHomeworks {
    /**
     * Constructor para un archivo
     * @param clase clase a la que pertenece el archivo
     * @param grado grado al que pertenece el archivo 
     * @param grupo grupo al que pertenece el archivo
     * @param definicion definicion del archivo
     * @param url la url del archivo
     */
      constructor(public nameFile: String, public nameStudent: String, public timeSend:String, public description:String, public url: String, public status:String, public statusFeedback:String, public feedbackComment: String) {}

      setNameFile(nF:string){
          this.nameFile = nF;
      }

      setNameStudent(nS:string){
          this.nameStudent = nS;
      }

      setTimeSend(tS: string){
          this.timeSend = tS;
      }

      setDescription(d:string){
          this.description = d;
      }

      setUrl(u:string){
          this.url = u;
      }

      setStatus(s:string){
          this.status = s;
      }

      setStatusFeedback(sF:string){
          this.statusFeedback =  sF;
      }

      setFeedbackComment(fC:string){
          this.feedbackComment = fC;
      }

    }
    