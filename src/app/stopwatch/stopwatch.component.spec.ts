import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopwatchComponent } from './stopwatch.component';

describe('Stopwatch24Component', () => {
  let component: StopwatchComponent;
  let fixture: ComponentFixture<StopwatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopwatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopwatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
