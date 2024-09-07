import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';


const routes:Routes =[
  {path:'', children:[
      {path:'',component:NotFoundComponent},
     /*  {path:'**', redirectTo:'login',pathMatch:'full'},  */
]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
