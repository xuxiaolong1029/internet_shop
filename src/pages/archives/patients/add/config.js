const NAME= 'name',
  SEX='sex',
  PATIENT_CERT_TYPE='patientCertType',//
  PATIENT_CERT_NO='patientCertNo',
  BIRTH_DATE='birthDate',
  GUARDIAN_CERT_TYPE='guardianCertType',
  GUARDIAN_CERT_NO='guardianCertNo',
  GUARDIAN_NAME='guardianName',
  VERIFY_CODE='verifyCode';
const OTHER_CARD_TYPE_ARR = [NAME,SEX,BIRTH_DATE,PATIENT_CERT_TYPE,PATIENT_CERT_NO,VERIFY_CODE]
const HAS_ID_CARD = [NAME,PATIENT_CERT_TYPE,PATIENT_CERT_NO,VERIFY_CODE]
const NO_HAS_ID_CARD = [NAME,SEX,BIRTH_DATE,GUARDIAN_CERT_TYPE,GUARDIAN_CERT_NO,GUARDIAN_NAME,VERIFY_CODE]

export default {
    NAME,SEX,PATIENT_CERT_TYPE,PATIENT_CERT_NO,BIRTH_DATE,GUARDIAN_CERT_TYPE,GUARDIAN_CERT_NO,GUARDIAN_NAME,VERIFY_CODE,
    OTHER_CARD_TYPE_ARR,
    HAS_ID_CARD,
    NO_HAS_ID_CARD
}
