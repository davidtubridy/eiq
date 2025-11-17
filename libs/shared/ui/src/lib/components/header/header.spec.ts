import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { provideRouter } from '@angular/router';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header element', () => {
    const compiled = fixture.nativeElement;
    const header = compiled.querySelector('header');
    expect(header).toBeTruthy();
  });

  it('should display title text', () => {
    const compiled = fixture.nativeElement;
    const link = compiled.querySelector('.title-link');
    expect(link.textContent).toBeDefined();
  });
});
