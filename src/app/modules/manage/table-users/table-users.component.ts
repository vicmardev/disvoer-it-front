import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {first} from 'rxjs/operators';
import {User} from 'src/app/models/User';
import {AccountService} from 'src/app/services/account/account.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {environment} from 'src/environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AddContractsComponent} from './dialogs/add-contracts/add-contracts.component';
import {ImageProfileComponent} from './dialogs/image-profile/image-profile.component';
import {DeleteUserComponent} from './dialogs/delete-user/delete-user.component';

@Component({
	selector: 'app-table-users',
	templateUrl: './table-users.component.html',
	styleUrls: ['./table-users.component.scss'],
})
export class TableUsersComponent implements OnInit {
	displayedColumns: string[] = [
		'avatar',
		'firstName',
		'statusLogin',
		'email',
		'contrato',
		'role',
		'id',
	];
	avatarUrl = `${environment.ticketImgUrl}/`;
	users!: User[];
	filteredUsers!: User[];
	usersTarjetas: any;

	contracts!: number;

	//flags
	cards: boolean = true;
	list: boolean = false;

	public userList = new MatTableDataSource<User>();
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	/* dialog: any; */

	constructor(
		private accountService: AccountService,
		public dialog: MatDialog,
		private _snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.getAllUsers();
	}

	getAllUsers() {
		this.accountService
			.getAll()
			.pipe(first())
			.subscribe(users => {
				this.users = users;
				this.filteredUsers = users;
				this.userList.data = users;
				console.log(this.userList.data);
			});
	}

	ngAfterViewInit(): void {
		setTimeout(() => (this.userList.paginator = this.paginator));
	}

	deleteUser(id: string) {
		const user = this.users.find(x => x.id === id);
		if (user) {
			user.isDeleting = true;
			this.accountService
				.delete(id)
				.pipe(first())
				.subscribe(() => {
					this.users = this.users.filter(x => x.id !== id);
					this.userList.data = this.users;
				});
		}
	}

	openDialog(id: string) {
		const user = this.users.find(x => x.id === id);
		if (user) {
			user.isDeleting = true;
			const dialogRef = this.dialog.open(DeleteUserComponent, {
				data: {id: user.id},
			});
			dialogRef.afterClosed().subscribe(result => {
				this.getAllUsers();
			});
		}
	}
	openContracts(user: any) {
		const dialog = this.dialog.open(AddContractsComponent, {
			data: user,
		});
	}

	filtrar(event: Event) {
		const filtro = (event.target as HTMLInputElement).value;
		this.userList.filter = filtro.trim().toLowerCase();
		/*   (filtro === '' ||  filtro.length === 1) ? '':
     this._snackBar.open(`Existen ${this.userList.filteredData.length} registros.`, '', {
     duration: 1500,
      panelClass: ['background-snack-info'],
    });
  } */
	}

	filtrarTarjetas(event: Event) {
		console.log(this.users);
		let filtro = (event.target as HTMLInputElement).value;
		if (filtro === '' || filtro.length === 0) {
			this.filteredUsers = this.users;
			return;
		}

		filtro = filtro.trim().toLowerCase();
		this.filteredUsers = this.users.filter((user: any) => {
			let userString = '';
			//key is an attribute of user, ej.: firstName, lastName, role, etc.
			//join all of user attributes into one string
			for (let key of Object.keys(user)) {
				userString += user[key].toString().trim().toLowerCase();
			}
			//see if filter is found in one of the user attributes
			return userString.includes(filtro);
		});

		filtro === '' || filtro.length === 0
			? ''
			: this.goodSnack(`Existen ${this.filteredUsers.length} registros.`);
	}

	dialogShowProfilePic(user: User) {
		const dialogRef = this.dialog.open(ImageProfileComponent, {
			data: user,
			/* width: '70%',
			height: '70%',
			autoFocus: 'false', */
			/* maxHeight: '90vh', */
			maxHeight: '70%',
			maxWidth: '70%',
		});
		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}

	goodSnack(msg: any) {
		this._snackBar.open(msg, '', {
			duration: 3500,
			panelClass: ['background-snack-info'],
		});
	}

	tabChange(valor: number) {
		console.log('valor', valor);
		switch (valor) {
			case 1:
				this.cards = true;
				this.list = false;
				break;
			case 2:
				this.cards = false;
				this.list = true;
				break;
			default:
				break;
		}
	}
}
