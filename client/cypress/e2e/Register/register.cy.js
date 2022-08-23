describe('Register', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('should be able to create a new account and log in', () => {
        const username = `cypressman-${Date.now()}`;
        cy.intercept({
            method: 'POST',
            url: '/users',
        }).as('register');
        cy.getByTestId('registerBtn').click();
        cy.getByTestId('registerEmailInput').type('cypress-e2e@gmail.com');
        cy.getByTestId('registerUsernameInput').type(username);
        cy.getByTestId('registerPasswordInput').type('KittensAreCute2022');
        cy.getByTestId('registerBirthdayInput').type('2002-12-11');
        const submitBtn = cy.getByTestId('registerSubmitBtn');
        submitBtn.click();
        cy.wait('@register').then((req) => {
           assert.equal(req.response.statusCode, 201, 'should create a user successfully');
           const { user } = req.response.body;
           submitBtn.click();
           cy.url().should('contain', `/profile/${user}`);
        });

    });
    it('should be able to log out', () => {
        cy.login();
        cy.visit('http://localhost:3000');
        cy.getByTestId('logoutBtn').click();
        cy.getByTestId('registerBtn').click();
    });
});