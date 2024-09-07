import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { first } from 'rxjs/operators';
import { MustMatch } from 'src/app/helpers';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  returnUrl: string = '';
  hide: boolean = true;
  hideConfirm: boolean = true;
  loggedIn: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) {
    if (this.loggedIn) {
      this.router.navigate(['/']);
    }
    this.registerForm = this.formBuilder.group({

    });
  }


  ngOnInit(): void {

    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [ Validators.required, Validators.email ]],
      password: [''],
      contrato: [[''], Validators.required],
      confirmPassword: [''],
      acceptTerms: [true]
    },
    {
      validators: MustMatch('password', 'confirmPassword'),
    });


    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  get form() { return this.registerForm.controls}

  onSubmit() {
    this.submitted = true;

    //reset alerts if any

    //stop if form is invalid
    if (this.registerForm.invalid){
      this.errorSnack("formulario vacio", "");

      return;
    }

    this.loading = true;
    this.form.password.setValue(this.form.contrato.value+String(this.getRandomInt(99999)))
    this.form.confirmPassword.setValue(this.form.password.value)

    //this is where we consume authService
    this.authService.register(this.registerForm.value).pipe(first())
    .subscribe({
      next:()=>{
        /* alertar que se mando correo */
        this.registerSuccessSnack(this.registerForm.value.email);
        this.router.navigate(['.../login'], {relativeTo: this.route});
      },
      error: error=>{
        this.errorSnack("error en campos del formulario", error);
        this.loading = false;
      }
    })
    if (!this.loading){
      this.router.navigate(['/']);
    }
  }

  registerSuccessSnack(email: any){
    this._snackBar.open(`${email} registrado con exito. Por favor espera la autorización del administrador`, '', {
      duration: 3500,
      verticalPosition: 'top',
      /* horizontalPosition: 'center', */
      panelClass:['background-snack']
    });

  }

  errorSnack(txt:any, err: any){
    this._snackBar.open(`Error: ${txt}`, '', {
      duration: 3500,
      verticalPosition: 'top',
      /* horizontalPosition: 'center', */
      panelClass:['background-snack-red']
    });
  }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
}
