import { Note } from './../../../shared/note.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  filterdNotes: Note[] = new Array<Note>();
  @ViewChild('filterInput') filterInputElRef: ElementRef<HTMLInputElement>;

  constructor(private notesService: NotesService) { }

  ngOnInit() {
    // Retrieve all notes fron notes service
    this.notes = this.notesService.getAll();
    this.filter('');
  }

  deleteNote(note: Note) {
    let noteId = this.notesService.getID(note)
    this.notesService.delete(noteId);
    this.filter(this.filterInputElRef.nativeElement.value)
  }

  generateNoteUrl(note: Note) {
    let noteId = this.notesService.getID;
    return noteId;
  }

  filter(query: string) {
    query.toLocaleLowerCase().trim();

    let allResults: Note[] = new Array<Note>();

    // Split up the search query into individual words
    let terms: string[] = query.split(' '); // Split on spaces
    // Remove duplicate search terms
    terms = this.removeDuplicates(terms);
    // Compile all relevant results into allResults array
    terms.forEach(term => {
      let results: Note[] = this.findRelevantNotes(term);
      // Append results into allResults
      allResults = [...allResults, ...results];
    });

    // All results will include duplicate notes
    // Because a particular note can be a result of many search terms
    // Therefore we must remove duplicate notes first
    this.filterdNotes = this.removeDuplicates(allResults);

    // Now finally sort by relevancy
    this.sortByRelevancy(allResults)
  }

  removeDuplicates(arr: Array<any>) : Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    // Loop through the input arry and add each item to the set
    arr.forEach(e => uniqueResults.add(e));
    // Return the unique results array
    return Array.from(uniqueResults);
  }

  findRelevantNotes(query: string) : Array<Note> {
    query.toLowerCase().trim();

    let relevantNotes =this.notes.filter(note => {
      if(note.title && note.title.toLowerCase().includes(query))
        return true;
      if(note.body && note.body.toLowerCase().includes(query))
        return true;

      return false;
    })

    return relevantNotes;
  }

  sortByRelevancy(searchResults: Note[]) {
    // Calculate the relevancy of based on the number of matched terms in the search search results
    let noteCountObj: Object = {}

    searchResults.forEach(note => {
      let noteId = this.notesService.getID(note);

      if(noteCountObj[noteId])
        noteCountObj[noteId] += 1;
      else
        noteCountObj[noteId] = 1;
    });

    this.filterdNotes = this.filterdNotes.sort((a: Note, b: Note) => {
      let aId = this.notesService.getID(a);
      let bId = this.notesService.getID(b);

      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];

      return bCount - aCount;
    })
  }

}
