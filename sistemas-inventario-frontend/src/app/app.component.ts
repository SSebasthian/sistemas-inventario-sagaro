import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MenuComponent } from './pagina/menu/menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIconModule, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sistemas-inventario-frontend';

  menuMinimizado = false; // Estado inicial del menú


  menuMinMax() {
    this.menuMinimizado = !this.menuMinimizado; // Cambia el estado al hacer clic
  }
}
