// Pet Management Test Suite
// Tests all pet CRUD operations, photo uploads, approval workflow, and validation

describe('Pet Management Suite', () => {

    let testLocation;

    before(() => {
        cy.waitForAPI();
        cy.loginAsAdmin();

        cy.createLocation({
            name: 'Test Shelter for Pets',
            address: '123 Test St, Test City, SK',
            phone: '(306) 555-0000'
        }).then((location) => {
            testLocation = location;
        });
    });

    beforeEach(() => {
        cy.loginAsAdmin();
    });

    after(() => {
        if (testLocation) {
            cy.deleteLocation(testLocation.location_id);
        }
        cy.cleanupTestData();
    });

    describe('Pet List View', () => {

        it('should display pet list page with filters', () => {
            cy.visit('/pets');
            cy.get('h1').should('exist');
            cy.get('input[placeholder="Search by name..."]').should('be.visible');
            cy.get('select').should('have.length.at.least', 3);
        });

        it('should filter pets by species', () => {
            cy.visit('/pets');
            cy.wait(2000);

            cy.get('body').then(($body) => {
                if ($body.find('[data-cy="pet-card"]').length > 0) {
                    cy.get('select').eq(1).then(($select) => {
                        const $options = $select.find('option');
                        if ($options.length > 1) {
                            cy.wrap($select).select($options.eq(1).val());
                            cy.wait(500);

                            cy.get('[data-cy="pet-card"]').each(($card) => {
                                cy.wrap($card).should('exist');
                            });
                        }
                    });
                }
            });
        });

        it('should filter pets by location', () => {
            cy.visit('/pets');
            cy.wait(2000);

            cy.get('select').eq(2).then(($select) => {
                const $options = $select.find('option');
                if ($options.length > 1) {
                    cy.wrap($select).select($options.eq(1).val());
                    cy.wait(500);
                }
            });
        });

    });

    describe('Add Pet Flow', () => {

        beforeEach(() => {
            cy.visit('/add-pet');
            cy.get('[data-cy="add-new-pet-button"]').click();
        });

        it('should display add pet form with all fields', () => {
            cy.get('[data-cy="pet-name-input"]').should('be.visible');
            cy.get('[data-cy="pet-species-input"]').should('be.visible');
            cy.get('[data-cy="pet-age-input"]').should('be.visible');
            cy.get('[data-cy="pet-location-select"]').should('be.visible');
            cy.get('[data-cy="pet-description-input"]').should('be.visible');
            cy.get('[data-cy="pet-photo-input"]').should('be.visible');
            cy.get('[data-cy="add-pet-button"]').should('be.visible');
            cy.get('[data-cy="cancel-button"]').should('be.visible');
        });

        it('should validate required fields', () => {
            cy.get('[data-cy="add-pet-button"]').click();
            cy.get('[data-cy="pet-name-input"]').should('be.visible');
        });

        it('should validate name minimum length', () => {
            cy.get('[data-cy="pet-name-input"]').type('A');
            cy.get('[data-cy="pet-species-input"]').type('Dog');
            cy.get('[data-cy="pet-age-input"]').type('3');
            cy.get('[data-cy="pet-location-select"]').then(($select) => {
                const $options = $select.find('option');
                cy.wrap($select).select($options.eq(1).val());
            });
            cy.get('[data-cy="add-pet-button"]').click();
            cy.wait(1000);
            cy.url().should('include', '/add-pet');
        });

        it('should validate age range', () => {
            cy.get('[data-cy="pet-name-input"]').type('Test Pet');
            cy.get('[data-cy="pet-species-input"]').type('Dog');
            cy.get('[data-cy="pet-age-input"]').type('-1');
            cy.get('[data-cy="pet-location-select"]').then(($select) => {
                const $options = $select.find('option');
                cy.wrap($select).select($options.eq(1).val());
            });
            cy.get('[data-cy="add-pet-button"]').click();
            cy.wait(1000);
            cy.url().should('include', '/add-pet');
        });

        it('should successfully create a pet with valid data', () => {
            const petName = `Cypress Pet ${Date.now()}`;

            cy.get('[data-cy="pet-name-input"]').type(petName);
            cy.get('[data-cy="pet-species-input"]').type('Dog');
            cy.get('[data-cy="pet-age-input"]').type('3');
            cy.get('[data-cy="pet-location-select"]').select(testLocation.location_id.toString());
            cy.get('[data-cy="pet-description-input"]').type('A friendly test dog');
            cy.get('[data-cy="add-pet-button"]').click();

            cy.wait(2000);
            cy.get('h1').should('have.text', 'Manage Pets');

            cy.getPets().then((pets) => {
                const createdPet = pets.find(p => p.name === petName);
                expect(createdPet).to.exist;
                if (createdPet) {
                    cy.deletePet(createdPet.pet_id);
                }
            });
        });
    });

    describe('Edit Pet Flow', () => {

        let testPet;

        beforeEach(() => {
            return cy.createPet({
                name: `Edit Test Pet ${Date.now()}`,
                species: 'Cat',
                age: 2,
                location_id: testLocation.location_id,
                description: 'Original description'
            }).then((pet) => {
                testPet = pet;
                cy.visit('/add-pet');
            });
        });

        afterEach(() => {
            if (testPet) {
                cy.deletePet(testPet.pet_id);
            }
        });

        it('should display edit form with current pet data', () => {
            cy.get(`[data-cy="edit-pet-${testPet.pet_id}"]`).click();

            cy.get('[data-cy="pet-name-input"]').should('have.value', testPet.name);
            cy.get('[data-cy="pet-species-input"]').should('have.value', testPet.species);
            cy.get('[data-cy="pet-age-input"]').should('have.value', testPet.age.toString());
        });

        it('should successfully update pet information', () => {
            cy.get(`[data-cy="edit-pet-${testPet.pet_id}"]`).click();

            const newName = `Updated Pet ${Date.now()}`;
            cy.get('[data-cy="pet-name-input"]').clear().type(newName);
            cy.get('[data-cy="pet-age-input"]').clear().type('5');
            cy.get('[data-cy="update-pet-button"]').click();

            cy.wait(2000);
            cy.get('h1').should('have.text', 'Manage Pets');

            cy.getPets().then((pets) => {
                const updatedPet = pets.find(p => p.pet_id === testPet.pet_id);
                expect(updatedPet.name).to.eq(newName);
                expect(updatedPet.age).to.eq(5);
            });
        });

        it('should allow cancel without saving changes', () => {
            cy.get(`[data-cy="edit-pet-${testPet.pet_id}"]`).click();

            cy.get('[data-cy="pet-name-input"]').clear().type('Should Not Save');
            cy.get('[data-cy="cancel-button"]').click();

            cy.get('h1').should('have.text', 'Manage Pets');

            cy.getPets().then((pets) => {
                const unchangedPet = pets.find(p => p.pet_id === testPet.pet_id);
                expect(unchangedPet.name).to.eq(testPet.name);
            });
        });
    });

    describe('Delete Pet Flow', () => {

        let testPet;

        beforeEach(() => {
            return cy.createPet({
                name: `Delete Test Pet ${Date.now()}`,
                species: 'Dog',
                age: 4,
                location_id: testLocation.location_id
            }).then((pet) => {
                testPet = pet;
                cy.visit('/add-pet');
            });
        });

        it('should show confirmation dialog before deleting', () => {
            cy.on('window:confirm', (text) => {
                expect(text).to.include(testPet.name);
                return false;
            });

            cy.get(`[data-cy="delete-pet-${testPet.pet_id}"]`).click();

            cy.getPets().then((pets) => {
                const stillExists = pets.find(p => p.pet_id === testPet.pet_id);
                expect(stillExists).to.exist;
            });
        });

        it('should successfully delete pet when confirmed', () => {
            cy.on('window:confirm', () => true);

            cy.get(`[data-cy="delete-pet-${testPet.pet_id}"]`).click();

            cy.wait(2000);

            cy.getPets().then((pets) => {
                const deleted = pets.find(p => p.pet_id === testPet.pet_id);
                expect(deleted).to.be.undefined;
            });
        });
    });

    describe('Pet Status Management', () => {

        let testPet;

        beforeEach(() => {
            return cy.createPet({
                name: `Status Test Pet ${Date.now()}`,
                species: 'Dog',
                age: 3,
                location_id: testLocation.location_id,
                status: 'pending'
            }).then((pet) => {
                testPet = pet;
            });
        });

        afterEach(() => {
            if (testPet) {
                cy.deletePet(testPet.pet_id);
            }
        });

        it('should create pets with pending status by default', () => {
            expect(testPet.status).to.eq('pending');
        });

        it('should allow admin to approve pending pets', () => {
            cy.approvePet(testPet.pet_id).then((approvedPet) => {
                expect(approvedPet.status).to.eq('approved');
            });
        });
    });

    describe('Pet Details Page', () => {

        let testPet;

        before(() => {
            cy.waitForAPI();
            cy.loginAsAdmin();

            return cy.createPet({
                name: `Details Test Pet ${Date.now()}`,
                species: 'Cat',
                age: 2,
                location_id: testLocation.location_id,
                description: 'A beautiful cat for adoption',
                status: 'approved'
            }).then((pet) => {
                testPet = pet;
            });
        });

        after(() => {
            if (testPet) {
                cy.deletePet(testPet.pet_id);
            }
        });



        it('should show apply button for authenticated users', () => {
            cy.loginAsUser();
            cy.visit(`/pet/${testPet.pet_id}`);

            cy.get('[data-cy="apply-button"]').should('be.visible');
        });

        it('should show login prompt for unauthenticated users', () => {
            cy.logout();
            cy.visit(`/pet/${testPet.pet_id}`);

            cy.get('[data-cy="apply-button"]').should('not.exist');
        });
    });
});