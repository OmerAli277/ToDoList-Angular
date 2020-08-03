import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTodolistsComponent } from './view-todolists.component';

describe('ViewTodolistsComponent', () => {
  let component: ViewTodolistsComponent;
  let fixture: ComponentFixture<ViewTodolistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTodolistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTodolistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
