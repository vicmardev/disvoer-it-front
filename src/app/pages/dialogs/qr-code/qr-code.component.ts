import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnInit,
	Output,
	SimpleChange,
	SimpleChanges,
} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SafeUrl} from '@angular/platform-browser';

@Component({
	selector: 'app-qr-code',
	templateUrl: './qr-code.component.html',
	styleUrls: ['./qr-code.component.scss'],
})
export class QrCodeComponent implements OnInit {
	qrCodeData: any = '';
	partObject: any;
	elementType: any = 'img';
	rackData: any;
	@Output() success = new EventEmitter<boolean>();
	public qrCodeSrc!: SafeUrl;
	@Input() componentData: any;
	constructor(@Inject(MAT_DIALOG_DATA) public qrCodeDataFromDialog: any) {}

	ngOnInit(): void {
		//use dialog data if it exist, always
		console.log('input data ', this.componentData);

		// this.qrCodeData =
		// 	this.componentData == undefined ? this.componentData : this.qrCodeDataFromDialog;
	}

	//only happens when input is changes
	ngOnChanges(changes: SimpleChanges) {
		console.log('input', changes.componentData.currentValue);

		this.qrCodeData = changes.componentData.currentValue;
		this.partObject = JSON.parse(this.qrCodeData);
		this.rackData = this.partObject.OperationParts[0].Rack;
		console.log('data ', this.rackData);
	}

	onChangeURL(url: SafeUrl) {
		this.qrCodeSrc = url;
	}

	saveAsImage(parent: any) {
		let parentElement = null;

		if (this.elementType === 'canvas') {
			// fetches base 64 data from canvas
			parentElement = parent.qrcElement.nativeElement
				.querySelector('canvas')
				.toDataURL('image/png');
		} else if (this.elementType === 'img' || this.elementType === 'url') {
			// fetches base 64 data from image
			// parentElement contains the base64 encoded image src
			// you might use to store somewhere
			parentElement = parent.qrcElement.nativeElement.querySelector('img').src;
		} else {
			alert("Set elementType to 'canvas', 'img' or 'url'.");
		}

		if (parentElement) {
			// converts base 64 encoded image to blobData
			let blobData = this.convertBase64ToBlob(parentElement);
			// saves as image
			const blob = new Blob([blobData], {type: 'image/png'});
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			// name of the file
			link.download = 'Qrcode';
			link.click();
		}
	}

	private convertBase64ToBlob(Base64Image: string) {
		// split into two parts
		const parts = Base64Image.split(';base64,');
		// hold the content type
		const imageType = parts[0].split(':')[1];
		// decode base64 string
		const decodedData = window.atob(parts[1]);
		// create unit8array of size same as row data length
		const uInt8Array = new Uint8Array(decodedData.length);
		// insert all character code into uint8array
		for (let i = 0; i < decodedData.length; ++i) {
			uInt8Array[i] = decodedData.charCodeAt(i);
		}
		// return blob image after conversion
		return new Blob([uInt8Array], {type: imageType});
	}

	onPrint() {
		window.print();
	}

	onSucces() {
		this.success.emit(true);
	}
}
