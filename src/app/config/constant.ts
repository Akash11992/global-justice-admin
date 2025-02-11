import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class Constants {

    public readonly API_ENDPOINT: string = environment.apiUrl;
    public readonly API_MOCK_ENDPOINT: string = environment.apiMockUrl;
    public readonly API_IS_DEVELOPMENT_ENV: boolean = environment.production;


    public readonly API_ENDPOINT_registration: string = 'registration/create'

    public readonly API_ENDPOINT_registratiotjoin: string = 'subscriber/create'


    public readonly API_ENDPOINT_captcha: string = 'captcha'
    public readonly API_ENDPOINT_getDelegate: string = 'registration/delegate/non-registered'
    public readonly API_ENDPOINT_getPartner: string = 'registration/partner/non-registered'
    public readonly API_ENDPOINT_getSpeaker: string = 'registration/speaker/non-registered'

    public readonly API_ENDPOINT_getApprovedDelegate: string = 'registration/delegate/approved'

    public readonly API_ENDPOINT_getApprovedPartner: string = 'registration/partner/approved'
    public readonly API_ENDPOINT_getApprovedSpeaker: string = 'registration/speaker/approved'


    public readonly API_ENDPOINT_ApprovedRegistration: string = 'registration/status'
    // public readonly API_ENDPOINT_addpartnerr: string = 'partner/create'
    public readonly API_ENDPOINT_GET_getAllCountrycode: string = 'getAll/countrycode'
    public readonly API_ENDPOINT_GET_ALL_COUNTRY: string = 'getcountry'
    public readonly API_ENDPOINT_GET_ALL_STATES: string = 'getstate'
    public readonly API_ENDPOINT_GET_ALL_CITIES: string = 'getcity'
    public readonly API_ENDPOINT_DeleteUser: string = 'registration/delete'
    public readonly API_ENDPOINT_DeleteUserBroucher: string = 'brochure/delete'

    public readonly API_ENDPOINT_deletesalesbroucher: string = 'sales_brochure/delete'

    public readonly API_ENDPOINT_Deletejoinmailinglist: string = 'subscriber/delete'

    public readonly API_ENDPOINT_SearchUser_Delegate: string = 'registration/search'
    public readonly API_ENDPOINT_TrackingLink: string = '/Tracking/create'

    public readonly API_ENDPOINT_SearchUser_Partner: string = 'registration/user/partner/search'


    public readonly API_ENDPOINT_SearchUser_Speaker: string = 'registration/user/speaker/search'

    public readonly API_ENDPOINT_SearchUser_broucher: string = 'brochure/search'

    public readonly API_ENDPOINT_SearchUser_joinmail: string = 'subscriber/search'

    public readonly API_ENDPOINT_SearchUser_salesbroucher: string = 'sales_brochure/search'

    public readonly API_ENDPOINT_SearchNonRegisteredUser_Delegate: string = 'registration/nonregistered/delegate/search'

    public readonly API_ENDPOINT_SearchNonRegisteredUser_Partner: string = 'registration/nonregistered/partner/search'

    public readonly API_ENDPOINT_SearchNonRegisteredUser_Speaker: string = 'registration/nonregistered/speaker/search'

    public readonly API_ENDPOINT_GetAllForms: string = 'Tracking/getAll/forms'
    public readonly API_ENDPOINT_GetAllRefrence: string = 'Tracking/getAll/refrence'


    public readonly API_ENDPOINT_deleteTracking: string = 'Tracking/delete'


    public readonly API_ENDPOINT_SearchTracking: string = 'Tracking/search'
    public readonly API_ENDPOINT_getTrackingList: string = 'Tracking/getAll'

    public readonly API_ENDPOINT_login: string = 'login'
    public readonly API_ENDPOINT_otpsend: string = 'forgot-password'
    public readonly API_ENDPOINT_fillotp: string = 'forgetadmin'



    public readonly API_ENDPOINT_getDelegatePieChart: string = 'delegate/piechart'
    public readonly API_ENDPOINT_getPartnerPieChart: string = 'partner/piechart'
    public readonly API_ENDPOINT_getSpeakerPieChart: string = 'speaker/piechart'

    public readonly API_ENDPOINT_getDelegateVerticalBarChartChart: string = 'delegate/piechart/currentDate'
    public readonly API_ENDPOINT_getPartnerVerticalBarChartChart: string = 'partner/piechart/currentDate'
    public readonly API_ENDPOINT_getSpeakerVerticalBarChartChart: string = 'speaker/piechart/currentDate'


    public readonly API_ENDPOINT_getDelegateRefrencePieChartChart: string = 'delegate/refrence/piechart'

    public readonly API_ENDPOINT_getPartnerRefrencePieChart: string = 'partner/refrence/piechart'

    public readonly API_ENDPOINT_getSpeakerRefrencePieChart: string = 'speaker/refrence/piechart'


    public readonly API_ENDPOINT_getSalesBroucher: string = 'sales_brochure/getAll'
    public readonly API_ENDPOINT_getBroucher: string = 'brochure/getAll'
    public readonly API_ENDPOINT_getJoinMailingList: string = 'subscriber/getAll'


    public readonly API_ENDPOINT_Generate_Badge: string = 'registration/generate_badge'
    public readonly API_ENDPOINT_SEND_EMAIL: string = 'resend_email'
    public readonly API_ENDPOINT_Download_Badge: string = 'registration/download_badge'
    public readonly API_ENDPOINT_getUserByid: string = 'registration/user_byid'
    public readonly API_ENDPOINT_update_user_details: string = 'registration/updateDetails'


    public readonly API_ENDPOINT_getContactUs: string = 'getAllContactUsData'
    public readonly API_ENDPOINT_SEARCH_PEACEKEEPER_USER: string = 'getAllpeacekeeper'
    public readonly API_ENDPOINT_getPeacekeeper: string = 'getAllpeacekeeper'
    public readonly API_ENDPOINT_DELETE_PEACEKEEPER: string = 'delete_peacekeeper'
    public readonly API_ENDPOINT_PEACE_UPDATE_GENERATE_QR: string = 'update_peacekeeper'

    public readonly API_ENDPOINT_ApprovedDelegate: string = 'mail_discount_code'

    public readonly API_ENDPOINT_ADD_SPONSORSHIP: string = 'sponsorships/add'
    public readonly API_ENDPOINT_EDIT_SPONSORSHIP: string = 'sponsorships/edit'
    public readonly API_ENDPOINT_DELETE_SPONSORSHIP: string = 'sponsorships/delete'
    public readonly API_ENDPOINT_GET_SPONSORSHIP: string = 'sponsorships/get'
    public readonly API_ENDPOINT_LIST_SPONSORSHIP: string = 'sponsorships/list'


    public readonly API_ENDPOINT_LIST_PEACEKEEPER: string = 'getAllpeacekeeperDropdown'
    public readonly API_ENDPOINT_LIST_COUNTRY: string = 'get_delegate_country'
    public readonly API_ENDPOINT_LIST_STATE: string = 'get_delegate_state'
    public readonly API_ENDPOINT_LIST_CITY: string = 'get_delegate_city'


}


