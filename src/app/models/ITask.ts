export interface Task {
	IdTask: number;
	Title: string;
	CreationDate: Date;
	StartDate: Date;
	EndDate: Date;
	CreatedBy: string;
	AssignedTo: number;
	Comments?: string;
	UpdatedBy?: string;
	SupportOperator: {
		IdSupportOPerators: number;
		Name: string;
	};
}
