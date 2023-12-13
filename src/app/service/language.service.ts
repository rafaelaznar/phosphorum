import { Injectable } from "@angular/core";
import { from, Observable } from 'rxjs';
import { Language } from "../model/utils/language";

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    private lngEnglish: Language = new Language('en', 'English', 'united-kingdom.png');
    private lngSpanish: Language = new Language('es', 'Spanish', 'spain.png');

    constructor() { }

    getAllLanguages(): Observable<Language[]>{
        const result : Observable<Language[]> = from([
            [
                this.lngEnglish,
                this.lngSpanish
            ]
        ]);

        return result;
    }

    getDefaultLanguage(): Language{
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
        let result: any = null;
        if (code !== null) {
            result = (code === 'en') ? this.lngEnglish : this.lngSpanish;
        }

        return result;
    }
}