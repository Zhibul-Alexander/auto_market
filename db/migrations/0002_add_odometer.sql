-- Add odometer fields to Vehicle
ALTER TABLE Vehicle ADD COLUMN odometerReading INTEGER;
ALTER TABLE Vehicle ADD COLUMN odometerUnit TEXT;
