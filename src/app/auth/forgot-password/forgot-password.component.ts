import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;
  loading:boolean = false;
  submitted:boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {
   }

  ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      contract: ['', Validators.required]
    });

  }

  get form() { return this.forgotForm.controls}

  onSubmit() {
    this.submitted = true;

    //reset alerts if any

    //stop if forgotForm is invalid
    if (this.forgotForm.invalid){
      return;
    }

    this.loading = true;

    //this is where we consume authService

    this.authService.forgotPassword(this.form.email.value)
      .pipe(first())
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        //implement alert service
        next: () => {
          this.successSnack();
          this.router.navigateByUrl('login/login');
        },
        // error: error => console.log(error);
      });

  }

  successSnack(){
    this._snackBar.open(`Verificación enviada al correo ${this.form.email.value}`, '', {
      duration: 3500,
      verticalPosition: 'top',
      /* horizontalPosition: 'center', */
      panelClass:['background-snack']
    });

  }

}
