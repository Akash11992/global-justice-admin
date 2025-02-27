import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function strictStringValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      // Trim spaces and check if the value is different from the original
      const trimmedValue = control.value.trim();
      if (control.value !== trimmedValue) {
        return { 'leadingTrailingSpaces': true };
      }
    }
    return null;
  };
}
