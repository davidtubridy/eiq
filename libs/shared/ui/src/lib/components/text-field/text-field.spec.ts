import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextField } from './text-field';
import { provideRouter } from '@angular/router';

describe('TextField', () => {
  let component: TextField;
  let fixture: ComponentFixture<TextField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [TextField],
    }).compileComponents();

    fixture = TestBed.createComponent(TextField);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('text', 'Test');
    expect(component).toBeTruthy();
  });

  it('should display the text', () => {
    fixture.componentRef.setInput('text', 'Test Item');
    fixture.detectChanges();

    const textButton = fixture.nativeElement.querySelector('.item-text');
    expect(textButton).toBeTruthy();
    expect(textButton?.textContent.trim()).toBe('Test Item');
  });

  it('should emit startEdit when text button is clicked', () => {
    fixture.componentRef.setInput('text', 'Test');
    fixture.detectChanges();

    const spy = jest.fn();
    component.startEdit.subscribe(spy);

    const textButton = fixture.nativeElement.querySelector('.item-text');
    expect(textButton).toBeTruthy();
    textButton.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit saveEdit with trimmed text when handleSave is called', () => {
    fixture.componentRef.setInput('text', 'Test');

    const spy = jest.fn();
    component.saveEdit.subscribe(spy);

    component.editText.set('New Text');
    component.handleSave();

    expect(spy).toHaveBeenCalledWith('New Text');
  });
});
