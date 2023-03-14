import { Injectable,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalServiceService {

  constructor() { }
  public modal: boolean = false;
  private _notificarCargue=new EventEmitter<any>();

  abrirModal() {
    this.modal = true;
  }

  cerrarModal() {
    this.modal = false;
  }
  get notificarCargue():EventEmitter<any>{
    return this._notificarCargue;
  }
}
