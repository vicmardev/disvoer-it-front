export interface IDataCenter {
	IdDataCenter: number;
	IdContract: String;
	IdCity: String;
	IdCountry: String;
	Delegation: String;
	PostalCode: String;
	Street: String;
	Neighborhood: String;
	InternalNumber: String | null;
	ExternalNumber: String | null;
	DataCenter: String;
	Latitud?: number;
	Longitud?: number;
	createdAt?: Date;
	updatedAt?: Date;
}
