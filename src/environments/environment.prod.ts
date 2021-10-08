export const environment = {
  production: true,
  rest_proto: "http",
  // Set the URL for the API.
  api_url: `://${window.location.hostname}:${window.location.port}/api/`,
  mqtt_host: window.location.hostname,
  mqtt_port: parseInt(window.location.port) || 8080
};