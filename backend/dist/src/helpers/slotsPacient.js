"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTimeSlots = generateTimeSlots;
exports.getDayName = getDayName;
function generateTimeSlots(startTime, endTime, intervalMinutes, selectedDate) {
    const slots = [];
    const dateStr = selectedDate.toISOString().split('T')[0];
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const start = new Date(dateStr);
    start.setHours(startHours, startMinutes, 0);
    const end = new Date(dateStr);
    end.setHours(endHours, endMinutes, 0);
    let current = new Date(start);
    while (current <= end) {
        slots.push(new Date(current));
        current = new Date(current.getTime() + intervalMinutes * 60000);
    }
    return slots;
}
function getDayName(day) {
    const days = [
        'Domingo', 'Lunes', 'Martes', 'Miércoles',
        'Jueves', 'Viernes', 'Sábado'
    ];
    return days[day];
}
