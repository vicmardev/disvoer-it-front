import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.apiUrl}/graphics`;

@Injectable({
  providedIn: 'root'
})
export class GraphicService {

  constructor( 
    private router: Router,
    private http: HttpClient,
    private authService: AuthService) {}

getCountTicket(){
      return this.http.get(`${baseUrl}`);
    }

getListEquipment(){
    return  this.http.get(`${baseUrl}/equipment`);
  }

getCountContract(){
    return  this.http.get(`${baseUrl}/contract`)
}

getCountUsersPerContract(){
  return  this.http.get(`${baseUrl}/contract/users`)
}

getAllField(field:string){
  return  this.http.get(`${baseUrl}/fields/${field}`)
}

getAllFieldUser(field:string){
  return  this.http.get(`${baseUrl}/user/${field}`)

}

getAllFieldTicket(field:string){
  return  this.http.get(`${baseUrl}/tickets/${field}`);

}
getEquipmnetCount(){
  return this.http.get(`${baseUrl}/brandGraphic`)
}

getTicketsPerDay(){
  return this.http.get(`${baseUrl}/tickets`)
}
}

