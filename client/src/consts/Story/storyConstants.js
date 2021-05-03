export default {
    COWRITER_ROLES: [
        {
           name: 'editor',
           color: '#bdd1a0',
           tooltip: 'Has permission to read chapter drafts and edit them with the main author\'s or coauthor\'s approval. ' +
               'Can be denied access to certain chapters and drafts. Does not have access to the author\'s chatroom. '
        },
        {
            name: 'writer',
            color: '#b4c468',
            tooltip: 'Has all the permissions of the \'editor\' role and the ability to create new chapters to be ' +
                'published with main author\'s or coauthor\'s approval. Has access to the author\'s chatroom.'
        },
        {
            name: 'coauthor',
            color: '#ed5555',
            tooltip: 'Can edit, delete, write and publish new chapters without the approval of the main author or a coauthor.' +
                ' Has moderator role in the author\'s chatroom. Can edit story metadata and settings. '
        },
        {
            name: 'artist',
            color: '#b8a7ea',
            tooltip: 'Can not edit or add any text content. Can add and edit illustrations with the main author\'s or coauthor\'s approval.'
        },
        {
            name: 'premium reader',
            color: '#d4af37',
            tooltip: 'Has access to exclusive content and extras, defined by the authors by paying a monthly fee.'
        }
    ]
}