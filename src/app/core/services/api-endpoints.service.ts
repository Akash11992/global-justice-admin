import { Injectable } from '@angular/core';
import { UrlBuilder } from 'src/app/shared/classes/url.builder';
import { QueryStringParameters } from '../../shared/classes/query-string-parameters';
import { Constants } from 'src/app/config/constant';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class ApiEndpointsService {
  constructor(
    // Application Constants
    private _constants: Constants
  ) { }
  /* #region URL CREATOR */
  // URL
  private createUrl(
    action: string,
    isMockAPI: boolean = false
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      isMockAPI ? this._constants.API_MOCK_ENDPOINT :
        this._constants.API_ENDPOINT,
      action
    );
    return urlBuilder.toString();
  }
  // URL WITH QUERY PARAMS
  private createUrlWithQueryParameters(
    action: string,
    queryStringHandler?:
      (queryStringParameters: QueryStringParameters) => void
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      this._constants.API_ENDPOINT,
      action
    );
    // Push extra query string params
    if (queryStringHandler) {
      queryStringHandler(urlBuilder.queryString);
    }
    return urlBuilder.toString();
  }

  // URL WITH QUERY PARAMS
  private createUrlWithQueryParametersExclude(
    action: string,
    queryStringHandler?:
      (queryStringParameters: QueryStringParameters) => void
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      this._constants.API_ENDPOINT,
      action
    );
    // Push extra query string params
    if (queryStringHandler) {
      queryStringHandler(urlBuilder.queryString);
    }
    return urlBuilder.toString();
  }

  // URL WITH PATH VARIABLES
  private createUrlWithPathVariables(
    action: string,
    pathVariables: any[] = []
  ): string {
    let encodedPathVariablesUrl: string = '';
    // Push extra path variables
    for (const pathVariable of pathVariables) {
      if (pathVariable !== null) {
        encodedPathVariablesUrl +=
          `/${encodeURIComponent(pathVariable.toString())}/`;
      }
    }
    const urlBuilder: UrlBuilder = new UrlBuilder(
      this._constants.API_ENDPOINT,
      `${action}${encodedPathVariablesUrl}`
    );
    return urlBuilder.toString();
  }
  /* #endregion */

  private createPostInstallUrl(
    action: string,
    isMockAPI: boolean = false
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      isMockAPI ? this._constants.API_MOCK_ENDPOINT :
        '',
      action
    );
    return urlBuilder.toString();
  }

  //Example

  //   public getNewsEndpoint(): string {
  //     return this.createUrl('news');
  //   }

  //   This method will return:
  //    https://domain.com/api/news


  //   public getNewsEndpoint(): string {
  //     return this.createUrl('news', true);
  //   }

  //   This method will return:
  //   https://mock-domain.com/api/news


  //   public getProductListByCountryAndPostalCodeEndpoint(
  //     countryCode: string, 
  //     postalCode: string
  //   ): string {
  //     return this.createUrlWithQueryParameters(
  //       'productlist', 
  //       (qs: QueryStringParameters) => {
  //         qs.push('countryCode', countryCode);
  //         qs.push('postalCode', postalCode);
  //       }
  //     );
  //   }

  //   This method will return:
  //   https://domain.com/api/productlist?countrycode=en&postalcode=12345


  //   public getDataByIdAndCodeEndpoint(
  //     id: string,
  //     code: number
  //   ): string {
  //     return this.createUrlWithPathVariables('data', [id, code]);
  //   }

  //   This method will return:
  //   https://domain.com/api/data/12/67


  // Now, let’s go to a component and use them all together.

  // constructor(
  //   // Application Services
  //   private apiHttpService: ApiHttpService,
  //   private apiEndpointsService: ApiEndpointsService
  // ) {
  //     ngOnInit() {
  //     this.apiHttpService
  //       .get(this.apiEndpointsService.getNewsEndpoint())
  //       .subscribe(() => {
  //         console.log('News loaded'))
  //       });
  // }

  // public getCSRFEndpoint(): string {
  //   return this.createUrl(this._constants.API_ENDPOINT_CSRF);
  // }

  // public addDelegateEndpoint(): string {
  //   return this.createUrl(this._constants.API_ENDPOINT_addDelegate);
  // }
  // public addSpeakerEndpoint(): string {
  //   return this.createUrl(this._constants.API_ENDPOINT_addSpeaker);
  // }
  // public addpartnerEndpoint(): string {
  //   return this.createUrl(this._constants.API_ENDPOINT_addpartnerr);
  // }

  public registrationEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_registration);
  }


  public registratiotjoinEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_registratiotjoin);
  }
  public captchaEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_captcha);
  }
  public getDelegateEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getDelegate);
  }

  public getPartnerEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getPartner);
  }

  public getSpeakerEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getSpeaker);
  }

  //approvel

  public getApprovedDelegateEndpoint(data:any): string {
    return this.createUrl(this._constants.API_ENDPOINT_getApprovedDelegate);
  }

  public updateDelegateByTypeReferenceEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_updateDelegateByTypeReference);
  }


  public getApprovedPartnerEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getApprovedPartner);
  }

  public getApprovedSpeakerEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getApprovedSpeaker);
  }


  public TrackingLink(): string {
    return this.createUrl(this._constants.API_ENDPOINT_TrackingLink);
  }
 
  public ApprovedRegistration(): string {
    return this.createUrl(this._constants.API_ENDPOINT_ApprovedRegistration);
  }

  public DeleteUser(): string {
    return this.createUrl(this._constants.API_ENDPOINT_DeleteUser);
  }

  public deletesalesbroucher(): string {
    return this.createUrl(this._constants.API_ENDPOINT_deletesalesbroucher);
  }

  public Deletejoinmailinglist(): string {
    return this.createUrl(this._constants.API_ENDPOINT_Deletejoinmailinglist);
  }


  public DeleteUserBroucher(): string {
    return this.createUrl(this._constants.API_ENDPOINT_DeleteUserBroucher);
  }

  public DeleteTracking(): string {
    return this.createUrl(this._constants.API_ENDPOINT_deleteTracking);
  }
  public SearchTracking(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SearchTracking);
  }

  public getAllTracking(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getTrackingList);
  }
  public SearchUser(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SearchUser_Delegate);
  }

  public SearchPartnerUser(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SearchUser_Partner);
  }
  public SearchSpeakerUser(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SearchUser_Speaker);
  }

  public Searchbroucher(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SearchUser_broucher);
  }
  public Searchsalesbroucher(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SearchUser_salesbroucher );
  }

  public Searchjoinmail(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SearchUser_joinmail);
  }

  public SearchDelegateNonUser(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SearchNonRegisteredUser_Delegate);
  }
  public SearchPartnerNonUser(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SearchNonRegisteredUser_Partner);
  }
  public SearchSpeakerNonUser(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SearchNonRegisteredUser_Speaker);
  }
  



  public getAllCountrycodeEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_getAllCountrycode);
  }
  public getAllCountriesEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_ALL_COUNTRY);
  }

  public getAllFormsEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GetAllForms);
  }
  public getAllRefrenceEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GetAllRefrence);
  }
  public getAllStatesEndpoint(country_id:any): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_ALL_STATES + '/' + country_id);
  }

  public getAllCitiesEndpoint(state_id:any): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_ALL_CITIES + '/' + state_id);
  }

  public login(data:any): string {
    return this.createUrl(this._constants.API_ENDPOINT_login );
  }

  public otpsend(data:any): string {
    return this.createUrl(this._constants.API_ENDPOINT_otpsend );
  }
  public fillotp(data:any): string {
    return this.createUrl(this._constants.API_ENDPOINT_fillotp );
  }

  
  public getDelegatePieChartEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getDelegatePieChart);
  }
  public getPartnerPieChartEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getPartnerPieChart);
  }
  public getSpeakerPieChartEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getSpeakerPieChart);
  }

    
  public getDelegateVerticalBarChartEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getDelegateVerticalBarChartChart);
  }
  public getPartnerVerticalBarChartEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getPartnerVerticalBarChartChart);
  }
  public getSpeakerVerticalBarChartEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getSpeakerVerticalBarChartChart);
  }

  public getDelegateRefrencePieChartEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getDelegateRefrencePieChartChart);
  }
  public getPartnerRefrencePieChartEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getPartnerRefrencePieChart);
  }
  public getSpeakerRefrencePieChartEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getSpeakerRefrencePieChart);
  }

  public getSalesBroucherEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getSalesBroucher);
  }

  public getBroucherEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getBroucher);
  }

  public getJoinMailingListEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getJoinMailingList);
  }


  public Generate_Badge(): string {
    return this.createUrl(this._constants.API_ENDPOINT_Generate_Badge);
  }
  public Download_Badge(): string {
    return this.createUrl(this._constants.API_ENDPOINT_Download_Badge);
  }

  public getUserByid(): string {
    return this.createUrl(this._constants.API_ENDPOINT_getUserByid);
  }

  public update_user_details(): string {
    return this.createUrl(this._constants.API_ENDPOINT_update_user_details);
  }

  public getContactUsEndpoint(data:any): string {
    return this.createUrl(this._constants.API_ENDPOINT_getContactUs);
  }


  public getPeacekeeperEndpoint(
    searchParams:string,
    pagesize: string,
    pagenumber: string
  ): string {
    return this.createUrlWithQueryParameters(this._constants.API_ENDPOINT_getPeacekeeper,
      (qs: QueryStringParameters) => {
        qs.push('name', searchParams);
        qs.push('page_size', pagesize);
        qs.push('page_no', pagenumber);
      });
  }

  public getAllPeacekeeperDataEndpoint(data:any): string {
    return this.createUrl(this._constants.API_ENDPOINT_getPeacekeeper );
  }


  public SearchPeacekeeperUserEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SEARCH_PEACEKEEPER_USER);
  }

  public postPeacekeeperEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_PEACE_UPDATE_GENERATE_QR);
  }

  public deletePeacekeeperEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_DELETE_PEACEKEEPER);
  }

  public Send_Email(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SEND_EMAIL);
  }
  public ApprovedRegistrationEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_ApprovedDelegate);
  }


  //sponsorship
  public addSponsorshipEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_ADD_SPONSORSHIP);
  }

  public editSponsorshipByIdEndpoint(id: string): string {
    return this.createUrlWithPathVariables(this._constants.API_ENDPOINT_EDIT_SPONSORSHIP, [id]);
  }

  public deleteSponsorshipByIdEndpoint(id: string): string {
    return this.createUrlWithPathVariables(this._constants.API_ENDPOINT_DELETE_SPONSORSHIP, [id]);
  }

  public getSponsorshipByIdEndpoint(id: string): string {
    return this.createUrlWithPathVariables(this._constants.API_ENDPOINT_GET_SPONSORSHIP, [id]);
  }

  public listSponsorshipByPaginationAndSearchAndSortingEndpoint(
    queryParamsObj:any
  ): string {
    return this.createUrlWithQueryParameters(this._constants.API_ENDPOINT_LIST_SPONSORSHIP,
      (qs: QueryStringParameters) => {
        qs.push('page', queryParamsObj['page']),
        qs.push('limit', queryParamsObj['limit']),
        qs.push('sort', queryParamsObj['sort']),
        qs.push('order', queryParamsObj['order']),
        qs.push('search', queryParamsObj['search'])
      });
  }

  public listSponsorshipTypeEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_LIST_SPONSORSHIP_TYPE);
  }

  //collaborator
  public addCollaboratorEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_ADD_COLLABORATOR);
  }

  public editCollaboratorByIdEndpoint(id: string): string {
    return this.createUrlWithPathVariables(this._constants.API_ENDPOINT_EDIT_COLLABORATOR, [id]);
  }

  public deleteCollaboratorByIdEndpoint(id: string): string {
    return this.createUrlWithPathVariables(this._constants.API_ENDPOINT_DELETE_COLLABORATOR, [id]);
  }

  public getCollaboratorIdEndpoint(id: string): string {
    return this.createUrlWithPathVariables(this._constants.API_ENDPOINT_GET_COLLABORATOR, [id]);
  }

  public listCollaboratorByPaginationAndSearchAndSortingEndpoint(
    queryParamsObj:any
  ): string {
    return this.createUrlWithQueryParameters(this._constants.API_ENDPOINT_LIST_COLLABORATOR,
      (qs: QueryStringParameters) => {
        qs.push('page', queryParamsObj['page']),
        qs.push('limit', queryParamsObj['limit']),
        qs.push('sort', queryParamsObj['sort']),
        qs.push('order', queryParamsObj['order']),
        qs.push('search', queryParamsObj['search'])
      });
  }

  public listPeaceKeeperEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_LIST_PEACEKEEPER);
  }

  //country, state, city
  public listCountryEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_LIST_COUNTRY);
  }

  public getStateByIdEndpoint(id: string): string {
    return this.createUrlWithPathVariables(this._constants.API_ENDPOINT_LIST_STATE, [id]);
  }

  public getCityByIdEndpoint(id: string): string {
    return this.createUrlWithPathVariables(this._constants.API_ENDPOINT_LIST_CITY, [id]);
  }

  public addDeletgateEndPoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_ADD_DELEGATE);
  }
}
