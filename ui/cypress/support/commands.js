// Cypress Commands with improved error handling

const API_BASE_URL = Cypress.env('apiBaseUrl') || 'http://localhost:8000';

// AUTHENTICATION COMMANDS

Cypress.Commands.add('loginAsAdmin', () => {
    cy.session('admin-session', () => {
        cy.visit('/login');
        cy.get('[data-cy="email-input"]').type('test@t.ca');
        cy.get('[data-cy="password-input"]').type('123456Pw');
        cy.get('[data-cy="login-button"]').click();
        cy.wait(1000);
        cy.url().should('include', '/pets', { timeout: 10000 });
        cy.request(`${API_BASE_URL}/auth/me`).its('status').should('eq', 200);
    });
});

Cypress.Commands.add('loginAsUser', (email = 'ebasotest@gmail.com', password = '123456Pw') => {
    cy.session(`user-${email}`, () => {
        cy.visit('/login');
        cy.get('[data-cy="email-input"]').type(email);
        cy.get('[data-cy="password-input"]').type(password);
        cy.get('[data-cy="login-button"]').click();
        cy.wait(1000);
        cy.url().should('include', '/pets', { timeout: 10000 });
        cy.request(`${API_BASE_URL}/auth/me`).its('status').should('eq', 200);
    });
});

Cypress.Commands.add('logout', () => {
    cy.request('POST', `${API_BASE_URL}/auth/logout`);
    cy.clearCookies();
    cy.clearLocalStorage();
});

Cypress.Commands.add('verifyAuthenticated', () => {
    cy.request(`${API_BASE_URL}/auth/me`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('email');
    });
});

Cypress.Commands.add('verifyNotAuthenticated', () => {
    cy.request({
        url: `${API_BASE_URL}/auth/me`,
        failOnStatusCode: false
    }).its('status').should('eq', 401);
});

// DATA CREATION COMMANDS

Cypress.Commands.add('createLocation', (locationData = {}) => {
    const defaultData = {
        name: `Test Location ${Date.now()}`,
        address: `${Math.floor(Math.random() * 9999)} Test St, Test City, SK`,
        phone: '(306) 555-1234'
    };

    const data = { ...defaultData, ...locationData };

    return cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/locations`,
        body: data
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
});

Cypress.Commands.add('createPet', (petData = {}) => {
    if (!petData.location_id) {
        throw new Error('location_id is required for createPet');
    }

    const timestamp = Date.now();
    const petName = petData.name || `Test Pet ${timestamp}`;
    const petSpecies = petData.species || 'Dog';
    const petAge = petData.age || 2;
    const petDescription = petData.description || 'A test pet for e2e testing';

    cy.visit('/add-pet');
    cy.get('[data-cy="add-new-pet-button"]').should('be.visible').click();
    cy.get('[data-cy="pet-name-input"]').should('be.visible');

    cy.get('[data-cy="pet-name-input"]').clear().type(petName);
    cy.get('[data-cy="pet-species-input"]').clear().type(petSpecies);
    cy.get('[data-cy="pet-age-input"]').clear().type(String(petAge));
    cy.get('[data-cy="pet-location-select"]').select(String(petData.location_id));
    cy.get('[data-cy="pet-description-input"]').clear().type(petDescription);

    if (petData.photo) {
        cy.get('[data-cy="pet-photo-input"]').attachFile(petData.photo);
    }

    cy.get('[data-cy="add-pet-button"]').click();
    cy.url().should('include', '/add-pet');
    cy.get('h1').should('have.text', 'Manage Pets');

    cy.wait(2000);

    const findCreatedPet = () => {
        return cy.request(`${API_BASE_URL}/pets`).then((response) => {
            const pets = response.body;
            const pet = pets.find(p =>
                p.name === petName &&
                p.location_id === petData.location_id
            );

            if (!pet || !pet.pet_id) {
                return null;
            }

            return pet;
        });
    };

    return findCreatedPet().then((pet) => {
        if (pet) {
            return pet;
        }

        return cy.wait(2000).then(() => {
            return findCreatedPet().then((retryPet) => {
                if (retryPet) {
                    return retryPet;
                }

                return cy.wait(3000).then(() => {
                    return findCreatedPet().then((finalPet) => {
                        if (!finalPet) {
                            throw new Error(
                                `Failed to create pet: ${petName}. ` +
                                `Check that the UI form submission succeeded.`
                            );
                        }
                        return finalPet;
                    });
                });
            });
        });
    }).then((createdPet) => {
        cy.log(`Pet created: ${createdPet.name} (ID: ${createdPet.pet_id})`);

        if (petData.status === 'approved') {
            return cy.approvePet(createdPet.pet_id).then(() => {
                return { ...createdPet, status: 'approved' };
            });
        }

        return cy.wrap(createdPet);
    });
});

Cypress.Commands.add('createUser', (userData = {}) => {
    const timestamp = Date.now();
    const defaultData = {
        email: `test${timestamp}@test.com`,
        password: 'Test123!',
        display_name: 'Test User',
        is_admin: false
    };

    const data = { ...defaultData, ...userData };

    return cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/users`,
        body: data
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
});

