import { Note } from './../../../shared/note.model';
import { Component, OnInit } from '@angular/core';
import { NotesService } from 'src/app/shared/notes.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      // Entry Animation
      transition('void => *', [
        // Set the initial state
        style({
          'height': 0,
          'opacity': 0,
          'transform': 'scale(0.85)',
          'margin-bottom': 0,

          // We have to expand out the padding properties
          'padding-top': 0,
          'padding-right': 0,
          'padding-bottom': 0,
          'padding-left': 0
        }),
        // Animate the spacing (this includes the height, margin and padding)
        animate('50ms', style({
          'height': '*',
          'margin-bottom': '*',
          'padding-top': '*',
          'padding-right': '*',
          'padding-bottom': '*',
          'padding-left': '*'
        })),
        animate(68)
      ]),
      transition('* => void', [
        // First scale up
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        // Then scale down back to normal size while starting to fade out
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75
        })),
        // Then scale down and fade out completely
        animate('120ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0
        })),
        // Then animate the spacing (which includes height, margin and padding)
        animate('150ms ease-out', style({
          'height': 0,
          'margin-bottom': 0,
          'padding-top': 0,
          'padding-right': 0,
          'padding-bottom': 0,
          'padding-left': 0
        }))
      ])
    ]),

    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {
          optional: true
        })
      ])
    ])
  ]
})

export class NotesListComponent implements OnInit {
  notes: Note[] = new Array<Note>();

  constructor(private notesService: NotesService) { }

  ngOnInit() {
    // Retrieve all notes fron notes service
    this.notes = this.notesService.getAll();
  }

  deleteNote(id: number) {
    this.notesService.delete(id);
  }

}
