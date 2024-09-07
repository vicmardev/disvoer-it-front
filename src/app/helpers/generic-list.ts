import { Input, HostBinding, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Report } from "../models/Report";
import { User } from "../models/User";
import { AccountService } from "../services/account/account.service";

export class GenericList {
  panelOpenState: boolean = false;
  displayedColumns: string[] | undefined;


  items: any;
  public dataSource = new MatTableDataSource<any>();
  public lastUpdate: any;

  expandedElement: any | null;
  startDate: any;
  endDate: any;
  currentFilter: any;

  constructor(
    public _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public accountService: AccountService,

  ) {
    this._snackBar = _snackBar;
    this.dialog = dialog;
  }

  get item(){
    return this.expandedElement;
  }

  get user(){
    return this.accountService.userValue;

  }

  expandRow(element: any){
    this.expandedElement = this.expandedElement === element ? null : element

    this.panelOpenState = this.expandedElement ? true : false
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  startChange(event:any){
    this.startDate = event.value;
   }

   endChange(event:any){
     this.endDate = event.value;
     this.startDate.toISOString().substr(0,10)
     this.endDate.toISOString().substr(0,10)
     let  inicial = this.startDate.toISOString().substr(0,10);
     let  final  = this.endDate.toISOString().substr(0,10)
     const busca =  this.items.filter((n:any) => n.Time.substr(0,10) >= inicial && n.Time.substr(0,10) <= final)
     this.dataSource.data  =  busca;
     if(busca.length === 0 ){
       this._snackBar.open('No existen registros en estas Fechas.', '', {
        duration: 3500,
        verticalPosition: 'top',
        /* horizontalPosition: 'center', */
         panelClass:['background-snack-red'],
       });
     }
   }



   filterStatus(selectedValue:any){

     const filter = this.items.filter((m: any) => m.Status === selectedValue.value)
     this.dataSource.data = filter;

     this.currentFilter = selectedValue;

     if (selectedValue.value === 'all') {
       this.dataSource.data = this.items;
     }
   }
}
