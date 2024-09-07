import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const rutas:Routes =[
    {path:'', children:[
        {path:'login',component:LoginComponent},
        {path:'register',component:RegisterComponent},
        {path: 'forgot-password', component:ForgotPasswordComponent},
        {path: 'reset-password', component:ResetPasswordComponent},
        {path: 'verify-email', component:VerifyEmailComponent},
        {path:'**', redirectTo:'login',pathMatch:'full'}, 
  ]},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(rutas),
  ],
  exports:[RouterModule
  ],
})
export class AuthRoutingModule { }