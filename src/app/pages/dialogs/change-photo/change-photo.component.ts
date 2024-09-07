import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
    selector: 'app-change-photo',
    templateUrl: './change-photo.component.html',
    styleUrls: ['./change-photo.component.scss']
})
export class ChangePhotoComponent implements OnInit {



    name = 'Angular';

    imageChangedEvent: any = '';
    croppedImage: any = '';
    flagImg:boolean =  false;


    constructor(
        public dialogRef: MatDialogRef<any>,
        public _snackBar:MatSnackBar
    ) { }

    ngOnInit(): void {
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
        this.flagImg =  true;
        if (this.imageChangedEvent.target.files[0].size > 1000000) {
            this._snackBar.open(`La imagen es muy pesada, intentar con otra.`,'',{
                duration: 3500,
                verticalPosition: 'top',
                /* horizontalPosition: 'center', */
                panelClass:['background-snack-red']
            });
            this.imageChangedEvent = '';
            this.flagImg =  false;  
        }   
    }
    
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.flagImg =  true;    
    }

    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }


    save(){
        this.dialogRef.close({data: this.croppedImage})
    }

}
