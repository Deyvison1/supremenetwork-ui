import {
  Component,
  ElementRef,
  OnChanges,
  ViewChild,
  booleanAttribute,
  input,
  output,
} from '@angular/core';

import { MatFormFieldControl } from '@angular/material/form-field';

import { Subject } from 'rxjs';

@Component({
  selector: 'sn-input-control',
  standalone: true,
  templateUrl: './input-control.html',
  styleUrl: './input-control.scss',
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: InputControl,
    },
  ],
})
export class InputControl
  implements MatFormFieldControl<string>, OnChanges {

  private static nextId = 0;

  readonly stateChanges = new Subject<void>();

  readonly id = `sn-input-control-${InputControl.nextId++}`;

  readonly required = false;
  readonly controlType = 'sn-input';
  readonly autofilled = false;
  readonly userAriaDescribedBy = '';
  readonly describedByIds: string[] = [];

  placeholder = '';
  disabled = false;
  value = '';
  errorState = false;

  readonly inputType = input<string>('text');
  readonly inputAutocomplete = input<string>('off');

  readonly inputMin = input<number | null>(null);
  readonly inputMax = input<number | null>(null);
  readonly inputStep = input<number | null>(null);

  readonly inputDisabled = input(false, {
    transform: booleanAttribute,
  });

  readonly inputValue = input<string>('');

  readonly inputErrorState = input(false, {
    transform: booleanAttribute,
  });

  readonly valueChange = output<string>();
  readonly blurChange = output<void>();

  @ViewChild('input')
  private inputElement?: ElementRef<HTMLInputElement>;

  // ============================================================
  // MatFormFieldControl
  // ============================================================

  get focused(): boolean {
    return document.activeElement === this.inputElement?.nativeElement;
  }

  get empty(): boolean {
    return this.value === '';
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  get ngControl(): null {
    return null;
  }

  // ============================================================
  // Events
  // ============================================================

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.value = input.value;
    this.valueChange.emit(input.value);

    this.stateChanges.next();
  }

  onFocus(): void {
    this.stateChanges.next();
  }

  onBlur(): void {
    this.stateChanges.next();
    this.blurChange.emit();
  }

  onContainerClick(): void {
    this.inputElement?.nativeElement.focus();
  }

  setDescribedByIds(ids: string[]): void {
    this.describedByIds.splice(
      0,
      this.describedByIds.length,
      ...ids,
    );

    this.stateChanges.next();
  }

  ngOnChanges(): void {
    const newDisabled = this.inputDisabled();
    const newValue = this.inputValue();
    const newErrorState = this.inputErrorState();

    const changed =
      this.disabled !== newDisabled ||
      this.value !== newValue ||
      this.errorState !== newErrorState;

    this.disabled = newDisabled;
    this.value = newValue;
    this.errorState = newErrorState;

    if (changed) {
      this.stateChanges.next();
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }
}