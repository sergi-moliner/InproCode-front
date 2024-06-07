import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventClickArg  } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [ FullCalendarModule, ReactiveFormsModule ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarOptions: CalendarOptions;
  eventForm: FormGroup;
  selectedEvent: any = null;
  modalTitle: string = '';
  predefinedColors: string[] = ['#3788d8', '#d83737', '#37d889', '#d8a537', '#8a37d8'];

  constructor(private fb: FormBuilder, private eventService: EventService) {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      events: this.fetchEvents.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventChange: this.handleEventChange.bind(this),
    };

    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      color: [this.predefinedColors[0], Validators.required],
      type: ['', Validators.required] // Añadir tipo de evento
    });
  }

  ngOnInit(): void {}

  fetchEvents(info: any, successCallback: any, failureCallback: any) {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        successCallback(events.map(event => ({
          id: String(event.id),
          title: event.title,
          start: event.date,
          backgroundColor: event.color,
          type: event.type // Incluir tipo de evento
        })));
      },
      error: (error) => {
        console.error('Error fetching events', error);
        failureCallback(error);
      }
    });
  }

  openModalForNewEvent() {
    this.eventForm.reset();
    this.eventForm.patchValue({ color: this.predefinedColors[0] });
    this.selectedEvent = null;
    this.modalTitle = 'Add Event';
    const modalElement = document.getElementById('eventModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.selectedEvent = clickInfo.event;
    this.eventForm.setValue({
      title: clickInfo.event.title,
      date: clickInfo.event.startStr,
      color: clickInfo.event.backgroundColor || this.predefinedColors[0],
      type: clickInfo.event.extendedProps['type'] || '' // Obtener tipo de evento
    });
    this.modalTitle = 'Edit Event';
    const modalElement = document.getElementById('eventModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  handleEventChange(changeInfo: any) {
    const event = changeInfo.event;
    this.eventService.updateEvent(Number(event.id), {
      title: event.title,
      date: event.start,
      color: event.backgroundColor,
      type: event.extendedProps['type'] || '' // Incluir tipo de evento
    }).subscribe({
      next: () => console.log('Event updated'),
      error: (error) => console.error('Error updating event', error)
    });
  }

  saveEvent() {
    if (this.eventForm.valid) {
      const calendarApi = this.calendarComponent.getApi();

      if (this.selectedEvent) {
        this.selectedEvent.setProp('title', this.eventForm.value.title);
        this.selectedEvent.setStart(this.eventForm.value.date);
        this.selectedEvent.setProp('backgroundColor', this.eventForm.value.color);
        this.selectedEvent.setExtendedProp('type', this.eventForm.value.type); // Establecer tipo de evento

        this.eventService.updateEvent(Number(this.selectedEvent.id), {
          title: this.eventForm.value.title,
          date: this.eventForm.value.date,
          color: this.eventForm.value.color,
          type: this.eventForm.value.type // Incluir tipo de evento
        }).subscribe({
          next: () => console.log('Event updated'),
          error: (error) => console.error('Error updating event', error)
        });
      } else {
        const newEvent = {
          id: String(new Date().getTime()),
          title: this.eventForm.value.title,
          date: this.eventForm.value.date,
          color: this.eventForm.value.color,
          type: this.eventForm.value.type // Incluir tipo de evento
        };

        this.eventService.createEvent(newEvent).subscribe({
          next: (event) => {
            calendarApi?.addEvent({
              id: String(event.id),
              title: event.title,
              start: event.date,
              allDay: true,
              backgroundColor: event.color,
              extendedProps: {
                type: event.type // Incluir tipo de evento
              }
            });
          },
          error: (error) => console.error('Error creating event', error)
        });
      }

      const modalElement = document.getElementById('eventModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    } else {
      alert('All fields are required');
    }
  }

  deleteEvent() {
    if (this.selectedEvent) {
      if (confirm(`Are you sure you want to delete the event '${this.selectedEvent.title}'`)) {
        this.eventService.deleteEvent(Number(this.selectedEvent.id)).subscribe({
          next: () => {
            this.selectedEvent.remove();
            const modalElement = document.getElementById('eventModal');
            if (modalElement) {
              const modal = bootstrap.Modal.getInstance(modalElement);
              if (modal) {
                modal.hide();
              }
            }
          },
          error: (error) => console.error('Error deleting event', error)
        });
      }
    }
  }
}
