import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stopwatch24Component } from './stopwatch24.component';

describe('Stopwatch24Component', () => {
  let component: Stopwatch24Component;
  let fixture: ComponentFixture<Stopwatch24Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Stopwatch24Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Stopwatch24Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
