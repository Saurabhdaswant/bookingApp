import { Appointment } from "./Appointment";

export interface AppointmentSlotProps {
  appointment?: Appointment;
  setOpenBookingConfirmationDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setSelectedAppointment: React.Dispatch<
    React.SetStateAction<Appointment | undefined>
  >;
}
