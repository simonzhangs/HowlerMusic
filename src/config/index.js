const env = process.env.NODE_ENV || 'prod';

const envConfig = {
    development:{
        VUE_APP_NETEASE_API_URL: 'http://localhost:3000',
    },
    production:{
        VUE_APP_NETEASE_API_URL: 'https://api.woaitouxiang.top/',
    }
}

export default {
    env,
    ...envConfig[env]
}