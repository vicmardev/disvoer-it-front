import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthModule} from './auth/auth.module';
import {ErrorModule} from './error/error.module';
import {NotFoundComponent} from './error/not-found/not-found.component';
import {PagesModule} from './pages/pages.module';
import {AuthGuard} from './helpers';
import {AlertsModule} from './alerts/alerts.module';
import {HomeModule} from './modules/home/home.module';

const rutas: Routes = [
	{
		path: 'dash',
		loadChildren: () => import('./pages/pages.module').then(m => PagesModule),
		canActivate: [AuthGuard],
	},
	{path: 'login', loadChildren: () => import('./auth/auth.module').then(m => AuthModule)},
	{
		path: 'account',
		loadChildren: () => import('./auth/auth.module').then(m => AuthModule),
	},
	{
		path: 'error',
		loadChildren: () => import('./error/error.module').then(m => ErrorModule),
	},
	{
		path: 'alerts',
		loadChildren: () => import('./alerts/alerts.module').then(m => AlertsModule),
	},

	// {path:'dash', loadChildren:()=>import('./pages/pages.module').then(m=>PagesModule)},
	{path: '', redirectTo: 'dash', pathMatch: 'full'},
	{path: '**', redirectTo: 'error'},
];
@NgModule({
	declarations: [],
	imports: [CommonModule, RouterModule.forRoot(rutas)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
