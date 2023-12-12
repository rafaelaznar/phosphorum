import { Component } from "@angular/core";
import { PrimeNGConfig } from "primeng/api";
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title: string = 'phosphorum';

  constructor(
    private primengConfig: PrimeNGConfig,
    private oTranslocoService: TranslocoService
  ) {}

    ngOnInit() {
      this.primengConfig.ripple = true;

      const browserLanguage = navigator.language || 'en';
      const languageCode = browserLanguage.split('-')[0];

      // Establecer el idioma predeterminado
      if (languageCode === 'es') {
        this.oTranslocoService.setDefaultLang('es');
        this.oTranslocoService.setActiveLang('es');
      } else {
        // Si no es español, establece inglés como predeterminado
        this.oTranslocoService.setDefaultLang('en');
        this.oTranslocoService.setActiveLang('en');
      }
    }

}
