import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KnowledgeBaseNode } from 'src/app/models/knowledge-base-node';
import { KnowledgeBaseNodeTypes } from 'src/app/models/knowledge-base-node-types';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.apiUrl}/knowledgeBase`;
// const baseUrl = `assets/json/knowledge_base_data.json`;

@Injectable({
  providedIn: 'root'
})
export class KnowledgeBaseService {


  constructor(private http: HttpClient) { }
  getData(){
    return this.http.get(baseUrl);
  }

  createEntry(parents: KnowledgeBaseNodeTypes,data:any){
    return this.http.post(`${baseUrl}/${parents.DeviceFieldUse}/${parents.DeviceType}/${parents.DeviceBrand}/${parents.Device}`, data);
  }

  updateEntry(parents: KnowledgeBaseNodeTypes,data:any){
    return this.http.post(`${baseUrl}/${parents.DeviceFieldUse}/${parents.DeviceType}/${parents.DeviceBrand}/${parents.Device}`, data);
  }

  getFile(filepath: string){
    return this.http.get(`${baseUrl}?filepath=${filepath}`, {responseType: 'arraybuffer'});
  }

  deleteNode(id: string){
    return this.http.delete(`${baseUrl}/${id}`)
  }
}
