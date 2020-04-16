import { Injectable } from '@angular/core';
import { Note } from 'src/shared/note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes: Note[] = new Array<Note>();

  constructor() { }

  getAll() {
    return this.notes;
  }

  get(id: number) {
    return this.notes[id];
  }

  getID(note: Note) {
    return this.notes.indexOf(note);
  }

  add(note: Note) {
    // Adds a note to the notes array ang return the id of the newly added note
    // Where id = index
    let newLength = this.notes.push(note);
    let index = newLength - 1;
    return index;
  }

  update(id: number, title: string, body: string) {
    let note = this.notes[id];
    note.title = title;
    note.body = body;
  }

  delete(id: number) {
    this.notes.splice(id, 1);
  }
}
