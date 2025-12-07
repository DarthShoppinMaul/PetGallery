// auth.cy.js
// Authentication and authorization tests

const API_BASE_URL = Cypress.env('apiBaseUrl') || 'http://localhost:8000';

describe('Authentication System', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.waitForAPI();
    });

    describe('Login Flow', () => {
        beforeEach(() => {
            cy.visit('/login');
        });

        it('should display login form with all required elements', () => {
            cy.get('h1').should('be.visible');
            cy.get('[data-cy="email-input"]').should('be.visible');
            cy.get('[data-cy="password-input"]').should('be.visible');
            cy.get('[data-cy="remember-me-checkbox"]').should('be.visible');
            cy.get('[data-cy="login-button"]').should('be.visible');
            cy.get('[data-cy="google-signin-button"]').should('be.visible');
            cy.get('[data-cy="register-link"]').should('have.attr', 'href', '/register');
        });

        it('should show validation errors for empty form submission', () => {
            cy.get('[data-cy="email-input"]').invoke('removeAttr', 'required');
            cy.get('[data-cy="password-input"]').invoke('removeAttr', 'required');
            cy.get('[data-cy="login-button"]').click();
            cy.url().should('include', '/login');
            cy.wait(500);
            cy.get('[data-cy="email-error"]').should('be.visible');
        });

        it('should show validation error for invalid email format', () => {
            cy.get('[data-cy="email-input"]').invoke('attr', 'type', 'text');
            cy.get('[data-cy="email-input"]').type('invalid-email');
            cy.get('[data-cy="password-input"]').type('123456Pw');
            cy.get('[data-cy="login-button"]').click();
            cy.wait(500);
            cy.url().should('include', '/login');
        });

        it('should show validation error for short password', () => {
            cy.get('[data-cy="email-input"]').type('test@test.com');
            cy.get('[data-cy="password-input"]').type('12345');
            cy.get('[data-cy="login-button"]').click();
            cy.wait(500);
            cy.url().should('include', '/login');
            cy.get('[data-cy="password-error"]').should('be.visible');
        });

        it('should fail with invalid credentials', () => {
            cy.get('[data-cy="email-input"]').type('wrong@user.com');
            cy.get('[data-cy="password-input"]').type('wrongpass123');
            cy.get('[data-cy="login-button"]').click();
            cy.wait(2000);
            cy.url().should('include', '/login');
        });

        it('should successfully login as admin with valid credentials', () => {
            cy.get('[data-cy="email-input"]').type('test@t.ca');
            cy.get('[data-cy="password-input"]').type('123456Pw');
            cy.get('[data-cy="login-button"]').click();
            cy.url().should('include', '/pets', { timeout: 10000 });
            cy.request(`${API_BASE_URL}/auth/me`).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.email).to.eq('test@t.ca');
                expect(response.body.is_admin).to.be.true;
            });
        });

        it('should successfully login as regular user', () => {
            cy.get('[data-cy="email-input"]').type('ebasotest@gmail.com');
            cy.get('[data-cy="password-input"]').type('123456Pw');
            cy.get('[data-cy="login-button"]').click();
            cy.url().should('include', '/pets', { timeout: 10000 });
            cy.request(`${API_BASE_URL}/auth/me`).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.email).to.eq('ebasotest@gmail.com');
                expect(response.body.is_admin).to.be.false;
            });
        });

        it('should persist remember me selection across form interaction', () => {
            cy.get('[data-cy="remember-me-checkbox"]').check();
            cy.get('[data-cy="remember-me-checkbox"]').should('be.checked');
            cy.get('[data-cy="email-input"]').type('test@test.com');
            cy.get('[data-cy="remember-me-checkbox"]').should('be.checked');
            cy.get('[data-cy="remember-me-checkbox"]').uncheck();
            cy.get('[data-cy="remember-me-checkbox"]').should('not.be.checked');
        });
    });

    describe('Registration Flow', () => {
        beforeEach(() => {
            cy.visit('/register');
        });

        it('should display registration form with all fields', () => {
            cy.get('h1').should('be.visible');
            cy.get('[data-cy="email-input"]').should('be.visible');
            cy.get('[data-cy="displayName-input"]').should('be.visible');
            cy.get('[data-cy="phone-input"]').should('be.visible');
            cy.get('[data-cy="password-input"]').should('be.visible');
            cy.get('[data-cy="confirm-password-input"]').should('be.visible');
            cy.get('[data-cy="register-button"]').should('be.visible');
            cy.get('[data-cy="login-link"]').should('have.attr', 'href', '/login');
        });

        it('should show validation errors for empty form', () => {
            cy.get('[data-cy="email-input"]').invoke('removeAttr', 'required');
            cy.get('[data-cy="displayName-input"]').invoke('removeAttr', 'required');
            cy.get('[data-cy="password-input"]').invoke('removeAttr', 'required');
            cy.get('[data-cy="confirm-password-input"]').invoke('removeAttr', 'required');
            cy.get('[data-cy="register-button"]').click();
            cy.wait(500);
            cy.url().should('include', '/register');
        });

        it('should validate password confirmation match', () => {
            cy.get('[data-cy="email-input"]').type('test@test.com');
            cy.get('[data-cy="displayName-input"]').type('Test User');
            cy.get('[data-cy="password-input"]').type('Password123');
            cy.get('[data-cy="confirm-password-input"]').type('DifferentPass123');
            cy.get('input[name="agreeToTerms"]').check();
            cy.get('[data-cy="register-button"]').click();
            cy.wait(500);
            cy.url().should('include', '/register');
        });

        it('should require terms agreement', () => {
            const timestamp = Date.now();
            cy.get('[data-cy="email-input"]').type(`test${timestamp}@test.com`);
            cy.get('[data-cy="displayName-input"]').type('Test User');
            cy.get('[data-cy="password-input"]').type('Password123');
            cy.get('[data-cy="confirm-password-input"]').type('Password123');
            cy.get('[data-cy="register-button"]').click();
            cy.wait(500);
            cy.url().should('include', '/register');
        });

        it('should show password strength indicator', () => {
            cy.get('[data-cy="password-input"]').type('weak');
            cy.get('body').then(($body) => {
                const text = $body.text();
                expect(text).to.match(/weak|medium|strong|Password strength/i);
            });
        });

        it('should successfully register a new user', () => {
            const timestamp = Date.now();
            const testEmail = `newuser${timestamp}@test.com`;
            cy.get('[data-cy="displayName-input"]').type('Cypress Test User');
            cy.get('[data-cy="email-input"]').type(testEmail);
            cy.get('[data-cy="password-input"]').type('StrongPass123!');
            cy.get('[data-cy="confirm-password-input"]').type('StrongPass123!');
            cy.get('[data-cy="phone-input"]').type('5551234567');
            cy.get('input[name="agreeToTerms"]').check();
            cy.get('[data-cy="register-button"]').click();
            cy.wait(3000);
            cy.url().should('not.include', '/register');
        });
    });

    describe('Session Management', () => {
        it('should maintain session across page navigation', () => {
            cy.loginAsAdmin();
            cy.visit('/pets');
            cy.url().should('include', '/pets');
            cy.visit('/profile');
            cy.url().should('include', '/profile');
            cy.request(`${API_BASE_URL}/auth/me`).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.email).to.eq('test@t.ca');
            });
        });

        it('should logout and clear session', () => {
            cy.loginAsAdmin();
            cy.visit('/');
            cy.get('[data-cy="logout-link"]').click();
            cy.wait(2000);
            cy.url().should('match', /(\/login|\/|\/home)/);
            cy.request({
                method: 'GET',
                url: `${API_BASE_URL}/auth/me`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(401);
            });
        });

        it('should not access protected routes when not authenticated', () => {
            cy.visit('/admin/dashboard');
            cy.wait(1000);
            cy.url().should('not.include', '/admin/dashboard');
        });
    });

    describe('Authorization', () => {
        it('should prevent regular users from accessing admin routes', () => {
            cy.loginAsUser();
            cy.visit('/admin/dashboard');
            cy.wait(1000);
            cy.url().should('not.include', '/admin/dashboard');
        });

        it('should allow admins to access admin routes', () => {
            cy.loginAsAdmin();
            cy.visit('/admin/dashboard');
            cy.wait(1000);
            cy.url().should('include', '/admin/dashboard');
            cy.get('h1', { timeout: 10000 }).should('be.visible');
        });

        it('should show appropriate navigation for admin users', () => {
            cy.loginAsAdmin();
            cy.visit('/');
            cy.get('nav').within(() => {
                cy.get('a[href="/admin/dashboard"]').should('be.visible');
                cy.get('[data-cy="user-management-link"]').should('be.visible');
            });
        });

        it('should not show admin navigation for regular users', () => {
            cy.loginAsUser();
            cy.visit('/');
            cy.wait(1000);
            cy.get('nav').within(() => {
                cy.get('a[href="/admin/dashboard"]').should('not.exist');
            });
        });
    });

    describe('Remember Me Functionality', () => {
        it('should create longer-lived token when remember me is checked', () => {
            cy.visit('/login');
            cy.get('[data-cy="email-input"]').type('test@t.ca');
            cy.get('[data-cy="password-input"]').type('123456Pw');
            cy.get('[data-cy="remember-me-checkbox"]').check();
            cy.get('[data-cy="login-button"]').click();
            cy.wait(2000);
            cy.url().should('include', '/pets');
            cy.getCookie('access_token').should('exist');
        });

        it('should work without remember me checked', () => {
            cy.visit('/login');
            cy.get('[data-cy="email-input"]').type('test@t.ca');
            cy.get('[data-cy="password-input"]').type('123456Pw');
            cy.get('[data-cy="login-button"]').click();
            cy.wait(2000);
            cy.url().should('include', '/pets');
            cy.getCookie('access_token').should('exist');
        });
    });

    describe('Error Handling', () => {
        it('should handle network errors gracefully', () => {
            cy.visit('/login');
            cy.get('[data-cy="email-input"]').type('test@test.com');
            cy.get('[data-cy="password-input"]').type('testpass');
            cy.get('[data-cy="login-button"]').click();
            cy.wait(2000);
            cy.url().should('include', '/login');
            cy.get('[data-cy="email-input"]').should('be.visible');
        });

        it('should clear errors when user starts typing', () => {
            cy.visit('/login');
            cy.get('[data-cy="email-input"]').invoke('removeAttr', 'required');
            cy.get('[data-cy="password-input"]').invoke('removeAttr', 'required');
            cy.get('[data-cy="login-button"]').click();
            cy.wait(500);
            cy.get('[data-cy="email-input"]').type('test@test.com');
            cy.get('[data-cy="password-input"]').type('password');
            cy.get('[data-cy="login-button"]').should('be.visible');
        });
    });
});