import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormGroup } from '@angular/forms';

export function stringValidator(
  controlName: string,
  minlength: number,
  maxlength: number
) {
  return (control: AbstractControl): ValidationErrors | null => {
    //let pattern = '^.{'+minlength+','+maxlength+'}$';
    
    let pattern = '^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{'+minlength+','+maxlength+'}?$';
    return !control.value.length && minlength > 0
      ? { error: true, message: `${controlName} is required` }
      : minlength > 0 && !control.value.match(new RegExp(pattern))
      ? {
          error: true,
          message: `${controlName} must contain Min no is ${minlength} and the Max is ${maxlength}`,
        }
      : null;
  };
}

export function stringLengthValidator(
  controlName: string,
  minlength: number,
  maxlength: number
) {
  return (control: AbstractControl): ValidationErrors | null => {
    let pattern = '^.{'+minlength+','+maxlength+'}$';
    //let pattern = '^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{'+minlength+','+maxlength+'}?$';
    return !control.value.length && minlength > 0
      ? { error: true, message: `${controlName} is required` }
      : minlength > 0 && !control.value.match(new RegExp(pattern))
      ? {
          error: true,
          // message: `${controlName} must contain Min no is ${minlength} and the Max is ${maxlength}`,
          message: `${controlName} needs to have at least ${minlength} characters and not more than ${maxlength} characters.`,
        }
      : null;
  };
}

export function ntpOrIpValidator(
  controlName: string,
  minlength: number,
  maxlength: number
) {
  return (control: AbstractControl): ValidationErrors | null => {
    //let pattern = '^.{'+minlength+','+maxlength+'}$';
    let first_character = Array.from(control.value)[0];
    if(!isNaN(Number(first_character))){
      let pattern = '(?=^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$)';
      return !control.value.length && minlength > 0
        ? { error: true, message: `${controlName} is required` }
        : minlength > 0 && !control.value.match(new RegExp(pattern))
        ? {
            error: true,
            //message: `${controlName} must contain Min no is ${minlength} and the Max is ${maxlength}`,
            message: `Please enter Valid IP Address`,
          }
        : null;
    } else {
      let pattern = '(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)';
      return !control.value.length && minlength > 0
        ? { error: true, message: `${controlName} is required` }
        : minlength > 0 && !control.value.match(new RegExp(pattern))
        ? {
            error: true,
            //message: `${controlName} must contain Min no is ${minlength} and the Max is ${maxlength}`,
            message: `Please enter Valid NTP`,
          }
        : null;
    }
  };
}

export function fdqnValidator(
  controlName: string,
  minlength: number,
  maxlength: number
) {
  return (control: AbstractControl): ValidationErrors | null => {
    //let pattern = '^.{'+minlength+','+maxlength+'}$';
    let pattern = '(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.||\-)+[a-zA-Z0-9]{1,63}$)';
    return !control.value.length && minlength > 0
      ? { error: true, message: `${controlName} is required` }
      : minlength > 0 && !control.value.match(new RegExp(pattern))
      ? {
          error: true,
          //message: `${controlName} must contain Min no is ${minlength} and the Max is ${maxlength}`,
          message: `Please enter Valid FQDN`,
        }
      : null;
  };
}

export function nameValidator(
  controlName: string,
  minlength: number,
  maxlength: number
) {
  return (control: AbstractControl): ValidationErrors | null => {
    //let pattern = '^[a-zA-Z0-9 ]{' + minlength + ',' + maxlength + '}$';
    let pattern = '^[a-zA-ZÀ-ȕ0-9 ]{' + minlength + ',' + maxlength + '}$';
    return !control.value.length
      ? { error: true, message: `${controlName} is required` }
      : !control.value.match(new RegExp(pattern))
      ? {
          error: true,
          message: `${controlName} must contain only alphabets & number. Min no is ${minlength} and the Max is ${maxlength}`,
        }
      : null;
  };
}

export function emailValidator(controlName: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    return !control.value.length
      ? { error: true, message: `${controlName} is required` }
      //: !control.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      : !control.value.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
      ? { error: true, message: `${controlName} is invalid` }
      : null;
  };
}

