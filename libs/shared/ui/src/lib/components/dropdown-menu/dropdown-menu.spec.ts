import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownMenu } from './drowdown-menu';

describe('DrowdownMenu', () => {
  let component: DropdownMenu;
  let fixture: ComponentFixture<DropdownMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
