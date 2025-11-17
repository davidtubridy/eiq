import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  ElementRef,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface DropdownOption<T = unknown> {
  value: T;
  label: string;
  icon?: string;
}

@Component({
  selector: 'eiq-dropdown-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dropdown-menu.html',
  imports: [MatIconModule],
  styleUrl: './dropdown-menu.scss',
  host: {
    '(document:keydown.escape)': 'handleEscapeKey()',
    '(document:mousedown)': 'handleClickOutside($event)',
  },
})
export class DropdownMenu<T = unknown> {
  private elementRef = inject(ElementRef);

  options = input.required<DropdownOption<T>[]>();
  selected = input<T | null>(null);
  searchPlaceholder = input<string>('Search...');
  ariaLabel = input<string>('');

  optionSelected = output<T>();

  isOpen = signal(false);
  searchQuery = signal('');

  selectedOption = computed(() => {
    const selectedValue = this.selected();
    if (selectedValue === null || selectedValue === undefined) {
      return null;
    }
    return this.options().find((opt) => opt.value === selectedValue) || null;
  });

  filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.options();

    return this.options().filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  });

  toggle() {
    this.isOpen.update((open) => !open);
  }

  close() {
    this.isOpen.set(false);
    this.searchQuery.set('');
  }

  selectOption(option: DropdownOption<T>) {
    this.optionSelected.emit(option.value);
    this.close();
  }

  isSelected(option: DropdownOption<T>): boolean {
    return option.value === this.selected();
  }

  handleEscapeKey() {
    if (this.isOpen()) {
      this.close();
    }
  }

  handleClickOutside(event: MouseEvent) {
    if (this.isOpen()) {
      const clickedInside = this.elementRef.nativeElement.contains(
        event.target
      );
      if (!clickedInside) {
        this.close();
      }
    }
  }

  handleTriggerKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    }
  }

  updateSearchQuery(value: string) {
    this.searchQuery.set(value);
  }
}
