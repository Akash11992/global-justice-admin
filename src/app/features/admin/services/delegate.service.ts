import { Injectable } from '@angular/core';
import { ApiEndpointsService } from "src/app/core/services/api-endpoints.service";
import { ApiHttpService } from "src/app/core/services/api-http.service";


@Injectable({
  providedIn: 'root'
})
export class DelegateService {

  constructor(
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
    // private translate: TranslateService
  ) { }
  
  //.
  getAllCountrycode() {
    return this._apiHttpService.get(this._apiEndpointsService.getAllCountrycodeEndpoint());
  }

  //.
  getAllCountries() {
    return this._apiHttpService.get(this._apiEndpointsService.getAllCountryForDelegatesEndpoint());
  }

  //.
  getAllStates(country_id: any) {
    return this._apiHttpService.get(this._apiEndpointsService.getStatesByCountryEndpoint(country_id));
  }

  //.
  getAllCities(state_id: any) {
    return this._apiHttpService.get(this._apiEndpointsService.getCityByStateEndpoint(state_id));

  }

}
