import Api from "./Api";
import { Service } from "./Service";

export class ConsultantService extends Service{
constructor(){
    super(Api,'consultant');
}
}