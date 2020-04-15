import { Note } from './../../../shared/note.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotesService } from 'src/app/shared/notes.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {
  note: Note;
  noteID: number;
  new: boolean;

  constructor(
    private noteService: NotesService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // Find out if we are creating a new note or editing an existing one
    this.route.params.subscribe((params: Params) => {
      this.note = new Note();
      if(params.id) {
        this.note = this.noteService.get(params.id);
        this.noteID = params.id;
        this.new = false;
      } else {
        this.new = true;
      }
    });
  }

  onSubmit(form: NgForm) {
    // Check if the note is a new note or an existing one
    if(this.new)
      // If so save the note
      this.noteService.add(form.value);
    else
      // Otherwise update the note value
      this.noteService.update(this.noteID, form.value.title, form.value.body);

    // Then navigate to the root address
    this.router.navigateByUrl('/');
  }

  cancel() {
    // Navigate back to the root address
    this.router.navigateByUrl('/');
  }

}
