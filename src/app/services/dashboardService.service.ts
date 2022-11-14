import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { configuration } from '../config/config';

@Injectable({
  providedIn: 'root',
})
export class DashboardCarService {
  constructor(protected httpClient: HttpClient) {}

  getResourceUrl(): string {
    return 'cars';
  }

  getLeandingData(): Observable<any> {
    return this.httpClient
      .get<any>(`${configuration.config.leandingURL}/${this.getResourceUrl()}`)
      .pipe(
        map((data) => {
          return data && data.values ? data.values : undefined;
        }),
        catchError((err) => {
          throw err;
        })
      );
  }

  getAmountFinance(totalVehicle: number, totalLoan: number) {
    return Number(totalVehicle - totalLoan);
  }

  getComission(amountFinance: number, comission: number) {
    return Number(amountFinance * Number(comission / 100));
  }

  getTotalFinance(amountFinance: number, comission: number) {
    return Number(amountFinance + comission);
  }

  getFeeMonthCalculation(totalFinance: number, fee: number) {
    return Number(totalFinance * Number(fee / 100));
  }

  getSecureVehicleCalculation(totalFeeMonth: number, secureA: number) {
    return Number(totalFeeMonth * Number(secureA / 100));
  }

  getSecureInsurance(amountFinance: number, secureInsurance: number) {
    return Number(amountFinance * Number(secureInsurance));
  }

  getSecureMonths(totalSecuresCalculation: number, insurance: number) {
    return Number(totalSecuresCalculation * Number(insurance / 100));
  }
}
