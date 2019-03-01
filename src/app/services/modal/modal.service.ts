import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }
  private modals: any[] = [];

    add(modal: any) {
        // add modal to array of active modals
        this.modals.push(modal);
    }

    remove(id: string) {
        // remove modal from array of active modals
        this.modals = this.modals.filter(x => x.id !== id);
    }

    open(id: string, userId: number) {
      console.log('open modaL in service',userId);
        // open modal specified by id
        let modal: any = this.modals.filter(x => x.id === id)[0];
        console.log('modal',modal);
        modal.open();
    }

    close(id: string) {
        // close modal specified by id
        let modal: any = this.modals.filter(x => x.id === id)[0];
        modal.close();
    }
}
