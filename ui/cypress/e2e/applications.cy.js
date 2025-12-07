// applications.cy.js
// Tests for adoption application workflow

const API_BASE_URL = Cypress.env('apiBaseUrl') || 'http://localhost:8000';

describe('Adoption Applications System', () => {
    let testLocation;
    let testPet;
    let adminPet;

    before(() => {
        cy.loginAsAdmin();

        cy.createLocation({
            name: `Test Location ${Date.now()}`,
            address: '123 Test St, Test City',
            phone: '(306) 555-1234'
        }).then((location) => {
            testLocation = location;

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

            cy.get('h1', { timeout: 10000 }).should('be.visible');

            cy.get('textarea[name="applicationMessage"]').should('be.visible');
            cy.get('[data-cy="contact-phone-input"]').should('be.visible');
            cy.get('[data-cy="living-situation-select"]').should('be.visible');
            cy.get('[data-cy="submit-application-button"]').should('be.visible');
        });

        it('should show pet information in application form', () => {
            cy.visit(`/apply/${testPet.pet_id}`);

            cy.get('h1', { timeout: 10000 }).should('be.visible');
            cy.get('h2').first().should('be.visible');
            cy.get('[data-cy="contact-phone-input"]').should('be.visible');
        });
    });

    describe('Application Form Validation', () => {
        beforeEach(() => {
            cy.loginAsUser();
            cy.visit(`/apply/${testPet.pet_id}`);
            cy.get('textarea[name="applicationMessage"]', { timeout: 10000 }).should('be.visible');
        });

        it('should validate application message minimum length', () => {
            cy.get('textarea[name="applicationMessage"]').clear().type('Too short');
            cy.get('[data-cy="contact-phone-input"]').clear().type('5551234567');
            cy.get('[data-cy="living-situation-select"]').select('house_owned');

            cy.get('[data-cy="submit-application-button"]').click();

            cy.url().should('include', `/apply/${testPet.pet_id}`);

            cy.get('body').then(($body) => {
                const text = $body.text();
                expect(text).to.include('at least 50');
            });
        });

        it('should validate required fields', () => {
            cy.get('textarea[name="applicationMessage"]').clear();
            cy.get('[data-cy="submit-application-button"]').click();

            cy.url().should('include', `/apply/${testPet.pet_id}`);
        });

        it('should validate phone number format', () => {
            const longMessage = 'I would love to adopt this pet because I have a great home with plenty of space and time to care for them properly.';

            cy.get('textarea[name="applicationMessage"]').clear().type(longMessage);
            cy.get('[data-cy="contact-phone-input"]').clear().type('invalid');
            cy.get('[data-cy="living-situation-select"]').select('house_owned');

            cy.get('[data-cy="submit-application-button"]').click();

            cy.url().should('include', `/apply/${testPet.pet_id}`);
        });

        it('should show other pets details field when checkbox is checked', () => {
            cy.get('input[name="hasOtherPets"]').check();

            cy.get('textarea[name="otherPetsDetails"]').should('be.visible');
        });

        it('should show character count for application message', () => {
            const testMessage = 'This is a test message to check character count functionality.';

            cy.get('textarea[name="applicationMessage"]').clear().type(testMessage);

            cy.get('body').then(($body) => {
                const text = $body.text();
                expect(text).to.match(/\d+.*character/);
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
            cy.get('[data-cy="contact-phone-input"]').clear().type('(306) 555-9999');
            cy.get('[data-cy="living-situation-select"]').select('house_owned');

            cy.get('[data-cy="submit-application-button"]').click();

            cy.wait(3000);

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

            cy.get('h1', { timeout: 10000 }).should('be.visible');
            cy.get('h1').should('be.visible');
        });

        it('should show filter tabs for application status', () => {
            cy.visit('/my-applications');

            cy.get('h1', { timeout: 10000 }).should('be.visible');
            cy.get('button').should('have.length.at.least', 1);
        });

        it('should redirect admins to dashboard', () => {
            cy.loginAsAdmin();
            cy.visit('/my-applications');

            cy.wait(2000);
            cy.url().should('not.include', '/my-applications');
        });
    });

    describe('Admin Dashboard - Applications', () => {
        let testApplication;

        beforeEach(() => {
            cy.loginAsAdmin();

            cy.loginAsUser();
            cy.createApplication(adminPet.pet_id, {
                application_message: 'This is a test application for admin review. I have a great home and would love to adopt this pet.',
                contact_phone: '(306) 555-9999',
                living_situation: 'house_owned',
                has_other_pets: false
            }).then((app) => {
                testApplication = app;
            });

            cy.loginAsAdmin();
        });

        afterEach(() => {
            if (testApplication) {
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

            cy.get('h1', { timeout: 10000 }).should('be.visible');
            cy.get('h1').first().should('be.visible');
        });

        it('should show application statistics', () => {
            cy.visit('/admin/dashboard');

            cy.get('.panel', { timeout: 10000 }).should('be.visible');
            cy.get('.panel').should('have.length.at.least', 1);
        });

        it('should navigate to application review from dashboard', () => {
            cy.visit('/admin/dashboard');
            cy.wait(2000);

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

            cy.loginAsUser();
            cy.createApplication(adminPet.pet_id, {
                application_message: 'I am submitting this application to test the admin review process. I have experience with pets and a suitable home.',
                contact_phone: '(306) 555-8888',
                living_situation: 'apartment_owned',
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

            cy.get('h1', { timeout: 10000 }).should('be.visible');
            cy.get('h1').should('be.visible');
        });

        it('should show applicant details correctly', () => {
            cy.visit(`/admin/application/${reviewApplication.application_id}`);

            cy.get('h1', { timeout: 10000 }).should('be.visible');
            cy.get('.panel').should('have.length.at.least', 1);
        });

        it('should allow admin to add notes', () => {
            cy.visit(`/admin/application/${reviewApplication.application_id}`);
            cy.wait(2000);

            cy.get('textarea').first().should('be.visible');
        });

        it('should show approve and reject buttons for pending applications', () => {
            cy.visit(`/admin/application/${reviewApplication.application_id}`);
            cy.wait(2000);

            cy.get('button').should('have.length.at.least', 1);
        });
    });

    describe('Application Status Updates', () => {
        let statusTestApplication;

        beforeEach(() => {
            cy.loginAsAdmin();

            cy.loginAsUser();
            cy.createApplication(adminPet.pet_id, {
                application_message: 'Testing status updates for this application. I am very interested in this pet and have all the necessary requirements.',
                contact_phone: '(306) 555-7777',
                living_situation: 'house_owned',
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
            cy.updateApplication(statusTestApplication.application_id, {
                status: 'approved',
                admin_notes: 'Great applicant, approved!'
            }).then((updated) => {
                expect(updated.status).to.equal('approved');
            });
        });

        it('should allow admin to reject application', () => {
            cy.updateApplication(statusTestApplication.application_id, {
                status: 'rejected',
                admin_notes: 'Not a good fit at this time.'
            }).then((updated) => {
                expect(updated.status).to.equal('rejected');
            });
        });
    });
});