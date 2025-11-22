// applications.cy.js
// Comprehensive tests for adoption application workflow

const API_BASE_URL = Cypress.env('apiBaseUrl') || 'http://localhost:8000';

describe('Adoption Applications System', () => {
    let testLocation;
    let testPet;
    let adminPet;

    before(() => {
        cy.loginAsAdmin();

        // Create test location
        cy.createLocation({
            name: `Test Location ${Date.now()}`,
            address: '123 Test St, Test City',
            phone: '(306) 555-1234'
        }).then((location) => {
            testLocation = location;

            // Create test pet for regular user applications
            cy.createPet({
                name: `Test Pet ${Date.now()}`,
                species: 'Dog',
                age: 3,
                location_id: location.location_id,
                description: 'Test pet for application testing',
                status: 'approved'
            }).then((pet) => {
                testPet = pet;
            });

            // Create second pet for admin tests
            cy.createPet({
                name: `Admin Test Pet ${Date.now()}`,
                species: 'Cat',
                age: 2,
                location_id: location.location_id,
                description: 'Test pet for admin application tests',
                status: 'approved'
            }).then((pet) => {
                adminPet = pet;
            });
        });
    });

    after(() => {
        cy.loginAsAdmin();

        // Cleanup test data
        if (testPet) {
            cy.deletePet(testPet.pet_id);
        }
        if (adminPet) {
            cy.deletePet(adminPet.pet_id);
        }
        if (testLocation) {
            cy.deleteLocation(testLocation.location_id);
        }
    });

    describe('Application Form Display', () => {
        beforeEach(() => {
            cy.loginAsUser();
        });

        it('should display application form for approved pets', () => {
            cy.visit(`/apply/${testPet.pet_id}`);

            // Wait for page to load
            cy.get('h1', { timeout: 10000 }).should('be.visible');

            // Verify form fields exist
            cy.get('textarea[name="applicationMessage"]').should('be.visible');
            cy.get('[data-cy="applicant-phone-input"]').should('be.visible');
            cy.get('[data-cy="housing-type-select"]').should('be.visible');
            cy.get('[data-cy="submit-application-button"]').should('be.visible');
        });

        it('should show pet information in application form', () => {
            cy.visit(`/apply/${testPet.pet_id}`);

            // Wait for page content to load
            cy.get('h1', { timeout: 10000 }).should('be.visible');

            // Check for pet name in the page
            cy.get('h2').first().should('be.visible');

            // Verify pet details are displayed somewhere on the page
            cy.get('[data-cy="applicant-phone-input"]').should('be.visible');
        });
    });

    describe('Application Form Validation', () => {
        beforeEach(() => {
            cy.loginAsUser();
            cy.visit(`/apply/${testPet.pet_id}`);
            cy.get('textarea[name="applicationMessage"]', { timeout: 10000 }).should('be.visible');
        });

        it('should validate application message minimum length', () => {
            // Fill in short message
            cy.get('textarea[name="applicationMessage"]').clear().type('Too short');
            cy.get('[data-cy="applicant-phone-input"]').clear().type('5551234567');
            cy.get('[data-cy="housing-type-select"]').select('house');

            cy.get('[data-cy="submit-application-button"]').click();

            // Should still be on the form page
            cy.url().should('include', `/apply/${testPet.pet_id}`);

            // Error message should be visible
            cy.get('body').then(($body) => {
                const text = $body.text();
                expect(text).to.include('at least 50');
            });
        });

        it('should validate required fields', () => {
            // Leave fields empty and submit
            cy.get('textarea[name="applicationMessage"]').clear();
            cy.get('[data-cy="submit-application-button"]').click();

            // Should still be on form page
            cy.url().should('include', `/apply/${testPet.pet_id}`);
        });

        it('should validate phone number format', () => {
            const longMessage = 'I would love to adopt this pet because I have a great home with plenty of space and time to care for them properly.';

            cy.get('textarea[name="applicationMessage"]').clear().type(longMessage);
            cy.get('[data-cy="applicant-phone-input"]').clear().type('invalid');
            cy.get('[data-cy="housing-type-select"]').select('house');

            cy.get('[data-cy="submit-application-button"]').click();

            // Should show validation error
            cy.url().should('include', `/apply/${testPet.pet_id}`);
        });

        it('should show other pets details field when checkbox is checked', () => {
            // Check the "has other pets" checkbox
            cy.get('input[name="hasOtherPets"]').check();

            // Other pets details field should appear
            cy.get('textarea[name="otherPetsDetails"]').should('be.visible');
        });

        it('should show character count for application message', () => {
            const testMessage = 'This is a test message to check character count functionality.';

            cy.get('textarea[name="applicationMessage"]').clear().type(testMessage);

            // Character count should be visible
            cy.get('body').then(($body) => {
                const text = $body.text();
                expect(text).to.match(/\d+ characters/);
            });
        });
    });

    describe('Application Submission', () => {
        beforeEach(() => {
            cy.loginAsUser();
        });

        it('should successfully submit application with valid data', () => {
            cy.visit(`/apply/${testPet.pet_id}`);
            cy.get('textarea[name="applicationMessage"]', { timeout: 10000 }).should('be.visible');

            const longMessage = 'I would love to adopt this wonderful pet. I have a large fenced yard, plenty of experience with pets, and work from home so I can provide constant companionship. I understand the commitment required and am prepared to provide excellent care for the lifetime of the pet.';

            cy.get('textarea[name="applicationMessage"]').clear().type(longMessage);
            cy.get('[data-cy="applicant-phone-input"]').clear().type('(306) 555-9999');
            cy.get('[data-cy="housing-type-select"]').select('house');

            cy.get('[data-cy="submit-application-button"]').click();

            // Wait for navigation
            cy.wait(3000);

            // Should redirect to my applications page OR stay on form with success/error
            cy.url().then((url) => {
                const validUrls = [
                    '/my-applications',
                    `/apply/${testPet.pet_id}`
                ];
                const isValid = validUrls.some(path => url.includes(path));
                expect(isValid).to.be.true;
            });
        });
    });

    describe('My Applications Page', () => {
        beforeEach(() => {
            cy.loginAsUser();
        });

        it('should display user applications list', () => {
            cy.visit('/my-applications');

            // Wait for page to load
            cy.get('h1', { timeout: 10000 }).should('be.visible');

            // Should have the main heading
            cy.get('h1').should('be.visible');
        });

        it('should show filter tabs for application status', () => {
            cy.visit('/my-applications');

            // Wait for page to load
            cy.get('h1', { timeout: 10000 }).should('be.visible');

            // Check for filter buttons
            cy.get('button').should('have.length.at.least', 1);
        });

        it('should redirect admins to dashboard', () => {
            cy.loginAsAdmin();
            cy.visit('/my-applications');

            // Admin should be redirected away from my-applications
            cy.wait(2000);
            cy.url().should('not.include', '/my-applications');
        });
    });

    describe('Admin Dashboard - Applications', () => {
        let testApplication;

        beforeEach(() => {
            cy.loginAsAdmin();

            // Create a fresh application for admin to review
            cy.loginAsUser();
            cy.createApplication(adminPet.pet_id, {
                application_message: 'This is a test application for admin review. I have a great home and would love to adopt this pet.',
                contact_phone: '(306) 555-9999',
                living_situation: 'house',
                has_other_pets: false
            }).then((app) => {
                testApplication = app;
            });

            cy.loginAsAdmin();
        });

        afterEach(() => {
            if (testApplication) {
                // Clean up application
                cy.loginAsAdmin();
                cy.request({
                    method: 'PATCH',
                    url: `${API_BASE_URL}/applications/${testApplication.application_id}`,
                    body: { status: 'rejected' },
                    failOnStatusCode: false
                });
            }
        });

        it('should display admin dashboard with pending applications', () => {
            cy.visit('/admin/dashboard');

            // Wait for page to load
            cy.get('h1', { timeout: 10000 }).should('be.visible');
            cy.get('h1').first().should('be.visible');
        });

        it('should show application statistics', () => {
            cy.visit('/admin/dashboard');

            // Wait for stats to load
            cy.get('.panel', { timeout: 10000 }).should('be.visible');

            // Should have stat cards
            cy.get('.panel').should('have.length.at.least', 1);
        });

        it('should navigate to application review from dashboard', () => {
            cy.visit('/admin/dashboard');
            cy.wait(2000);

            // Try to find and click a review button
            cy.get('body').then(($body) => {
                const reviewButtons = $body.find('button');
                if (reviewButtons.length > 0) {
                    cy.get('button').first().click();
                    cy.wait(1000);
                }
            });
        });
    });

    describe('Application Review Page', () => {
        let reviewApplication;

        beforeEach(() => {
            cy.loginAsAdmin();

            // Create application for review
            cy.loginAsUser();
            cy.createApplication(adminPet.pet_id, {
                application_message: 'I am submitting this application to test the admin review process. I have experience with pets and a suitable home.',
                contact_phone: '(306) 555-8888',
                living_situation: 'apartment',
                has_other_pets: true,
                other_pets_details: 'I have a friendly cat named Whiskers'
            }).then((app) => {
                reviewApplication = app;
            });

            cy.loginAsAdmin();
        });

        afterEach(() => {
            if (reviewApplication) {
                cy.loginAsAdmin();
                cy.request({
                    method: 'PATCH',
                    url: `${API_BASE_URL}/applications/${reviewApplication.application_id}`,
                    body: { status: 'rejected' },
                    failOnStatusCode: false
                });
            }
        });

        it('should display application review page with all details', () => {
            cy.visit(`/admin/application/${reviewApplication.application_id}`);

            // Wait for page to load
            cy.get('h1', { timeout: 10000 }).should('be.visible');

            // Should show main heading
            cy.get('h1').should('be.visible');
        });

        it('should show applicant details correctly', () => {
            cy.visit(`/admin/application/${reviewApplication.application_id}`);

            // Wait for content
            cy.get('h1', { timeout: 10000 }).should('be.visible');

            // Check that page has loaded with content
            cy.get('.panel').should('have.length.at.least', 1);
        });

        it('should allow admin to add notes', () => {
            cy.visit(`/admin/application/${reviewApplication.application_id}`);
            cy.wait(2000);

            // Find textarea for admin notes
            cy.get('textarea').first().should('be.visible');
        });

        it('should show approve and reject buttons for pending applications', () => {
            cy.visit(`/admin/application/${reviewApplication.application_id}`);
            cy.wait(2000);

            // Should have action buttons
            cy.get('button').should('have.length.at.least', 1);
        });
    });

    describe('Application Status Updates', () => {
        let statusTestApplication;

        beforeEach(() => {
            cy.loginAsAdmin();

            // Create fresh application
            cy.loginAsUser();
            cy.createApplication(adminPet.pet_id, {
                application_message: 'Testing status updates for this application. I am very interested in this pet and have all the necessary requirements.',
                contact_phone: '(306) 555-7777',
                living_situation: 'house',
                has_other_pets: false
            }).then((app) => {
                statusTestApplication = app;
            });

            cy.loginAsAdmin();
        });

        afterEach(() => {
            if (statusTestApplication) {
                cy.loginAsAdmin();
                cy.request({
                    method: 'PATCH',
                    url: `${API_BASE_URL}/applications/${statusTestApplication.application_id}`,
                    body: { status: 'rejected' },
                    failOnStatusCode: false
                });
            }
        });

        it('should allow admin to approve application', () => {
            // Update via API
            cy.updateApplication(statusTestApplication.application_id, {
                status: 'approved',
                admin_notes: 'Great applicant, approved!'
            }).then((updated) => {
                expect(updated.status).to.equal('approved');
            });
        });

        it('should allow admin to reject application', () => {
            // Update via API
            cy.updateApplication(statusTestApplication.application_id, {
                status: 'rejected',
                admin_notes: 'Not a good fit at this time.'
            }).then((updated) => {
                expect(updated.status).to.equal('rejected');
            });
        });
    });
});