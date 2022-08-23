describe('Profile', () => {
    beforeEach(() => {
        cy.login();
        cy.request('PATCH', '/users', { avatarUrl: '' })
            .then(() => {
                cy.visit('/');
                cy.getByTestId('profileBtn').click();
            })
    });
    describe('Change Avatar', () => {
        beforeEach(() => {
            cy.intercept('PATCH', '/users').as('updateUser');
            cy.intercept('GET', '/files/*').as('getImage');
            const avatarImage = cy.getByTestId('ProfileAvatar');
            avatarImage.click();
        });
        const selectImageForCrop = (filename) => {
            cy.getByTestId('ChangeAvatarFileInput')
                .attachFile(filename);
        };
        const moveCropBox = (deltaX, deltaY) => {
            cy.get('.cropper-crop-box').move({ deltaX, deltaY });
        };
        const waitForAvatarUpdate = () => {
           return cy.wait('@updateUser')
                .then(() => cy.wait('@getImage'))
        }

        it('should be able to change the avatar image', () => {
            const avatarImage = cy.getByTestId('ProfileAvatar');
            selectImageForCrop('avatar.png')
            moveCropBox(80, 0);
            cy.getByTestId('PhotoCropperSubmit').click();
            waitForAvatarUpdate()
                .then(() => avatarImage.compareSnapshot('correct-avatar'));
        });

        it('when uploading a NSFW image, it should display with protection', () => {
            const avatarImage = cy.getByTestId('ProfileAvatar');
            selectImageForCrop('pornAvatar.jpg')
            moveCropBox(80, 80);
            cy.getByTestId('PhotoCropperSubmit').click();
            waitForAvatarUpdate()
                .then(() => {
                    avatarImage.compareSnapshot('nsfw-image-protection');
                    cy.getByTestId('ProfileAvatar').click();
                    avatarImage.compareSnapshot('nsfw-image-protection-revealed');

                });

        });
    })
});