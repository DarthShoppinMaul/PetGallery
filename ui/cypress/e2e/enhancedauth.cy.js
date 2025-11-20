/**
 * Enhanced Authentication Test
 * Tests the improved Cypress authentication commands
 */

describe('Enhanced Authentication Tests', () => {
    beforeEach(() => {
        // Ensure API is available
        cy.testAPI()
    })

    describe('Enhanced Login Command', () => {
        it('should login successfully using enhanced command', () => {
            // Use the enhanced login command
            cy.loginEnhanced()

            // Verify we're logged in by visiting a protected page
            cy.visit('/add-pet')
            cy.url().should('include', '/add-pet')

            // Verify via API that we're authenticated
            cy.request({
                method: 'GET',
                url: `${Cypress.env('apiBaseUrl')}/auth/me`
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.email).to.eq('test@t.ca')
            })
        })

        it('should maintain session across page visits', () => {
            cy.loginEnhanced()

            // Visit multiple protected pages
            cy.visit('/add-pet')
            cy.url().should('include', '/add-pet')

            cy.visit('/admin/dashboard')
            cy.url().should('include', '/admin/dashboard')

            cy.visit('/profile')
            cy.url().should('include', '/profile')

            // Should still be authenticated
            cy.request({
                method: 'GET',
                url: `${Cypress.env('apiBaseUrl')}/auth/me`
            }).then((response) => {
                expect(response.status).to.eq(200)
            })
        })
    })

    describe('API Login Command', () => {
        it('should login using direct API call', () => {
            // Use API login command
            cy.loginAPI()

            // Visit the frontend to verify session works
            cy.visit('/pets')

            // Should be able to access protected routes
            cy.visit('/add-pet')
            cy.url().should('include', '/add-pet')
        })
    })

    describe('Login Comparison', () => {
        it('should work with original cy.login() command', () => {
            // Test original command still works
            cy.login()

            cy.visit('/add-pet')
            cy.url().should('include', '/add-pet')
        })

        it('should work with enhanced cy.loginEnhanced() command', () => {
            // Test enhanced command works
            cy.loginEnhanced()

            cy.visit('/add-pet')
            cy.url().should('include', '/add-pet')
        })
    })
})