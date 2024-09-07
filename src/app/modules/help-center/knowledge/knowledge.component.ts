import {Component, OnInit} from '@angular/core';
import {ArrayDataSource} from '@angular/cdk/collections';
import {NestedTreeControl} from '@angular/cdk/tree';
import {KnowledgeBaseNode} from 'src/app/models/knowledge-base-node';
import {KnowledgeBaseService} from 'src/app/services/knowledgeBase/knowledge-base.service';
import {first} from 'rxjs/operators';
import {User} from 'src/app/models/User';
import {AccountService} from 'src/app/services/account/account.service';
import {MatDialog} from '@angular/material/dialog';
import {AddFilesComponent} from './dialogs/add-files/add-files.component';
import {DeleteFileComponent} from './dialogs/delete-file/delete-file.component';

interface FoodNode {
	name: string;
	children?: FoodNode[];
}

@Component({
	selector: 'app-knowledge',
	templateUrl: './knowledge.component.html',
	styleUrls: ['./knowledge.component.scss'],
})
export class KnowledgeComponent implements OnInit {
	// treeControl = new NestedTreeControl<FoodNode>(node => node.children);
	data: any;
	treeSize: number = 0.0;
	treeControl = new NestedTreeControl<KnowledgeBaseNode>(node => node.children);
	dataSource = new ArrayDataSource([]); //= new ArrayDataSource(TREE_DATA);
	pdfSrc: string = '';
	pdfAvailable: boolean = false;
	user!: User;
	currentNode!: KnowledgeBaseNode;

	hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
	constructor(
		private kbService: KnowledgeBaseService,
		private accountService: AccountService,

		public dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.user = this.accountService.userValue;
		this.getTreeData();
	}

	getTreeData() {
		this.pdfAvailable = false;
		this.pdfSrc = '';
		this.kbService
			.getData()
			.pipe(first())
			.subscribe(res => {
				this.data = res;
				this.treeSize = this.data.sizeInMB;
				this.data = this.data.tree;
				this.treeControl = new NestedTreeControl<KnowledgeBaseNode>(
					node => node.children
				);
				this.dataSource = new ArrayDataSource(this.data);
			});
	}

	openDialog(option: string) {
		switch (option) {
			case 'add':
				this.createDialog();
				break;
			case 'edit':
				this.editDialog();
				break;
			case 'delete':
				this.deleteDialog();
				break;
			default:
				break;
		}
	}

	createDialog() {
		const dialogRef = this.dialog.open(AddFilesComponent, {
			width: '650px',
			height: 'auto',
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getTreeData();
		});
	}
	editDialog() {
		const dialogRef = this.dialog.open(AddFilesComponent, {
			width: '650px',
			height: 'auto',
			data: this.currentNode,
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getTreeData();
		});
	}
	deleteDialog() {
		const dialogRef = this.dialog.open(DeleteFileComponent, {
			width: 'auto',
			height: 'auto',
			data: this.currentNode,
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getTreeData();
		});
	}

	loadPdf(node: KnowledgeBaseNode) {
		const filepath = node.filepath;
		this.currentNode = node;

		if (filepath) {
			this.kbService
				.getFile(filepath)
				.pipe(first())
				.subscribe((res: any) => {
					let file = new Blob([res], {type: 'application/pdf'});
					this.pdfSrc = URL.createObjectURL(file);
					this.pdfAvailable = true;
				});
		}
	}
}
