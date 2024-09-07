import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { QuizService } from 'src/app/services/quiz/quiz.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StarRatingComponent } from 'ng-starrating';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-customer-support',
  templateUrl: './customer-support.component.html',
  styleUrls: ['./customer-support.component.scss']
})
export class CustomerSupportComponent implements OnInit {


  quizForm!: FormGroup;
  /* rating3: number; */
  satisfactionValues: Array<any> = [
    { id: 1, name: 'Muy Satisfecho', value: 'muy satisfecho' },
    { id: 2, name: 'Satisfecho', value: 'satisfecho' },
    { id: 3, name: 'Poco Satisfecho', value: 'poco satisfecho' },
    { id: 4, name: 'Nada Satisfecho', value: 'nada satisfecho' },
  ];
  responseSatisfactionValues: Array<any> = [
    { id: 1, name: 'Si', value: 'si' },
    { id: 2, name: 'No', value: 'no' },
  ];
  treatmentSatisfactionValues: Array<any> = [
    { id: 1, name: 'Si', value: 'si' },
    { id: 2, name: 'No', value: 'no' },
  ];
 /*  stars: Array<any> = [
    { id: 1, name: '1 estrella', value: '1 estrella' },
    { id: 2, name: '2 estrellas', value: '2 estrellas' },
    { id: 3, name: '3 estrellas', value: '3 estrellas' },
    { id: 4, name: '4 estrellas', value: '4 estrellas' },
    { id: 5, name: '5 estrellas', value: '5 estrellas' },
  ]; */

  constructor(
    /*  private formBuilder: FormBuilder, */
    fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private quizService: QuizService,
    private snackBar: MatSnackBar,

  ) {
    /* this.rating3 = 0; */
    
    this.quizForm = fb.group({
      satisfaction: ['', Validators.required],
      responseTimeSatisfaction: ['', Validators.required],
      treatmentSatisfaction: ['', Validators.required],
      ticketID: ['', Validators.required],
      client: ['', Validators.required],
      supportAssignment: ['', Validators.required],
      comments: [''],
      rating: [5, Validators.required],
      

      /* rating1: ['', Validators.required],
      rating2: [4] */

    });
  }

  get form(){
    return this.quizForm.controls;
  }


  ngOnInit(): void {
    this.setFormValues()
    console.log("El valor de data es: ", this.quizForm.value);
    
    /* this.quizForm = this.formBuilder.group({
      verySatisfied: ['', Validators.required],
    }) */
  }

  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}) {
    this.form.rating.setValue($event.newValue)
  }

  onCheckboxChange(event: any) {
    this.quizForm.controls['comments'].setValue('');

    const selectedQuestions = (this.quizForm.controls.selectedQuestions as FormArray);
    if (event.target.checked) {
      selectedQuestions.push(new FormControl(event.target.value));
    } else {
      const index = selectedQuestions.controls
        .findIndex(x => x.value === event.target.value);
      selectedQuestions.removeAt(index);
    }

  }

  setFormValues(){
    this.form.ticketID.setValue(this.data.info.ticketID)
    this.form.client.setValue(this.data.info.userClient)
    this.form.supportAssignment.setValue(this.data.info.supportAssignment)
    
  }

  submit() {
    console.log("El valor de data en aceptar", this.data);
    this.quizService.createQuiz(this.quizForm.value).pipe(first()).subscribe({
      next:(res:any) => {
        this.successSnack();
        this.closeDialog();
      },
      error: error => {
        this.errorSnack(error);
      }
    })
    console.log(this.quizForm.value);

  }


  errorSnack(error: any){
    this.snackBar.open(`${error}`, '',
          {
            duration: 3500,
        verticalPosition: 'top',
            panelClass: ['background-snack-red'],
          }
        );
  }

  successSnack(){
    this.snackBar.open(`Gracias por su atención`, '',
          {
            duration: 3500,
        verticalPosition: 'top',
            panelClass: ['background-snack-info'],
          }
        );
  }
  closeDialog(){
    this.dialogRef.close();
  }







}
