// This snippet enables live reloading via the ESBuild API.
// See https://esbuild.github.io/api/#live-reload

export default function setupLiveReload() {
  new EventSource("/esbuild").addEventListener("change", () =>
    location.reload(),
  );
}
