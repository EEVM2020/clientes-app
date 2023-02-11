import { Component } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  clientes:Cliente[];


  constructor(private clienteService: ClienteService){

  }

  ngOnInit(): void {
   this.clienteService.getClientes().subscribe(
    clientes=>this.clientes=clientes
   );
  }

  eliminar (cliente:Cliente):void{
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
        this.clienteService.borrar(cliente.id).subscribe((respuesta)=>{
          this.clientes=this.clientes.filter(cli=> cli !==cliente)
          swal.fire(
            'Eliminado!',
            `El cliente ${respuesta.nombre} ha sido eliminado.`,
            'success'
          )

        })
        
      } 
    })
  }


}
