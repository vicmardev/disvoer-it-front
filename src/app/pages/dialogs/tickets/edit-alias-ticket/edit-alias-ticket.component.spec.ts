import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAliasTicketComponent } from './edit-alias-ticket.component';

describe('EditAliasTicketComponent', () => {
  let component: EditAliasTicketComponent;
  let fixture: ComponentFixture<EditAliasTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAliasTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAliasTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
