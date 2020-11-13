export default function ({ route, redirect, app }) {
  // Add all routes that
  const allowedRoutes = [
    '/login'
  ]

  if (allowedRoutes.includes(route.path)) {
    return
  }

  // Disable middleware if no route was matched to allow 404/error page
  if (!route.matched.some(match => match.components)) {
    return
  }

  console.log(app.$auth.isAuthenticated())

  // If we're not logged in, redirect to /login
  if (!app.$auth.isAuthenticated()) {
    redirect(302, '/login', {
      next: route.path
    })
  }
}
