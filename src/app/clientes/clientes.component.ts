import { Component } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalServiceService } from './detalle/modal-service.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router'


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent {
  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;


  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute, private modalServiceService: ModalServiceService) {

  }


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      params => {
        let pagina = !params.get('pagina') ? 0 : +params.get('pagina');
        this.clienteService.getClientesPag(pagina).pipe(
          tap(
            (response: any) => {
              this.clientes = response.content as Cliente[];
              this.paginador = response;
            })
        ).subscribe();
        /*this.clienteService.getClientes().pipe(
         tap(clientes=>{
            this.clientes=clientes
         })
        ).subscribe();*/

      }
    )

    this.modalServiceService.notificarCargue.subscribe((cliente) => {
      this.clientes = this.clientes.map((clienteOriginal) => {
        if (clienteOriginal.id == cliente.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    })

  }

  eliminar(cliente: Cliente): void {
    swal.fire({
      title: 'Estas seguro?',
      text: `SEguro de esliminar al cliente ${cliente.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.borrar(cliente.id).subscribe((respuesta) => {
          this.clientes = this.clientes.filter(cli => cli !== cliente)
          swal.fire(
            'Eliminado!',
            `El cliente ${respuesta.nombre} ha sido eliminado.`,
            'success'
          )

        })

      }
    })
  }
  mostrarModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalServiceService.abrirModal();
  }

}
