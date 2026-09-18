import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressEdit } from './address-edit';

describe('AddressEdit', () => {
  let component: AddressEdit;
  let fixture: ComponentFixture<AddressEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
