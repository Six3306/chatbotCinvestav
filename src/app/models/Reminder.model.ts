export class Reminder{

    constructor(public title:string, public contentReminder:string, public datePublication:string, public dateExpiration:string, public professors:number, public status:number, public destinatary?:Array<String>){

    }

    setDestinatarys(arr:Array<String>){
        this.destinatary = arr;
    }
}