import { Appointment } from "./Appointment";

export interface BookingConfirmationDialogProps {
  setOpenBookingConfirmationDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  selectedAppointment?: Appointment;
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}
