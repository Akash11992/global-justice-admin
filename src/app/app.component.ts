import { Component } from '@angular/core';
import { Observable, fromEvent, mapTo, merge, of } from 'rxjs';
declare var AOS:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'microsite';
 
  ngOnInit(): void {
    AOS.init({
      duration: 1200,
  })
  }

  online$: Observable<boolean> = of(false);

  constructor() {
    // this.setupVisibilityChange();
    
    this.online$ = merge(

      of(navigator.onLine),

      fromEvent(window, 'online').pipe(mapTo(true)),

      fromEvent(window, 'offline').pipe(mapTo(false))

    );
  }
  
}

