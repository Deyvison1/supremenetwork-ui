import { Component, inject, input, signal } from '@angular/core';

import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';

import { FormError } from '../form-error/form-error';
import { InputControl } from '../input-control/input-control';

@Component({
  selector: 'sn-input',
  standalone: true,
  imports: [MatFormFieldModule, InputControl, FormError],
  templateUrl: './sn-input.html',
  styleUrl: './sn-input.scss',
})
export class Input implements ControlValueAccessor {
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
  type = input<string>('text');
  autocomplete = input<string>('off');

  min = input<number | null>(null);
  max = input<number | null>(null);
  step = input<number | null>(null);

  value = signal<string>('');
  disabled = signal<boolean>(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get control(): AbstractControl | null {
    return this.ngControl?.control ?? null;
  }

  get hasError(): boolean {
    const control = this.control;

    return !!control && control.invalid && control.touched;
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onValueChange(value: string): void {
    this.value.set(value);
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
