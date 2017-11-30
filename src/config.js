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
    adminList: [
        //{ value: '3346407', text: 'test_1' },
        //{ value: '3348228', text: 'test_2' },
        { value: '2026857', text: 'Alx Dark'},
        //{ value: '3351155', text: 'Bridge_Study_Creator' },
        { value: '273979', text: 'Brian Bot' },
        { value: '273984', text: 'Mike Kellen' }
    ],
    rolesList: [
        { value: 'role_researcher', text: 'Researcher' },
        { value: 'role_dev', text: 'Developer' }
    ],
    rolesList: [
        { value: 'role_researcher', text: 'Researcher' },
        { value: 'role_dev', text: 'Developer' }
    ],
    studies: {
    },
    signIn: '/v3/auth/signIn',
    signOut: '/v3/auth/signOut',
    postStudy: '/v3/studies',
    createStudyAndUsers: '/v3/studies/init',
    getStudy: '/v3/studies/',
    updateStudy: '/v3/studies/',
    getCurrentStudy: '/v3/studies/self',
    getStudyList: '/v3/studies',
    getStudySummaryList: '/v3/studies?summary=true',
    getCacheKeys: '/v3/cache',
    deleteCacheKey: '/v3/cache/',
    getSurveyList: '/v3/surveys',
    deleteSurvey: '/v3/surveys/',
    getSchemaList: '/v3/uploadschemas',
    deleteSchema: '/v3/uploadschemas/'
}
