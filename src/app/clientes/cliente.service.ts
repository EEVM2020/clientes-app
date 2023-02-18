import { Injectable } from '@angular/core';
import {formatDate} from '@angular/common'
import { Cliente } from './cliente';
import { Observable, of, catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators'
import swal from 'sweetalert2';
import { Router } from '@angular/router'


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlServicio: string = "http://localhost:8080/api/clientes";
  private httHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get(this.urlServicio).pipe(
      map((response) => {
        let clientes=response as Cliente[];
        return clientes.map(cliente=>{
          cliente.nombre=cliente.nombre.toUpperCase();
          //cliente.creacion=formatDate(cliente.creacion,'EEEE dd, MMMM yyyy','es');
          return cliente;
        })
        
      })
    )
  }

  getClientesPag(pagina: number): Observable<any> {
    return this.http.get(this.urlServicio+'/paginar/'+pagina).pipe(
      map((response:any) => {
         (response.content as Cliente[]).map(cliente=>{
          cliente.nombre=cliente.nombre.toUpperCase();
          //cliente.creacion=formatDate(cliente.creacion,'EEEE dd, MMMM yyyy','es');
          return cliente;
        })
        return response;
      })
    )
  }

  crear(cliente: Cliente): Observable<any> {
    return this.http.post<any>(this.urlServicio, cliente, { headers: this.httHeaders }).pipe(
      catchError((e)=>{
        if(e.status==400){
          return throwError(e);
        }
        swal.fire('Error al crear', e.error.mensaje, 'error')
        return throwError(e);
      })
    )
  }

  public getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlServicio}/${id}`).pipe(
      map((response )=> response as Cliente),
      catchError(e => {
        this.router.navigate(['/clientes'])
        swal.fire('Error al editar', e.error.mensaje, 'error')
        return throwError(e);
      }
      )
    )
  }

  public actualizar(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlServicio}/${cliente.id}`, cliente, { headers: this.httHeaders }).pipe(
      map((response:any) => response.cliente as Cliente),
      catchError((e)=>{
        if(e.status==400){
          return throwError(e);
        }

        swal.fire('Error al editar', e.error.mensaje, 'error')
        return throwError(e);
      })
    )
  }

  public borrar(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlServicio}/${id}`, { headers: this.httHeaders }).pipe(
      map((response:any)=>response.cliente as Cliente),
      catchError((e)=>{
        swal.fire('Error al eliminar', e.error.mensaje, 'error')
        return throwError(e);
      })
    )
  }
}
