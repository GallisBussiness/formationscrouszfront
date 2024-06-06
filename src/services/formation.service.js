import Api from "./Api";
import { Service } from "./Service";

export class FormationService extends Service{
constructor(){
    super(Api,'formations');
}
}