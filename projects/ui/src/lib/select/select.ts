import { Component, computed, inject, input, signal } from '@angular/core';

import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { FormError } from '../form-error/form-error';
import { SelectOption } from '../dtos/select-option.dto';

@Component({
  selector: 'sn-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormError],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, {
    self: true,
    optional: true,
  });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  label = input<string>('');
  options = input<SelectOption[]>([]);
  multiple = input<boolean>(false);
  placeholder = input<string>('');

  value = signal<string | string[]>([]);
  disabled = signal<boolean>(false);

  private onChange: (value: string | string[]) => void = () => {};
  private onTouched: () => void = () => {};

  get control(): AbstractControl | null {
    return this.ngControl?.control ?? null;
  }

  writeValue(value: string | string[]): void {
    this.value.set(value ?? (this.multiple() ? [] : ''));
  }

  registerOnChange(fn: (value: string | string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onValueChange(value: string | string[]): void {
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }

  selectedOptions = computed(() => {
    const options = this.options();
    const value = this.value();

    if (!this.multiple()) {
      const option = options.find((option) => option.id === value);

      return option ? [option] : [];
    }

    const values = value as string[];

    return options.filter((option) => values.includes(option.id));
  });
}
