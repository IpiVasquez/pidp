import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {
  MarkdownToHtmlComponent,
  MarkdownToHtmlModule
} from 'ng2-markdown-to-html';
import {AppComponent} from './app.component';
import {ApiService} from './api.service';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {LeafIdentifierComponent} from './leaf-identifier/leaf-identifier.component';

@NgModule({
  declarations: [
    AppComponent,
    LeafIdentifierComponent,
    // MarkdownToHtmlComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    MarkdownToHtmlModule.forRoot()
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {}
