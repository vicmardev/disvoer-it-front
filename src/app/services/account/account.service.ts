import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/User';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.apiUrl}/accounts`;

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  getUserById(arg0: number) {
    throw new Error('Method not implemented.');
  }
  private userSubject!: BehaviorSubject<User>;
  public user!: Observable<User>;
  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  public get userValue(): User {
    return this.authService.currentUserValue;
  }

  getAll() {
    return this.http.get<User[]>(baseUrl);
  }

  getById(id: string) {
    return this.http.get<User>(`${baseUrl}/${id}`);
  }

  create(params: any) {
    return this.http.post(baseUrl, params);
  }

  update(id: any, data: any) {
    const formData = new FormData();
    for ( let key of Object.keys( data)) {

      formData.append(key, data[key]);
    }

    return this.http.put(`${baseUrl}/${id}`, formData).pipe(
      map((user: any) => {
        // update the current user if it was updated
        if (user.id === this.userValue.id) {
          // publish updated user to subscribers
          user = { ...this.userValue, ...user };

          this.authService.currentUserSubject.next(user);
          localStorage.removeItem('currentUser');
          localStorage.setItem('currentUser', JSON.stringify(user));

        }
        return user;
      })
    );
  }
  updateListContract(email:string,data:any){
    const  formData = new  FormData();
    formData.append('data',data);
    return this.http.put(`${baseUrl}/listContrats/${email}`, formData);
  }

  delete(id: string) {
    return this.http.delete(`${baseUrl}/${id}`).pipe(
      finalize(() => {
        // auto logout if the logged in user was deleted
        if (id === this.userValue.id) this.authService.logout();
      })
    );
  }

  deleteContractUser(email:string, contract:any){


    return  this.http.delete(`${baseUrl}/itemList/${email}/${contract}`);

  }
}
