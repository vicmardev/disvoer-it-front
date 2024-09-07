import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {KnowledgeBaseService} from 'src/app/services/knowledgeBase/knowledge-base.service';

@Component({
	selector: 'app-delete-file',
	templateUrl: './delete-file.component.html',
	styleUrls: ['./delete-file.component.scss'],
})
export class DeleteFileComponent implements OnInit {
	constructor(
		@Inject(MAT_DIALOG_DATA) public nodeInfo: any,
		private dialogRef: MatDialogRef<any>,
		private _kbService: KnowledgeBaseService
	) {}

	ngOnInit(): void {}

	deleteEntry() {
		const id = this.nodeInfo.id;
		this._kbService.deleteNode(id).subscribe(() => {
			this.dialogRef.close();
		});
	}
}
