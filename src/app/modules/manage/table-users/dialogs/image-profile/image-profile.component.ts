import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {environment} from 'src/environments/environment';

@Component({
	selector: 'app-image-profile',
	templateUrl: './image-profile.component.html',
	styleUrls: ['./image-profile.component.scss'],
})
export class ImageProfileComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public user: any) {}
	avatarUrl = `${environment.ticketImgUrl}/`;

	ngOnInit(): void {
		console.log(this.user);
	}
}
