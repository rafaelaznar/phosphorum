import { Injectable } from '@angular/core';
import { UserAjaxService } from './user.ajax.service.service';
import { IUser } from '../model/model.interfaces';
import { ThreadAjaxService } from './thread.ajax.service.service';

declare let jsPDF: any;

@Injectable({
  providedIn: 'root'
})
export class UserPrintAjaxService {


  constructor(
    private oUserAjaxService: UserAjaxService,
    private oThreadAjaxService: ThreadAjaxService
  ) { }


  //Mirar qué hace esto
  sp = (n: number): string => n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 });


  printUser = (id_user: number): void => {
    this.oUserAjaxService.getOne(id_user).subscribe({
      next: (oUserToPrint: IUser) => {
        //Cosas
        var doc = new jsPDF();
        doc.setFont('Courier');
        doc.text(50, 64, `Prueba de si funciona`);
        //doc = this.cabecera(doc, oUserToPrint);
        doc.save('prueba.pdf');
      }




    })


  }


  private cabecera(doc: any, oUserToPrint: IUser): any {
    const baseX = 10;
    doc.setFontType('bold');
    doc.setFontSize(20);
    doc.text('U s u a r i o', 80, 30);
    doc.setFontType('normal');
    //
    doc.setFillColor(240, 240, 240);
    //separacion de cajas: h=15 v=5
    doc.rect(baseX, 35, 105, 35, 'F');
    //
    /* doc.setFillColor(240, 240, 240);
     doc.rect(120, 35, 80, 15, 'F');
     doc.setFontSize(12);
     doc.text(142, 44, `Id de Usuario: ${oUserToPrint.id}`);
    */
    //
    /* doc.setFillColor(240, 240, 240);
     doc.rect(120, 55, 80, 15, 'F');
     doc.setFontSize(12);
     doc.text(140, 64, `Nombre: ${oUserToPrint.name}`);
    */
    //
    doc.setFillColor(240, 240, 240);
    doc.rect(baseX, 75, 190, 50, 'F');
    //
    doc.text(140, 64, `Prueba de si funciona`);




  }


}



