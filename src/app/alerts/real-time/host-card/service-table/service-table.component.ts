import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Service } from 'src/app/models/service';
import { CreateTicketAlertComponent } from 'src/app/pages/dialogs/tickets/create-ticket-alert/create-ticket-alert.component';

@Component({
  selector: 'service-table',
  templateUrl: './service-table.component.html',
  styleUrls: ['./service-table.component.scss']
})
export class ServiceTableComponent implements OnInit {

  @Input('services') services!: Service[];
  @Input('filter') filter!: String;
  public data = new MatTableDataSource<Service>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() changeOKCountEvent = new EventEmitter<string>();

  highLightOn = false;
  selectedRow: any;
  displayedColumns: String[];


  constructor(
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _router: Router,
  ) { 
    this.displayedColumns = [
      /*  'Acknowledged', */
      // 'Hostname',
      'ServiceName',
      'Status',
      'Duration',
      'Created',
      // 'Notification',
      'Attemps',
      'Service',
      /* 'Serial', */
      /*  'PluginOutput', */
    ];
  }

  ngOnInit(): void {
    this.data.data = this.services;
    
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    // console.log("changes table",changes);
    this.data.data = changes.services.currentValue;

    
  }

  getInfo(data:any){
    console.log(data);
    
  }

  getDateFromTimestamp(timestamp: any){
    return new Date(timestamp*1000);
  }

  ngAfterViewInit(): void {
    setTimeout(() => (this.data.paginator = this.paginator));
  }

  openDialogTicket(rowInfo: any) {
    const dialogRef = this.dialog.open(CreateTicketAlertComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      maxHeight: '90vh',
      data: {
        info: rowInfo,
      },
    });
  }

  goTickets() {
    this._router.navigateByUrl('dash/ticketsAlerts/home');
  }

  clearAlarm(row: Service) {
    if (row.CurrentAlarm == undefined) return;
    this.changeOKCountEvent.emit(row.CurrentAlarm.Status);
    row.CurrentAlarm.Status = 'ok';
  }

}
