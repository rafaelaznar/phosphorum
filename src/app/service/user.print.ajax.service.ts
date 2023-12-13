import { Injectable } from '@angular/core';
import { UserAjaxService } from './user.ajax.service.service';
import { IUser, IThreadPage } from '../model/model.interfaces';
import { ThreadAjaxService } from './thread.ajax.service.service';
import { Title } from '@angular/platform-browser';
import { Observer } from 'rxjs';
declare let jsPDF: any;

@Injectable({
  providedIn: 'root'
})
export class UserPrintAjaxService {


  constructor(
    private oUserAjaxService: UserAjaxService
  ) { }


  //Mirar qué hace esto
  sp = (n: number): string => n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 });


  printUser = (id_user: number): void => {
    this.oUserAjaxService.getOne(id_user).subscribe({
      next: (oUserToPrint: IUser) => {
        console.log('User to print:', oUserToPrint);
        //Cosas
        var doc = new jsPDF();
        doc.setFont('Arial');
        doc.setFontSize(12);
        //doc.text(50, 64, `Prueba de si funciona`);
        doc = this.cabecera(doc);
        doc = this.contenido(doc, oUserToPrint);
        doc = this.pie(doc);


        doc.save('prueba.pdf');
      }
    })
  }


  private cabecera(doc: any): any {

    const indigoPastel = "#7887AB";

    doc.setFontType('bold');
    doc.setFontSize(20);
    doc.text('PHOSPHORUM 2023', 70, 25);
    //
    doc.setDrawColor(indigoPastel);
    doc.line(60, 30, 145, 30);
    //
    doc.text('User\'s Profile', 80, 40);
    doc.setDrawColor(indigoPastel);
    doc.line(10, 45, 200, 45);
    doc.setFontType('normal');

    return doc;
  }

  private contenido(doc: any, oUserToPrint: IUser): any {
    const baseX = 10;
    const indigoPastel = "#7887AB";

    doc.setTextColor(0, 0, 0, 0);
    //
    //Reordenar
    doc.setFillColor(parseInt(indigoPastel.substring(1, 3), 16),
      parseInt(indigoPastel.substring(3, 5), 16),
      parseInt(indigoPastel.substring(5, 7), 16));
    doc.roundedRect(baseX, 55, 104, 175, 5, 5, 'F');
    doc.setFontSize(14);
    doc.text(20, 68, `User Privileges: `);
    //
    doc.setFillColor(parseInt(indigoPastel.substring(1, 3), 16),
      parseInt(indigoPastel.substring(3, 5), 16),
      parseInt(indigoPastel.substring(5, 7), 16));
    doc.roundedRect(120, 55, 80, 15, 5, 5, 'F');
    doc.setFontSize(14);
    doc.text(125, 64, `ID: ${oUserToPrint.id}`);
    //
    doc.setFillColor(parseInt(indigoPastel.substring(1, 3), 16),
      parseInt(indigoPastel.substring(3, 5), 16),
      parseInt(indigoPastel.substring(5, 7), 16));
    doc.roundedRect(120, 75, 80, 15, 5, 5, 'F');
    doc.setFontSize(14);
    doc.text(125, 84, `Name: ${oUserToPrint.name}`);
    //
    doc.setFillColor(parseInt(indigoPastel.substring(1, 3), 16),
      parseInt(indigoPastel.substring(3, 5), 16),
      parseInt(indigoPastel.substring(5, 7), 16));
    doc.roundedRect(120, 95, 80, 15, 5, 5, 'F');
    doc.setFontSize(14);
    doc.text(125, 104, `Surname: ${oUserToPrint.surname}`);
    //
    doc.setFillColor(parseInt(indigoPastel.substring(1, 3), 16),
      parseInt(indigoPastel.substring(3, 5), 16),
      parseInt(indigoPastel.substring(5, 7), 16));
    doc.roundedRect(120, 115, 80, 15, 5, 5, 'F');
    doc.setFontSize(14);
    doc.text(125, 124, `Lastname: ${oUserToPrint.lastname}`);
    //
    doc.setFillColor(parseInt(indigoPastel.substring(1, 3), 16),
      parseInt(indigoPastel.substring(3, 5), 16),
      parseInt(indigoPastel.substring(5, 7), 16));
    doc.roundedRect(120, 135, 80, 15, 5, 5, 'F');
    doc.setFontSize(14);
    doc.text(123, 144, `Email: ${oUserToPrint.email}`);
    //
    doc.setFillColor(parseInt(indigoPastel.substring(1, 3), 16),
      parseInt(indigoPastel.substring(3, 5), 16),
      parseInt(indigoPastel.substring(5, 7), 16));
    doc.roundedRect(120, 155, 80, 15, 5, 5, 'F');
    doc.setFontSize(14);
    doc.text(125, 164, `Username: ${oUserToPrint.username}`);
    //

    var rol = "rol";
    if (oUserToPrint.role == true) {
      rol = "User";
      doc.setFontSize(12);
      doc.text(20, 78, `— Get own data `);
      doc.text(20, 88, `— See threads `);
      doc.text(20, 98, `— See replies `);
      doc.text(20, 108, `— Create threads `);
      doc.text(20, 118, `— Create replies `);


    } else {
      rol = "Admin";
      doc.setFontSize(12);
      //Por terminar
      doc.text(20, 78, `— Cosis cosis `);
      doc.text(20, 88, `— Cosis cosis `);

    }

    doc.setFillColor(parseInt(indigoPastel.substring(1, 3), 16),
      parseInt(indigoPastel.substring(3, 5), 16),
      parseInt(indigoPastel.substring(5, 7), 16));
    doc.roundedRect(120, 175, 80, 15, 5, 5, 'F');
    doc.setFontSize(14);
    doc.text(125, 184, `Role: ${rol}`);
    //
    doc.setFillColor(parseInt(indigoPastel.substring(1, 3), 16),
      parseInt(indigoPastel.substring(3, 5), 16),
      parseInt(indigoPastel.substring(5, 7), 16));
    doc.roundedRect(120, 195, 80, 15, 5, 5, 'F');
    doc.setFontSize(14);
    doc.text(125, 204, `Threads: ${oUserToPrint.threads}`);
    //
    doc.setFillColor(parseInt(indigoPastel.substring(1, 3), 16),
      parseInt(indigoPastel.substring(3, 5), 16),
      parseInt(indigoPastel.substring(5, 7), 16));
    doc.roundedRect(120, 215, 80, 15, 5, 5, 'F');
    doc.setFontSize(14);
    doc.text(125, 224, `Replies: ${oUserToPrint.replies}`);
    //

    return doc;
  }

  private pie(doc: any): any {

    const indigoPastel = "#7887AB";

    doc.setDrawColor(indigoPastel);
    doc.line(10, 244, 200, 244);

    //Por terminar
    return doc;
  }


}



