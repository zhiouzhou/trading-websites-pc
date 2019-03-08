/*实名认证入口*/
const CertificationEntry = (resolve) => {
    import('@/views/realNameCertification/certificationEntry.vue').then((module) => {
        resolve(module)
    })
}

const PhoneCertification = (resolve) => {
    import('@/views/realNameCertification/phoneCertification.vue').then((module) => {
        resolve(module)
    })
}
const RealNameCertification = (resolve) => {
    import('@/views/realNameCertification/realNameCertification.vue').then((module) => {
        resolve(module)
    })
}
const RealNameExamine = (resolve) => {
    import('@/views/realNameCertification/realNameExamine.vue').then((module) => {
        resolve(module)
    })
}
const authentication = [{
    path: '/certificationEntry',
    name: 'certificationEntry',
    component: CertificationEntry,
    children: [
        {
            path: 'phoneCertification',
            name: 'phoneCertification',
            component: PhoneCertification
        },
        {
            path: 'realNameCertification',
            name: 'realNameCertification',
            component: RealNameCertification
        },
        {
            path: 'realNameExamine',
            name: 'realNameExamine',
            component: RealNameExamine
        },
    ]
}]
export default authentication