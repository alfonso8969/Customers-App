import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { authInterceptor } from './core/interceptors/auth.interceptor';


const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      // Additional HTTP client providers...
      withInterceptors([
        // Additional interceptors...
        authInterceptor, // Include the auth interceptor
      ])
    ),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
