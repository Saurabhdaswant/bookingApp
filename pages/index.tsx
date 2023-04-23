import React, { useEffect, useState } from "react";
import { Calendar, Clock } from "react-feather";
import {
  addMinutes,
  format,
  isSameDay,
  startOfToday,
  differenceInMinutes,
} from "date-fns";

import { Appointment } from "@/interfaces/Appointment";
import { AppointmentSlotProps } from "@/interfaces/AppointmentSlotProps";
import { BookingConfirmationDialogProps } from "@/interfaces/BookingConfirmationDialogProps";
import { TextAreaProps } from "@/interfaces/TextAreaProps";
import { generateSlotsForWeek, getSlots } from "@/utils/helpers";
import { defaultAppointments } from "@/utils/data";

function AppointmentSlot({
  appointment,
  setOpenBookingConfirmationDialog,
  setSelectedAppointment,
}: AppointmentSlotProps) {
  const isBooked = appointment?.status === "booked";
  const isAvailable = appointment?.status === "available";
  const appointmentClasses = `p-2 space-y-3 m-1 h-32 text-left ${
    isBooked
      ? "bg-blue-100 rounded-md"
      : isAvailable
      ? "bg-green-100 rounded-md"
      : ""
  } ${appointment ? "hover:cursor-pointer" : ""}`;
  const statusClasses = `w-min rounded-md px-1 text-sm ${
    isBooked
      ? "text-blue-600 bg-blue-300"
      : isAvailable
      ? "text-green-800 bg-green-300"
      : ""
  }`;

  const handleAppointmentClick = () => {
    if (appointment) {
      setOpenBookingConfirmationDialog(true);
      setSelectedAppointment(appointment);
    }
  };

  return (
    <div>
      <div onClick={handleAppointmentClick} className={appointmentClasses}>
        <div className="flex justify-between">
          <div className="font-semibold text-gray-800">
            {appointment?.provider}
          </div>
          <div className={statusClasses}>{appointment?.status}</div>
        </div>
        <div className="text-sm break-words text-gray-800">
          {appointment?.service}
        </div>
      </div>
    </div>
  );
}

