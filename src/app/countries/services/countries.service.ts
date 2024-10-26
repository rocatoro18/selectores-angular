import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interfaces';
import { map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// NO HACE FALTA QUE IMPORTE UN SERVICIO PORQUE VIENE PROVEIDO EN EL RUTH
@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v3.1';

  private _regions: Region[] = [Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania];

  constructor(
    private httpClient: HttpClient
  ) { }

  get regions(): Region[]{
    // SE HACE CON EL SPREAD PARA ROMPER LA RELACION QUE HAY
    // CON LAS REGIONES
    return [...this._regions];
  }

  getCountriesByRegion(region: Region): Observable <SmallCountry[]>{
    if(!region) return of([]);

    const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

    return this.httpClient.get<Country[]>(url)
      .pipe(
        map(countries => countries.map(country => ({
          name: country.name.common,
          cca3: country.cca3,
          // OPERADOR DE COALESCENCIA NULA
          borders: country.borders ?? []
        }))),
        // EL TAP DISPARA EFECTOS SECUNDARIOS
        //tap(response => console.log({response}))
      );
  }

  getCountryByAlphaCode(alphaCode: string): Observable<SmallCountry>{

    const url = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;

    return this.httpClient.get<Country>(url)
      .pipe(
        map( country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        }))
      )

  }

}
