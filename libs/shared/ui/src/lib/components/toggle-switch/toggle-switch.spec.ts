import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleSwitch } from './toggle-switch';

describe('ToggleSwitch', () => {
  let component: ToggleSwitch;
  let fixture: ComponentFixture<ToggleSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleSwitch],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit true when clicked while unchecked', () => {
    fixture.componentRef.setInput('checked', false);
    fixture.detectChanges();

    const spy = jest.fn();
    component.checkedChange.subscribe(spy);

    const inputEl = fixture.nativeElement.querySelector('input');
    inputEl.click();

    expect(spy).toHaveBeenCalledWith(true);
  });
});
