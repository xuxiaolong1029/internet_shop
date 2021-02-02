import request from "@/service";
import {watchEnvHost} from '../common'
const baseUrl = watchEnvHost('http://192.168.50.129:3002');

export const USERCHANNEL_ORG_APPID = `/userChannel/channelConfig/getOrgByAppId`; //appid换orgcode

const userChannel_org_appid =  (params,options) =>  request({url:baseUrl + USERCHANNEL_ORG_APPID, data:params},options);

export default {
    userChannel_org_appid
}
