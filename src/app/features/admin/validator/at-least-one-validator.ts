import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const atLeastOneCheckboxCheckedValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const group = control;
  const isAtLeastOneChecked = Object.keys(group.value).some(key => group.value[key] === true);
  return isAtLeastOneChecked ? null : { atLeastOneRequired: true };
};