Cypress.Commands.add('createApplication', (petId, applicationData = {}) => {
    const defaultData = {
        pet_id: petId,
        application_message: 'I would love to adopt this pet. I have a great home with a yard and plenty of time to care for them. I have experience with pets and can provide references.',
        contact_phone: '(306) 555-9999',
        living_situation: 'house',
        has_other_pets: false,
        other_pets_details: null
    };

    const data = { ...defaultData, ...applicationData };

    return cy.request({
        method: 'GET',
        url: `${API_BASE_URL}/applications`,
        failOnStatusCode: false
    }).then((response) => {
        if (response.status === 200) {
            const existingApp = response.body.find(app =>
                app.pet_id === petId && app.status === 'pending'
            );

            if (existingApp) {
                cy.log(`Application already exists for pet ${petId}, returning existing application`);
                return existingApp;
            }
        }

        return cy.request({
            method: 'POST',
            url: `${API_BASE_URL}/applications`,
            body: data,
            failOnStatusCode: false
        }).then((createResponse) => {
            if (createResponse.status === 400 || createResponse.status === 422) {
                cy.log(`Application already exists (status ${createResponse.status}), fetching existing application`);
                return cy.request(`${API_BASE_URL}/applications`).then((fetchResponse) => {
                    const existingApp = fetchResponse.body.find(app =>
                        app.pet_id === petId && app.status === 'pending'
                    );
                    if (existingApp) {
                        return existingApp;
                    }
                    throw new Error(`Failed to create or find application for pet ${petId}`);
                });
            }

            expect(createResponse.status).to.eq(200);
            return createResponse.body;
        });
    });
});

// DATA MANIPULATION COMMANDS

Cypress.Commands.add('updatePet', (petId, updates) => {
    const formData = new FormData();

    Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined && updates[key] !== null) {
            formData.append(key, updates[key]);
        }
    });

    return cy.request({
        method: 'PUT',
        url: `${API_BASE_URL}/pets/${petId}`,
        body: formData
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
});

