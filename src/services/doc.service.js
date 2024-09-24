import Api from "./Api";
import { Service } from "./Service";

export class DocService extends Service{
constructor(){
    super(Api,'docs');
}

async byFormation(id) {
    return this.api.get(`/${this.ressource}/byformation/${id}`).then(res => res.data);
  }

}