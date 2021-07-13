export class Doubt{

    constructor(public id, public student:string, public email:string, public doubt:string, public status:number, public date:string, public hour:string, public recommendedMaterial?:Array<String>){

    }

    setRecommendedMaterial(arr:Array<String>){
        this.recommendedMaterial = arr;
    }
}