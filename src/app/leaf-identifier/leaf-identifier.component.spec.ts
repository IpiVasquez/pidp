import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafIdentifierComponent } from './leaf-identifier.component';

describe('LeafIdentifierComponent', () => {
  let component: LeafIdentifierComponent;
  let fixture: ComponentFixture<LeafIdentifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeafIdentifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeafIdentifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
