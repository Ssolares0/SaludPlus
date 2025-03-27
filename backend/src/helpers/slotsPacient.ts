export function generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number, selectedDate: Date): Date[] {
    const slots: Date[] = [];
    
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

export function getDayName(day: number): string {
    const days: string[] = [
        'Domingo', 'Lunes', 'Martes', 'Miércoles',
        'Jueves', 'Viernes', 'Sábado'
    ];
    return days[day];
}