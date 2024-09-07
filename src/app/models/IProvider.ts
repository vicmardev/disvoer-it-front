export interface IProvider {
	IdProvider: number;
	Name: string;
	NameContact: string;
	PhoneContact: string;
	EmailContact: string;
	City: string;
	Country: string;
	Delegation: string;
	PostalCode: string;
	InternalNumber: string;
	ExternalNumber: string;
	Comments: string;
	createdAt?: Date;
	updatedAt?: Date;
}
