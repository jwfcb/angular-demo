import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

declare global {
  interface Window {
    ENV: {
      APP_VERSION: string;
      ENVIRONMENT: string;
      POD_NAME: string;
      POD_NAMESPACE: string;
      NODE_NAME: string;
    };
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  appVersion = '';
  environment = '';
  podName = '';
  podNamespace = '';
  nodeName = '';
  currentTime = new Date();
  uptime = 0;
  
  private startTime = Date.now();

  ngOnInit() {
    // Load environment variables from env.js
    if (window.ENV) {
      this.appVersion = window.ENV.APP_VERSION || 'unknown';
      this.environment = window.ENV.ENVIRONMENT || 'unknown';
      this.podName = window.ENV.POD_NAME || 'unknown';
      this.podNamespace = window.ENV.POD_NAMESPACE || 'unknown';
      this.nodeName = window.ENV.NODE_NAME || 'unknown';
    }

    // Update time every second
    interval(1000).pipe(
      map(() => new Date())
    ).subscribe(time => {
      this.currentTime = time;
      this.uptime = Math.floor((Date.now() - this.startTime) / 1000);
    });

    console.log('Angular app initialized with environment:', {
      version: this.appVersion,
      environment: this.environment,
      pod: this.podName,
      namespace: this.podNamespace,
      node: this.nodeName
    });
  }

  get uptimeFormatted(): string {
    const hours = Math.floor(this.uptime / 3600);
    const minutes = Math.floor((this.uptime % 3600) / 60);
    const seconds = this.uptime % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }
}
