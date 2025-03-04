import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom Email Validator for stricter email format
export function strictEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    // Stricter regex for validating the email (RFC 5322 standard)
    const regex = /^[A-Za-z0-9]+([._%+-]*[A-Za-z0-9]+)*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    return regex.test(email) ? null : { invalidEmail: true };
  };
}
