import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JamCrudComponent } from './jam-crud.component';

describe('JamCrudComponent', () => {
  let component: JamCrudComponent;
  let fixture: ComponentFixture<JamCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JamCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JamCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
