import { Component ,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-discount-coupan',
  templateUrl: './add-discount-coupan.component.html',
  styleUrls: ['./add-discount-coupan.component.css']
})
export class AddDiscountCoupanComponent implements OnInit {
  couponForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.couponForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      country: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\\d{10}$/)]],
      discount: [7, [Validators.required, Validators.min(1), Validators.max(100)]],
      couponCode: [{ value: '', disabled: true }], // Disabled for read-only
      qrCode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.couponForm.valueChanges.subscribe(() => this.generateCouponCode());
  }

  generateCouponCode(): void {
    const firstName = this.couponForm.get('firstName')?.value ;
    const lastName = this.couponForm.get('lastName')?.value ;
    const country = this.couponForm.get('country')?.value ;
    const email = this.couponForm.get('email')?.value ;
    const mobile = this.couponForm.get('mobile')?.value ;
debugger
    // Generate parts of the coupon code
    const firstChar = firstName.charAt(0).toUpperCase();
    const lastChar = lastName.charAt(0).toUpperCase();
    const countryChars = country.substring(0, 2).toUpperCase();
    const emailChars = email.substring(0, 2).toUpperCase();
    const mobileStart = mobile.substring(0, 2);
    const mobileEnd = mobile.slice(-2);
console.log(mobile.length,'mobile');

    // Combine the parts into a 16-character code
    if(firstName!==""&&lastName!==""&&country!==""&&email!==""&&mobile!==""&&mobile.length>9){
      const randomChars = this.generateRandomChars(16 - (firstChar.length + lastChar.length + mobileStart.length + mobileEnd.length + countryChars.length + emailChars.length ));
      const couponCode = `${firstChar}${lastChar}${mobileStart}${mobileEnd}${countryChars}${emailChars}${randomChars}`;
      this.couponForm.get('couponCode')?.setValue(couponCode);

    }

    // Update the coupon code field
  }

  generateRandomChars(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  onGenerateQR(): void {
    const qrData = this.couponForm.value;
    console.log('QR Data:', qrData);
    // Logic to generate QR code can go here.
  }

  onSave(): void {
    if (this.couponForm.valid) {
      console.log('Form Data:', this.couponForm.value);
      // Logic to save the data can go here.
    } else {
      console.log('Form is invalid');
    }
  }
}
