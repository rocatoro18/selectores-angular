import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/country.interfaces';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {

  private fb: FormBuilder = new FormBuilder();

  public myForm: FormGroup = this.fb.group({
    region: ['',Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required]
  })

  constructor(private countriesService: CountriesService){}

  ngOnInit(): void {
    this.onRegionChanged();
  }

  get regions(): Region[] {
    // ESTO APUNTA POR REFERENCIA AL LUGAR DONDE SE TIENEN LAS REGIONES
    return this.countriesService.regions;
  }

  onRegionChanged(): void{
    this.myForm.get('region')?.valueChanges
    .pipe(
      //switchMap(this.countriesService.getCountriesByRegion)
      switchMap(region => this.countriesService.getCountriesByRegion(region))
    )
    .subscribe(region => {
      console.log({region})
    })
  }

}
