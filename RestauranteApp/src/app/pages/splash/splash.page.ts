import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: false
})
export class SplashPage implements OnInit {

  animando = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    // Iniciar animación
    setTimeout(() => {
      this.animando = true;
    }, 100);

    // Esperar 2.5 segundos y redirigir
    setTimeout(async () => {
      const loggedIn = await this.authService.isLoggedIn();
      if (loggedIn) {
        this.router.navigate(['/tabs/menu'], { replaceUrl: true });
      } else {
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    }, 2800);
  }
}