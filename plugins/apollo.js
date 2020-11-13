export default function ({ app }) {
  const client = app.apolloProvider.defaultClient

  client.wsClient.lazy = true
  client.wsClient.connectionParams = () => {
    return {
      headers: {
        Authorization: `Bearer ${app.$auth.getJWTToken()}`
      }
    }
  }
}
