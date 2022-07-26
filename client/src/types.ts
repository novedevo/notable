export type Presentation = {
	presentation_instance_id: number;
	title: string;
	presenter_id: number;
	scheduled_date: string;
	presentation_end_date: string;
	pdf?: string;
	youtube_url?: string;
	notes?: Note[];
};

export type User = {
	id: number;
	username: string;
	isAdmin: boolean;
	name: string;
};

export interface Note {
	note_id?: number;
	note: string;
	notetaker_id?: number;
	presentation_id?: number;
}

export interface VideoNote extends Note {
	time_stamp: number;
}

export interface PdfNote extends Note {
	page_number: number;
	time_stamp: number;
}
