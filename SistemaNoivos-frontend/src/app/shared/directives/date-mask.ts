import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDateMask]',
  standalone: true
})
export class DateMaskDirective {
  private ngControl = inject(NgControl, { optional: true });

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    let newVal = event.target.value.replace(/\D/g, ''); // Remove tudo que não for número

    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 2) {
      newVal = newVal;
    } else if (newVal.length <= 4) {
      newVal = newVal.replace(/^(\d{0,2})(\d{0,2})/, '$1/$2');
    } else {
      newVal = newVal.slice(0, 8); // Limita a 8 números (ddmmaaaa)
      newVal = newVal.replace(/^(\d{0,2})(\d{0,2})(\d{0,4})/, '$1/$2/$3');
    }

    event.target.value = newVal;

    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(newVal, { emitEvent: false });
    }
  }
}
