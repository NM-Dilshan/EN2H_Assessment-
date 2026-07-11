-- Add supporting indexes for service and booking queries
CREATE INDEX "Service_createdBy_idx" ON "Service"("createdBy");
CREATE INDEX "Booking_serviceId_idx" ON "Booking"("serviceId");
CREATE INDEX "Booking_customerEmail_idx" ON "Booking"("customerEmail");

-- Prevent duplicate bookings for the same service/date/time slot
CREATE UNIQUE INDEX "Booking_serviceId_bookingDate_bookingTime_key" ON "Booking"("serviceId", "bookingDate", "bookingTime");
