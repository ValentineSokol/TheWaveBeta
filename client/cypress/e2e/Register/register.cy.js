describe('Register', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });
    const getByTestId = (testId) => cy.get(`[data-testid="${testId}"]`);

    it('a user should be able to create a new account and log in', () => {
        const username = `cypressman-${Date.now()}`;
        cy.intercept({
            method: 'POST',
            url: '/users',
        }).as('register');
        getByTestId('registerBtn').click();
        getByTestId('registerEmailInput').type('cypress-e2e@gmail.com');
        getByTestId('registerUsernameInput').type(username);
        getByTestId('registerPasswordInput').type('KittensAreCute2022');
        getByTestId('registerBirthdayInput').type('2002-12-11');
        const submitBtn = getByTestId('registerSubmitBtn');
        submitBtn.click();
        cy.wait('@register').then((req) => {
           assert.equal(req.response.statusCode, 201, 'should create a user successfully');
           const { user } = req.response.body;
           submitBtn.click();
           cy.url().should('contain', `/profile/${user}`);
        });

    })
});