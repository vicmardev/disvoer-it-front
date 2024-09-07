export interface OrdersPurchase {
	IdOrder: number;
	NumOrder: number;
	ProviderNumber: number;
	DateReceptionEmail: Date;
	IdStatus: number;
	User: string;
	UrlOrderFile: string;
	Comments: string;
	EmailUserFianl: string;
	IdOwnerCompany: number;
	TotalEquipments: number;
	Services: string;
	Subtotal: number;
	IdTypePart: number;
	IdBrand: number;
}
