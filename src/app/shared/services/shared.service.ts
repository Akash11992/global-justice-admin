import { Injectable } from '@angular/core';
import { ApiEndpointsService } from 'src/app/core/services/api-endpoints.service';
import { ApiHttpService } from 'src/app/core/services/api-http.service';
import { BehaviorSubject, Observable, Subject, Observer } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  apiUrl: any = environment.apiUrl;

  permissionData : any;

  private refreshPermissionSubject = new Subject<boolean>();
  private refreshPeacekeeperSubject = new Subject<boolean>();
  refresh$ = this.refreshPermissionSubject.asObservable();
  refreshPeacekeeper$ = this.refreshPeacekeeperSubject.asObservable();


  constructor(
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
    private _toastr :ToastrService,
    private http: HttpClient
  ) { }
  ToastPopup(errorMsg: string, errorModule: string, errorType: string) {
    switch (errorType) {
      case 'error':
        this._toastr.error(errorMsg, errorModule, {
          progressBar: true,
        });

        break;

      case 'info':
        this._toastr.info(errorMsg, errorModule, {
          progressBar: true,
        });

        break;

      case 'success':
        this._toastr.success(errorMsg, errorModule, {
          progressBar: true,
        });

        break;
    }
  }

  refreshTicker() {
    this.refreshPeacekeeperSubject.next(true);
  }

  registration(data:any) {
    return this._apiHttpService.post(this._apiEndpointsService.registrationEndpoint(),data
    )
  }

  capchaa() {
    return this._apiHttpService.get(this._apiEndpointsService.captchaEndpoint()
    )
  }


  registratiotjoin(data:any) {
    return this._apiHttpService.post(this._apiEndpointsService.registratiotjoinEndpoint(),data
    )
  }
  getAllCountries() {
    return this._apiHttpService.get(this._apiEndpointsService.getAllCountriesEndpoint());
  }

  getAllStates(country_id: any) {
    return this._apiHttpService.get(this._apiEndpointsService.getAllStatesEndpoint(country_id));
  }

  getAllCities(state_id: any) {
    return this._apiHttpService.get(this._apiEndpointsService.getAllCitiesEndpoint(state_id));

  }
  getAllCountrycode() {
    return this._apiHttpService.get(this._apiEndpointsService.getAllCountrycodeEndpoint());
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
  
  private secretKey = '6b5872594167471930cfe5c0b99cb6bfafd7b1601ee9f439359a7dde010a5ce9'; // Use a secure key & store it safely

  encryptData(data: any): string {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, this.secretKey).toString();
  }

  decryptData(cipherText: string): any {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }



  getJWTToken() {
    return localStorage.getItem('authToken');
  }

  setJWTToken(res: string) {
    sessionStorage.setItem('res', res);
    localStorage.setItem('res', res);
  }

  getUserDetails() {
    return JSON.parse(localStorage.getItem('userDetails') || '{}');
  }

  setUserDetails(userDetails: any) {
    sessionStorage.setItem('userDetails', userDetails);
    localStorage.setItem('userDetails', userDetails);
  }

  downloadFile(filePath: string, fileName: string) {
    this.http
      .get(filePath, { responseType: 'blob' })
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      ()=> console.log("not found"));
  }


}
