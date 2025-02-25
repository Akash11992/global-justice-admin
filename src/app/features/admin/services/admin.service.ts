import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpointsService } from "src/app/core/services/api-endpoints.service";
import { ApiHttpService } from "src/app/core/services/api-http.service";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
  ) { }


  getDelegate() {
    return this._apiHttpService.get(this._apiEndpointsService.getDelegateEndpoint());
  }

  getPartner() {
    return this._apiHttpService.get(this._apiEndpointsService.getPartnerEndpoint());
  }

  getSpeaker() {
    return this._apiHttpService.get(this._apiEndpointsService.getSpeakerEndpoint());
  }
//approvel
getApprovedDelegate(data:any) {
  return this._apiHttpService.post(this._apiEndpointsService.getApprovedDelegateEndpoint(data),data);
}



getApprovedPartner() {
  return this._apiHttpService.get(this._apiEndpointsService.getApprovedPartnerEndpoint());
}

getApprovedSpeaker() {
  return this._apiHttpService.get(this._apiEndpointsService.getApprovedSpeakerEndpoint());
}




getAllFormsEndpoint() {
  return this._apiHttpService.get(this._apiEndpointsService.getAllFormsEndpoint());
}


getAllRefrenceEndpoint() {
  return this._apiHttpService.get(this._apiEndpointsService.getAllRefrenceEndpoint());
}

