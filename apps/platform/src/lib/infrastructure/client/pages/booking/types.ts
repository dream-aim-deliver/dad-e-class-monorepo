interface ScheduledOffering {
    session?: {
        id: number;
        name: string;
        duration: number;
    };
    startTime?: Date;
    endTime?: Date;
}