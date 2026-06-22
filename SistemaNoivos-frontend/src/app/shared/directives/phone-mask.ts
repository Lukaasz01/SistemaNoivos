import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneMask]',
  standalone: true
})
export class PhoneMaskDirective {
  private ngControl = inject(NgControl, { optional: true });

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    let newVal = event.target.value.replace(/\D/g, ''); // Remove o que não é número

    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 2) {
      newVal = newVal.replace(/^(\d{0,2})/, '($1');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,2})(\d{0,4})/, '($1) $2');
    } else if (newVal.length <= 10) {
      newVal = newVal.replace(/^(\d{0,2})(\d{0,4})(\d{0,4})/, '($1) $2-$3');
    } else {
      newVal = newVal.slice(0, 11); // Limita a 11 dígitos
      newVal = newVal.replace(/^(\d{0,2})(\d{0,5})(\d{0,4})/, '($1) $2-$3');
    }

    event.target.value = newVal;

    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(newVal, { emitEvent: false });
    }
  }
}
