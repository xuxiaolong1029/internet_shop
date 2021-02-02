
import user from './_api/user'
import basedata from './_api/basedata'
import sms from './_api/sms'
import outpatient from './_api/outpatient'
import ihosp from './_api/ihosp'
import userChannel from "./_api/userChannel";
import ihosp_fee from "./_api/ihosp_fee";
import ihosp_report from "./_api/ihosp_report";
import ihosp_payment from "./_api/ihosp_payment";
export default {
    ...user,
    ...basedata,
    ...sms,
    ...outpatient,
	...ihosp,
    ...userChannel,
    ...ihosp_fee,
    ...ihosp_report,
    ...ihosp_payment
}