Cypress.Commands.add('approvePet', (petId) => {
    return cy.request({
        method: 'PATCH',
        url: `${API_BASE_URL}/pets/${petId}/approve`
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
});

Cypress.Commands.add('updateApplication', (applicationId, updates) => {
    return cy.request({
        method: 'PATCH',
        url: `${API_BASE_URL}/applications/${applicationId}`,
        body: updates
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
});

Cypress.Commands.add('addFavorite', (petId) => {
    return cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/favorites/${petId}`
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
});

Cypress.Commands.add('removeFavorite', (petId) => {
    return cy.request({
        method: 'DELETE',
        url: `${API_BASE_URL}/favorites/${petId}`
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
});

// DATA DELETION COMMANDS

Cypress.Commands.add('deletePet', (petId) => {
    return cy.request({
        method: 'DELETE',
        url: `${API_BASE_URL}/pets/${petId}`,
        failOnStatusCode: false
    });
});

Cypress.Commands.add('deleteLocation', (locationId) => {
    return cy.request({
        method: 'DELETE',
        url: `${API_BASE_URL}/locations/${locationId}`,
        failOnStatusCode: false
    });
});

Cypress.Commands.add('deleteUser', (userId) => {
    return cy.request({
        method: 'DELETE',
        url: `${API_BASE_URL}/users/${userId}`,
        failOnStatusCode: false
    });
});

// DATA RETRIEVAL COMMANDS

Cypress.Commands.add('getPets', () => {
    return cy.request(`${API_BASE_URL}/pets`).its('body');
});

Cypress.Commands.add('getLocations', () => {
    return cy.request(`${API_BASE_URL}/locations`).its('body');
});

Cypress.Commands.add('getApplications', (status = null) => {
    const url = status ? `${API_BASE_URL}/applications?status=${status}` : `${API_BASE_URL}/applications`;
    return cy.request(url).its('body');
});

Cypress.Commands.add('getFavorites', () => {
    return cy.request(`${API_BASE_URL}/favorites`).its('body');
});

// CLEANUP COMMANDS

Cypress.Commands.add('cleanupTestData', () => {
    cy.session('cleanup-session', () => {
        cy.visit('/login');
        cy.get('[data-cy="email-input"]').type('test@t.ca');
        cy.get('[data-cy="password-input"]').type('123456Pw');
        cy.get('[data-cy="login-button"]').click();
        cy.wait(1000);
        cy.url().should('include', '/pets', { timeout: 10000 });
    }, {
        validate() {
            cy.request(`${API_BASE_URL}/auth/me`).its('status').should('eq', 200);
        }
    });

    cy.request({
        url: `${API_BASE_URL}/pets`,
        failOnStatusCode: false
    }).then((response) => {
        if (response.status === 200) {
            const testPets = response.body.filter(pet =>
                    pet.name && (
                        pet.name.includes('Test Pet') ||
                        pet.name.includes('Duplicate Test Pet') ||
                        pet.name.includes('Admin Workflow Pet') ||
                        pet.name.includes('Popular Pet') ||
                        pet.name.includes('Multi-Application Pet') ||
                        pet.name.includes('Pet in Protected Location')
                    )
            );

            testPets.forEach((pet) => {
                cy.deletePet(pet.pet_id);
            });
        }
    });

    cy.request({
        url: `${API_BASE_URL}/locations`,
        failOnStatusCode: false
    }).then((response) => {
        if (response.status === 200) {
            const testLocations = response.body.filter(location =>
                    location.name && (
                        location.name.includes('Test Location') ||
                        location.name.includes('Protected Location')
                    )
            );

            testLocations.forEach((location) => {
                cy.deleteLocation(location.location_id);
            });
        }
    });
});

// UTILITY COMMANDS

Cypress.Commands.add('waitForAPI', () => {
    cy.request({
        url: `${API_BASE_URL}/auth/status`,
        retryOnStatusCodeFailure: true,
        timeout: 30000
    }).its('status').should('eq', 200);
});

Cypress.Commands.add('fillForm', (formData) => {
    Object.keys(formData).forEach(key => {
        const selector = `[data-cy="${key}"]`;
        const value = formData[key];

        cy.get(selector).then($el => {
            const tagName = $el.prop('tagName').toLowerCase();

            if (tagName === 'select') {
                cy.get(selector).select(value);
            } else if ($el.attr('type') === 'checkbox') {
                if (value) {
                    cy.get(selector).check();
                } else {
                    cy.get(selector).uncheck();
                }
            } else {
                cy.get(selector).clear().type(value);
            }
        });
    });
});

Cypress.Commands.add('verifyFormError', (fieldName, errorMessage) => {
    cy.get(`[data-cy="${fieldName}-error"]`).should('be.visible');
    if (errorMessage) {
        cy.get(`[data-cy="${fieldName}-error"]`).should('have.text', errorMessage);
    }
});

Cypress.Commands.add('verifyNoFormErrors', () => {
    cy.get('[data-cy$="-error"]').should('not.exist');
});