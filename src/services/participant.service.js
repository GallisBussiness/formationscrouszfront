import Api from "./Api";
import { Service } from "./Service";

export class ParticipantService extends Service{
constructor(){
    super(Api,'participant');
}
}