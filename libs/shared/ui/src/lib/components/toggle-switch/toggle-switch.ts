import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'eiq-toggle-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toggle-switch.html',
  styleUrl: './toggle-switch.scss',
})
export class ToggleSwitch {
  checked = input<boolean>(false);
  label = input<string>('');
  disabled = input<boolean>(false);
  ariaLabel = input<string>('');

  checkedChange = output<boolean>();

  handleChange(): void {
    if (!this.disabled()) {
      this.checkedChange.emit(!this.checked());
    }
  }
}
