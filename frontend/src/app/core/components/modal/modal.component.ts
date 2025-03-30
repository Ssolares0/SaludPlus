import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgClass, ClickOutsideDirective],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 }))
      ])
    ])
  ]
})

export class ModalComponent {
  @Input() isVisible: boolean = false;
  @Input() type: 'success' | 'warning' | 'error' = 'success';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() showConfirmButton: boolean = false;
  @Input() confirmButtonText: string = 'Aceptar';
  @Input() cancelButtonText: string = 'Cancelar';

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

  confirmAction(): void {
    this.confirm.emit();
  }
}