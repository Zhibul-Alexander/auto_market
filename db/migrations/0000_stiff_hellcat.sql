CREATE TABLE `Lead` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`name` text,
	`phone` text NOT NULL,
	`message` text,
	`lotId` integer,
	`serviceSlug` text,
	`locale` text NOT NULL,
	`pageUrl` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`note` text,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Office` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`city` text NOT NULL,
	`phone` text NOT NULL,
	`address` text,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ServicePage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`locale` text NOT NULL,
	`title` text NOT NULL,
	`blocksJson` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `TrackingEvent` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vin` text NOT NULL,
	`status` text NOT NULL,
	`checkpoint` text NOT NULL,
	`date` text NOT NULL,
	`notes` text,
	`photosJson` text
);
--> statement-breakpoint
CREATE TABLE `Vehicle` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`externalId` text NOT NULL,
	`slug` text NOT NULL,
	`category` text DEFAULT 'cars' NOT NULL,
	`year` integer NOT NULL,
	`make` text NOT NULL,
	`model` text NOT NULL,
	`trim` text,
	`fullModelName` text,
	`vin` text,
	`color` text,
	`fuelRaw` text,
	`fuelType` text,
	`driveRaw` text,
	`driveType` text,
	`transmissionRaw` text,
	`transmissionType` text,
	`bodyTypeRaw` text,
	`bodyType` text,
	`engineVolumeL` real,
	`odometerReading` integer,
	`odometerUnit` text,
	`buyItNow` real,
	`estRetail` real,
	`displayedPrice` real,
	`currency` text DEFAULT 'USD' NOT NULL,
	`itemUrl` text,
	`thumbUrl` text,
	`galleryJson` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ServicePage_slug_locale_unique` ON `ServicePage` (`slug`,`locale`);--> statement-breakpoint
CREATE UNIQUE INDEX `Vehicle_externalId_unique` ON `Vehicle` (`externalId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Vehicle_slug_unique` ON `Vehicle` (`slug`);