const fs = require('fs')
const chalk = require('chalk')

const addNotes = (title, body) => {
    let notes = loadNotes()
    const duplicateTitle = notes.filter(d => d.title === title)
    if (duplicateTitle.length) {
        console.log(chalk.red('Duplicate title detected'))
    } else {
        notes.push({
            title,
            body
        })
        saveNotes(notes)
    }
}

const listNotes = () => {
    let notes = loadNotes()
    notes.forEach((d,i) => console.log(chalk.green.inverse(`${i+1}:`, d.title )))
}

const removeNotes = (title) => {
    let notes = loadNotes()
    const noteToRemove = notes.filter(d => d.title === title)
    if(noteToRemove.length) {
        const remainingNotes = notes.filter(d => d.title !== title)
        saveNotes(remainingNotes)
    } else {
        console.log(chalk.red('No notes found with that title'))
    }
}

const readNotes = (title) => {
    const notes = loadNotes()
    const specificNote = notes.find(d => d.title === title)
    if(specificNote) {
        console.log(chalk.green.inverse("Note title:",specificNote.title,",Note body:" ,specificNote.body))
    } else {
        console.log(chalk.red.inverse('Note not found.'))
    }
}

const saveNotes = (notes) => {
    const data = JSON.stringify(notes)
    fs.writeFileSync('Notes.json', data)
}

const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync('Notes.json')
        const data = dataBuffer.toString()
        return JSON.parse(data)
    } catch (e) {
        return []
    }
}

module.exports = {
    addNotes,
    saveNotes,
    loadNotes,
    removeNotes,
    listNotes,
    readNotes
}