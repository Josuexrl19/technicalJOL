import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//material modules
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatGridListModule } from '@angular/material/grid-list';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { DashboardCarService } from './services/dashboardService.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, DashboardComponent],
  imports: [
    FormsModule,
    LayoutModule,
    MatCardModule,
    BrowserModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatSliderModule,
    MatTooltipModule,
    AppRoutingModule,
    MatStepperModule,
    MatCheckboxModule,
    MatGridListModule,
    CurrencyMaskModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    HttpClientModule,

    BrowserAnimationsModule,
  ],
  providers: [DashboardCarService],
  bootstrap: [AppComponent],
})
export class AppModule {}
