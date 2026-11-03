import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

// No router: the site is a single page navigated with #anchors, which also means
// GitHub Pages never has to resolve a client-side route (no 404 workaround needed).
export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient(withFetch())],
};
