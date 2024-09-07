import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../auth.service';

enum EmailStatus {
  Verifying,
  Failed
}

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  EmailStatus = EmailStatus;
  emailStatus = EmailStatus.Verifying;
  name!: string;
  contrato!: string;
  email!: string;
  token!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) { }


  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    this.email = this.route.snapshot.queryParams['email'];
    this.name = this.route.snapshot.queryParams['name'];
    this.contrato = this.route.snapshot.queryParams['contrato'];
    

    // this.router.navigate([], {relativeTo: this.route, replaceUrl: true});

    // this.verifyUser(token, email);
    
  }

  verifyUser(){
    
    this.authService.verifyEmail(this.token, this.email).pipe(first())
    .subscribe({
      next: () => {
        this.successSnack();
        this.router.navigate(['../login'], {relativeTo: this.route});
      },
      error: () => {
        this.errorSnack();
        this.emailStatus = EmailStatus.Failed;
      }
    });
  }
  

  successSnack(){
    this._snackBar.open(`Usuario verificado exitosamente`, '', {
      duration: 3500,
      verticalPosition: 'top',
      /* horizontalPosition: 'center', */
      panelClass:['background-snack']
    });

  }

  errorSnack(){
    this._snackBar.open(`Usuario ya registrado`, '', {
      duration: 3500,
      verticalPosition: 'top',
      /* horizontalPosition: 'center', */
      panelClass:['background-snack-red']
    });
  }
}
