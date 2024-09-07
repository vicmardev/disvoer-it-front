import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { MustMatch } from 'src/app/helpers';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePasswordComponent } from '../dialogs/update-password/update-password.component';
import { MatSnackBar } from '@angular/material/snack-bar';

enum TokenStatus {
  Validating,
  Valid,
  Invalid,
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  TokenStatus = TokenStatus;
  tokenStatus = TokenStatus.Validating;
  token = '';
  resetForm!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  hide: boolean = true;
  hideConfirm: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService //alert service here
  ) {}

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: MustMatch('password', 'confirmPassword'),
      }
    );

    const token = this.route.snapshot.queryParams['token'];

    //remove token from route
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

    this.authService
      .validateResetToken(token)
      .pipe(first())
      .subscribe({
        next: () => {
          this.token = token;
          this.tokenStatus = TokenStatus.Valid;
        },
        error: () => {
          this.tokenStatus = TokenStatus.Invalid;
        },
      });
  }

  get form() {
    return this.resetForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    //reset alerts here

    //stop if invalid
    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService
      .resetPassword(
        this.token,
        this.form.password.value,
        this.form.confirmPassword.value
      )
      .pipe(first())
      .subscribe({
        next: () => {
          this.openDialogSuccess();
          this.router.navigate(['.../login'], { relativeTo: this.route });
        },
        error: (error) => {
          this.errorSnack(error);
          this.loading = false;
        },
      });
  }

  openDialogSuccess() {
    const dialogRef = this.dialog.open(UpdatePasswordComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      maxHeight: '90vh',
      data: {
      }
    });

  }

  errorSnack(error: any){
    this._snackBar.open(`Error: ${error}`, '', {
      duration: 3500,
      verticalPosition: 'top',
      /* horizontalPosition: 'center', */
      panelClass:['background-snack-red']
    });

  }
}

//helper function to see of passwords match
