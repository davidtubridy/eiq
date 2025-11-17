import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  effect,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type EditableListItemType = 'header' | 'regular' | 'list' | 'question';

@Component({
  selector: 'eiq-text-field',
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './text-field.html',
  styleUrl: './text-field.scss',
})
export class TextField {
  text = input.required<string>();
  type = input<EditableListItemType>('regular');
  isSelected = input<boolean>(false);
  isEditing = input<boolean>(false);
  canDelete = input<boolean>(true);
  prefix = input<string>('');
  placeholder = input<string>('Enter text...');

  startEdit = output<void>();
  saveEdit = output<string>();
  deleteItem = output<void>();

  editText = signal<string>('');

  constructor() {
    effect(() => {
      if (this.isEditing()) {
        this.editText.set(this.text());
      }
    });
  }

  handleSave() {
    const text = this.editText().trim();
    if (text) {
      this.saveEdit.emit(text);
    }
  }

  handleDelete(event: MouseEvent) {
    event.stopPropagation();
    this.deleteItem.emit();
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault();
      this.handleSave();
    }
  }
}
