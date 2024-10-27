import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  private fb: FormBuilder = new FormBuilder();

  public myForm: FormGroup = this.fb.group({
    region: ['',Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required]
  })

  constructor(private countriesService: CountriesService){}

  ngOnInit(): void {
    // LLAMAMOS ESTO AQUI PARA CREAR EL LISTENER
    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions(): Region[] {
    // ESTO APUNTA POR REFERENCIA AL LUGAR DONDE SE TIENEN LAS REGIONES
    return this.countriesService.regions;
  }

  onRegionChanged(): void{
    this.myForm.get('region')?.valueChanges
    .pipe(
      tap(() => this.myForm.get('country')!.setValue('')),
      tap(() => this.borders = []),
      //switchMap(this.countriesService.getCountriesByRegion)
      switchMap((region) => this.countriesService.getCountriesByRegion(region))
    )
    .subscribe(countries => {
      //console.log({countries})
      this.countriesByRegion = countries;
    })
  }

  onCountryChanged(): void{
    this.myForm.get('country')?.valueChanges
    .pipe(
      tap(() => this.myForm.get('border')!.setValue('')),
      filter((value: string) => value.length > 0),
      //switchMap(this.countriesService.getCountriesByRegion)
      switchMap((alphaCode) => this.countriesService.getCountryByAlphaCode(alphaCode)),
      switchMap(country => this.countriesService.getCountryBordersByCodes(country.borders)),
    )
    .subscribe(countries => {
      //console.log({borders: country.borders});
      //this.borders = country.borders;
      //this.countriesByRegion = countries;
      this.borders = countries;

    })
  }

}
