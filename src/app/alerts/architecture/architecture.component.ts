import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'app-architecture',
	templateUrl: './architecture.component.html',
	styleUrls: ['./architecture.component.scss'],
})
export class ArchitectureComponent implements OnInit {
	direction = true;

	directionMode(otro: boolean) {
		otro == true ? (this.direction = false) : (this.direction = true);
		console.log('this.direction', this.direction);
	}
	nodes: any = [
		{
			name: 'Sundar Pichai',
			cssClass: 'ngx-org-ceo',
			image: 'assets/img_architecture/switch.svg',
			title: 'Chief Executive Officer',
			childs: [
				{
					name: 'Thomas Kurian',
					cssClass: 'ngx-org-ceo',
					image: 'assets/img_architecture/server.svg',
					title: 'CEO, Google Cloud',
				},
				{
					name: 'Susan Wojcicki',
					cssClass: 'ngx-org-ceo',
					image: 'assets/img_architecture/switch.svg',
					title: 'CEO, YouTube',
					childs: [
						{
							name: 'Beau Avril',
							cssClass: 'ngx-org-head',
							image: 'assets/img_architecture/switch.svg',
							title: 'Global Head of Business Operations',
							childs: [
								{
									name: 'Thomas Kurian',
									cssClass: 'ngx-org-ceo',
									image: 'assets/img_architecture/switch.svg',
									title: 'CEO, Google Cloud',
								},
							],
						},
						{
							name: 'Tara Walpert Levy',
							cssClass: 'ngx-org-vp',
							image: 'assets/img_architecture/switch.svg',
							title: 'VP, Agency and Brand Solutions',
							childs: [],
						},
						{
							name: 'Ariel Bardin',
							cssClass: 'ngx-org-vp',
							image: 'assets/img_architecture/switch.svg',
							title: 'VP, Product Management',
							childs: [],
						},
					],
				},
				{
					name: 'Jeff Dean',
					cssClass: 'ngx-org-head',
					image: 'assets/img_architecture/switch.svg',
					title: 'Head of Artificial Intelligence',
					childs: [
						{
							name: 'David Feinberg',
							cssClass: 'ngx-org-ceo',
							image: 'assets/img_architecture/switch.svg',
							title: 'CEO, Google Health',
							childs: [],
						},
					],
				},
			],
		},
		{
			name: 'Sundar Pichai',
			cssClass: 'ngx-org-ceo',
			image: 'assets/img_architecture/switch.svg',
			title: 'Chief Executive Officer',
			childs: [
				{
					name: 'Thomas Kurian',
					cssClass: 'ngx-org-ceo',
					image: 'assets/img_architecture/switch.svg',
					title: 'CEO, Google Cloud',
				},
				{
					name: 'Susan Wojcicki',
					cssClass: 'ngx-org-ceo',
					image: 'assets/img_architecture/switch.svg',
					title: 'CEO, YouTube',
					childs: [
						{
							name: 'Beau Avril',
							cssClass: 'ngx-org-head',
							image: 'assets/img_architecture/switch.svg',
							title: 'Global Head of Business Operations',
							childs: [],
						},
						{
							name: 'Tara Walpert Levy',
							cssClass: 'ngx-org-vp',
							image: 'assets/img_architecture/switch.svg',
							title: 'VP, Agency and Brand Solutions',
							childs: [],
						},
						{
							name: 'Ariel Bardin',
							cssClass: 'ngx-org-vp',
							image: 'assets/img_architecture/switch.svg',
							title: 'VP, Product Management',
							childs: [],
						},
					],
				},
				{
					name: 'Jeff Dean',
					cssClass: 'ngx-org-head',
					image: 'assets/img_architecture/switch.svg',
					title: 'Head of Artificial Intelligence',
					childs: [
						{
							name: 'David Feinberg',
							cssClass: 'ngx-org-ceo',
							image: 'assets/img_architecture/switch.svg',
							title: 'CEO, Google Health',
							childs: [],
						},
					],
				},
			],
		},
		{
			name: 'Sundar Pichai',
			cssClass: 'ngx-org-ceo',
			image: 'assets/img_architecture/switch.svg',
			title: 'Chief Executive Officer',
			childs: [
				{
					name: 'Thomas Kurian',
					cssClass: 'ngx-org-ceo',
					image: 'assets/img_architecture/switch.svg',
					title: 'CEO, Google Cloud',
				},
				{
					name: 'Susan Wojcicki',
					cssClass: 'ngx-org-ceo',
					image: 'assets/img_architecture/switch.svg',
					title: 'CEO, YouTube',
					childs: [
						{
							name: 'Beau Avril',
							cssClass: 'ngx-org-head',
							image: 'assets/img_architecture/switch.svg',
							title: 'Global Head of Business Operations',
							childs: [],
						},
						{
							name: 'Tara Walpert Levy',
							cssClass: 'ngx-org-vp',
							image: 'assets/img_architecture/switch.svg',
							title: 'VP, Agency and Brand Solutions',
							childs: [],
						},
						{
							name: 'Ariel Bardin',
							cssClass: 'ngx-org-vp',
							image: 'assets/img_architecture/switch.svg',
							title: 'VP, Product Management',
							childs: [],
						},
					],
				},
				{
					name: 'Jeff Dean',
					cssClass: 'ngx-org-head',
					image: 'assets/img_architecture/switch.svg',
					title: 'Head of Artificial Intelligence',
					childs: [
						{
							name: 'David Feinberg',
							cssClass: 'ngx-org-ceo',
							image: 'assets/img_architecture/switch.svg',
							title: 'CEO, Google Health',
							childs: [],
						},
					],
				},
			],
		},
	];

	ngOnInit(): void {}

	test(x: any) {
		console.log(x);
	}
}