TrackingLink(body:any) {
  return this._apiHttpService.post(this._apiEndpointsService.TrackingLink(),body);
}

  ApprovedUnapproveStatusRegistration(body:any) {
    return this._apiHttpService.put(this._apiEndpointsService.ApprovedRegistration(),body);
  }
 DeleteUser(body:any) {
    return this._apiHttpService.patch(this._apiEndpointsService.DeleteUser(),body);
  }

  Deletejoinmailinglist(body:any) {
    return this._apiHttpService.patch(this._apiEndpointsService.Deletejoinmailinglist(),body);
  }

  deletesalesbroucher(body:any) {
    return this._apiHttpService.patch(this._apiEndpointsService.deletesalesbroucher(),body);
  }


  DeleteBroucher(body:any) {
    return this._apiHttpService.patch(this._apiEndpointsService.DeleteUserBroucher(),body);
  }

  DeleteTracking(body:any) {
    return this._apiHttpService.patch(this._apiEndpointsService.DeleteTracking(),body);
  }
  getAllTracking() {
    return this._apiHttpService.get(this._apiEndpointsService.getAllTracking());
  }

  SearchTracking(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.SearchTracking(),body);
  }
  SearchDelegateUser(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.SearchUser(),body);
  }

  SearchPartnerUser(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.SearchPartnerUser(),body);
  }

  SearchSpeakerUser(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.SearchSpeakerUser(),body);
  }

  Searchbroucher(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.Searchbroucher(),body);
  }

  Searchjoinmail(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.Searchjoinmail(),body);
  }

  Searchsalesbroucher(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.Searchsalesbroucher(),body);
  }


  SearchDelegateNonUser(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.SearchDelegateNonUser(),body);
  }
  SearchPartnernNonUser(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.SearchPartnerNonUser(),body);
  }
  SearchSpeakerNonUser(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.SearchSpeakerNonUser(),body);
  }

  login(data:any) {
    return this._apiHttpService.post(this._apiEndpointsService.login(data),data
    )
  }


  otpsend(data:any) {
    return this._apiHttpService.post(this._apiEndpointsService.otpsend(data),data
    )
  }

  fillotp(data:any) {
    return this._apiHttpService.put(this._apiEndpointsService.fillotp(data),data
    )
  }

  getDelegatePieChart() {
    return this._apiHttpService.get(this._apiEndpointsService.getDelegatePieChartEndpoint());
  }
  getPartnerPieChart() {
    return this._apiHttpService.get(this._apiEndpointsService.getPartnerPieChartEndpoint());
  }
  getSpeakerPieChart() {
    return this._apiHttpService.get(this._apiEndpointsService.getSpeakerPieChartEndpoint());
  }

  getDelegateVerticalBarChart() {
    return this._apiHttpService.get(this._apiEndpointsService.getDelegateVerticalBarChartEndpoint());
  }
  getPartnerVerticalBarChart() {
    return this._apiHttpService.get(this._apiEndpointsService.getPartnerVerticalBarChartEndpoint());
  }
  getSpeakerVerticalBarChart() {
    return this._apiHttpService.get(this._apiEndpointsService.getSpeakerVerticalBarChartEndpoint());
  }


  getDelegateRefrencePieChart() {
    return this._apiHttpService.get(this._apiEndpointsService.getDelegateRefrencePieChartEndpoint());
  }

  getPartnerRefrencePieChart() {
    return this._apiHttpService.get(this._apiEndpointsService.getPartnerRefrencePieChartEndpoint());
  }
  getSpeakerRefrencePieChart() {
    return this._apiHttpService.get(this._apiEndpointsService.getSpeakerRefrencePieChartEndpoint());
  }
  getJoinMailingListEndpoint() {
    return this._apiHttpService.get(this._apiEndpointsService.getJoinMailingListEndpoint());
  }
  getBroucherEndpoint() {
    return this._apiHttpService.get(this._apiEndpointsService.getBroucherEndpoint());
  }
  getSalesBroucherEndpoint() {
    return this._apiHttpService.get(this._apiEndpointsService.getSalesBroucherEndpoint());
  }


  Generate_Badge(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.Generate_Badge(),body);
  }
  Download_Badge(body: any) {
    return this._apiHttpService.post(this._apiEndpointsService.Download_Badge(), body, { responseType: 'blob' });
  }
  
  getUserByid(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.getUserByid(),body);
  }

  update_user_details(body:any) {
    return this._apiHttpService.put(this._apiEndpointsService.update_user_details(),body);
  }


  getContactUsApi(data:any) {
    return this._apiHttpService.post(this._apiEndpointsService.getContactUsEndpoint(data),data);
  }
  
  
  
  getPeacekeeper(searchParams:string,pagesize:string,pagenumber:string) {
    return this._apiHttpService.get(this._apiEndpointsService.getPeacekeeperEndpoint(searchParams,pagesize,pagenumber));
  }

  //encrypted 
  getAllPeacekeeperData(data:any) {
    return this._apiHttpService.post(this._apiEndpointsService.getAllPeacekeeperDataEndpoint(data),data);
  }
  
  SearchPeacekeeperUser(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.SearchPeacekeeperUserEndpoint(),body);
  }

  postPeacekeeper(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.postPeacekeeperEndpoint(),body);
  }
  
  deletePeacekeeperApi(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.deletePeacekeeperEndpoint(),body);
  }


  Send_Email(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.Send_Email(),body);
  }

  ApprovedUnapproveStatus(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.ApprovedRegistrationEndpoint(),body);
  }

  //sponsorship
  createSponsership(bodyParams:any): Observable<any> {
    return this._apiHttpService.post(this._apiEndpointsService.addSponsorshipEndpoint(),bodyParams);
  }
  
  updateSponsorship(id: string, data: any): Observable<any> {
    return this._apiHttpService.put(this._apiEndpointsService.editSponsorshipByIdEndpoint(id), data);
  }

  deleteSponsorship(id: string): Observable<any> {
    return this._apiHttpService.delete(this._apiEndpointsService.deleteSponsorshipByIdEndpoint(id));
  }

  getSponsorship(id: string): Observable<any> {
    return this._apiHttpService.get(this._apiEndpointsService.getSponsorshipByIdEndpoint(id));
  }

  listSponsorship(queryParamsObj: any): Observable<any> {
    return this._apiHttpService.get(this._apiEndpointsService.listSponsorshipByPaginationAndSearchAndSortingEndpoint(queryParamsObj));
  }

  //collaborator
  createCollaborator(bodyParams:any): Observable<any> {
    return this._apiHttpService.post(this._apiEndpointsService.addCollaboratorEndpoint(),bodyParams);
  }
  
  updateCollaborator(id: string, data: any): Observable<any> {
    return this._apiHttpService.put(this._apiEndpointsService.editCollaboratorByIdEndpoint(id), data);
  }

  deleteCollaborator(id: string): Observable<any> {
    return this._apiHttpService.delete(this._apiEndpointsService.deleteCollaboratorByIdEndpoint(id));
  }

  getCollaborator(id: string): Observable<any> {
    return this._apiHttpService.get(this._apiEndpointsService.getCollaboratorIdEndpoint(id));
  }

  listCollaborator(queryParamsObj: any): Observable<any> {
    return this._apiHttpService.get(this._apiEndpointsService.listCollaboratorByPaginationAndSearchAndSortingEndpoint(queryParamsObj));
  }

  listSponosorshipType(): Observable<any> {
    return this._apiHttpService.get(this._apiEndpointsService.listSponsorshipTypeEndpoint());
  }

  listCountry(): Observable<any> {
    return this._apiHttpService.get(this._apiEndpointsService.listCountryEndpoint());
  }

  getStateById(id: string): Observable<any> {
    return this._apiHttpService.get(this._apiEndpointsService.getStateByIdEndpoint(id));
  }

  getCityById(id: string): Observable<any> {
    return this._apiHttpService.get(this._apiEndpointsService.getCityByIdEndpoint(id));
  }

  listPeaceKeeper(): Observable<any> {
    return this._apiHttpService.get(this._apiEndpointsService.listPeaceKeeperEndpoint());
  }

  addDeletgate(bodyParams:any): Observable<any> {
    return this._apiHttpService.post(this._apiEndpointsService.addDeletgateEndPoint(),bodyParams);
  }

  getAllCountrycode() {
    return this._apiHttpService.get(this._apiEndpointsService.getAllCountrycodeEndpoint());
  }

  updateDelegateByTypeRef(data: any): Observable<any> {
    return this._apiHttpService.put(this._apiEndpointsService.updateDelegateByTypeReferenceEndpoint(), data);
  }


}
