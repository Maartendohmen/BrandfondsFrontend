import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule,LOCALE_ID } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { RegisterComponent } from './components/registration/register/register.component';
import { RegisterconformationComponent } from './components/registration/registerconformation/registerconformation.component';
import { ResetpasswordComponent } from './components/passwordreset/resetpassword/resetpassword.component';
import { ResetpasswordrequestComponent } from './components/passwordreset/resetpasswordrequest/resetpasswordrequest.component';
import { AdminComponent } from './components/brandmaster/admin/admin.component';
import { NavbarComponent } from './components/global/navbar/navbar.component';
import { AdminEditsaldoComponent } from './components/brandmaster/admin-editsaldo/admin-editsaldo.component';
import { AdminEditpunishmentstripeComponent } from './components/brandmaster/admin-editpunishmentstripe/admin-editpunishmentstripe.component';
import { AdminDepositrequestComponent } from './components/brandmaster/admin-depositrequest/admin-depositrequest.component'
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainmenuComponent,
    RegisterComponent,
    AdminComponent,
    ResetpasswordComponent,
    ResetpasswordrequestComponent,
    RegisterconformationComponent,
    NavbarComponent,
    AdminEditsaldoComponent,
    AdminEditpunishmentstripeComponent,
    AdminDepositrequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AlertModule,
    MaterialModule,
    FlexLayoutModule,
    HammerModule,
    AlertModule.forRoot({maxMessages: 3, timeout: 5000, position: 'right'})
  ],
  providers: [{provide: LOCALE_ID, useValue: 'nl-NL' }, TitleCasePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
