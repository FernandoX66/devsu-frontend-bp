import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextualMenuComponent } from './contextual-menu.component';

describe('ContextualMenuComponent', () => {
  let component: ContextualMenuComponent;
  let fixture: ComponentFixture<ContextualMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContextualMenuComponent],
    });
    fixture = TestBed.createComponent(ContextualMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu', () => {
    expect(component.showMenu).toBeFalse();

    component.toggleMenu();

    expect(component.showMenu).toBeTrue();
  });
});
