import { Component, OnInit } from '@angular/core';
import {Cliente} from './cliente'
import{ClienteService} from './cliente.service'
import {Router,ActivatedRoute} from '@angular/router'
import swal from 'sweetalert2'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

 cliente:Cliente;
  titulo='Crear cliente';
  constructor(private clienteService:ClienteService,private router:Router,private activatedRoute:ActivatedRoute){
    this.cliente=new Cliente();

  }
  ngOnInit(): void {
    this.consultar ();
  }
  public crear(){
    this.clienteService.crear(this.cliente).subscribe(
      (response)=>{
        console.log(response)
        this.router.navigate(['/clientes'])
        swal.fire('Nuevo cliente',` El cliente ${response.cliente.nombre} ha sido creado`,'success')
      }
    )
  }

  public consultar ():void{
    this.activatedRoute.params.subscribe(
      params=>{let id=params['id']
      console.log("entro!!")
      console.log(id)
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente=>this.cliente=cliente
          )
      }
    })

  }

  public actualizar():void{
    this.clienteService.actualizar(this.cliente).subscribe(
      (cliente)=>{
        this.router.navigate(['/clientes'])
        swal.fire('Actualizar cliente',` El cliente ${cliente.nombre} ha sido actualizado`,'success')
    })
  }
}
