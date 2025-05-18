import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { BeginnerComponent } from './beginner/beginner.component';
import { RouterModule } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { QwenApiService } from './services/qwen-api.service';
import { ProfileGuard } from './guards/profile.guard';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { AdvancedComponent } from './advanced/advanced.component';
import { IntermediateComponent } from './intermediate/intermediate.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatbotComponent,
    HomeComponent,
    CreateProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,

    FormsModule,
    AdvancedComponent,
    BeginnerComponent,
    IntermediateComponent,
  ],
  providers: [provideHttpClient(), QwenApiService, ProfileGuard],
  bootstrap: [AppComponent],
  exports: [ChatbotComponent],
})
export class AppModule {}
