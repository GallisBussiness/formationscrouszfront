export class Service {
  constructor(api,ressource){
    this.api = api;
    this.ressource  = ressource;
  }

  async create(data) {
    return this.api.post(`/${this.ressource}`, data).then(res => res.data);
  }
  async getAll() {
    return this.api.get(`/${this.ressource}`).then(res => res.data);
  }

  async getOne(id) {  
    return this.api.get(`/${this.ressource}/${id}`).then(res => res.data);
  }
  async update(id , data ) {
    return this.api.patch(`/${this.ressource}/${id}`,data).then(res => res.data);
  }

  async delete(id) {
   return  this.api.delete(`/${this.ressource}/${id}`).then(res => res.data);
  }
}