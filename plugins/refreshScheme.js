export default class RefreshScheme {
  constructor (auth, options) {
    this.$auth = auth
    this.$store = auth.ctx.store
    this.$redirect = auth.ctx.redirect
    this.axios = auth.ctx.app.$axios
    this.cookies = auth.ctx.app.$cookies

    this.options = Object.assign({}, DEFAULTS, options)
    this.jwtKey = this.options.endpoints.login.token
    this.refreshKey = this.options.endpoints.refresh.token

    this.refreshLoopIndex = null
  }

  _setAxiosAuthorization (jwt) {
    // Prepend tokenType (i.e. 'Bearer') to the jwt_token
    const token = this.options.tokenType ? this.options.tokenType + ' ' + jwt : jwt
    return this.axios.setHeader('Authorization', token)
  }

  _setToken (name, value, expiresAt) {
    // Default to expire in seven days
    const today = new Date()
    let expires = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)

    if (expiresAt !== undefined) {
      // JWT date is divided by 1000
      expires = new Date(expiresAt * 1000)
    }

    return this.cookies.set(`${this.options.prefix}.${name}`, value, {
      expires,
      path: '/'
    })
  }

  _getToken (name) {
    return this.cookies.get(`${this.options.prefix}.${name}`)
  }

  _clearToken (name) {
    return this.cookies.remove(`${this.options.prefix}.${name}`, {
      path: '/'
    })
  }

  // Allow user to pass in their own JWT, because on initial login, the token isn't set yet
  // which means _getToken returns nothing exciting.
  _parseJWT (jwt = this._getToken(this.jwtKey)) {
    // Handle a missing JWT possibility gracefully
    return jwt ? JSON.parse(this._atob(jwt.split('.')[1])) : {}
  }

  // Server-side doesn't have the same atob that the browser has. Instead of more node modules,
  // this is a simple buffer implementation stolen from stackoverflow
  _atob (base64String) {
    if (typeof atob === 'undefined') {
      return Buffer.from(base64String, 'base64').toString()
    } else {
      return atob(base64String)
    }
  }

  // Work out the interval, and hit that refresh loop. Also save the refresh loop index so we can
  // cancel at a later date if needs be.
  _triggerRefresh () {
    const tokenData = this._parseJWT()
    // Subtract sixty seconds as a grace period before the token expires
    const interval = ((tokenData.exp - tokenData.iat) * 1000) / 2

    this.refreshLoopIndex = this._refreshLoop(interval)
    return this.refreshLoopIndex
  }

  _refreshLoop (interval) {
    // Only trigger a refresh loop in the browser. There is a possibility that refresh loops
    // server-side mess up the refresh token.
    if (typeof window !== 'undefined') {
      return setInterval(() => {
        return this._loginWithRefresh()
          .catch((err) => {
            console.warn(err.message)
            // You can trigger a login popup here.
          })
      }, interval)
    }
  }

  _clearRefreshLoop () {
    // Could possibly clear the JWT and authorization headers here too. Basically a _logoutLocally
    // without notifying the auth (which would then kick the user)
    this._clearToken(this.refreshKey)
    clearInterval(this.refreshLoopIndex)
    this.refreshLoopIndex = null
  }

  _loginWithUsername ({ username, password }) {
    return this.axios({
      url: this.options.endpoints.login.url,
      method: this.options.endpoints.login.method,
      data: {
        username,
        password
      }
    })
      .then(({ data }) => {
        this._saveLogin(data)
        // Return an empty resolve
        return Promise.resolve()
      })
      // No catch? That's right. Someone else can deal with it.
      // (i.e. the try/catch on the login page)
  }

  _loginWithRefresh () {
    return this.axios({
      url: this.options.endpoints.refresh.url,
      method: this.options.endpoints.refresh.method,
      data: {
        [this.refreshKey]: this._getToken(this.refreshKey)
      }
    })
      .then(({ data }) => {
        this._saveLogin(data)
        return Promise.resolve(data)
      })
      .catch((err) => {
        console.warn('Caught error in login with refresh:', err.message)
      })
  }

  _saveLogin (data) {
    const tokenData = this._parseJWT(data[this.jwtKey])

    this._setToken(this.jwtKey, data[this.jwtKey], tokenData.exp)
    this._setToken(this.refreshKey, data[this.refreshKey])
    this._setAxiosAuthorization(data[this.jwtKey], tokenData.exp)
  }

  _logoutLocally () {
    this._clearRefreshLoop()

    this.axios.setHeader('Authorization', false)
    this._clearToken(this.jwtKey)
    this._clearToken(this.refreshKey)

    return this.$auth.reset()
  }

  // This gets fired straight from the constructor, so is triggered on page load.
  // Handles the initial refresh, if there is a token.
  mounted () {
    if (this._getToken(this.refreshKey)) {
      return this._loginWithRefresh()
        .then(() => {
          this._triggerRefresh()
          return this.$auth.fetchUserOnce()
        })
        .catch((err) => {
          console.warn(err.message)
          // If I log out here, it throws a 'cannot modify headers after they are sent' error.
          // Maybe I should just clear the refresh token instead.
          // Although it does modify the cookie, so there might be no improvement.
          return this._logoutLocally()
        })
    } else {
      // Clear any tokens just in case
      return this._logoutLocally()
    }
  }

  login ({ data }) {
    // Logout first, so all the refresh things are cleared.
    this._logoutLocally()
    return this._loginWithUsername(data)
      .then(() => {
        this._triggerRefresh()
        return this.fetchUser()
      })
      // No catch? That's right. Someone else can deal with it.
      // (i.e. the try/catch on the login page)
  }

  fetchUser () {
    // Token is required but not available
    if (!this._getToken(this.jwtKey)) {
      return Promise.reject(new Error('No JWT available'))
    }

    // Try to fetch user and then set
    return this.axios.get(this.options.endpoints.user.url)
      .then(({ data }) => {
        const userData = data[this.options.endpoints.user.propertyName]

        // Modify userData to add properties

        this.$auth.setUser(userData)
        return Promise.resolve()
      })
      .catch((err) => {
        console.log(err)
        return Promise.reject(err)
      })
  }
}

const DEFAULTS = {
  tokenType: 'Bearer',
  globalToken: true,
  tokenName: 'Authorization'
}
