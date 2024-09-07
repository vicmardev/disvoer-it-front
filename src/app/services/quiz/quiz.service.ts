import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseRouteReuseStrategy, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.apiUrl}/customerQuiz`;

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
  ) { }


  getQuiz() {
    return this.http.get(baseUrl);
  }

  createQuiz(data: any) {
    for(let key of Object.keys(data)){
      console.log(data[key]);
    }
    console.log(data);
    
    return this.http.post(`${baseUrl}`, data);
  }
}
