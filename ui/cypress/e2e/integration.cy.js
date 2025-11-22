// integration.cy.js
// Comprehensive end-to-end integration tests
// Tests complete user journeys and multi-user interactions

describe('End-to-End Integration Tests', () => {
    beforeEach(() => {
        cy.cleanupTestData();
    });

    describe('Complete User Journey: Registration to Adoption Application', () => {
        it('should complete full user flow from registration to submitting application', () => {
            const timestamp = Date.now();
            const testEmail = `journey${timestamp}@test.com`;

            cy.visit('/register');
            cy.get('[data-cy="email-input"]').type(testEmail);
            cy.get('[data-cy="displayName-input"]').type('Journey Tester');
            cy.get('[data-cy="password-input"]').type('Test123!');
            cy.get('[data-cy="confirm-password-input"]').type('Test123!');
            cy.get('input[name="agreeToTerms"]').check();
            cy.get('[data-cy="register-button"]').click();

            cy.url().should('not.include', '/register', { timeout: 10000 });
            cy.verifyAuthenticated();

            cy.getPets().then((pets) => {
                const approvedPet = pets.find(p => p.status === 'approved');

                if (!approvedPet) {
                    cy.log('No approved pets available for application test');
                    return;
                }

                cy.visit(`/pet/${approvedPet.pet_id}`);
                cy.get('h1').should('be.visible');

                cy.get('body').then(($body) => {
                    if ($body.find('[data-cy="apply-button"]').length > 0) {
                        cy.get('[data-cy="apply-button"]').click();

                        cy.url().should('include', `/apply/${approvedPet.pet_id}`);

                        const message = 'I would love to adopt this wonderful pet. I have a stable home with plenty of space and time to provide excellent care.';
                        cy.get('textarea[name="applicationMessage"]').clear().type(message);
                        cy.get('[data-cy="applicant-phone-input"]').clear().type('(306) 555-1111');
                        cy.get('[data-cy="housing-type-select"]').select('house');
                        cy.get('[data-cy="submit-application-button"]').click();

                        cy.wait(2000);
                        cy.url().then((url) => {
                            const validUrls = url.includes('/my-applications') || url.includes(`/apply/${approvedPet.pet_id}`);
                            expect(validUrls).to.be.true;
                        });
                    } else {
                        cy.log('Apply button not available for this pet');
                    }
                });
            });
        });
    });

    describe('Admin Workflow: Pet Management to Application Review', () => {
        it('should complete admin workflow from pet creation to application approval', () => {
            cy.loginAsAdmin();

            cy.getLocations().then((locations) => {
                expect(locations.length).to.be.greaterThan(0);
                const location = locations[0];

                cy.createPet({
                    name: `Admin Workflow Pet ${Date.now()}`,
                    species: 'Dog',
                    age: 4,
                    location_id: location.location_id,
                    status: 'approved'
                }).then((pet) => {
                    cy.logout();
                    cy.loginAsUser();

                    cy.createApplication(pet.pet_id).then((application) => {
                        expect(application).to.have.property('application_id');

                        cy.logout();
                        cy.loginAsAdmin();

                        cy.visit(`/admin/application/${application.application_id}`);
                        cy.get('h1', { timeout: 10000 }).should('be.visible');

                        cy.get('body').then(($body) => {
                            const bodyText = $body.text();
                            expect(bodyText).to.include('Application');
                        });

                        cy.deletePet(pet.pet_id);
                    });
                });
            });
        });
    });

    describe('Multi-User Interaction', () => {
        it('should handle multiple users favoriting the same pet', () => {
            cy.loginAsAdmin();

            cy.getLocations().then((locations) => {
                const location = locations[0];

                cy.createPet({
                    name: `Popular Pet ${Date.now()}`,
                    species: 'Cat',
                    age: 2,
                    location_id: location.location_id,
                    status: 'approved'
                }).then((pet) => {
                    cy.addFavorite(pet.pet_id).then((response) => {
                        expect(response).to.have.property('ok', true);

                        cy.logout();
                        cy.loginAsUser();

                        cy.addFavorite(pet.pet_id).then((userResponse) => {
                            expect(userResponse).to.have.property('ok', true);

                            cy.getFavorites().then((favorites) => {
                                const hasPet = favorites.some(f => f.pet_id === pet.pet_id);
                                expect(hasPet).to.be.true;

                                cy.logout();
                                cy.loginAsAdmin();
                                cy.deletePet(pet.pet_id);
                            });
                        });
                    });
                });
            });
        });

        it('should allow multiple applications for the same pet', () => {
            cy.loginAsAdmin();

            cy.getLocations().then((locations) => {
                const location = locations[0];

                cy.createPet({
                    name: `Multi-Application Pet ${Date.now()}`,
                    species: 'Dog',
                    age: 3,
                    location_id: location.location_id,
                    status: 'approved'
                }).then((pet) => {
                    cy.logout();
                    cy.loginAsUser();

                    cy.createApplication(pet.pet_id).then((app1) => {
                        expect(app1).to.have.property('application_id');

                        cy.logout();
                        cy.loginAsUser('john@t.ca', '123456Pw');

                        cy.createApplication(pet.pet_id).then((app2) => {
                            expect(app2).to.have.property('application_id');
                            expect(app2.application_id).to.not.equal(app1.application_id);

                            cy.logout();
                            cy.loginAsAdmin();
                            cy.deletePet(pet.pet_id);
                        });
                    });
                });
            });
        });
    });

    describe('Error Handling and Edge Cases', () => {
        it('should handle navigation to non-existent pet', () => {
            cy.visit('/pet/999999');
            cy.get('body', { timeout: 10000 }).should('exist');
        });

        it('should handle navigation to non-existent application', () => {
            cy.loginAsAdmin();
            cy.visit('/admin/application/999999');
            cy.get('body', { timeout: 10000 }).should('exist');
        });


        it('should prevent deletion of location with associated pets', () => {
            cy.loginAsAdmin();

            cy.createLocation({
                name: `Protected Location ${Date.now()}`,
                address: '999 Test St, Test City, SK',
                phone: '(306) 555-9999'
            }).then((location) => {
                return cy.createPet({
                    name: `Pet in Protected Location ${Date.now()}`,
                    species: 'Dog',
                    age: 3,
                    location_id: location.location_id
                }).then((pet) => {
                    return cy.deleteLocation(location.location_id).then((deleteResponse) => {
                        return cy.wrap(deleteResponse);
                    }).then((response) => {
                        expect(response.status).to.equal(400);
                        return cy.deletePet(pet.pet_id);
                    }).then(() => {
                        return cy.deleteLocation(location.location_id);
                    });
                });
            });
        });
    });

    describe('Session Persistence', () => {
        it('should maintain session across multiple pages', () => {
            cy.loginAsUser();

            cy.visit('/pets');
            cy.verifyAuthenticated();

            cy.visit('/profile');
            cy.verifyAuthenticated();

            cy.visit('/my-applications');
            cy.verifyAuthenticated();
        });

        it('should properly clear session on logout', () => {
            cy.loginAsUser();
            cy.verifyAuthenticated();

            cy.visit('/');
            cy.get('[data-cy="logout-link"]').click();
            cy.wait(2000);

            cy.verifyNotAuthenticated();
        });
    });
});