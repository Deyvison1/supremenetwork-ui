import { Component, DestroyRef, inject, input, signal } from '@angular/core';

import { AbstractControl } from '@angular/forms';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form-error',
  standalone: true,
  templateUrl: './form-error.html',
})
export class FormError {
  control = input.required<AbstractControl>();

  private readonly destroyRef = inject(DestroyRef);

  mensagem = signal<string | null>(null);

  ngOnInit(): void {
    const control = this.control();

    this.atualizarMensagem();

    control.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.atualizarMensagem();
    });
  }

  private atualizarMensagem(): void {
    const control = this.control();

    if (!control.touched || !control.errors) {
      this.mensagem.set(null);
      return;
    }

    if (control.hasError('required')) {
      this.mensagem.set('Campo obrigatório.');
      return;
    }

    if (control.hasError('invalidDocument')) {
      this.mensagem.set('CPF ou CNPJ inválido.');
      return;
    }

    if (control.hasError('invalidName')) {
      this.mensagem.set('Nome inválido.');
      return;
    }

    if (control.hasError('invalidDate')) {
      this.mensagem.set('Data inválida.');
      return;
    }

    if (control.hasError('dateBeforeToday')) {
      this.mensagem.set('A data deve ser anterior à data atual.');
      return;
    }

    if (control.hasError('email')) {
      this.mensagem.set('Informe um e-mail válido.');
      return;
    }

    if (control.hasError('multiplePrimaryContacts')) {
      this.mensagem.set('Só é possível marcar um contato como principal.');
      return;
    }

    if (control.hasError('telefone')) {
      this.mensagem.set('Informe um telefone válido.');
      return;
    }

    this.mensagem.set(null);
  }
}
