import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseRouteReuseStrategy, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


const baseUrl = `${environment.apiUrl}/help-center`;

@Injectable({
  providedIn: 'root'
})

export class HelpCenterService {
  private userSubject!: BehaviorSubject<User>;
  public user!: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  getAll(){
    return this.http.get(baseUrl);
  }

  sendEmail(contactForm:any){
    return this.http.post(`${baseUrl}/contact-support`, contactForm);
  }

  createFaq(data:any){
    for (let key of Object.keys(data)){
      console.log(data[key]);
    }    
    return this.http.post(`${baseUrl}`, data);
  }

  updateFaq(id:any, data: any){
    const formData = new FormData();
    for (let key of Object.keys(data)){
      formData.append(key, data[key]);
    }
    return this.http.put(`${baseUrl}/${id}`, formData);
  }

  deleteFaq(id:any){
    return this.http.patch(`${baseUrl}/${id}`,'');
  }
}
