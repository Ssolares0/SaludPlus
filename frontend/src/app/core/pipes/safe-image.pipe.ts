import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
        if (url.startsWith('https://')) {
            processedUrl = 'http://' + url.substring(8);
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