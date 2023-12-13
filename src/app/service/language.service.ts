import { Injectable } from "@angular/core";
import { from, Observable } from 'rxjs';
import { Language } from "../model/model.interfaces";

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    private lngEnglish: Language = new Language('en', 'English', 'united-kingdom.png');
    private lngSpanish: Language = new Language('es', 'Español', 'spain.png');

    constructor() { }

    getAllLanguages(): Observable<Language[]> {
        const result: Observable<Language[]> = from([
            [
                this.lngEnglish,
                this.lngSpanish
            ]
        ]);

        return result;
    }

    getDefaultLanguage(): Language {
        const browserLanguage = navigator.language || 'en';
        const languageCode = browserLanguage.split('-')[0];

        // Establecer el idioma predeterminado
        if (languageCode === 'es') {
            return this.lngSpanish;
        } else {
            // Si no es español, establece inglés como predeterminado
            return this.lngEnglish
        }
    }

    getLanguageByCode(code: string): Language {
        if (code !== null) {
            return (code === 'en') ? this.lngEnglish : this.lngSpanish;
        }

        return this.getDefaultLanguage();
    }
}