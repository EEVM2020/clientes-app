import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente'
import { ClienteService } from '../cliente.service'
import { ActivatedRoute } from '@angular/router'
import { ModalServiceService } from './modal-service.service';
import swal from 'sweetalert2'
import { HttpEventType } from '@angular/common/http'

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html'
})
export class DetalleComponent implements OnInit {

  //cliente: Cliente;
  titulo: string = "Subir foto"
  private fotoSeleccionada: File;
  progreso: number = 0;
  @Input() cliente: Cliente;
  mostrarModal: boolean = false;


  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute, public modalServiceService: ModalServiceService) {
    //this.mostrarModal = modalServiceService.modal;
    //alert(this.mostrarModal);
  }

 

  ngOnInit(): void {
    //this.mostrarModal = this.modalServiceService.modal;
    //alert(this.mostrarModal);
    /*this.activatedRoute.paramMap.subscribe(parametros => {
      let id: number = +parametros.get('id');
      if (id) {
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente
        })
      }
    })*/
  }

  seleccionarFoto(event) {
    this.progreso = 0;
    this.fotoSeleccionada = event.target.files[0];
    console.log(this.fotoSeleccionada.type.indexOf('image'))
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal.fire('Error!!', 'Debe seleccionar una imagen', 'error')
      this.fotoSeleccionada = null
    }

  }

  subirFoto() {
    console.log(this.fotoSeleccionada)
    if (this.fotoSeleccionada) {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).
        subscribe((evento) => {

          if (evento.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((evento.loaded / evento.total) * 100)
          } else if (evento.type === HttpEventType.Response) {
            let respuesta: any = evento.body;
            this.cliente = respuesta.cliente;
            this.modalServiceService.notificarCargue.emit(this.cliente);
            swal.fire('Cargue exitoso', 'La foto se cargo con exito.', 'success')
          }
        })
    } else {
      swal.fire('Error!!', 'Debe seleccionar un archivo de imagen ', 'error')
    }

  }

  ocultarModal() {
    this.modalServiceService.cerrarModal();
    this.progreso = 0;
    this.fotoSeleccionada = null;
  }

}
