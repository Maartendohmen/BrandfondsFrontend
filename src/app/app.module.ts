import { BrowserModule } from '@angular/platform-browser';
import { NgModule,LOCALE_ID, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import { MainmenuComponent } from './components/mainmenu/mainmenu.component';
import { HttpClientModule } from '@angular/common/http';
import { TitleCasePipe } from '@angular/common';

// Language settings for nl
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
registerLocaleData(localeNl);

// Import BrowserAnimationsModule
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
 
// Import your library
import { AlertModule } from 'ngx-alerts';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { ResetpasswordrequestComponent } from './components/resetpasswordrequest/resetpasswordrequest.component';
import { RegisterconformationComponent } from './components/registerconformation/registerconformation.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainmenuComponent,
    RegisterComponent,
    AdminComponent,
    ResetpasswordComponent,
    ResetpasswordrequestComponent,
    RegisterconformationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    NgbModule, // bootstrap ngx
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AlertModule,

    AlertModule.forRoot({maxMessages: 5, timeout: 5000, position: 'right'})
  ],
  providers: [{provide: LOCALE_ID, useValue: 'nl-NL' },TitleCasePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
