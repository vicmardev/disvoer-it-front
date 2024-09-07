export interface IContract {
	IdContract: number;
	Contract: String;
	StartContract: Date;
	EndContract: Date;
	Status: String;
	Alias: String | null;
	Year: String;
	createdAt?: Date;
	updatedAt?: Date;
}
