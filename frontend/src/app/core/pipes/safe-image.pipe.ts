import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Pipe({
    name: 'safeImage',
    standalone: true
})
export class SafeImagePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(url: string | null): SafeUrl | string {
        if (!url) {
            return '';
        }

        let processedUrl = url;

        if (!environment.production && url.startsWith('https://')) {
            processedUrl = 'http://' + url.substring(8);
        }

        if (environment.production && url.startsWith('http://')) {
            processedUrl = 'https://' + url.substring(7);
        }

        try {
            new URL(processedUrl);
            return this.sanitizer.bypassSecurityTrustUrl(processedUrl);
        } catch (e) {
            console.error('URL inválida:', processedUrl);
            return '';
        }
    }
}