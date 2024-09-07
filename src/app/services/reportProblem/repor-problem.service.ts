import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseRouteReuseStrategy, Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

const baseUrl = `${environment.apiUrl}/report-problem`;


@Injectable({
  providedIn: 'root'
})
export class ReporProblemService {
  private userSubject!: BehaviorSubject<User>;
  private user!: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService:AuthService
  ) { }

  sendEmail(reportForm: any){
    console.log("Si esta llegando al servicio del Front", `${baseUrl}`);
    
    return this.http.post(`${baseUrl}`, reportForm);
  }
}
