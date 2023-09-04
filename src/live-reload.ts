// This snippet enables live reloading via the ESBuild API.
// See https://esbuild.github.io/api/#live-reload

new EventSource('/esbuild').addEventListener('change', () => location.reload())
