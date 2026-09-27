import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Header } from './header';

describe('Header', () => {
  let driver = false;

  const auth = {
    isDriver: () => driver,
    logout: () => undefined,
  };
  const cart = {
    itemCount: () => 0,
  };

  beforeEach(() => {
    driver = false;
    TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: auth },
        { provide: CartService, useValue: cart },
      ],
    });
  });

  it('does not render the floating navbar for a driver', () => {
    driver = true;
    const fixture = TestBed.createComponent(Header);
    fixture.componentInstance.isScrolled = true;
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.floating-navigation');
    expect(nav).toBeNull();
  });

  it('keeps customer navigation in the floating navbar for a non-driver', () => {
    const fixture = TestBed.createComponent(Header);
    fixture.componentInstance.isScrolled = true;
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.floating-navigation') as HTMLElement;
    expect(nav.textContent).toContain('Businesses');
    expect(nav.textContent).toContain('Orders');
    expect(nav.textContent).toContain('Track Order');
  });
});