const TextArea = ({ label, value, onChange }: TextAreaProps) => {
  return (
    <div>
      <label
        className="block text-gray-700 font-semibold text-sm mb-2"
        htmlFor="textarea"
      >
        {label}
      </label>
      <textarea
        className={`appearance-none  border-2 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
        id="textarea"
        value={value}
        onChange={onChange}
        rows={4}
        cols={50}
      />
    </div>
  );
};

const BookingConfirmationDialog = ({
  setOpenBookingConfirmationDialog,
  selectedAppointment,
  setAppointments,
}: BookingConfirmationDialogProps) => {
  const {
    slot = "",
    provider = "",
    status = "",
    service = "",
  } = selectedAppointment || {};
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const selectedSlotTime = new Date(slot).getTime();

  const updateAppointment = (
    appointments: Appointment[],
    time: Date,
    status: string
  ): Appointment[] => {
    const index = appointments.findIndex(
      (appointment: Appointment) =>
        new Date(appointment.slot || "").getTime() === time.getTime()
    );
    const updatedAppointments: Appointment[] = [...appointments];

    updatedAppointments[index] = {
      ...updatedAppointments[index],
      status: status,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    }

    return updatedAppointments;
  };

  const handleBookingConfirmation = () => {
    setAppointments((prevAppointments: Appointment[]) => {
      const updatedAppointments = updateAppointment(
        prevAppointments,
        new Date(selectedSlotTime),
        "booked"
      );

      return updatedAppointments;
    });
    setOpenBookingConfirmationDialog(false);
  };

  const handleBookingCancellation = () => {
    setAppointments((prevAppointments: Appointment[]) => {
      const updatedAppointments = updateAppointment(
        prevAppointments,
        new Date(selectedSlotTime),
        "available"
      );
      return updatedAppointments;
    });
    setOpenBookingConfirmationDialog(false);
  };

  const startTime = new Date(slot);
  const endTime = addMinutes(startTime, 45);

  return (
    <div className=" fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-50 ">
      <div className="bg-white p-8 rounded-lg space-y-10  ">
        <div className="space-y-6  text-gray-600 ">
          <div>
            <p className=" text-lg font-semibold ">{provider} </p>
            <p className=" text-gray-800   font-bold text-2xl ">{service}</p>
          </div>

          <div className="space-y-4  font-semibold">
            <div className="flex gap-2">
              <Calendar className="w-6 h-6" />{" "}
              <div className="flex gap-2">
                <p className="text-gray-800 font-bold ">
                  {format(startTime, "h:mm aaa")}
                </p>
                {`-`}
                <p className="text-gray-800 font-bold ">
                  {format(endTime, "h:mm aaa")},
                </p>
                <p>{format(startTime, "PPPP")}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Clock /> <p>{differenceInMinutes(endTime, startTime)} Minutes</p>
            </div>
          </div>
        </div>
        {status === "available" && (
          <div className="space-y-6">
            <TextArea
              label="Additional notes  "
              value={inputValue}
              onChange={handleInputChange}
            />
            <div className="flex justify-end gap-x-4  ">
              <button
                onClick={() => setOpenBookingConfirmationDialog(false)}
                type="submit"
                className="   font-semibold    text-[#2E2E2E] hover:bg-gray-100 px-8 rounded py-4 "
              >
                Cancel
              </button>
              <button
                onClick={() => handleBookingConfirmation()}
                type="submit"
                className="   font-semibold  bg-[#2e2e2e] hover:bg-[#2e2e2eed] text-white px-8 rounded py-4 "
              >
                Confirm{" "}
              </button>
            </div>
          </div>
        )}

        {status === "booked" && (
          <div className="space-y-6">
            <TextArea
              label="Additional notes"
              value={inputValue}
              onChange={handleInputChange}
            />
            <div className="flex justify-end gap-x-4  ">
              <button
                onClick={() => handleBookingCancellation()}
                type="submit"
                className="   font-semibold  bg-red-500 hover:bg-red-400 text-white px-8 rounded py-4 "
              >
                Cancel{" "}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function HourCell({ slot }: { slot: Date }) {
  return (
    <div>
      <div className={` px-2 m-1 h-32  `}>
        <div className="text-xs text-right font-semibold ">
          {format(slot, "h:mm a")}
        </div>
      </div>
    </div>
  );
}

export default function WeeklyCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
  const [openBookingConfirmationDialog, setOpenBookingConfirmationDialog] =
    useState<boolean>(false);

  // Fetch appointments from local storage when component mounts
  useEffect(() => {
    const storedAppointments = JSON.parse(
      localStorage.getItem("appointments") || "[]"
    ) as Appointment[];

    if (storedAppointments.length > 0) {
      setAppointments(storedAppointments);
    } else {
      setAppointments(defaultAppointments);
    }
  }, []);

  const { days, slots } = generateSlotsForWeek();

  return (
    <div className="grid grid-cols-8 ">
      <div
        key={startOfToday().toISOString()}
        className=" border border-gray-100"
      >
        <div className="h-11"></div>
        <div className="divide-y-2 divide-gray-100 divide-opacity-0 ">
          {getSlots(startOfToday()).map((slot) => {
            return <HourCell key={slot.toISOString()} slot={slot} />;
          })}
        </div>
      </div>
      {days.map((day) => (
        <div
          key={day.toISOString()}
          className="text-center border border-gray-100"
        >
          <div className="flex justify-center py-4  border-b border-gray-100  gap-2">
            <div className="font-bold">{format(day, "E")}</div>
            <div>{format(day, "d")}</div>
          </div>
          <div className="divide-y-2 divide-gray-100 ">
            {slots
              .filter((slot) => isSameDay(slot, day))
              .map((slot) => {
                const appointment = appointments?.find(
                  (appointment: Appointment) =>
                    new Date(appointment.slot ?? "").getTime() ===
                    new Date(slot).getTime()
                );

                return (
                  <AppointmentSlot
                    key={slot.toISOString()}
                    appointment={appointment}
                    setOpenBookingConfirmationDialog={
                      setOpenBookingConfirmationDialog
                    }
                    setSelectedAppointment={setSelectedAppointment}
                  />
                );
              })}
          </div>
        </div>
      ))}
      {openBookingConfirmationDialog && (
        <BookingConfirmationDialog
          setOpenBookingConfirmationDialog={setOpenBookingConfirmationDialog}
          selectedAppointment={selectedAppointment}
          setAppointments={setAppointments}
        />
      )}
    </div>
  );
}
