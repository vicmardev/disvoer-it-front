export interface Quote {
	Id: number;
	Lead: string;
	Currency: string;
	Subtotal: number;
	IVA: number;
	Total: number;
	Status: string;
	Remark: string;
	UrlFile: string;
	IdCustomer: number;
	IdQuote: number;
	Customer?: any;
	CustomerName?: string;
	StatusQuote?: any;
	QuoteStatus?: string;
}