export function phoneValidator(controlName: string, expectedLength: number) {
  let pattern = '^\\d{' + expectedLength + '}$';
  /* Add an extra backslash before \d if regex is constructed as a string. There is no need for // at the beginning and end of string if using RegExp  */
  return (control: AbstractControl): ValidationErrors | null => {
    return !control.value.length
      ? { error: true, message: `${controlName} is required` }
      : !control.value.match(new RegExp(pattern))
      ? {
          error: true,
          message: `${controlName} must be numeric with ${expectedLength} digits`,
        }
      : null;
  };
}

export function dateValidator(controlName: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    let today = new Date();
    let selectedDate = new Date(control.value);
    return !control.value.length
      ? { error: true, message: `${controlName} is required` }
      : selectedDate.getTime() > today.getTime()
      ? { error: true, message: `${controlName} cannot be a future date` }
      : null;
  };
}

//custom validator

export function hostValidator(controlName: string,isRequired:boolean=false) {
    return (control: AbstractControl): ValidationErrors | null => {
      return !control.value.length && isRequired
        ? { error: true, message: `${controlName} is required` }
        : control.value.length && !control.value.match(/^([a-z0-9]+(-[a-z0-9]+)*\.){1,10}([a-z]{2,12})$/)
        ? { error: true, message: `${controlName} is invalid` }
        : null;
    };
}

export function IPValidatorWithPort(controlName: string,isRequired:boolean=false) {
    return (control: AbstractControl): ValidationErrors | null => {
      return !control.value.length && isRequired
        ? { error: true, message: `${controlName} is required` }
        : control.value.length && !control.value.match(/^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4})(:[0-9]{1,4})?$/)
        ? { error: true, message: `${controlName} is invalid` }
        : null;
    };
}

export function IPValidator(controlName: string,isRequired:boolean=false) {
  return (control: AbstractControl): ValidationErrors | null => {
    return !control.value.length && isRequired
      ? { error: true, message: `${controlName} is required` }
      : control.value.length && !control.value.match(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
      ? { error: true, message: `${controlName} is invalid` }
      : null;
  };
}

export function proxyURLValidator(controlName: string,isRequired:boolean=false) {
    return (control: AbstractControl): ValidationErrors | null => {
      return !control.value.length && isRequired
        ? { error: true, message: `${controlName} is required` }
        : control.value.length && !control.value.match(/^https?:\/\/([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+:[0-9]+/)
        ? { error: true, message: `${controlName} is invalid` }
        : null;
    };
}

export function confPasswordValidator(controlName: string,passwordField:string,confPasswordField:string) {
  return (control: AbstractControl): ValidationErrors | null => {
    let password = control.get(passwordField)?.value;
    let confPassword = control.get(confPasswordField)?.value;

    return (password.length &&confPassword.length) && password === confPassword
      ? { error: true, message: `${controlName} is not same` }
      : null;
  };
}

export function passswordValidator(
  controlName: string,
  minlength: number,
  maxlength: number
) {
  return (control: AbstractControl): ValidationErrors | null => {
    // let pattern = '^.{'+minlength+','+maxlength+'}$';
    // let pattern ='(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{'+minlength+','+maxlength+'}'
    let pattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.!@#\$%\^&\*])(?=.{'+minlength+',})'
    return !control.value.length && minlength > 0
      ? { error: true, message: `${controlName} is required` }
      : minlength > 0 && !control.value.match(new RegExp(pattern))
      ? {
          error: true,
          message: `${controlName} must contain Min no is ${minlength} and the Max is ${maxlength}`,
        }
      : null;
  };
}

export function userNameValidator(
  controlName: string,
  minlength: number,
  maxlength: number
) {
  return (control: AbstractControl): ValidationErrors | null => {
    //let pattern = '^[a-zA-Z0-9 ]{' + minlength + ',' + maxlength + '}$';
    let pattern = '^[a-zA-ZÀ-ȕ0-9_ ]{' + minlength + ',' + maxlength + '}$';
    return !control.value.length
      ? { error: true, message: `${controlName} is required` }
      : !control.value.match(new RegExp(pattern))
      ? {
          error: true,
          message: `${controlName} must contain only alphabets & number. Min no is ${minlength} and the Max is ${maxlength}`,
        }
      : null;
  };
}