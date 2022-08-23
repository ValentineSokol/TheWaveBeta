describe('Profile', () => {
    beforeEach(() => {
        cy.login();
        cy.request('PATCH', '/users', { avatarUrl: '' })
            .then(() => {
                cy.visit('/');
                cy.getByTestId('profileBtn').click();
            })
    })
    it('should be able to change the avatar image', () => {
        cy.intercept('PATCH', '/users').as('updateUser');
        cy.intercept('GET', '/files/*').as('getImage');
        const avatarImage = cy.getByTestId('ProfileAvatar');
        avatarImage.click();
        cy.getByTestId('ChangeAvatarFileInput')
            .attachFile('avatar.png');
        cy.get('.cropper-crop-box').move({ deltaX: 80, deltaY: 0});
        cy.getByTestId('PhotoCropperSubmit').click();
        cy.wait('@updateUser')
            .then(() => cy.wait('@getImage'))
            .then(() => avatarImage.compareSnapshot('correct-avatar'));
    });
});