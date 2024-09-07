import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {KnowledgeBaseNode} from 'src/app/models/knowledge-base-node';
import {KnowledgeBaseNodeTypes} from 'src/app/models/knowledge-base-node-types';
import {KnowledgeBaseService} from 'src/app/services/knowledgeBase/knowledge-base.service';

interface Servicio {
	value: string;
	viewValue: string;
}

interface Equipo {
	value: string;
	viewValue: string;
}

interface Documento {
	value: string;
	viewValue: string;
}

@Component({
	selector: 'app-add-files',
	templateUrl: './add-files.component.html',
	styleUrls: ['./add-files.component.scss'],
})
export class AddFilesComponent implements OnInit {
	myNodeTypes!: KnowledgeBaseNodeTypes;
	editFlag: boolean = false;

	servicio: Servicio[] = [
		{value: 'Redes IP', viewValue: 'Redes IP'},
		{value: 'Servicios IT', viewValue: 'Servicios IT'},
	];

	equipo: Equipo[] = [
		{value: 'Balanceador', viewValue: 'Balanceador'},
		{value: 'Storage', viewValue: 'Storage'},
		{value: 'Switch', viewValue: 'Switch'},
		{value: 'Server', viewValue: 'Server'},
	];

	documento: Documento[] = [
		{value: 'Manual', viewValue: 'Manual'},
		{value: 'Troubleshooting', viewValue: 'Troubleshooting'},
		{value: 'Datasheet', viewValue: 'Datasheet'},
		{value: 'Installation', viewValue: 'Installation'},
		{value: 'Otros', viewValue: 'Otros'},
	];

	public kbForm = this._formBuilder.group({
		DeviceFieldUse: ['', [Validators.required]],
		DeviceType: ['', [Validators.required]],
		DeviceBrand: ['', [Validators.required]],
		Device: ['', [Validators.required]],
		name: ['', Validators.required],
		fileUpload: ['', [Validators.required]],

		/*  servicio: [this.selectedServicio, [Validators.required]],
      equipo: [this.selectedEquipo, [Validators.required]],
      documento: [this.selectedDocumento, [Validators.required]], */
	});

	constructor(
		@Inject(MAT_DIALOG_DATA) public nodeInfo: KnowledgeBaseNode,
		private dialogRef: MatDialogRef<any>,
		private _formBuilder: FormBuilder,
		private _snackBar: MatSnackBar,
		private _kbService: KnowledgeBaseService
	) {}

	get form() {
		return this.kbForm.controls;
	}

	ngOnInit(): void {
		if (this.nodeInfo) {
			this.editFlag = true;
			this.setvaluesForm();
		}
	}

	setvaluesForm() {
		let node = this.nodeInfo;
		let types = node.id ? node.id : '';
		let typeInfo = types.split(',');

		this.kbForm.controls['DeviceFieldUse'].setValue(typeInfo[1]);
		this.kbForm.controls['DeviceType'].setValue(typeInfo[2]);
		this.kbForm.controls['DeviceBrand'].setValue(typeInfo[3]);
		this.kbForm.controls['Device'].setValue(typeInfo[4]);
		this.kbForm.controls['name'].setValue(this.nodeInfo.name);
	}

	onFileChange(event: any) {
		if (event.target.files.length > 0) {
			const file = event.target.files[0];

			this.kbForm.patchValue({
				fileUpload: file,
			});
		}
	}

	submitEntry() {
		let formData = new FormData();
		formData.append('name', this.kbForm.value.name);
		formData.append('type', 'Filepath');
		formData.append('fileUpload', this.kbForm.value.fileUpload);

		if (this.editFlag) {
			this._kbService.updateEntry(this.kbForm.value, formData).subscribe(res => {
				if (res) {
					this.closeDialog();
					this.closeSnack();
				} else {
					this.errorSnack();
				}
			});
		} else {
			this._kbService.createEntry(this.kbForm.value, formData).subscribe(res => {
				if (res) {
					this.closeDialog();
					this.closeSnack();
				} else {
					this.errorSnack();
				}
			});
		}
	}

	closeDialog() {
		this.dialogRef.close();
	}

	closeSnack() {
		const msg = this.editFlag
			? 'Documento Actualizado con Exito.'
			: 'Documento Creado con Exito.';
		this._snackBar.open('Documento Creado con Exito.', '', {
			duration: 3500,
			verticalPosition: 'top',
			panelClass: ['background-snack'],
			/*  horizontalPosition: 'start',
      verticalPosition: 'top', */
		});
	}

	errorSnack() {
		this._snackBar.open(
			'Error al crear Documento, intentalo de nuevo o comunicate  con el  admin',
			'',
			{
				duration: 3500,
				verticalPosition: 'top',
				panelClass: ['background-snack'],
			}
		);
	}
}
