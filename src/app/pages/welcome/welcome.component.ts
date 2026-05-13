import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent implements OnInit {
  constructor(
    private readonly el: ElementRef,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      const destino = this.auth.isStaff() ? '/admin' : '/catalogo';
      void this.router.navigateByUrl(destino);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    const page = this.el.nativeElement.querySelector('.welcome-page');
    if (page) {
      page.style.setProperty('--mx', `${x}%`);
      page.style.setProperty('--my', `${y}%`);
    }
  }
}
