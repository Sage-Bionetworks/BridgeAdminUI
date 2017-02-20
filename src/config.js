module.exports = {
    environments: [
            {value: 'local', label: 'Local'},
            {value: 'develop', label: 'Development'},
            {value: 'staging', label: 'Staging'},
            {value: 'production', label: 'Production'}
    ],
    host: {
        'local': 'http://localhost:9000',
        'develop': 'https://webservices-develop.sagebridge.org',
        'staging': 'https://webservices-staging.sagebridge.org',
        'production': 'https://webservices.sagebridge.org'
    },
    adminList: {
        test_1: '3346407',
        test_2: '3348228',
        Bridge_Study_Creator: '3351155',
        Brian_Bot: '273979',
        Mike_Kellen: '273984'
    },
    studies: {
    },
    signIn: '/v3/auth/signIn',
    signOut: '/v3/auth/signOut',
    postStudy: '/v3/studies',
    createStudyAndUsers: '/v3/studies/init',
    getStudy: '/v3/studies/',
    updateStudy: '/v3/studies/',
    getCurrentStudy: '/v3/studies/self',
    getStudyList: '/v3/studies'
}
