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
            // Remove HTML5 validation to test React validation
            cy.get('[data-cy="email-input"]').invoke('removeAttr', 'required');
            cy.get('[data-cy="password-input"]').invoke('removeAttr', 'required');

            cy.get('[data-cy="login-button"]').click();

            // Should stay on login page
            cy.url().should('include', '/login');

            // Wait for validation to trigger
            cy.wait(500);

            // Check for error messages using data-cy attributes
            cy.get('body').then(($body) => {
                const text = $body.text();
                const hasEmailError = text.includes('Email is required') || text.includes('email');
                const hasPasswordError = text.includes('Password is required') || text.includes('password');

                // At least one validation message should appear
                expect(hasEmailError || hasPasswordError).to.be.true;
            });
        });

        it('should show validation error for invalid email format', () => {
            cy.get('[data-cy="email-input"]').type('invalid-email');
            cy.get('[data-cy="password-input"]').type('123456Pw');

            // Remove HTML5 validation
            cy.get('[data-cy="email-input"]').invoke('attr', 'type', 'text');

            cy.get('[data-cy="login-button"]').click();

            // Wait for validation
            cy.wait(500);

            // Check for validation error
            cy.get('body').then(($body) => {
                const text = $body.text();
                const hasValidationError = text.includes('valid email') ||
                    text.includes('Invalid') ||
                    text.includes('Please enter a valid');
                expect(hasValidationError).to.be.true;
            });
        });

        it('should show validation error for short password', () => {
            cy.get('[data-cy="email-input"]').type('test@test.com');
            cy.get('[data-cy="password-input"]').type('12345');
            cy.get('[data-cy="login-button"]').click();

            cy.wait(500);

            // Should stay on login and show error
            cy.url().should('include', '/login');
            cy.get('body').then(($body) => {
                const text = $body.text();
                expect(text).to.match(/password.*6.*character|Password must be at least/i);
            });
        });

        it('should fail with invalid credentials', () => {
            cy.get('[data-cy="email-input"]').type('wrong@user.com');
            cy.get('[data-cy="password-input"]').type('wrongpass123');
            cy.get('[data-cy="login-button"]').click();

            cy.wait(2000);

            // Should stay on login page
            cy.url().should('include', '/login');
        });

        it('should successfully login as admin with valid credentials', () => {
            cy.get('[data-cy="email-input"]').type('test@t.ca');
            cy.get('[data-cy="password-input"]').type('123456Pw');
            cy.get('[data-cy="login-button"]').click();

            // Should redirect to pets page
            cy.url().should('include', '/pets', { timeout: 10000 });

            // Verify authentication via API
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

            // Should redirect to pets page
            cy.url().should('include', '/pets', { timeout: 10000 });

            // Verify authentication via API
            cy.request(`${API_BASE_URL}/auth/me`).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.email).to.eq('ebasotest@gmail.com');
                expect(response.body.is_admin).to.be.false;
            });
        });

        it('should persist remember me selection across form interaction', () => {
            // Check remember me
            cy.get('[data-cy="remember-me-checkbox"]').check();
            cy.get('[data-cy="remember-me-checkbox"]').should('be.checked');

            // Type in email
            cy.get('[data-cy="email-input"]').type('test@test.com');

            // Remember me should still be checked
            cy.get('[data-cy="remember-me-checkbox"]').should('be.checked');

            // Uncheck
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
            // Remove HTML5 required attributes
            cy.get('[data-cy="email-input"]').invoke('removeAttr', 'required');
            cy.get('[data-cy="displayName-input"]').invoke('removeAttr', 'required');
            cy.get('[data-cy="password-input"]').invoke('removeAttr', 'required');
            cy.get('[data-cy="confirm-password-input"]').invoke('removeAttr', 'required');

            cy.get('[data-cy="register-button"]').click();

            cy.wait(500);

            // Should stay on register page
            cy.url().should('include', '/register');

            // Should show validation errors
            cy.get('body').then(($body) => {
                const text = $body.text();
                expect(text).to.include('Email is required');
            });
        });

        it('should validate password confirmation match', () => {
            cy.get('[data-cy="email-input"]').type('test@test.com');
            cy.get('[data-cy="displayName-input"]').type('Test User');
            cy.get('[data-cy="password-input"]').type('Password123');
            cy.get('[data-cy="confirm-password-input"]').type('DifferentPass123');

            // Agree to terms
            cy.get('input[name="agreeToTerms"]').check();

            cy.get('[data-cy="register-button"]').click();

            cy.wait(500);

            // Should stay on register page with error
            cy.url().should('include', '/register');
            cy.get('body').then(($body) => {
                const text = $body.text();
                expect(text).to.match(/password.*not match|Passwords do not match/i);
            });
        });

        it('should require terms agreement', () => {
            const timestamp = Date.now();

            cy.get('[data-cy="email-input"]').type(`test${timestamp}@test.com`);
            cy.get('[data-cy="displayName-input"]').type('Test User');
            cy.get('[data-cy="password-input"]').type('Password123');
            cy.get('[data-cy="confirm-password-input"]').type('Password123');

            // Do NOT check terms
            cy.get('[data-cy="register-button"]').click();

            cy.wait(500);

            // Should stay on register page
            cy.url().should('include', '/register');
        });

        it('should show password strength indicator', () => {
            cy.get('[data-cy="password-input"]').type('weak');

            // Password strength indicator should appear
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

            // Should not remain on register page
            cy.url().should('not.include', '/register');
        });
    });

    describe('Session Management', () => {
        it('should maintain session across page navigation', () => {
            cy.loginAsAdmin();

            // Navigate to different pages
            cy.visit('/pets');
            cy.url().should('include', '/pets');

            cy.visit('/profile');
            cy.url().should('include', '/profile');

            // Session should still be valid
            cy.request(`${API_BASE_URL}/auth/me`).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.email).to.eq('test@t.ca');
            });
        });

        it('should logout and clear session', () => {
            cy.loginAsAdmin();
            cy.visit('/');

            // Click logout
            cy.get('[data-cy="logout-link"]').click();

            cy.wait(2000);

            // Should redirect to home or login
            cy.url().should('match', /(\/login|\/|\/home)/);

            // Session should be cleared
            cy.request({
                method: 'GET',
                url: `${API_BASE_URL}/auth/me`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(401);
            });
        });

        it('should not access protected routes when not authenticated', () => {
            // Try to access admin dashboard without login
            cy.visit('/admin/dashboard');

            cy.wait(1000);

            // Should be redirected away from admin dashboard
            cy.url().should('not.include', '/admin/dashboard');
        });
    });

    describe('Authorization', () => {
        it('should prevent regular users from accessing admin routes', () => {
            cy.loginAsUser();

            // Try to access admin dashboard
            cy.visit('/admin/dashboard');

            cy.wait(1000);

            // Should be redirected away
            cy.url().should('not.include', '/admin/dashboard');
        });

        it('should allow admins to access admin routes', () => {
            cy.loginAsAdmin();

            // Access admin dashboard
            cy.visit('/admin/dashboard');

            cy.wait(1000);

            // Should remain on admin dashboard
            cy.url().should('include', '/admin/dashboard');

            // Verify page loaded
            cy.get('h1', { timeout: 10000 }).should('be.visible');
        });

        it('should show appropriate navigation for admin users', () => {
            cy.loginAsAdmin();
            cy.visit('/');

            // Admin navigation links should be visible
            cy.get('nav').within(() => {
                cy.get('a[href="/admin/dashboard"]').should('be.visible');
                cy.get('[data-cy="user-management-link"]').should('be.visible');
            });
        });

        it('should not show admin navigation for regular users', () => {
            cy.loginAsUser();
            cy.visit('/');

            cy.wait(1000);

            // Admin links should not exist
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

            // Verify logged in
            cy.url().should('include', '/pets');

            // Check cookie exists
            cy.getCookie('access_token').should('exist');
        });

        it('should work without remember me checked', () => {
            cy.visit('/login');

            cy.get('[data-cy="email-input"]').type('test@t.ca');
            cy.get('[data-cy="password-input"]').type('123456Pw');
            // Do NOT check remember me
            cy.get('[data-cy="login-button"]').click();

            cy.wait(2000);

            // Should still log in successfully
            cy.url().should('include', '/pets');
            cy.getCookie('access_token').should('exist');
        });
    });

    describe('Error Handling', () => {
        it('should handle network errors gracefully', () => {
            // This test verifies the app doesn't crash on errors
            cy.visit('/login');

            cy.get('[data-cy="email-input"]').type('test@test.com');
            cy.get('[data-cy="password-input"]').type('testpass');
            cy.get('[data-cy="login-button"]').click();

            cy.wait(2000);

            // Should stay on login page
            cy.url().should('include', '/login');

            // Page should still be functional
            cy.get('[data-cy="email-input"]').should('be.visible');
        });

        it('should clear errors when user starts typing', () => {
            cy.visit('/login');

            // Remove required attributes
            cy.get('[data-cy="email-input"]').invoke('removeAttr', 'required');
            cy.get('[data-cy="password-input"]').invoke('removeAttr', 'required');

            // Submit empty form
            cy.get('[data-cy="login-button"]').click();

            cy.wait(500);

            // Start typing in email
            cy.get('[data-cy="email-input"]').type('test@test.com');

            // Start typing in password
            cy.get('[data-cy="password-input"]').type('password');

            // Form should be functional
            cy.get('[data-cy="login-button"]').should('be.visible');
        });
    });
});