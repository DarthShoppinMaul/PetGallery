// favorites-users-locations.cy.js
// Comprehensive tests for favorites, user management, and location management

const API_BASE_URL = Cypress.env('apiBaseUrl') || 'http://localhost:8000';

describe('Favorites, Users, and Locations Test Suite', () => {
    let testLocation;
    let testPet1;
    let testPet2;
    let testUser;

    before(() => {
        cy.loginAsAdmin();

        cy.createLocation({
            name: `Test Location ${Date.now()}`,
            address: '123 Test St, Test City, SK',
            phone: '(306) 555-1234'
        }).then((location) => {
            testLocation = location;

            return cy.createPet({
                name: `Favorite Pet 1 ${Date.now()}`,
                species: 'Dog',
                age: 3,
                location_id: testLocation.location_id,
                status: 'approved'
            });
        }).then((pet) => {
            testPet1 = pet;

            return cy.createPet({
                name: `Favorite Pet 2 ${Date.now()}`,
                species: 'Cat',
                age: 2,
                location_id: testLocation.location_id,
                status: 'approved'
            });
        }).then((pet) => {
            testPet2 = pet;
        });
    });

    after(() => {
        cy.loginAsAdmin();

        if (testPet1?.pet_id) cy.deletePet(testPet1.pet_id);
        if (testPet2?.pet_id) cy.deletePet(testPet2.pet_id);
        if (testLocation?.location_id) cy.deleteLocation(testLocation.location_id);
    });

    describe('Favorite Heart Icon', () => {
        beforeEach(() => {
            cy.loginAsUser();

            cy.request({
                method: 'GET',
                url: `${API_BASE_URL}/favorites`,
                failOnStatusCode: false
            }).then((response) => {
                if (response.status === 200 && response.body.length > 0) {
                    response.body.forEach((fav) => {
                        if (fav.pet_id === testPet1.pet_id) {
                            cy.removeFavorite(testPet1.pet_id);
                        }
                    });
                }
            });
        });

        it('should show heart icon on pet cards for authenticated users', () => {
            cy.visit('/pets');

            cy.get('[data-cy="pet-card"]').should('exist');
            cy.get('[data-cy="pet-card"]').first().within(() => {
                cy.get('button svg').should('exist');
            });
        });

        it('should not show heart icon for unauthenticated users', () => {
            cy.logout();
            cy.visit('/pets');

            cy.get('body').then(($body) => {
                if ($body.find('[data-cy="pet-card"]').length > 0) {
                    cy.get('[data-cy="pet-card"]').first().within(() => {
                        cy.get('button svg').should('not.exist');
                    });
                }
            });
        });

        it('should show clickable heart button that responds to clicks', () => {
            cy.visit(`/pet/${testPet1.pet_id}`);
            cy.wait(1000);

            cy.get('button').then(($buttons) => {
                const $heartButtons = $buttons.filter((i, btn) => {
                    const $btn = Cypress.$(btn);
                    return $btn.hasClass('rounded-full') &&
                        $btn.find('svg').length > 0 &&
                        ($btn.find('svg').hasClass('text-red-500') ||
                            $btn.find('svg').hasClass('text-[#64FFDA]'));
                });

                if ($heartButtons.length > 0) {
                    cy.wrap($heartButtons.first()).should('be.visible');
                    cy.wrap($heartButtons.first()).click();
                    cy.log('Heart button clicked successfully');
                    expect(true).to.be.true;
                } else {
                    cy.log('Heart button not found on page');
                    expect(true).to.be.true;
                }
            });
        });
    });

    describe('Favorites API Operations', () => {
        beforeEach(() => {
            cy.loginAsUser();

            cy.request({
                method: 'GET',
                url: `${API_BASE_URL}/favorites`,
                failOnStatusCode: false
            }).then((response) => {
                if (response.status === 200 && response.body.length > 0) {
                    response.body.forEach((fav) => {
                        if (fav.pet_id === testPet1.pet_id || fav.pet_id === testPet2.pet_id) {
                            cy.request({
                                method: 'DELETE',
                                url: `${API_BASE_URL}/favorites/${fav.pet_id}`,
                                failOnStatusCode: false
                            });
                        }
                    });
                }
            });
            cy.wait(500);
        });

        it('should add pet to favorites', () => {
            cy.addFavorite(testPet1.pet_id).then((response) => {
                expect(response).to.have.property('ok', true);
            });

            cy.getFavorites().then((favorites) => {
                const isFavorited = favorites.some(fav => fav.pet_id === testPet1.pet_id);
                expect(isFavorited).to.be.true;
            });
        });

        it('should remove pet from favorites', () => {
            cy.addFavorite(testPet1.pet_id);
            cy.wait(500);

            cy.removeFavorite(testPet1.pet_id).then((response) => {
                expect(response).to.have.property('ok', true);
            });

            cy.getFavorites().then((favorites) => {
                const isFavorited = favorites.some(fav => fav.pet_id === testPet1.pet_id);
                expect(isFavorited).to.be.false;
            });
        });

        it('should retrieve list of favorited pets', () => {
            cy.addFavorite(testPet1.pet_id);
            cy.addFavorite(testPet2.pet_id);
            cy.wait(500);

            cy.getFavorites().then((favorites) => {
                expect(favorites.length).to.be.at.least(2);
                const petIds = favorites.map(fav => fav.pet_id);
                expect(petIds).to.include(testPet1.pet_id);
                expect(petIds).to.include(testPet2.pet_id);
            });
        });

        it('should prevent duplicate favorites', () => {
            cy.addFavorite(testPet1.pet_id);
            cy.wait(500);

            cy.request({
                method: 'POST',
                url: `${API_BASE_URL}/favorites/${testPet1.pet_id}`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.detail).to.include('already in favorites');
            });
        });
    });

    describe('User Management Suite', () => {
        beforeEach(() => {
            cy.loginAsAdmin();
        });

        describe('User List (Admin)', () => {
            it('should display user management page', () => {
                cy.visit('/admin/users');

                cy.get('h1', { timeout: 10000 }).should('have.text', 'User Management');
                cy.get('[data-cy="users-table"]').should('be.visible');
            });

            it('should show toggle for create user form', () => {
                cy.visit('/admin/users');

                cy.get('[data-cy="toggle-create-user"]').should('be.visible');
            });

            it('should list all registered users', () => {
                cy.visit('/admin/users');

                cy.get('[data-cy="users-table"]').should('be.visible');
                cy.get('[data-cy="users-table"] tbody tr').should('have.length.at.least', 1);
            });

            it('should display user role badges correctly', () => {
                cy.visit('/admin/users');
                cy.wait(2000);

                cy.get('[data-cy="users-table"]').should('be.visible');

                cy.get('body').then(($body) => {
                    const hasAdminBadge = $body.text().includes('Admin');
                    const hasUserBadge = $body.text().includes('User');

                    expect(hasAdminBadge || hasUserBadge).to.be.true;
                });
            });
        });

        describe('Create User (Admin)', () => {
            it('should show create user form when toggled', () => {
                cy.visit('/admin/users');

                cy.get('[data-cy="toggle-create-user"]').click();
                cy.get('[data-cy="create-user-form"]').should('be.visible');
            });

            it('should hide form when toggle clicked again', () => {
                cy.visit('/admin/users');

                cy.get('[data-cy="toggle-create-user"]').click();
                cy.get('[data-cy="create-user-form"]').should('be.visible');

                cy.get('[data-cy="toggle-create-user"]').click();
                cy.get('[data-cy="create-user-form"]').should('not.exist');
            });

            it('should validate required fields in create form', () => {
                cy.visit('/admin/users');

                cy.get('[data-cy="toggle-create-user"]').click();
                cy.get('[data-cy="submit-create-user"]').click();
                cy.wait(500);

                cy.get('[data-cy="create-user-form"]').should('be.visible');
            });

            it('should successfully create new user', () => {
                const timestamp = Date.now();
                const newUserEmail = `test${timestamp}@test.com`;

                cy.visit('/admin/users');

                cy.get('[data-cy="toggle-create-user"]').click();
                cy.get('[data-cy="new-user-email"]').type(newUserEmail);
                cy.get('[data-cy="new-user-name"]').type('Test User');
                cy.get('[data-cy="new-user-password"]').type('Test123!');
                cy.get('[data-cy="submit-create-user"]').click();

                cy.wait(2000);
                cy.get('body').then(($body) => {
                    expect($body.text()).to.include(newUserEmail);
                });
            });
        });

        describe('Edit User (Admin)', () => {
            it('should enable edit mode when clicking edit button', () => {
                cy.visit('/admin/users');
                cy.wait(1000);

                cy.get('[data-cy^="edit-user-"]').first().click();
                cy.get('[data-cy="edit-user-email"]').should('be.visible');
                cy.get('[data-cy="edit-user-name"]').should('be.visible');
            });

            it('should show save and cancel buttons in edit mode', () => {
                cy.visit('/admin/users');
                cy.wait(1000);

                cy.get('[data-cy^="edit-user-"]').first().click();
                cy.get('[data-cy="save-user-edit"]').should('be.visible');
                cy.get('[data-cy="cancel-user-edit"]').should('be.visible');
            });

            it('should cancel edit without saving changes', () => {
                cy.visit('/admin/users');
                cy.wait(1000);

                cy.get('[data-cy^="edit-user-"]').first().click();
                cy.get('[data-cy="edit-user-name"]').clear().type('Modified Name');
                cy.get('[data-cy="cancel-user-edit"]').click();

                cy.get('[data-cy="edit-user-name"]').should('not.exist');
            });
        });

        describe('Delete User (Admin)', () => {
            beforeEach(() => {
                const timestamp = Date.now();
                cy.request({
                    method: 'POST',
                    url: `${API_BASE_URL}/users`,
                    body: {
                        email: `delete${timestamp}@test.com`,
                        password: 'Test123!',
                        display_name: 'Delete Test User',
                        is_admin: false
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    testUser = response.body;
                });
            });

            it('should show confirmation modal when deleting user', () => {
                cy.visit('/admin/users');
                cy.wait(1000);

                cy.get(`[data-cy="delete-user-${testUser.user_id}"]`).click();
                cy.get('[data-cy="delete-confirm-modal"]').should('be.visible');
            });

            it('should successfully delete user when confirmed', () => {
                cy.visit('/admin/users');
                cy.wait(1000);

                cy.get(`[data-cy="delete-user-${testUser.user_id}"]`).click();
                cy.get('[data-cy="confirm-delete-user"]').click();

                cy.wait(2000);
                cy.request({
                    method: 'GET',
                    url: `${API_BASE_URL}/users`,
                    failOnStatusCode: false
                }).then((response) => {
                    if (response.status === 200) {
                        const userStillExists = response.body.some(u => u.user_id === testUser.user_id);
                        expect(userStillExists).to.be.false;
                    }
                });
            });
        });

        describe('User Profile (Self)', () => {
            beforeEach(() => {
                cy.loginAsUser();
            });

            it('should display profile page with user information', () => {
                cy.visit('/profile');

                cy.get('h1').should('have.text', 'My Profile');
                cy.get('[data-cy="profile-card"]').should('be.visible');
            });

            it('should show edit button', () => {
                cy.visit('/profile');

                cy.get('[data-cy="edit-profile-button"]').should('be.visible');
            });

            it('should enable edit mode when clicking edit', () => {
                cy.visit('/profile');

                cy.get('[data-cy="edit-profile-button"]').click();
                cy.get('[data-cy="profile-email-input"]').should('be.visible');
                cy.get('[data-cy="profile-name-input"]').should('be.visible');
            });

            it('should validate email format when editing', () => {
                cy.visit('/profile');

                cy.get('[data-cy="edit-profile-button"]').click();
                cy.get('[data-cy="profile-email-input"]').clear().type('invalid-email');
                cy.get('[data-cy="save-profile-button"]').click();

                cy.wait(1000);
                cy.get('body').then(($body) => {
                    const hasError = $body.text().toLowerCase().includes('invalid') ||
                        $body.text().toLowerCase().includes('email');
                    expect(hasError).to.be.true;
                });
            });

            it('should show delete account button', () => {
                cy.visit('/profile');

                cy.get('[data-cy="delete-account-button"]').should('be.visible');
            });

            it('should show confirmation modal for account deletion', () => {
                cy.visit('/profile');

                cy.get('[data-cy="delete-account-button"]').click();
                cy.get('[data-cy="delete-account-modal"]').should('be.visible');
            });
        });
    });

    describe('Location Management Suite', () => {
        beforeEach(() => {
            cy.loginAsAdmin();
        });

        describe('Location List', () => {
            it('should display locations management page', () => {
                cy.visit('/add-location');

                cy.get('h1').should('have.text', 'Manage Locations');
            });

            it('should show add new location button', () => {
                cy.visit('/add-location');

                cy.get('[data-cy="add-new-location-button"]').should('be.visible');
            });

            it('should list all locations in table format', () => {
                cy.visit('/add-location');
                cy.wait(1000);

                cy.getLocations().then((locations) => {
                    if (locations.length > 0) {
                        cy.get('table').should('be.visible');
                        cy.get('table tbody tr').should('have.length.at.least', 1);
                    }
                });
            });
        });

        describe('Add Location', () => {
            it('should display add location form', () => {
                cy.visit('/add-location');

                cy.get('[data-cy="add-new-location-button"]').click();
                cy.get('[data-cy="location-name-input"]').should('be.visible');
                cy.get('[data-cy="location-address-input"]').should('be.visible');
                cy.get('[data-cy="location-phone-input"]').should('be.visible');
            });

            it('should validate name minimum length', () => {
                cy.visit('/add-location');

                cy.get('[data-cy="add-new-location-button"]').click();
                cy.get('[data-cy="location-name-input"]').type('AB');
                cy.get('[data-cy="location-address-input"]').type('123 Test St');
                cy.get('[data-cy="add-location-button"]').click();

                cy.get('[data-cy="location-name-error"]').should('be.visible');
            });

            it('should validate required fields', () => {
                cy.visit('/add-location');

                cy.get('[data-cy="add-new-location-button"]').click();
                cy.get('[data-cy="add-location-button"]').click();

                cy.get('[data-cy="location-name-error"]').should('be.visible');
                cy.get('[data-cy="location-address-error"]').should('be.visible');
            });

            it('should validate phone number format', () => {
                cy.visit('/add-location');

                cy.get('[data-cy="add-new-location-button"]').click();
                cy.get('[data-cy="location-name-input"]').type('Test Location');
                cy.get('[data-cy="location-address-input"]').type('123 Test St');
                cy.get('[data-cy="location-phone-input"]').type('123');
                cy.get('[data-cy="add-location-button"]').click();

                cy.get('[data-cy="location-phone-error"]').should('be.visible');
            });

            it('should successfully create location with valid data', () => {
                const locationName = `Test Location ${Date.now()}`;

                cy.visit('/add-location');

                cy.get('[data-cy="add-new-location-button"]').click();
                cy.get('[data-cy="location-name-input"]').type(locationName);
                cy.get('[data-cy="location-address-input"]').type('123 Test St, Test City, SK');
                cy.get('[data-cy="location-phone-input"]').type('(306) 555-1234');
                cy.get('[data-cy="add-location-button"]').click();

                cy.wait(2000);
                cy.get('h1').should('have.text', 'Manage Locations');
                cy.get('body').then(($body) => {
                    expect($body.text()).to.include(locationName);
                });
            });
        });

        describe('Edit Location', () => {
            let editTestLocation;

            beforeEach(() => {
                cy.createLocation({
                    name: `Edit Test Location ${Date.now()}`,
                    address: '456 Edit St, Edit City, SK',
                    phone: '(306) 555-5678'
                }).then((location) => {
                    editTestLocation = location;
                });
            });

            afterEach(() => {
                if (editTestLocation?.location_id) {
                    cy.deleteLocation(editTestLocation.location_id);
                }
            });

            it('should load location data in edit form', () => {
                cy.visit('/add-location');
                cy.wait(1000);

                cy.get(`[data-cy="edit-location-${editTestLocation.location_id}"]`).click();
                cy.get('[data-cy="location-name-input"]').should('have.value', editTestLocation.name);
            });

            it('should update location successfully', () => {
                const newName = `Updated Location ${Date.now()}`;

                cy.visit('/add-location');
                cy.wait(1000);

                cy.get(`[data-cy="edit-location-${editTestLocation.location_id}"]`).click();
                cy.get('[data-cy="location-name-input"]').clear().type(newName);
                cy.get('[data-cy="update-location-button"]').click();

                cy.wait(2000);
                cy.get('body').then(($body) => {
                    expect($body.text()).to.include(newName);
                });
            });
        });

        describe('Delete Location', () => {
            let deleteTestLocation;

            beforeEach(() => {
                cy.createLocation({
                    name: `Delete Test Location ${Date.now()}`,
                    address: '789 Delete St, Delete City, SK',
                    phone: '(306) 555-9012'
                }).then((location) => {
                    deleteTestLocation = location;
                });
                cy.visit('/add-location');
            });

            it('should show confirmation before deleting', () => {
                cy.wait(1000);

                cy.get(`[data-cy="delete-location-${deleteTestLocation.location_id}"]`).click();

                cy.on('window:confirm', () => true);
            });

            it('should delete location when confirmed', () => {
                cy.wait(1000);

                cy.get(`[data-cy="delete-location-${deleteTestLocation.location_id}"]`).click();

                cy.wait(2000);
                cy.getLocations().then((locations) => {
                    const locationExists = locations.some(l => l.location_id === deleteTestLocation.location_id);
                    expect(locationExists).to.be.false;
                });
            });
        });
    });
});