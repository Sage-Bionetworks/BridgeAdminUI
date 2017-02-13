import {router} from '../main'
import config from '../config'
import store from '../store'

// URL and endpoint constants
const API_URL = 'http://localhost:9000'
const LOGIN_URL = API_URL + config.signIn
// const SIGNUP_URL = API_URL + 'users/'
const SESSION_KEY = 'session'

let session = null

export default {

  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  // Send a request to the login URL and save the returned JWT
  logIn (context, creds, redirect) {
    this.API_URL = config.host[creds.env]
    return context.$http.post(LOGIN_URL, creds, (data) => {
      data.studyName = creds.study
      data.studyId = data.study
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(data))
      session = data
      this.user.authenticated = true

      store.commit('refresh')

      // Redirect to a specified route
      if (redirect) {
        router.replace(redirect)
      }
    }).error((err) => {
      context.error = err
    })
  },

  // To log out, we just need to remove the token
  logOut (redirect) {
    window.localStorage.removeItem(SESSION_KEY)
    store.commit('refresh')
    router.replace(redirect)
  },

  checkAuth () {
    var jwt = JSON.parse(window.localStorage.getItem(SESSION_KEY))
    if (jwt) {
      return true
    } else {
      return false
    }
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader () {
    var headers = {'Content-Type': 'application/json'}
    if (session && session.sessionToken) {
      headers['Bridge-Session'] = session.sessionToken
    }
    return headers
  },

  createStudyAndUser (context, adminIds, study, users, redirect) {
    var body = {
      'adminIds': adminIds,
      'study': study,
      'users': users
    }
    return context.$http.post(API_URL + config.createStudyAndUser, body, {
      headers: this.getAuthHeader()
    }).then(response => {
      if (redirect) {
        router.replace(redirect)
      }
    }).error((err) => {
      context.error = err
    })
  },

  getStudyList (context) {
    return context.$http.get(API_URL + config.getStudyList, {
      headers: this.getAuthHeader()
    }).then(response => {
      var data = response.data
      context.studyList = data.items
    }).error((err) => {
      context.error = err
    })
  }
}
