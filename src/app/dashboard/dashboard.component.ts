import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StepperOrientation } from '@angular/material/stepper';
import { DashboardCarService } from '../services/dashboardService.service';

export interface PeriodicElement {
  position: string;
  name: number;
}

const ELEMENT_DATA_DEUDA: PeriodicElement[] = [
  { position: '+Monto a financiar', name: 0 },
  { position: '+Comision (3.25%)', name: 0 },
  { position: 'Total a financiar', name: 0 },
];

const ELEMENT_DATA_MONTH: PeriodicElement[] = [
  { position: '+ Cuota del préstamo', name: 0 },
  { position: '+ Seguro de vehículo obligatorio', name: 0 },
];

const ELEMENT_DATA_SECURE: any[] = [
  { id: 1, position: '', name: 0 },
  { id: 2, position: '', name: 0 },
  { id: 3, position: '', name: 0 },
  { id: 4, position: 'Total:', name: 0 },
  { id: 5, position: 'Monto a desembolsar:', name: 0 },
  { id: 6, position: '' },
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  /*VEHICLE Variables*/
  sliderTotalVehicle = 12000;

  /*TERM Variables*/
  paymentTerm = 48;
  dataAsign: any;

  /*Years Variables*/
  listYears = [];
  sliderYear = 0;

  /*Loan Variables*/
  sliderLoan = 2400;

  /* TABLE VARIABLES */
  displayedColumns: string[] = ['position', 'name'];
  dataSource = ELEMENT_DATA_DEUDA;
  dataSource2 = ELEMENT_DATA_MONTH;
  dataSource3 = ELEMENT_DATA_SECURE;

  //checkboxSecure
  checkboxSecureBool = false;

  //radiobuttonSecures
  radioButtonSix = false;
  radioButtonTwelve = false;

  //inputs

  grossIncome = 0;

  netIncome = 0;

  nameCompleted = '';
  personId = '';
  personCelular: any;
  personEmail = '';

  stepperOrientation: Observable<StepperOrientation>;

  @ViewChild('radioChildSix') radioChildSix: any;
  @ViewChild('radioChildTwelve') radioChildTwelve: any;

  constructor(
    private _formBuilder: FormBuilder,
    private serviceDataDashboard: DashboardCarService,
    breakpointObserver: BreakpointObserver
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    this.serviceDataDashboard.getLeandingData().subscribe((data) => {
      if (data) {
        this.dataAsign = data;
        //Se le pasa el parametro de usd, porque aunque el de colones no este disponible se dede cargar por defecto
        this.asigmentListYearsComponent(data.usd);
      }
    });
  }

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  /*METODO QUE MODIFICARA EL VALOR DEL VEHICULO DEL INPUT SEGUN EL SLIDER*/
  modifiedValueVehicle(valueRange: string) {
    this.sliderTotalVehicle = Number(valueRange);
    this.asigmentListYearsComponent(this.dataAsign.usd);
  }

  /*METODO QUE MODIFICARA EL VALOR DEL ANNO DEL INPUT SEGUN EL SLIDER*/
  modifiedValueYear(valueRange: string) {
    this.sliderYear = Number(valueRange);
    this.asigmentListYearsComponent(this.dataAsign.usd);
  }

  /*METODO QUE MODIFICARA EL VALOR DE LA PRIMA DEL INPUT SEGUN EL SLIDER*/
  modifiedValueLoan(valueRange: string) {
    //se hace de esta manera ya que no habia una formula para la prima, entonces al monto total se le resta mil, no deja poner mas prima del monto del vehiculo
    if (Number(valueRange) >= Number(this.sliderTotalVehicle)) {
      this.sliderLoan = Number(this.sliderTotalVehicle - 100);
    } else {
      this.sliderLoan = Number(valueRange);
    }

    this.asigmentListYearsComponent(this.dataAsign.usd);
  }

  /*METODO QUE MODIFICARA EL VALOR DEL PLAZO DEL INPUT SEGUN EL SLIDER*/
  modifiedValueTerm(valueRange: string) {
    this.paymentTerm = Number(valueRange);
    this.asigmentListYearsComponent(this.dataAsign.usd);
  }

  /*   START REGION ASIGMENT DATA   */

  asigmentListYearsComponent(dataAsign: any) {
    this.listYears = dataAsign.yearsList;
    this.sliderYear = dataAsign.yearsList[0];

    //calculo de los montos
    this.calculationAmount(dataAsign.years);
  }

  addMoreCurrency(isVehicle: boolean) {
    if (isVehicle) {
      Number((this.sliderTotalVehicle += 1000));
      if (this.sliderTotalVehicle > 100000) {
        this.sliderTotalVehicle = 100000;
      }
    } else {
      this.modifiedValueLoan(`${Number((this.sliderLoan += 100))}`);
      if (this.sliderLoan > 80000) {
        this.sliderLoan = 80000;
      }
    }

    this.asigmentListYearsComponent(this.dataAsign.usd);
  }

  addLessCurrency(isVehicle: boolean) {
    if (isVehicle) {
      Number((this.sliderTotalVehicle -= 1000));
      if (this.sliderTotalVehicle < 12000) {
        this.sliderTotalVehicle = 12000;
      }
    } else {
      Number((this.sliderLoan -= 100));
      if (this.sliderLoan < 2400) {
        this.sliderLoan = 2400;
      }
    }

    this.asigmentListYearsComponent(this.dataAsign.usd);
  }

  addMoreDataSlider(isYear: boolean) {
    if (isYear) {
      const lastYearList = this.listYears[this.listYears.length - 1];
      Number((this.sliderYear += 1));
      if (this.sliderYear > lastYearList) {
        this.sliderYear = lastYearList;
      }
    } else {
      Number((this.paymentTerm += 1));
      if (this.paymentTerm > 84) {
        this.paymentTerm = 84;
      }
    }

    this.asigmentListYearsComponent(this.dataAsign.usd);
  }

  addLessDataSlider(isYear: boolean) {
    if (isYear) {
      const initYearList = this.listYears[0];
      Number((this.sliderYear -= 1));
      if (this.sliderYear < initYearList) {
        this.sliderYear = initYearList;
      }
    } else {
      Number((this.paymentTerm -= 1));
      if (this.paymentTerm < 48) {
        this.paymentTerm = 48;
      }
    }

    this.asigmentListYearsComponent(this.dataAsign.usd);
  }

  changeInputVehicle() {
    if (this.sliderTotalVehicle < 12000) {
      this.sliderTotalVehicle = 12000;
    } else if (this.sliderTotalVehicle > 100000) {
      this.sliderTotalVehicle = 100000;
    }
  }

  changeInputYear() {
    const initYearList = this.listYears[0];

    const lastYearList = this.listYears[this.listYears.length - 1];

    if (this.sliderYear < initYearList) {
      this.sliderYear = initYearList;
    } else if (this.sliderYear > lastYearList) {
      this.sliderYear = lastYearList;
    }
  }

  changeInputLoan() {
    if (this.sliderLoan < 2400) {
      this.modifiedValueLoan('2400');
    } else if (this.sliderLoan > 80000) {
      this.modifiedValueLoan('80000');
    }
  }

  changeInputTerm(e: any) {
    if (this.paymentTerm < 48) {
      this.paymentTerm = 48;
    } else if (this.paymentTerm > 84) {
      this.paymentTerm = 84;
    }
  }

  /*   END REGION ASIGMENT DATA   */

  /* START CALCULATION DATA */

  //en este metodo se calculan todos los campos dependiendo de los datos ingresados
  calculationAmount(dataAPI: any) {
    //calculo de monto a financiar
    this.amountToFinanceCalculation();

    //calculo de comision
    this.amountComisionCalculation(dataAPI);

    //calculo de total a financiar
    this.amountTotalFinanceCalculation();

    //calculo de cuota mensual
    this.amountFeeCalculation();

    //calculo del seguro del vehiculo
    this.secureVehicleCalculation(dataAPI);

    //calculo seguro de vida
    this.secureInsuranceCalculation();

    //calculo para los seguros de desempleo
    this.secureInsuranceCalculationMonths();
  }

  //calcular el monto a financiar
  amountToFinanceCalculation() {
    const amountFinance = this.serviceDataDashboard.getAmountFinance(
      this.sliderTotalVehicle,
      this.sliderLoan
    );

    const foundAmountChange = ELEMENT_DATA_DEUDA.find(
      (x) => x.position === '+Monto a financiar'
    );

    if (foundAmountChange) {
      foundAmountChange.name = amountFinance;
    }

    const foundAmountDes = ELEMENT_DATA_SECURE.find(
      (x) => x.position === 'Monto a desembolsar:'
    );

    if (foundAmountDes) {
      foundAmountDes.name = amountFinance;
    }
  }

  amountComisionCalculation(dataAPI: any[]) {
    const foundAmountChange = ELEMENT_DATA_DEUDA.find(
      (x) => x.position === '+Monto a financiar'
    );

    if (foundAmountChange) {
      //se buscar el monto a multiplicar obtenido en el API

      const comission = dataAPI.find(
        (x) => Number(x.year) === Number(this.sliderYear)
      );

      if (comission) {
        const calculationComission = ELEMENT_DATA_DEUDA.find(
          (x) => x.position === '+Comision (3.25%)'
        );

        if (calculationComission) {
          calculationComission.name = this.serviceDataDashboard.getComission(
            Number(foundAmountChange.name),
            Number(comission.commission)
          );
        }
      }
    }
  }

  amountTotalFinanceCalculation() {
    const foundAmountChange = ELEMENT_DATA_DEUDA.find(
      (x) => x.position === '+Monto a financiar'
    );

    const calculationComission = ELEMENT_DATA_DEUDA.find(
      (x) => x.position === '+Comision (3.25%)'
    );

    if (foundAmountChange && calculationComission) {
      const totalFinanceChange = ELEMENT_DATA_DEUDA.find(
        (x) => x.position === 'Total a financiar'
      );

      if (totalFinanceChange) {
        totalFinanceChange.name = this.serviceDataDashboard.getTotalFinance(
          Number(foundAmountChange.name),
          Number(calculationComission.name)
        );
      }
    }
  }

  amountFeeCalculation() {
    const totalFinanceChange = ELEMENT_DATA_DEUDA.find(
      (x) => x.position === 'Total a financiar'
    );

    if (totalFinanceChange) {
      const feeMonthCalculation = ELEMENT_DATA_MONTH.find(
        (x) => x.position === '+ Cuota del préstamo'
      );

      if (feeMonthCalculation) {
        feeMonthCalculation.name =
          this.serviceDataDashboard.getFeeMonthCalculation(
            Number(totalFinanceChange.name),
            Number(this.dataAsign.cuota)
          );
      }
    }
  }

  secureVehicleCalculation(dataAPI: any[]) {
    const feeMonthCalculation = ELEMENT_DATA_MONTH.find(
      (x) => x.position === '+ Cuota del préstamo'
    );

    if (feeMonthCalculation) {
      const secureA = dataAPI.find(
        (x) => Number(x.year) === Number(this.sliderYear)
      );

      if (secureA) {
        const secureVehicleCalculation = ELEMENT_DATA_MONTH.find(
          (x) => x.position === '+ Seguro de vehículo obligatorio'
        );

        if (secureVehicleCalculation) {
          const secureAAPI = secureA.insuranceCoverage.CoberturaA.value;
          secureVehicleCalculation.name =
            this.serviceDataDashboard.getSecureVehicleCalculation(
              Number(feeMonthCalculation.name),
              Number(secureAAPI ? secureAAPI : 0)
            );
        }
      }
    }
  }

  secureInsuranceCalculation() {
    const foundAmountChange = ELEMENT_DATA_DEUDA.find(
      (x) => x.position === '+Monto a financiar'
    );

    if (foundAmountChange) {
      const secureLifeCalculation = ELEMENT_DATA_SECURE.find((x) => x.id === 3);

      if (secureLifeCalculation) {
        secureLifeCalculation.name =
          this.serviceDataDashboard.getSecureInsurance(
            Number(foundAmountChange.name),
            Number(this.dataAsign.lifeInsurance)
          );
      }
    }
  }

  secureInsuranceCalculationMonths() {
    const totalSecures = this.totalySecures();

    const feeMonthCalculation = ELEMENT_DATA_MONTH.find(
      (x) => x.position === '+ Cuota del préstamo'
    );
    if (feeMonthCalculation) {
      const totalCalculationAmount = totalSecures + feeMonthCalculation.name;

      //calculation 6 months
      const secureLifeCalculation6 = ELEMENT_DATA_SECURE.find(
        (x) => x.id === 1
      );

      if (secureLifeCalculation6) {
        secureLifeCalculation6.name = this.serviceDataDashboard.getSecureMonths(
          Number(totalCalculationAmount),
          this.dataAsign.unemploymentInsurance6
        );
      }

      //calculation 12 months
      const secureLifeCalculation12 = ELEMENT_DATA_SECURE.find(
        (x) => x.id === 2
      );

      if (secureLifeCalculation12) {
        secureLifeCalculation12.name =
          this.serviceDataDashboard.getSecureMonths(
            Number(totalCalculationAmount),
            this.dataAsign.unemploymentInsurance12
          );
      }
    }
  }

  totalCalculationLoan() {}

  addDataCheckboxTotal() {
    this.checkboxSecureBool;
  }

  changeRadioButtonSix() {
    if (this.radioButtonTwelve) {
      this.radioButtonTwelve = false;
    }

    if (this.radioButtonSix) {
      this.radioButtonSix = false;
      this.radioChildSix.reset();
    } else {
      this.radioButtonSix = true;
    }
  }

  changeRadioButtonTwelve() {
    if (this.radioButtonSix) {
      this.radioButtonSix = false;
    }
    if (this.radioButtonTwelve) {
      this.radioButtonTwelve = false;
      this.radioChildTwelve.reset();
    } else {
      this.radioButtonTwelve = true;
    }
  }

  totalySecures() {
    let totalSecures = 0;

    const secureVehicleCalculation = ELEMENT_DATA_MONTH.find(
      (x) => x.position === '+ Seguro de vehículo obligatorio'
    );

    if (secureVehicleCalculation) {
      totalSecures += secureVehicleCalculation.name;

      if (this.checkboxSecureBool) {
        const secureLifeCalculation = ELEMENT_DATA_SECURE.find(
          (x) => x.id === 3
        );

        if (secureLifeCalculation) {
          totalSecures += secureLifeCalculation.name;
        }
      }
    }

    return Number(totalSecures);
  }

  /* END CALCULATION DATA */
}
