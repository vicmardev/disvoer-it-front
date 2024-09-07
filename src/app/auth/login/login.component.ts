import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {first} from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading:boolean = false;
  submitted:boolean = false;
  returnUrl: string = '';
  hide:boolean = true;
  /*
  * value only used for testing login without 
  * auth service implemented
  */
  loggedIn: boolean = false;
  icoContra = 'assets/constrasena-ico.png';
  icoCorreo = 'assets/correo-ico.png'

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) {
    // if (this.loggedIn){
    //   this.router.navigate(['/']);
    // }
   }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }

  get form() { return this.loginForm.controls}

  onSubmit() {
    this.submitted = true;

    //reset alerts if any

    //stop if form is invalid
    if (this.loginForm.invalid){
      return;
    }

    this.loading = true;

    //this is where we consume authService
    this.authService.login(this.form.email.value, this.form.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
          //get url from query parameters
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dash';
          this.router.navigateByUrl(returnUrl);
        },
        error: error =>{
          this.errorSnack(error);
          this.loading = false;
          
        }
      })
  }

  errorSnack(txt:any){
    this._snackBar.open(`Error: ${txt}`, '', {
      duration: 3500,
      verticalPosition: 'top',
      /* horizontalPosition: 'center', */
      panelClass:['background-snack-red']
    });
  }

}
