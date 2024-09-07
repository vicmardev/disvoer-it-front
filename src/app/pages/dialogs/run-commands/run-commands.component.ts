import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { ScriptData } from 'src/app/models/script-data';
import { InventoryService } from 'src/app/services/inventory/inventory.service';

interface selectList {
  value: string,
  viewValue: String
}

@Component({
  selector: 'app-run-commands',
  templateUrl: './run-commands.component.html',
  styleUrls: ['./run-commands.component.scss']
})
export class RunCommandsComponent implements OnInit {

  driverList: selectList[] = [
    {value: 'ios', viewValue: 'IOS'},
    {value: 'ios', viewValue: 'Genérico'},
    {value: 'eos', viewValue: 'EOS'},
    {value: 'junos', viewValue: 'JUNOS'},
    {value: 'iosxr_netconf', viewValue: 'IOS-XR (NETCONF)'},
    {value: 'iosxr', viewValue: 'IOS-XR (XML-Agent)'},
    {value: 'nxos', viewValue: 'NX-OS'},
    {value: 'nxos_ssh', viewValue: 'NX-OS SSH'},
  ]

  public serial:string;
  public ip: string;
  public commands: string[];
  public scriptData!: ScriptData; 
  public download = false
  public loading = false
  public commandRes: any;
  public fileRef: any;

  public commandData = this._formBuilder.group({
    serial: ['',[Validators.required]],
    driverType: ['ios',[Validators.required]],
    hostname: ['',[Validators.required]],
    username: ['',[Validators.required]],
    password: ['',[Validators.required]],
    enableSecret: [''],
    commandString: ['', [Validators.required]]
  })
  constructor(
    @Inject (MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    private _inventoryService: InventoryService,
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
  ) {
    this.serial = ""
    this.ip = ""
    this.commands = []
   }

   get form(){
     return this.commandData.controls
   }

  ngOnInit(): void {
    this.serial = this.data.serial
    this.ip = this.data.ip
    console.log(this.form);
    this.setFormValues()
    
  }

  closeDialog() {
    this.dialogRef.close();
  }

  errorSnack(error: string) {
    this._snackBar.open('Error al ejecutar comandos', '', {
      duration: 3500,
      verticalPosition: 'top',
      panelClass: ['background-snack'],
    });
  }

  setFormValues(){
    this.form.serial.setValue(this.serial)
    this.form.hostname.setValue(this.ip)
  }

  setScriptData(){ 
    this.scriptData = this.commandData.value;
    this.commands = this.commandData.value.commandString.split("\n")
    this.commands.unshift("skip-page-display") //needed to show all command output
    this.scriptData.commands = this.commands
    console.log(this.scriptData);
    
  }

  sendCommands(){
    this.setScriptData();
    this.loading = true;
    this._inventoryService.runCommands(this.scriptData).pipe(first()).subscribe({

      next: res => {
        this.download = true
        this.loading = false
        this.commandRes = res
        this.downloadJSON()
      },
      error: error =>{
        this.loading = false
        console.log(error);
        
        this.errorSnack(error);
      }
    })
  }

  downloadJSON(){
    let theJSON = JSON.stringify(this.commandRes);
        let uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
        this.fileRef = uri;

        console.log(this.fileRef);
        
  }




}
