const yargs = require('yargs')
const notes = require('./notes')

yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note body',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        const {title, body} = argv
        notes.addNotes(title, body)
    }
})

yargs.command({
    command: 'remove',
    describe: 'remove a note',
    builder: {
        title: {
            describe: 'note title',
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv) => {
        const {title} = argv
        notes.removeNotes(title)
    }
})

yargs.command({
    command: 'read',
    describe: 'read a note',
    builder: {
        title: {
            describe: 'read a note',
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv) => {
        const {title} = argv
        notes.readNotes(title)
    }
})

yargs.command({
    command: 'list',
    describe: 'list all notes',
    handler: () => notes.listNotes()
})

yargs.parse()